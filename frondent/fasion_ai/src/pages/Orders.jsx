import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { getOrders } from "../api/orders";
import EmptyOrders from "../components/EmptyOrders";
import Loader from "../components/Loader";
import OrderCard from "../components/OrderCard";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load your orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.75rem] border border-white/20 bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] p-6 text-white shadow-[0_18px_34px_rgba(231,75,88,0.3)] backdrop-blur-lg"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/80">Orders</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Your order history</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          Track every premium purchase, payment status, and delivery snapshot in one place.
        </p>
      </motion.div>

      {loading ? <Loader label="Loading orders…" /> : null}

      {!loading && error ? (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur-lg">
          <p className="text-lg font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && !orders.length ? <EmptyOrders /> : null}

      {!loading && !error && orders.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Orders;
