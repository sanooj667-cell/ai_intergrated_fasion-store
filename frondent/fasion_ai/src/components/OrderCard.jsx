import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatCurrency } from "../utils/format";
import TrackingStatusBadge from "./TrackingStatusBadge";

function OrderCard({ order }) {
  const created = order.created_at ? new Date(order.created_at) : null;
  const dateLabel =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 bg-white/90 backdrop-blur-xl transition hover:border-[#ffd0d4] hover:bg-[#fffcfc]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Order</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800">#{order.id}</h3>
          <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</p>
          <p className="mt-1 text-xl font-semibold text-[#e6535c]">{formatCurrency(order.total_price)}</p>
          <p className="mt-2 inline-flex rounded-full border border-[#ffd8dc] bg-[#fff8f8] px-3 py-1 text-xs font-medium capitalize text-slate-700">
            Pay: {order.payment_status || "pending"}
          </p>
          <div className="mt-2 flex justify-end">
            <TrackingStatusBadge status={order.order_status} label={order.order_status_label} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ffd8dc] pt-4">
        <p className="text-sm text-slate-600">
          {order.item_count != null ? `${order.item_count} items` : "Items"}
        </p>
        <div className="flex flex-wrap gap-2">
          {order.tracking_id ? (
            <Link
              to={`/track-order/${order.tracking_id}`}
              className="rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(231,75,88,0.35)] transition hover:brightness-105"
            >
              Track
            </Link>
          ) : null}
          <Link
            to={`/orders/${order.id}`}
            className="rounded-full border border-[#ffd0d4] bg-[#fff1f1] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#ffe7ea]"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default OrderCard;
