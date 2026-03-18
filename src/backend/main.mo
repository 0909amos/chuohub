import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Types
  public type UserProfile = {
    displayName : Text;
    university : Text;
    course : Text;
    isPremium : Bool;
  };

  public type Note = {
    id : Text;
    title : Text;
    subject : Text;
    description : Text;
    content : Text;
    fileUrl : ?Text;
    isPremium : Bool;
    uploadedBy : Principal;
    createdAt : Time.Time;
  };

  public type PastPaper = {
    id : Text;
    title : Text;
    subject : Text;
    year : Nat;
    description : Text;
    fileUrl : Text;
    isPremium : Bool;
    uploadedBy : Principal;
    createdAt : Time.Time;
  };

  public type Quiz = {
    id : Text;
    title : Text;
    subject : Text;
    questions : [Question];
  };

  public type Question = {
    text : Text;
    options : [Text];
    correctIndex : Nat;
  };

  public type QuizAttempt = {
    quizId : Text;
    score : Nat;
    total : Nat;
    timestamp : Time.Time;
  };

  public type Task = {
    id : Text;
    title : Text;
    description : Text;
    dueDate : Text;
    isDone : Bool;
  };

  public type QuestionPost = {
    id : Text;
    title : Text;
    body : Text;
    author : Principal;
    subject : Text;
    createdAt : Time.Time;
    upvotes : Nat;
  };

  public type Answer = {
    id : Text;
    questionId : Text;
    body : Text;
    author : Principal;
    createdAt : Time.Time;
    upvotes : Nat;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let notes = Map.empty<Text, Note>();
  let pastPapers = Map.empty<Text, PastPaper>();
  let quizzes = Map.empty<Text, Quiz>();
  let quizAttempts = Map.empty<Principal, List.List<QuizAttempt>>();
  let tasks = Map.empty<Principal, List.List<Task>>();
  let questions = Map.empty<Text, QuestionPost>();
  let answers = Map.empty<Text, Answer>();

  var nextId = 0;

  func generateId(prefix : Text) : Text {
    nextId += 1;
    prefix # nextId.toText();
  };

  // Stripe integration state
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // User Profile Logic
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(profileOwner : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(profileOwner);
  };

  // Notes
  public shared ({ caller }) func uploadNote(title : Text, subject : Text, description : Text, content : Text, fileUrl : ?Text, isPremium : Bool) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload notes");
    };

    let id = generateId("note");
    let note : Note = {
      id;
      title;
      subject;
      description;
      content;
      fileUrl;
      isPremium;
      uploadedBy = caller;
      createdAt = Time.now();
    };
    notes.add(id, note);
    id;
  };

  public query ({ caller }) func getNoteById(noteId : Text) : async Note {
    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.isPremium) {
          if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            Runtime.trap("Unauthorized: Only users can view premium notes");
          };
          let userProfile = switch (userProfiles.get(caller)) {
            case (null) { Runtime.trap("User profile not found") };
            case (?profile) { profile };
          };
          if (not userProfile.isPremium) { Runtime.trap("Premium access required") };
        };
        note;
      };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    notes.values().toArray();
  };

  // Past Papers
  public shared ({ caller }) func uploadPastPaper(title : Text, subject : Text, year : Nat, description : Text, fileUrl : Text, isPremium : Bool) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload past papers");
    };

    let id = generateId("pastpaper");
    let pastPaper : PastPaper = {
      id;
      title;
      subject;
      year;
      description;
      fileUrl;
      isPremium;
      uploadedBy = caller;
      createdAt = Time.now();
    };
    pastPapers.add(id, pastPaper);
    id;
  };

  public query ({ caller }) func getPastPaperById(paperId : Text) : async PastPaper {
    switch (pastPapers.get(paperId)) {
      case (null) { Runtime.trap("Past paper not found") };
      case (?paper) {
        if (paper.isPremium) {
          if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            Runtime.trap("Unauthorized: Only users can view premium past papers");
          };
          let userProfile = switch (userProfiles.get(caller)) {
            case (null) { Runtime.trap("User profile not found") };
            case (?profile) { profile };
          };
          if (not userProfile.isPremium) { Runtime.trap("Premium access required") };
        };
        paper;
      };
    };
  };

  public query ({ caller }) func getAllPastPapersBySubject(subject : Text) : async [PastPaper] {
    pastPapers.values().toArray().filter(
      func(paper) {
        Text.equal(paper.subject, subject);
      }
    );
  };

  // Quizzes
  public shared ({ caller }) func createQuiz(title : Text, subject : Text, questions : [Question]) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create quizzes");
    };

    let id = generateId("quiz");
    let quiz : Quiz = {
      id;
      title;
      subject;
      questions;
    };
    quizzes.add(id, quiz);
    id;
  };

  public query func getQuizById(quizId : Text) : async Quiz {
    switch (quizzes.get(quizId)) {
      case (null) { Runtime.trap("Quiz not found") };
      case (?quiz) { quiz };
    };
  };

  public query func getAllQuizzes() : async [Quiz] {
    quizzes.values().toArray();
  };

  public shared ({ caller }) func recordQuizAttempt(quizId : Text, score : Nat, total : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can record quiz attempts");
    };

    let attempt : QuizAttempt = {
      quizId;
      score;
      total;
      timestamp = Time.now();
    };

    let attemptsList = switch (quizAttempts.get(caller)) {
      case (null) { List.empty<QuizAttempt>() };
      case (?existing) { existing };
    };

    attemptsList.add(attempt);
    quizAttempts.add(caller, attemptsList);
  };

  public query ({ caller }) func getUserQuizAttempts(user : Principal) : async [QuizAttempt] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own quiz attempts");
    };
    switch (quizAttempts.get(user)) {
      case (null) { [] };
      case (?attemptsList) { attemptsList.toArray() };
    };
  };

  // Study Planner
  public shared ({ caller }) func addTask(title : Text, description : Text, dueDate : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };

    let id = generateId("task");
    let task : Task = {
      id;
      title;
      description;
      dueDate;
      isDone = false;
    };

    let tasksList = switch (tasks.get(caller)) {
      case (null) { List.empty<Task>() };
      case (?existing) { existing };
    };

    tasksList.add(task);
    tasks.add(caller, tasksList);
    id;
  };

  public shared ({ caller }) func updateTask(taskId : Text, title : Text, description : Text, dueDate : Text, isDone : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };

    let tasksList = switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task not found") };
      case (?existing) { existing };
    };

    let updatedTasks = tasksList.map<Task, Task>(
      func(t) {
        if (Text.equal(t.id, taskId)) {
          {
            t with
            title;
            description;
            dueDate;
            isDone;
          };
        } else {
          t;
        };
      }
    );

    tasks.add(caller, updatedTasks);
  };

  public query ({ caller }) func getTasks(user : Principal) : async [Task] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tasks");
    };
    switch (tasks.get(user)) {
      case (null) { [] };
      case (?tasksList) { tasksList.toArray() };
    };
  };

  // Community Q&A
  public shared ({ caller }) func postQuestion(title : Text, body : Text, subject : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can post questions");
    };

    let questionId = generateId("question");
    let question : QuestionPost = {
      id = questionId;
      title;
      body;
      author = caller;
      subject;
      createdAt = Time.now();
      upvotes = 0;
    };

    questions.add(questionId, question);
    questionId;
  };

  public shared ({ caller }) func postAnswer(questionId : Text, body : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can post answers");
    };

    switch (questions.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (_) {};
    };

    let answerId = generateId("answer");
    let answer : Answer = {
      id = answerId;
      questionId;
      body;
      author = caller;
      createdAt = Time.now();
      upvotes = 0;
    };

    answers.add(answerId, answer);
    answerId;
  };

  public shared ({ caller }) func upvoteQuestion(questionId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upvote questions");
    };

    switch (questions.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (?question) {
        questions.add(questionId, { question with upvotes = question.upvotes + 1 });
      };
    };
  };

  public shared ({ caller }) func upvoteAnswer(answerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upvote answers");
    };

    switch (answers.get(answerId)) {
      case (null) { Runtime.trap("Answer not found") };
      case (?answer) {
        answers.add(answerId, { answer with upvotes = answer.upvotes + 1 });
      };
    };
  };

  // Stripe Integration
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
