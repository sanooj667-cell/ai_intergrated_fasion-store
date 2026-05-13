import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatCurrency } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80";

function AddToCartModal({ product, onClose }) {
  if (!product) return null;

  const imageUrl = product.image_url || product.image || FALLBACK_IMAGE;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ffccd1] bg-white shadow-[0_24px_48px_rgba(231,75,88,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#ffe2e5] bg-gradient-to-r from-[#fff6f7] to-white px-6 py-4">
          <p id="add-to-cart-title" className="text-sm font-semibold text-[#e6535c]">
            Added to cart
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">You can review it anytime</p>
        </div>

        <div className="flex gap-4 p-6">
          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#ffd5d9] bg-[#fff0f1]">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-semibold capitalize text-slate-800">{product.title}</p>
            <p className="mt-2 text-lg font-semibold text-[#e6535c]">{formatCurrency(product.price)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#ffe2e5] bg-[#fffafb] px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-ghost order-2 rounded-xl px-4 py-2.5 text-sm sm:order-1">
            Continue shopping
          </button>
          <Link
            to="/cart"
            onClick={onClose}
            className="btn-primary order-1 inline-flex justify-center rounded-xl px-4 py-2.5 text-center text-sm sm:order-2"
          >
            View cart
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddToCartModal;
