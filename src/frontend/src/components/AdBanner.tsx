import { X, Zap } from "lucide-react";
import { useState } from "react";

export default function AdBanner({
  message = "Go Premium – Remove ads & unlock all content",
}: { message?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      className="mx-4 mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3 flex items-center gap-3"
      data-ocid="ad_banner"
    >
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Zap size={16} className="text-accent-foreground" />
      </div>
      <p className="text-xs text-amber-900 font-medium flex-1">{message}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 p-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
