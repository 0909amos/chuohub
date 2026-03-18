import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: string;
    title: string;
    content: string;
    subject: string;
    isPremium: boolean;
    createdAt: Time;
    description: string;
    uploadedBy: Principal;
    fileUrl?: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Task {
    id: string;
    title: string;
    dueDate: string;
    description: string;
    isDone: boolean;
}
export interface Quiz {
    id: string;
    title: string;
    subject: string;
    questions: Array<Question>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PastPaper {
    id: string;
    title: string;
    subject: string;
    isPremium: boolean;
    createdAt: Time;
    year: bigint;
    description: string;
    uploadedBy: Principal;
    fileUrl: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface QuizAttempt {
    total: bigint;
    score: bigint;
    timestamp: Time;
    quizId: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Question {
    correctIndex: bigint;
    text: string;
    options: Array<string>;
}
export interface UserProfile {
    displayName: string;
    isPremium: boolean;
    university: string;
    course: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTask(title: string, description: string, dueDate: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createQuiz(title: string, subject: string, questions: Array<Question>): Promise<string>;
    getAllNotes(): Promise<Array<Note>>;
    getAllPastPapersBySubject(subject: string): Promise<Array<PastPaper>>;
    getAllQuizzes(): Promise<Array<Quiz>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNoteById(noteId: string): Promise<Note>;
    getPastPaperById(paperId: string): Promise<PastPaper>;
    getQuizById(quizId: string): Promise<Quiz>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTasks(user: Principal): Promise<Array<Task>>;
    getUserProfile(profileOwner: Principal): Promise<UserProfile | null>;
    getUserQuizAttempts(user: Principal): Promise<Array<QuizAttempt>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    postAnswer(questionId: string, body: string): Promise<string>;
    postQuestion(title: string, body: string, subject: string): Promise<string>;
    recordQuizAttempt(quizId: string, score: bigint, total: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateTask(taskId: string, title: string, description: string, dueDate: string, isDone: boolean): Promise<void>;
    uploadNote(title: string, subject: string, description: string, content: string, fileUrl: string | null, isPremium: boolean): Promise<string>;
    uploadPastPaper(title: string, subject: string, year: bigint, description: string, fileUrl: string, isPremium: boolean): Promise<string>;
    upvoteAnswer(answerId: string): Promise<void>;
    upvoteQuestion(questionId: string): Promise<void>;
}
