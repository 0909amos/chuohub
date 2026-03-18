import {
  BookOpen,
  Edit2,
  GraduationCap,
  Loader2,
  LogOut,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateCheckoutSession,
  useQuizAttempts,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useUserProfile();
  const { data: attempts } = useQuizAttempts();
  const saveProfile = useSaveProfile();
  const checkout = useCreateCheckoutSession();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setUniversity(profile.university || "");
      setCourse(profile.course || "");
    }
  }, [profile]);

  const principal = identity?.getPrincipal().toString() || "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        displayName,
        university,
        course,
        isPremium: profile?.isPremium || false,
      });
      setEditing(false);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  const handleUpgrade = async () => {
    try {
      const url = await checkout.mutateAsync();
      window.location.href = url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const profileFields = [
    { label: "Name", value: profile?.displayName, icon: User },
    { label: "University", value: profile?.university, icon: GraduationCap },
    { label: "Course", value: profile?.course, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-foreground">
            My Profile
          </h1>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1.5 text-primary-foreground/70 text-xs"
            data-ocid="profile.logout.button"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center pt-8"
          data-ocid="profile.loading_state"
        >
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 -mt-8 space-y-4"
        >
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground text-base truncate">
                {profile?.displayName || "Set your name"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {profile?.university || "Add your university"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {profile?.course || "Add your course"}
              </div>
            </div>
            {profile?.isPremium && (
              <div className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={10} fill="currentColor" /> PREMIUM
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
              Internet Identity
            </div>
            <div className="text-xs text-foreground font-mono truncate">
              {principal}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-foreground">
                Profile Details
              </div>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1 text-xs text-primary font-medium"
                data-ocid="profile.edit.toggle"
              >
                <Edit2 size={13} /> {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="text-xs font-medium text-muted-foreground block mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="profile-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                    data-ocid="profile.name.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-university"
                    className="text-xs font-medium text-muted-foreground block mb-1"
                  >
                    University
                  </label>
                  <input
                    id="profile-university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. University of Dar es Salaam"
                    className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                    data-ocid="profile.university.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-course"
                    className="text-xs font-medium text-muted-foreground block mb-1"
                  >
                    Course
                  </label>
                  <input
                    id="profile-course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                    data-ocid="profile.course.input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saveProfile.isPending}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm"
                  data-ocid="profile.save.submit_button"
                >
                  {saveProfile.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                {profileFields.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        {label}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {value || (
                          <span className="text-muted-foreground italic">
                            Not set
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!profile?.isPremium && (
            <div
              className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5"
              data-ocid="profile.premium.card"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-accent" fill="currentColor" />
                <div className="text-sm font-bold text-amber-900">
                  Upgrade to Premium
                </div>
              </div>
              <p className="text-xs text-amber-700 mb-4">
                Unlock all premium notes, past papers, ad-free experience, and
                more. Only $5/month.
              </p>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={checkout.isPending}
                className="w-full bg-accent text-accent-foreground font-bold py-3 rounded-full flex items-center justify-center gap-2"
                data-ocid="profile.upgrade.primary_button"
              >
                {checkout.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {checkout.isPending
                  ? "Redirecting..."
                  : "Upgrade to Premium – $5/mo"}
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="text-sm font-bold text-foreground mb-3">
              Quiz History
            </div>
            {!attempts || attempts.length === 0 ? (
              <div
                className="text-center py-6 text-xs text-muted-foreground"
                data-ocid="profile.quizhistory.empty_state"
              >
                No quizzes taken yet. Start a quiz to see your history here.
              </div>
            ) : (
              <div className="space-y-2" data-ocid="profile.quizhistory.list">
                {attempts.map((a, i) => {
                  const pct =
                    Number(a.total) > 0
                      ? Math.round((Number(a.score) / Number(a.total)) * 100)
                      : 0;
                  return (
                    <div
                      key={`${a.quizId}-${a.timestamp}`}
                      className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                      data-ocid={`profile.quiz.item.${i + 1}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          pct >= 70
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {pct}%
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-foreground">
                          Quiz Attempt
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {Number(a.score)}/{Number(a.total)} correct
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(
                          Number(a.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground py-4">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
