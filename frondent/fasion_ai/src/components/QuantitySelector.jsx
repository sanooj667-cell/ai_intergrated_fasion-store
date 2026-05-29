import { motion } from "framer-motion";

function QuantitySelector({ value = 1, onDecrease, onIncrease, disabled = false }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
      >
        -
      </motion.button>
      <span className="min-w-8 text-center text-sm font-bold text-slate-700">{value}</span>
      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
      >
        +
      </motion.button>
    </div>
  );
}

export default QuantitySelector;
