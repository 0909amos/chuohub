import {
  Brain,
  CheckCircle,
  ChevronRight,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAllQuizzes, useRecordQuizAttempt } from "../hooks/useQueries";
import type { Quiz } from "../hooks/useQueries";

const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: "sq1",
    title: "Basic Mathematics Quiz",
    subject: "Mathematics",
    questions: [
      {
        text: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2"],
        correctIndex: BigInt(1),
      },
      {
        text: "What is the integral of 2x dx?",
        options: ["x²", "x² + C", "2", "2x + C"],
        correctIndex: BigInt(1),
      },
      {
        text: "What is π approximately equal to?",
        options: ["2.14", "3.14", "3.41", "4.13"],
        correctIndex: BigInt(1),
      },
    ],
  },
  {
    id: "sq2",
    title: "Computer Fundamentals Quiz",
    subject: "Computer Science",
    questions: [
      {
        text: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Power Unit",
          "Central Power Unit",
          "Computing Process Unit",
        ],
        correctIndex: BigInt(0),
      },
      {
        text: "What is the binary equivalent of decimal 10?",
        options: ["1010", "1100", "0110", "1001"],
        correctIndex: BigInt(0),
      },
      {
        text: "Which data structure uses LIFO?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctIndex: BigInt(1),
      },
    ],
  },
];

const OPTION_LABELS = ["A", "B", "C", "D"];
type QuizState = "list" | "question" | "result";

export default function QuizzesPage() {
  const { data: backendQuizzes } = useAllQuizzes();
  const recordAttempt = useRecordQuizAttempt();

  const allQuizzes = [...SAMPLE_QUIZZES, ...(backendQuizzes || [])];

  const [quizState, setQuizState] = useState<QuizState>("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setQuizState("question");
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null || !activeQuiz) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const score = newAnswers.filter(
        (a, i) => a === Number(activeQuiz.questions[i].correctIndex),
      ).length;
      if (!activeQuiz.id.startsWith("sq")) {
        recordAttempt.mutate({
          quizId: activeQuiz.id,
          score,
          total: activeQuiz.questions.length,
        });
      }
      setQuizState("result");
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    }
  };

  const score = answers.filter(
    (a, i) => activeQuiz && a === Number(activeQuiz.questions[i].correctIndex),
  ).length;
  const total = activeQuiz?.questions.length || 0;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">
          Quizzes
        </h1>
        <p className="text-primary-foreground/70 text-xs">
          Test your knowledge
        </p>
      </div>

      <AnimatePresence mode="wait">
        {quizState === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 mt-4 pb-4 space-y-3"
            data-ocid="quizzes.list"
          >
            {allQuizzes.map((quiz, i) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-border p-4 flex items-center gap-3"
                data-ocid={`quizzes.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Brain size={18} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {quiz.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {quiz.subject} · {quiz.questions.length} questions
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startQuiz(quiz)}
                  className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1"
                  data-ocid={`quizzes.start.button.${i + 1}`}
                >
                  Start <ChevronRight size={12} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {quizState === "question" && activeQuiz && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 mt-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(currentQ / activeQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {currentQ + 1}/{activeQuiz.questions.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5 mb-4">
              <div className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
                {activeQuiz.subject}
              </div>
              <div className="text-base font-semibold text-foreground">
                {activeQuiz.questions[currentQ].text}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {activeQuiz.questions[currentQ].options.map((opt, idx) => {
                const isCorrect =
                  idx === Number(activeQuiz.questions[currentQ].correctIndex);
                const isSelected = selected === idx;
                let cls = "bg-white border-border text-foreground";
                if (selected !== null) {
                  if (isCorrect)
                    cls = "bg-green-50 border-green-400 text-green-800";
                  else if (isSelected)
                    cls = "bg-red-50 border-red-400 text-red-800";
                } else if (isSelected) {
                  cls = "bg-primary/10 border-primary text-primary";
                }
                return (
                  <button
                    type="button"
                    key={`${currentQ}-${opt}`}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left rounded-xl border p-4 text-sm font-medium transition ${cls}`}
                    data-ocid={`quiz.option.${idx + 1}`}
                  >
                    <span className="font-bold mr-2">
                      {OPTION_LABELS[idx]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={selected === null}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full disabled:opacity-40 transition"
              data-ocid="quiz.next.button"
            >
              {currentQ + 1 >= activeQuiz.questions.length
                ? "See Results"
                : "Next Question"}
            </button>
          </motion.div>
        )}

        {quizState === "result" && activeQuiz && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 mt-8 text-center pb-4"
          >
            <div
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${pct >= 70 ? "bg-green-50" : "bg-red-50"}`}
            >
              {pct >= 70 ? (
                <CheckCircle size={40} className="text-green-600" />
              ) : (
                <XCircle size={40} className="text-red-500" />
              )}
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">
              {pct}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {score} out of {total} correct
            </div>
            <div
              className={`text-base font-semibold mb-6 ${pct >= 70 ? "text-green-600" : "text-red-500"}`}
            >
              {pct >= 90
                ? "Outstanding!"
                : pct >= 70
                  ? "Well Done!"
                  : pct >= 50
                    ? "Keep Practicing"
                    : "Try Again"}
            </div>

            <div className="space-y-3 mb-6">
              {activeQuiz.questions.map((q, i) => {
                const correct = answers[i] === Number(q.correctIndex);
                return (
                  <div
                    key={q.text}
                    className={`flex items-start gap-2 p-3 rounded-xl text-left ${correct ? "bg-green-50" : "bg-red-50"}`}
                  >
                    {correct ? (
                      <CheckCircle
                        size={16}
                        className="text-green-600 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <XCircle
                        size={16}
                        className="text-red-500 flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="text-xs">
                      <div className="font-medium text-foreground">
                        {q.text}
                      </div>
                      {!correct && (
                        <div className="text-muted-foreground mt-0.5">
                          Answer: {q.options[Number(q.correctIndex)]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => startQuiz(activeQuiz)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-full"
                data-ocid="quiz.retry.button"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <button
                type="button"
                onClick={() => setQuizState("list")}
                className="flex-1 bg-muted text-foreground font-semibold py-3 rounded-full"
                data-ocid="quiz.back.button"
              >
                Back to Quizzes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
