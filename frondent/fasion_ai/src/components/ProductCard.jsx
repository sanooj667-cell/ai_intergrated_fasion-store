import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatCurrency } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80";

function ProductCard({ product }) {
  const imageUrl = product.image_url || product.image || FALLBACK_IMAGE;
  const inStock = product.stock > 0;

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 230, damping: 20 }}
      className="group overflow-hidden rounded-3xl border border-[#ffccd1] bg-[#f27474] shadow-[0_10px_24px_rgba(231,75,88,0.15)]"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              inStock ? "bg-white text-[#e6535c]" : "bg-slate-700 text-white"
            }`}
          >
            {inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>

        <div className="space-y-2 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold text-slate-800">{product.title}</h3>
            <p className="whitespace-nowrap text-sm font-semibold text-[#e6535c]">{formatCurrency(product.price)}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-slate-600">
            {product.brand ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.brand}</span> : null}
            {product.gender ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.gender}</span> : null}
            {product.category?.name ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.category.name}</span> : null}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
