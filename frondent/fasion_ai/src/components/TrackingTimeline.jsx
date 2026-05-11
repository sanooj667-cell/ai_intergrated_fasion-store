import { motion } from "framer-motion";

function StepDot({ state }) {
  if (state === "completed") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-500/25 text-sm font-bold text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.35)]">
        ✓
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-pulse rounded-full bg-[#f47a78]/35" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-[#ef6a6c] to-[#f47a78] text-xs font-bold text-white shadow-[0_8px_20px_rgba(231,75,88,0.45)]">
          ●
        </span>
      </span>
    );
  }
  if (state === "skipped") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-white/40">
        —
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs text-white/50">
      ○
    </span>
  );
}

function TrackingTimeline({ steps = [], className = "" }) {
  if (!steps.length) return null;

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Timeline</p>
      <ul className="relative mt-3 space-y-0">
        {steps.map((step, index) => (
          <motion.li
            key={`${step.key}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {index < steps.length - 1 ? (
              <span
                className={`absolute left-[17px] top-9 h-[calc(100%-0.5rem)] w-px ${
                  step.state === "completed" ? "bg-emerald-400/40" : "bg-white/15"
                }`}
                aria-hidden
              />
            ) : null}
            <StepDot state={step.state} />
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-semibold text-white">{step.label}</p>
              {step.at ? (
                <p className="mt-0.5 text-xs text-white/60">
                  {new Date(step.at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default TrackingTimeline;
