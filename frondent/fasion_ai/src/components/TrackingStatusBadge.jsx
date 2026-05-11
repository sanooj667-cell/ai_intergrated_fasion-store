import { motion } from "framer-motion";

const VARIANTS = {
  pending: "border-amber-200/50 bg-amber-500/20 text-amber-100",
  processing: "border-sky-200/40 bg-sky-500/20 text-sky-100",
  shipped: "border-violet-200/40 bg-violet-500/25 text-violet-100",
  out_for_delivery: "border-fuchsia-200/40 bg-fuchsia-500/25 text-fuchsia-100",
  delivered: "border-emerald-200/45 bg-emerald-500/20 text-emerald-100",
  cancelled: "border-white/30 bg-white/10 text-white/80",
};

function TrackingStatusBadge({ status, label, className = "" }) {
  const key = status || "pending";
  const style = VARIANTS[key] || VARIANTS.pending;
  const text = label || key.replace(/_/g, " ");

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize tracking-wide backdrop-blur-sm ${style} ${className}`}
    >
      {text}
    </motion.span>
  );
}

export default TrackingStatusBadge;
