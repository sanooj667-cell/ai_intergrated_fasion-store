import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 text-center sm:p-12"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-[#e6535c] font-bold">Orders</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">No orders yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 font-medium leading-relaxed">
        When you complete checkout, your premium fashion orders will appear here with full shipping and
        item details.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex rounded-full bg-[#ef5f67] hover:bg-[#e74b58] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition shadow-md active:scale-95"
        >
          Browse shop
        </Link>
        <Link
          to="/cart"
          className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50 shadow-sm"
        >
          View cart
        </Link>
      </div>
    </motion.div>
  );
}

export default EmptyOrders;
