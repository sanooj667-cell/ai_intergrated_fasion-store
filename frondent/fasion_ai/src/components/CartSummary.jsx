import { motion } from "framer-motion";

import { formatCurrency } from "../utils/format";

function CartSummary({ subtotal = 0, itemCount = 0 }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-white/70">Order Summary</p>
      <div className="mt-4 space-y-3 text-sm text-white/85">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>
      <div className="my-4 h-px bg-white/20" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Total</span>
        <span className="text-xl font-semibold text-white">{formatCurrency(subtotal)}</span>
      </div>
      <button
        type="button"
        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.35)] transition hover:brightness-105"
      >
        Checkout Soon
      </button>
    </motion.aside>
  );
}

export default CartSummary;
