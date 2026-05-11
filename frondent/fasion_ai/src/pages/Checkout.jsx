import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCartItems } from "../api/cart";
import { createOrder } from "../api/orders";
import { getAddresses } from "../api/addresses";
import CheckoutForm from "../components/CheckoutForm";
import EmptyCart from "../components/EmptyCart";
import Loader from "../components/Loader";
import OrderSummary from "../components/OrderSummary";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/format";

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCartItems();
      setItems(Array.isArray(response.items) ? response.items : []);
      setSubtotal(Number(response.subtotal) || 0);
    } catch {
      setError("Unable to load your cart for checkout.");
      setItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const loadAddresses = useCallback(async () => {
    try {
      const data = await getAddresses();
      const list = Array.isArray(data) ? data : [];
      setAddresses(list);
      const def = list.find((a) => a.is_default);
      if (def) setSelectedAddressId(String(def.id));
      else if (list[0]) setSelectedAddressId(String(list[0].id));
    } catch {
      setAddresses([]);
      setSelectedAddressId("");
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const selectedAddress = addresses.find((a) => String(a.id) === String(selectedAddressId));

  const handlePlaceOrder = async (payload) => {
    setCheckoutError("");
    setSubmitting(true);
    try {
      const order = await createOrder(payload);
      setPlacedOrder(order);
      setItems([]);
      setSubtotal(0);
      if (order?.tracking_id) {
        navigate(`/track-order/${order.tracking_id}`, { replace: true });
      }
    } catch (err) {
      const data = err?.response?.data;
      let message = "Checkout failed. Please try again.";

      // DRF often returns:
      // - { detail: "..." }
      // - { field: ["error message"] }
      // - or sometimes HTML/text for 500s
      if (data && typeof data === "object") {
        if (typeof data.detail === "string") message = data.detail;
        else if (data.detail && Array.isArray(data.detail)) {
          message = data.detail.map((d) => d?.msg || String(d)).join(" ");
        } else {
          const keys = Object.keys(data);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const val = data[firstKey];
            if (Array.isArray(val) && val[0]) message = String(val[0]);
            else if (typeof val === "string" && val.trim()) message = val;
            else message = JSON.stringify(data);
          }
        }
      } else if (typeof data === "string" && data.trim()) {
        message = data;
      } else if (err?.message) {
        message = err.message;
      }

      setCheckoutError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.75rem] border border-white/20 bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] p-6 text-white shadow-[0_18px_34px_rgba(231,75,88,0.3)] backdrop-blur-lg"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/80">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Secure premium checkout</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          Confirm shipping, review your AI-curated cart, and place your order in one seamless flow.
        </p>
      </motion.div>

      {loading ? <Loader label="Preparing checkout…" /> : null}

      {!loading && error ? (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur-lg">
          <p className="text-lg font-semibold">{error}</p>
          <button
            type="button"
            onClick={loadCart}
            className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
          >
            Retry
          </button>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {!loading && !error && placedOrder ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-xl rounded-3xl border border-white/25 bg-white/12 p-8 text-center text-white backdrop-blur-xl sm:p-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              ✓
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/75">Order placed</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Thank you for your purchase</h2>
            <p className="mt-3 text-sm text-white/80">
              Order <span className="font-semibold">#{placedOrder.id}</span> total{" "}
              {formatCurrency(placedOrder.total_price)} — confirmation sent to{" "}
              <span className="font-medium">{placedOrder.email}</span>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {placedOrder.tracking_id ? (
                <Link
                  to={`/track-order/${placedOrder.tracking_id}`}
                  className="rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_22px_rgba(231,75,88,0.35)] transition hover:brightness-105"
                >
                  Track order
                </Link>
              ) : null}
              <Link
                to={`/orders/${placedOrder.id}`}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
              >
                View order
              </Link>
              <Link
                to="/orders"
                className="rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                All orders
              </Link>
              <Link
                to="/shop"
                className="rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Continue shopping
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!loading && !error && !placedOrder && !items.length ? <EmptyCart /> : null}

      {!loading && !error && !placedOrder && items.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {checkoutError ? (
              <div className="rounded-3xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-white backdrop-blur-lg">
                {checkoutError}
              </div>
            ) : null}
            <div className="rounded-3xl border border-white/20 bg-slate-950/25 p-5 text-white shadow-[0_18px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">Saved address</p>
                  <p className="mt-1 text-sm text-white/75">Select a saved address or manage your list.</p>
                </div>
                <Link
                  to="/addresses"
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
                >
                  Manage
                </Link>
              </div>
              <div className="mt-4">
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full rounded-2xl border border-white/25 bg-white/95 px-4 py-3 text-sm font-semibold text-[#2f3440] outline-none shadow-sm transition focus:border-white/45"
                  disabled={submitting || !addresses.length}
                >
                  {!addresses.length ? <option value="">No saved addresses</option> : null}
                  {addresses.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.is_default ? "Default — " : ""}
                      {a.full_name} • {a.city}, {a.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              submitting={submitting}
              defaultEmail={user?.email || ""}
              defaultValues={
                selectedAddress
                  ? {
                      full_name: selectedAddress.full_name,
                      email: selectedAddress.email,
                      phone: selectedAddress.phone,
                      address: selectedAddress.address,
                      city: selectedAddress.city,
                      state: selectedAddress.state,
                      postal_code: selectedAddress.postal_code,
                    }
                  : null
              }
            />
          </div>
          <OrderSummary items={items} subtotal={subtotal} />
        </div>
      ) : null}
    </section>
  );
}

export default Checkout;
