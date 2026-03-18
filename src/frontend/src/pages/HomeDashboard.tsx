import { Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  FileText,
  Lock,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllNotes,
  useAllQuizzes,
  useTasks,
  useUserProfile,
} from "../hooks/useQueries";

const SAMPLE_NOTES = [
  {
    id: "s1",
    title: "Introduction to Calculus",
    subject: "Mathematics",
    isPremium: false,
  },
  {
    id: "s2",
    title: "Organic Chemistry Basics",
    subject: "Chemistry",
    isPremium: false,
  },
  {
    id: "s3",
    title: "Business Law Fundamentals",
    subject: "Law",
    isPremium: true,
  },
  {
    id: "s4",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    isPremium: true,
  },
];

const quickLinks = [
  {
    to: "/notes",
    icon: BookOpen,
    label: "Notes",
    color: "bg-blue-50 text-blue-600",
  },
  {
    to: "/papers",
    icon: FileText,
    label: "Papers",
    color: "bg-purple-50 text-purple-600",
  },
  {
    to: "/quizzes",
    icon: Brain,
    label: "Quizzes",
    color: "bg-green-50 text-green-700",
  },
  {
    to: "/planner",
    icon: Calendar,
    label: "Planner",
    color: "bg-orange-50 text-orange-600",
  },
  {
    to: "/community",
    icon: Users,
    label: "Q&A",
    color: "bg-pink-50 text-pink-600",
  },
];

export default function HomeDashboard() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: notes } = useAllNotes();
  const { data: quizzes } = useAllQuizzes();
  const { data: tasks } = useTasks();

  const principalSlice = identity
    ? `${identity.getPrincipal().toString().slice(0, 8)}...`
    : "Student";
  const displayName = profile?.displayName || principalSlice;
  const notesCount = (notes?.length || 0) + SAMPLE_NOTES.length;
  const quizzesCount = quizzes?.length || 0;
  const pendingTasks = tasks?.filter((t) => !t.isDone).length || 0;
  const isPremium = profile?.isPremium || false;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-16">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-primary-foreground/70 text-sm">
              Good morning,
            </div>
            <div className="text-primary-foreground font-bold text-xl truncate max-w-[200px]">
              {displayName}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPremium && (
              <div className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                PREMIUM
              </div>
            )}
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center"
            >
              <Bell size={18} className="text-primary-foreground" />
            </button>
          </div>
        </div>
        <p className="text-primary-foreground/60 text-xs">
          {new Date().toLocaleDateString("en-TZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-border p-4 grid grid-cols-3 gap-2"
        >
          <div className="text-center" data-ocid="stats.notes.card">
            <div className="text-2xl font-bold text-primary">{notesCount}</div>
            <div className="text-xs text-muted-foreground">Notes</div>
          </div>
          <div
            className="text-center border-x border-border"
            data-ocid="stats.quizzes.card"
          >
            <div className="text-2xl font-bold text-primary">
              {quizzesCount + 2}
            </div>
            <div className="text-xs text-muted-foreground">Quizzes</div>
          </div>
          <div className="text-center" data-ocid="stats.tasks.card">
            <div className="text-2xl font-bold text-primary">
              {pendingTasks}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </motion.div>
      </div>

      {!isPremium && (
        <div
          className="mx-4 mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3 flex items-center gap-3"
          data-ocid="home.ad_banner"
        >
          <TrendingUp size={18} className="text-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-900">
              Upgrade to Premium
            </div>
            <div className="text-[10px] text-amber-700">
              Remove ads & unlock all premium content
            </div>
          </div>
          <Link
            to="/profile"
            className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full"
            data-ocid="home.upgrade.button"
          >
            Upgrade
          </Link>
        </div>
      )}

      <div className="px-4 mt-6">
        <div className="text-sm font-bold text-foreground mb-3">
          Quick Access
        </div>
        <div className="grid grid-cols-5 gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex flex-col items-center gap-1"
              data-ocid={`quick.${l.label.toLowerCase()}.link`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${l.color} flex items-center justify-center`}
              >
                <l.icon size={22} />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-foreground">
            Featured Resources
          </div>
          <Link
            to="/notes"
            className="text-xs text-primary font-medium flex items-center gap-1"
            data-ocid="home.notes.link"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3" data-ocid="home.resources.list">
          {SAMPLE_NOTES.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl border border-border p-3 flex items-center gap-3"
              data-ocid={`home.resources.item.${i + 1}`}
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {note.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {note.subject}
                </div>
              </div>
              {note.isPremium ? (
                <div className="flex items-center gap-1 bg-accent/10 rounded-full px-2 py-0.5">
                  <Lock size={10} className="text-accent" />
                  <span className="text-[9px] font-bold text-accent">PRO</span>
                </div>
              ) : (
                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
