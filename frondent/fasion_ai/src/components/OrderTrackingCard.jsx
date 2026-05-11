import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import TrackingStatusBadge from "./TrackingStatusBadge";
import { formatCurrency } from "../utils/format";

function OrderTrackingCard({ order }) {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-[#ef6a6c]/90 to-[#f47a78]/85 p-6 text-white shadow-[0_20px_40px_rgba(231,75,88,0.35)] backdrop-blur-xl sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/80">Live tracking</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Order #{order.id}</h1>
          <p className="mt-2 font-mono text-sm text-white/90">{order.tracking_id}</p>
        </div>
        <div className="text-right">
          <TrackingStatusBadge status={order.order_status} label={order.order_status_label} />
          <p className="mt-3 text-lg font-semibold">{formatCurrency(order.total_price)}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/orders/${order.id}`}
          className="rounded-full border border-white/35 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          Full details
        </Link>
        <Link
          to="/orders"
          className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
        >
          All orders
        </Link>
      </div>
    </motion.div>
  );
}

export default OrderTrackingCard;
