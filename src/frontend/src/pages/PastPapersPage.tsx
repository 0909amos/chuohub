import { Link } from "@tanstack/react-router";
import { Download, FileText, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { usePastPapersBySubject, useUserProfile } from "../hooks/useQueries";
import type { PastPaper } from "../hooks/useQueries";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "Business",
  "Law",
  "Medicine",
];

const SAMPLE_PAPERS: PastPaper[] = [
  {
    id: "p1",
    title: "Mathematics Final Exam 2023",
    subject: "Mathematics",
    year: BigInt(2023),
    isPremium: false,
    description:
      "Comprehensive final exam covering calculus, algebra and statistics.",
    fileUrl: "",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
  {
    id: "p2",
    title: "Physics Midterm 2022",
    subject: "Physics",
    year: BigInt(2022),
    isPremium: false,
    description: "Mechanics, waves and thermodynamics midterm paper.",
    fileUrl: "",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
  {
    id: "p3",
    title: "Computer Science Finals 2023",
    subject: "Computer Science",
    year: BigInt(2023),
    isPremium: true,
    description: "Algorithms, OS, and networking final examination.",
    fileUrl: "",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
];

function PaperCard({
  paper,
  isPremium,
  index,
}: { paper: PastPaper; isPremium: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-border p-4 relative overflow-hidden"
      data-ocid={`papers.item.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground mb-0.5">
            {paper.title}
          </div>
          <div className="text-xs text-muted-foreground mb-1">
            {paper.subject} · {paper.year.toString()}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {paper.description}
          </div>
        </div>
        {paper.isPremium && (
          <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex-shrink-0 h-fit">
            PRO
          </span>
        )}
      </div>

      {paper.isPremium && !isPremium ? (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center">
            <Lock size={20} className="text-accent mx-auto mb-1" />
            <div className="text-xs font-bold text-foreground mb-2">
              Premium Content
            </div>
            <Link
              to="/profile"
              className="bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full"
              data-ocid="papers.upgrade.button"
            >
              Unlock
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="mt-3 w-full flex items-center justify-center gap-2 bg-secondary text-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition"
          data-ocid={`papers.download.button.${index + 1}`}
        >
          <Download size={14} /> Download Paper
        </button>
      )}
    </motion.div>
  );
}

export default function PastPapersPage() {
  const [subject, setSubject] = useState("Mathematics");
  const { data: backendPapers, isLoading } = usePastPapersBySubject(subject);
  const { data: profile } = useUserProfile();
  const isPremium = profile?.isPremium || false;

  const sampleForSubject = SAMPLE_PAPERS.filter((p) => p.subject === subject);
  const allPapers = [...sampleForSubject, ...(backendPapers || [])];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">
          Past Papers
        </h1>
        <p className="text-primary-foreground/70 text-xs">
          Practice with real exam papers
        </p>
      </div>

      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUBJECTS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSubject(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                subject === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
              data-ocid="papers.subject.tab"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 pb-4 space-y-3" data-ocid="papers.list">
        {isLoading && (
          <div className="text-center py-8" data-ocid="papers.loading_state">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto" />
          </div>
        )}
        {!isLoading && allPapers.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground text-sm"
            data-ocid="papers.empty_state"
          >
            No past papers available for {subject} yet.
          </div>
        )}
        {allPapers.map((paper, i) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isPremium={isPremium}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
