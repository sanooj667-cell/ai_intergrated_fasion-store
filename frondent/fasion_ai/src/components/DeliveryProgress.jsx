import { motion } from "framer-motion";

function DeliveryProgress({ percent = 0, className = "" }) {
  const safe = Math.min(100, Math.max(0, Number(percent) || 0));

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-white/70">
        <span>Delivery progress</span>
        <span className="text-white">{safe}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] shadow-[0_0_16px_rgba(239,106,108,0.45)]"
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default DeliveryProgress;
