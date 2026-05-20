import { motion } from "framer-motion";

import { formatCurrency } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80";

function OrderItemCard({ title, imageUrl, quantity, unitPrice, lineTotal, layoutId }) {
  const image = imageUrl || FALLBACK_IMAGE;

  return (
    <motion.article
      layoutId={layoutId}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#ffd8dc] bg-white/90 p-4 shadow-sm backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img src={image} alt={title} className="h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-800 sm:text-lg">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Unit: {formatCurrency(unitPrice)}</p>
          <p className="mt-1 text-sm text-slate-500">Qty: {quantity}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Line total: <span className="font-semibold text-[#e6535c]">{formatCurrency(lineTotal)}</span></p>
        </div>
      </div>
    </motion.article>
  );
}

export default OrderItemCard;
