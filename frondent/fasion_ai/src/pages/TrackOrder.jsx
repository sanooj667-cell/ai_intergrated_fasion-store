import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { trackOrder } from "../api/orders";
import Loader from "../components/Loader";
import OrderTracker from "../components/OrderTracker";
import OrderTrackingCard from "../components/OrderTrackingCard";

function TrackOrder() {
  const { tracking_id: trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTracking = useCallback(async () => {
    if (!trackingId) return;
    setLoading(true);
    setError("");
    try {
      const data = await trackOrder(trackingId);
      setOrder(data);
    } catch {
      setError("We could not find that tracking number, or it is not linked to your account.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [trackingId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.75rem] border border-white/20 bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] p-6 text-white shadow-[0_18px_34px_rgba(231,75,88,0.3)] backdrop-blur-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/80">Track order</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Delivery intelligence</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
              Real-time milestones for your premium fashion shipment — synced to your account.
            </p>
          </div>
          <Link
            to="/orders"
            className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
          >
            Order history
          </Link>
        </div>
      </motion.div>

      {loading ? <Loader label="Fetching tracking…" /> : null}

      {!loading && error ? (
        <div className="glass-panel p-8 text-center text-slate-850 backdrop-blur-lg">
          <p className="text-lg font-semibold">{error}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchTracking}
              className="rounded-full border border-[#ffd0d4] bg-[#fff1f1] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#ffe7ea]"
            >
              Retry
            </button>
            <Link
              to="/orders"
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50 shadow-sm"
            >
              My orders
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && !error && order ? (
        <div className="space-y-6">
          <OrderTrackingCard order={order} />
          <OrderTracker
            orderStatus={order.order_status}
            orderStatusLabel={order.order_status_label}
            trackingTimeline={order.tracking_timeline}
            deliveryProgressPercent={order.delivery_progress_percent}
            estimatedDelivery={order.estimated_delivery}
            trackingId={order.tracking_id}
          />
        </div>
      ) : null}
    </section>
  );
}

export default TrackOrder;
