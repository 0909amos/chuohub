import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Brain, Calendar, FileText, Home } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/notes", icon: BookOpen, label: "Notes" },
  { path: "/papers", icon: FileText, label: "Papers" },
  { path: "/quizzes", icon: Brain, label: "Quiz" },
  { path: "/planner", icon: Calendar, label: "Planner" },
];

export default function BottomNav() {
  const state = useRouterState();
  const currentPath = state.location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border flex items-center justify-around px-2 py-2 z-50"
      data-ocid="bottom_nav"
    >
      {navItems.map((item) => {
        const active = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center rounded-xl px-3 transition-colors ${
              active
                ? "text-primary bg-secondary"
                : "text-muted-foreground hover:text-primary"
            }`}
            data-ocid={`nav.${item.label.toLowerCase()}.link`}
          >
            <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span
              className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
