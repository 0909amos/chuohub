import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  Menu,
  Star,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_ITEMS = [
  "Home",
  "Notes",
  "Past Papers",
  "Quizzes",
  "Planner",
  "Community",
];

const features = [
  {
    icon: BookOpen,
    title: "NOTES LIBRARY",
    desc: "Access thousands of curated notes across all university subjects.",
    cta: "Browse Notes",
  },
  {
    icon: FileText,
    title: "PAST PAPERS",
    desc: "Practice with past exam papers from top Tanzanian universities.",
    cta: "View Papers",
  },
  {
    icon: Brain,
    title: "QUIZZES",
    desc: "Test your knowledge with subject-specific interactive quizzes.",
    cta: "Take a Quiz",
  },
  {
    icon: Calendar,
    title: "STUDY PLANNER",
    desc: "Organize tasks and plan your study schedule effectively.",
    cta: "Plan Now",
  },
  {
    icon: Users,
    title: "COMMUNITY Q&A",
    desc: "Ask questions and learn from fellow university students.",
    cta: "Join Community",
  },
];

const benefits = [
  "Access notes for 50+ university subjects",
  "Download past papers for offline study",
  "Track your quiz performance over time",
  "Plan and meet study deadlines",
  "Connect with thousands of Tanzanian students",
  "Earn certificates for completed courses",
];

const testimonials = [
  {
    name: "Amina Juma",
    university: "University of Dar es Salaam",
    course: "Computer Science",
    text: "ChuoHub helped me pass my finals! The past papers section is incredibly useful for exam preparation.",
    rating: 5,
  },
  {
    name: "Joseph Mwangi",
    university: "Sokoine University",
    course: "Agriculture",
    text: "The study planner keeps me organized throughout the semester. I've improved my grades significantly.",
    rating: 5,
  },
  {
    name: "Grace Kimaro",
    university: "Muhimbili University",
    course: "Medicine",
    text: "The community Q&A is fantastic. I get answers to complex medical questions from senior students.",
    rating: 5,
  },
];

const recentResources = [
  {
    title: "Introduction to Calculus – Chapter 5",
    subject: "Mathematics",
    type: "Note",
  },
  { title: "Business Law Final Exam 2023", subject: "Law", type: "Past Paper" },
  { title: "Organic Chemistry Quiz", subject: "Chemistry", type: "Quiz" },
  {
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    type: "Note",
  },
];

const stats = [
  { label: "Registered Students", value: "12,400+" },
  { label: "Study Resources", value: "3,800+" },
  { label: "Universities Covered", value: "28" },
  { label: "Quizzes Completed", value: "87,000+" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = async () => {
    await login();
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap size={20} className="text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-lg text-primary leading-tight">
                ChuoHub
              </div>
              <div className="text-[9px] text-muted-foreground leading-none">
                Smart Study Platform
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item}
                className="hover:text-primary transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="text-sm font-medium text-primary hover:underline"
              data-ocid="header.login.button"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-accent text-accent-foreground text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              data-ocid="header.get_started.primary_button"
            >
              {isLoggingIn ? "Connecting..." : "Get Started"}
            </button>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary text-left"
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full mt-2 bg-accent text-accent-foreground font-semibold py-3 rounded-full"
              data-ocid="mobile_menu.get_started.primary_button"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <section className="bg-secondary px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇹🇿 Built for Tanzanian Students
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Achieve Academic
              <br />
              <span className="text-primary">Excellence</span> with
              <br />
              ChuoHub
            </h1>
            <p className="text-muted-foreground text-base mb-8 max-w-md">
              The all-in-one smart study platform for university students across
              Tanzania. Access notes, past papers, quizzes, and more – anytime,
              anywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-accent text-accent-foreground font-semibold px-7 py-3 rounded-full hover:opacity-90 transition flex items-center gap-2"
                data-ocid="hero.get_started.primary_button"
              >
                {isLoggingIn ? "Connecting..." : "Start Learning Free"}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="border-2 border-primary text-primary font-semibold px-7 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition"
                data-ocid="hero.explore.secondary_button"
              >
                Explore Features
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-card border border-border p-5">
              <div className="text-sm font-bold text-foreground mb-3">
                Recent Study Resources
              </div>
              <div className="space-y-3">
                {recentResources.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {r.type === "Note" ? (
                        <BookOpen size={14} className="text-primary" />
                      ) : r.type === "Past Paper" ? (
                        <FileText size={14} className="text-primary" />
                      ) : (
                        <Brain size={14} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {r.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {r.subject} · {r.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground">
              Powerful tools designed for Tanzanian university students
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col gap-3"
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
                  <f.icon size={22} className="text-primary" />
                </div>
                <div className="text-xs font-bold tracking-widest text-primary uppercase">
                  {f.title}
                </div>
                <p className="text-sm text-muted-foreground flex-1">{f.desc}</p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="self-start bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition"
                >
                  {f.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Students Choose ChuoHub
            </h2>
            <p className="text-muted-foreground mb-6">
              We understand the challenges facing Tanzanian university students.
              ChuoHub is built to solve them.
            </p>
            <div className="space-y-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle
                    size={18}
                    className="text-primary flex-shrink-0"
                  />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="mt-8 bg-accent text-accent-foreground font-semibold px-7 py-3 rounded-full hover:opacity-90 transition"
              data-ocid="why.join.primary_button"
            >
              Join ChuoHub Today
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-border p-4 flex items-center justify-between"
              >
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-xl font-bold text-primary">
                  {stat.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              What Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border shadow-card p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }, (_, s) => (
                    <Star
                      key={`star-${t.name}-${s}`}
                      size={14}
                      fill="currentColor"
                      className="text-accent"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.course} · {t.university}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-3">
          Ready to Excel Academically?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Join over 12,000 Tanzanian students already using ChuoHub to achieve
          their academic goals.
        </p>
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="bg-accent text-accent-foreground font-bold px-10 py-4 rounded-full text-lg hover:opacity-90 transition"
          data-ocid="cta.get_started.primary_button"
        >
          {isLoggingIn ? "Connecting..." : "Get Started Free"}
        </button>
      </section>

      <footer className="bg-primary text-primary-foreground px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={22} />
              <span className="font-bold text-lg">ChuoHub</span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed">
              Smart study platform for Tanzanian university students. Learn
              smarter, not harder.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Platform</div>
            <div className="space-y-2 text-xs text-primary-foreground/70">
              {["Notes", "Past Papers", "Quizzes", "Planner", "Community"].map(
                (l) => (
                  <div key={l}>{l}</div>
                ),
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Company</div>
            <div className="space-y-2 text-xs text-primary-foreground/70">
              {[
                "About Us",
                "Blog",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
              ].map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Contact</div>
            <div className="space-y-2 text-xs text-primary-foreground/70">
              <div>info@chuohub.co.tz</div>
              <div>+255 712 345 678</div>
              <div>Dar es Salaam, Tanzania</div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} ChuoHub. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
