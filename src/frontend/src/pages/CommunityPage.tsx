import {
  ChevronDown,
  Loader2,
  MessageSquare,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AdBanner from "../components/AdBanner";
import { usePostQuestion, useUserProfile } from "../hooks/useQueries";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "Business",
  "Law",
  "Medicine",
  "Other",
];

const INITIAL_QUESTIONS = [
  {
    id: "q1",
    title: "How do I solve differential equations?",
    body: "I'm struggling with solving first-order differential equations. Can someone explain the steps clearly?",
    subject: "Mathematics",
    upvotes: 14,
    author: "James K.",
    timeAgo: "2 hours ago",
    answers: 3,
  },
  {
    id: "q2",
    title: "Best resources for organic chemistry?",
    body: "Looking for good study materials and mnemonics for organic chemistry reactions.",
    subject: "Chemistry",
    upvotes: 9,
    author: "Sara M.",
    timeAgo: "5 hours ago",
    answers: 5,
  },
  {
    id: "q3",
    title: "What is the time complexity of QuickSort?",
    body: "Can someone explain the best-case, average-case, and worst-case time complexities for QuickSort?",
    subject: "Computer Science",
    upvotes: 22,
    author: "David L.",
    timeAgo: "1 day ago",
    answers: 7,
  },
];

type LocalQuestion = (typeof INITIAL_QUESTIONS)[0];

export default function CommunityPage() {
  const { data: profile } = useUserProfile();
  const postQuestion = usePostQuestion();
  const isPremium = profile?.isPremium || false;

  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    try {
      await postQuestion.mutateAsync({ title, body, subject });
      const newQ: LocalQuestion = {
        id: `local-${Date.now()}`,
        title,
        body,
        subject,
        upvotes: 0,
        author: "You",
        timeAgo: "Just now",
        answers: 0,
      };
      setQuestions((prev) => [newQ, ...prev]);
      setTitle("");
      setBody("");
      setShowForm(false);
      toast.success("Question posted!");
    } catch {
      toast.error("Failed to post question.");
    }
  };

  const handleUpvote = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q)),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-foreground mb-1">
            Community Q&A
          </h1>
          <p className="text-primary-foreground/70 text-xs">
            Ask and learn together
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
          data-ocid="community.ask.open_modal_button"
        >
          <Plus size={22} className="text-accent-foreground" />
        </button>
      </div>

      {!isPremium && (
        <AdBanner message="Join Premium for priority Q&A answers from top students" />
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-4 bg-white rounded-2xl border border-border p-4"
            data-ocid="community.ask.panel"
          >
            <div className="text-sm font-bold text-foreground mb-3">
              Ask a Question
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="q-title"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Question Title *
                </label>
                <input
                  id="q-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question?"
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                  required
                  data-ocid="community.title.input"
                />
              </div>
              <div>
                <label
                  htmlFor="q-body"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Details *
                </label>
                <textarea
                  id="q-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide more context..."
                  rows={3}
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20 resize-none"
                  required
                  data-ocid="community.body.textarea"
                />
              </div>
              <div>
                <label
                  htmlFor="q-subject"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Subject
                </label>
                <select
                  id="q-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                  data-ocid="community.subject.select"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={postQuestion.isPending}
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm"
                  data-ocid="community.post.submit_button"
                >
                  {postQuestion.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Post Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 bg-muted text-muted-foreground font-semibold py-2.5 rounded-full text-sm"
                  data-ocid="community.cancel.cancel_button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="px-4 mt-4 pb-4 space-y-3"
        data-ocid="community.questions.list"
      >
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-border overflow-hidden"
            data-ocid={`community.question.item.${i + 1}`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-sm font-semibold text-foreground flex-1">
                  {q.title}
                </div>
                <span className="text-[9px] font-bold text-primary bg-secondary px-2 py-0.5 rounded-full flex-shrink-0">
                  {q.subject}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {q.body}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUpvote(q.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
                  data-ocid={`community.upvote.button.${i + 1}`}
                >
                  <ThumbsUp size={13} /> {q.upvotes}
                </button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare size={13} /> {q.answers} answers
                </div>
                <div className="flex-1" />
                <div className="text-[10px] text-muted-foreground">
                  {q.author} · {q.timeAgo}
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
                  className="text-muted-foreground"
                  data-ocid={`community.expand.toggle.${i + 1}`}
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedQ === q.id ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {expandedQ === q.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="p-4 bg-secondary">
                    <div className="text-xs font-bold text-foreground mb-2">
                      Answers coming soon
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Community answers will be visible here as students
                      respond.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
