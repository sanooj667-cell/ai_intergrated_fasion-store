import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg sm:p-12"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-white/70">Orders</p>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">No orders yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
        When you complete checkout, your premium fashion orders will appear here with full shipping and
        item details.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
        >
          Browse shop
        </Link>
        <Link
          to="/cart"
          className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          View cart
        </Link>
      </div>
    </motion.div>
  );
}

export default EmptyOrders;
