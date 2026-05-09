import { motion } from "framer-motion";

import { formatCurrency } from "../utils/format";
import QuantitySelector from "./QuantitySelector";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80";

function CartItem({ item, onDecrease, onIncrease, onRemove, loading = false }) {
  const image = item.product_image || FALLBACK_IMAGE;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-lg sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img src={image} alt={item.product_title} className="h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28" />

        <div className="flex-1">
          <h3 className="text-base font-semibold text-white sm:text-lg">{item.product_title}</h3>
          <p className="mt-1 text-sm text-white/70">Unit: {formatCurrency(item.product_price)}</p>
          <p className="mt-1 text-sm font-medium text-white">Subtotal: {formatCurrency(item.line_total)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector
            value={item.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabled={loading}
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default CartItem;
