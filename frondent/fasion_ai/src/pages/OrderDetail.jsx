import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrder } from "../api/orders";
import Loader from "../components/Loader";
import OrderItemCard from "../components/OrderItemCard";
import OrderTracker from "../components/OrderTracker";
import { formatCurrency } from "../utils/format";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch {
      setError("Order not found or you do not have access.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const created = order?.created_at ? new Date(order.created_at) : null;
  const dateLabel =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

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
            <p className="text-xs uppercase tracking-[0.28em] text-white/80">Order detail</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              {order ? `Order #${order.id}` : "Order"}
            </h1>
            {dateLabel ? <p className="mt-2 text-sm text-white/85">{dateLabel}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {order?.tracking_id ? (
              <Link
                to={`/track-order/${order.tracking_id}`}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
              >
                Track shipment
              </Link>
            ) : null}
            <Link
              to="/orders"
              className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </motion.div>

      {loading ? <Loader label="Loading order…" /> : null}

      {!loading && error ? (
        <div className="glass-panel p-8 text-center text-slate-850 backdrop-blur-lg">
          <p className="text-lg font-semibold">{error}</p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-full border border-[#ffd0d4] bg-[#fff1f1] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#ffe7ea]"
          >
            View all orders
          </Link>
        </div>
      ) : null}

      {!loading && !error && order ? (
        <div className="space-y-6">
          <OrderTracker
            compact
            orderStatus={order.order_status}
            orderStatusLabel={order.order_status_label}
            trackingTimeline={order.tracking_timeline}
            deliveryProgressPercent={order.delivery_progress_percent}
            estimatedDelivery={order.estimated_delivery}
            trackingId={order.tracking_id}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e6535c]">Items</h2>
              {(order.items || []).map((line) => (
                <OrderItemCard
                  key={line.id}
                  title={line.product?.title || "Product"}
                  imageUrl={line.product?.image_url}
                  quantity={line.quantity}
                  unitPrice={line.price}
                  lineTotal={line.line_total}
                />
              ))}
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-fit space-y-4 glass-panel bg-white/90 p-6 text-slate-850 backdrop-blur-lg"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#e6535c]">Summary</p>
              <div className="flex items-center justify-between text-lg font-semibold text-slate-800">
                <span>Total</span>
                <span className="text-[#e6535c]">{formatCurrency(order.total_price)}</span>
              </div>
              <p className="inline-flex rounded-full border border-[#ffd8dc] bg-[#fff8f8] px-3 py-1 text-xs font-medium capitalize text-slate-700">
                Payment: {order.payment_status}
              </p>

              <div className="h-px bg-[#ffd8dc]" />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ship to</p>
              <div className="space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">{order.full_name}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state} {order.postal_code}
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default OrderDetail;
