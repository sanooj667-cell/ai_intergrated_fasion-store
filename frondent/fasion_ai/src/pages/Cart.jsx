import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCartItems, removeCartItem, updateCartItemQuantity } from "../api/cart";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";

function Cart() {
  const { refreshCart } = useCart();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCartItems();
      setItems(Array.isArray(response.items) ? response.items : []);
      setSubtotal(Number(response.subtotal) || 0);
      await refreshCart(response);
    } catch {
      setError("Unable to load your cart right now.");
      setItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  }, [refreshCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId, quantity) => {
    setBusyItemId(itemId);
    try {
      await updateCartItemQuantity(itemId, quantity);
      await fetchCart();
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setBusyItemId(itemId);
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } finally {
      setBusyItemId(null);
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
        <p className="text-xs uppercase tracking-[0.28em] text-white/80">My Cart</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Premium Picks Ready for Checkout</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          Review your selected outfits and keep your wardrobe list in sync.
        </p>
      </motion.div>

      {loading ? <Loader label="Loading your cart..." /> : null}

      {!loading && error ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-lg font-semibold text-[#e6535c]">{error}</p>
          <button
            type="button"
            onClick={fetchCart}
            className="mt-4 rounded-full bg-[#ef5f67] hover:bg-[#e74b58] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md active:scale-95 transition-all"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && !items.length ? <EmptyCart /> : null}

      {!loading && !error && items.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  loading={busyItemId === item.id}
                  onDecrease={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                  onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </AnimatePresence>
            <Link 
              to="/shop" 
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
          <CartSummary subtotal={subtotal} itemCount={items.length} />
        </div>
      ) : null}
    </section>
  );
}

export default Cart;
