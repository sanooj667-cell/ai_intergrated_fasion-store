import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { addToCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80";

function QuickAddIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 4h2l2.2 10.3a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20 7H7.1" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </svg>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { notifyProductAdded } = useCart();
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(false);

  const imageUrl = product.image_url || product.image || FALLBACK_IMAGE;
  const inStock = product.stock > 0;
  const detailPath = `/product/${product.id}`;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!inStock || !product?.id) return;

    setAddLoading(true);
    setAddError(false);
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      notifyProductAdded(product);
    } catch {
      setAddError(true);
    } finally {
      setAddLoading(false);
    }
  };

  const addLabel = !isAuthenticated ? "Sign in to add to cart" : inStock ? "Add to cart" : "Out of stock";

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 230, damping: 20 }}
      className="group overflow-hidden rounded-3xl border border-[#ffccd1] bg-[#f27474] shadow-[0_10px_24px_rgba(231,75,88,0.15)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={detailPath} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <span
          className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            inStock ? "bg-white text-[#e6535c]" : "bg-slate-700 text-white"
          }`}
        >
          {inStock ? "In Stock" : "Sold Out"}
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || addLoading || authLoading}
          title={addError ? "Could not add. Try again." : addLabel}
          aria-label={addLabel}
          className={`absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/95 text-[#e6535c] shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 ${
            addError ? "ring-2 ring-[#e6535c]" : ""
          }`}
        >
          {addLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffd5d9] border-t-[#e6535c]" />
          ) : (
            <QuickAddIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <Link to={detailPath} className="block space-y-2 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-800">{product.title}</h3>
          <p className="whitespace-nowrap text-sm font-semibold text-[#e6535c]">{formatCurrency(product.price)}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-slate-600">
          {product.brand ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.brand}</span> : null}
          {product.gender ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.gender}</span> : null}
          {product.category?.name ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.category.name}</span> : null}
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
