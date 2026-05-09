import { motion } from "framer-motion";

function QuantitySelector({ value = 1, onDecrease, onIncrease, disabled = false }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        -
      </motion.button>
      <span className="min-w-8 text-center text-sm font-semibold text-white">{value}</span>
      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </motion.button>
    </div>
  );
}

export default QuantitySelector;
