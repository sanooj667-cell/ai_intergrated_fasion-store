import { motion } from "framer-motion";

import DeliveryProgress from "./DeliveryProgress";
import TrackingStatusBadge from "./TrackingStatusBadge";
import TrackingTimeline from "./TrackingTimeline";

function OrderTracker({
  orderStatus,
  orderStatusLabel,
  trackingTimeline = [],
  deliveryProgressPercent = 0,
  estimatedDelivery,
  trackingId,
  compact = false,
}) {
  const est =
    estimatedDelivery &&
    !Number.isNaN(new Date(estimatedDelivery + "T12:00:00").getTime())
      ? new Date(estimatedDelivery + "T12:00:00").toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass-panel bg-white/90 backdrop-blur-lg ${compact ? "p-5" : "p-6 sm:p-8"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Shipment status</p>
          <div className="flex flex-wrap items-center gap-2">
            <TrackingStatusBadge status={orderStatus} label={orderStatusLabel} />
            {trackingId ? (
              <span className="rounded-full border border-[#ffd8dc] bg-[#fff8f8] px-3 py-1 font-mono text-[11px] text-slate-700">
                {trackingId}
              </span>
            ) : null}
          </div>
        </div>
        {est ? (
          <div className="rounded-2xl border border-[#ffd8dc] bg-[#fff8f8] px-4 py-3 text-right shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Est. delivery</p>
            <p className="mt-1 text-sm font-semibold text-[#e6535c]">{est}</p>
          </div>
        ) : null}
      </div>

      <div className={`${compact ? "mt-5" : "mt-6"} space-y-6`}>
        <DeliveryProgress percent={deliveryProgressPercent} />
        <TrackingTimeline steps={trackingTimeline} />
      </div>
    </motion.div>
  );
}

export default OrderTracker;
