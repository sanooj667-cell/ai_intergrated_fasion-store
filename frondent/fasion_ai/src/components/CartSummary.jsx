import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatCurrency } from "../utils/format";

function CartSummary({ subtotal = 0, itemCount = 0 }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="glass-panel p-6"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-[#e6535c] font-bold">Order Summary</p>
      <div className="mt-4 space-y-3 text-sm text-slate-600 font-medium">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span className="font-semibold text-slate-800">{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
        </div>
      </div>
      <div className="my-4 border-t border-slate-150" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800">Total</span>
        <span className="text-xl font-extrabold text-[#e6535c]">{formatCurrency(subtotal)}</span>
      </div>
      <Link
        to="/checkout"
        className="mt-6 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.35)] transition hover:brightness-105"
      >
        Checkout
      </Link>
    </motion.aside>
  );
}

export default CartSummary;
