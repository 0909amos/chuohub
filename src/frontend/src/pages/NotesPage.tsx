import { Link } from "@tanstack/react-router";
import { BookOpen, Lock, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AdBanner from "../components/AdBanner";
import { useAllNotes, useUserProfile } from "../hooks/useQueries";
import type { Note } from "../hooks/useQueries";

const SAMPLE_NOTES: Note[] = [
  {
    id: "s1",
    title: "Introduction to Calculus",
    subject: "Mathematics",
    isPremium: false,
    content: "Covers limits, derivatives, and integrals.",
    description: "Core calculus concepts for first year students.",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
  {
    id: "s2",
    title: "Organic Chemistry Basics",
    subject: "Chemistry",
    isPremium: false,
    content: "Carbon compounds and reactions.",
    description: "Introduction to organic compounds.",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
  {
    id: "s3",
    title: "Business Law Fundamentals",
    subject: "Law",
    isPremium: true,
    content: "Contract law and business regulations.",
    description: "Essential business law for commerce students.",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
  {
    id: "s4",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    isPremium: true,
    content: "Arrays, linked lists, trees and graphs.",
    description: "Fundamental data structures for CS students.",
    createdAt: BigInt(0),
    uploadedBy: {} as any,
  },
];

const SUBJECTS = [
  "All",
  "Mathematics",
  "Chemistry",
  "Physics",
  "Computer Science",
  "Law",
  "Business",
  "Medicine",
];

export default function NotesPage() {
  const { data: backendNotes } = useAllNotes();
  const { data: profile } = useUserProfile();
  const [subject, setSubject] = useState("All");
  const [search, setSearch] = useState("");
  const isPremium = profile?.isPremium || false;

  const allNotes = [...SAMPLE_NOTES, ...(backendNotes || [])];
  const filtered = allNotes.filter(
    (n) =>
      (subject === "All" || n.subject === subject) &&
      (search === "" || n.title.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">
          Notes Library
        </h1>
        <p className="text-primary-foreground/70 text-xs">
          Access curated study notes
        </p>
        <div className="mt-4 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
            data-ocid="notes.search_input"
          />
        </div>
      </div>

      {!isPremium && (
        <AdBanner message="Go Premium – Remove ads & unlock all premium notes" />
      )}

      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
              data-ocid="notes.subject.tab"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 pb-4 space-y-3" data-ocid="notes.list">
        {filtered.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground text-sm"
            data-ocid="notes.empty_state"
          >
            No notes found for this subject.
          </div>
        )}
        {filtered.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border p-4 relative overflow-hidden"
            data-ocid={`notes.item.${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {note.title}
                  </div>
                  {note.isPremium && (
                    <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      PREMIUM
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {note.subject}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {note.description}
                </div>
              </div>
            </div>

            {note.isPremium && !isPremium && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <Lock size={20} className="text-accent mx-auto mb-1" />
                  <div className="text-xs font-bold text-foreground mb-2">
                    Premium Content
                  </div>
                  <Link
                    to="/profile"
                    className="bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full"
                    data-ocid="notes.upgrade.button"
                  >
                    Unlock with Premium
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
