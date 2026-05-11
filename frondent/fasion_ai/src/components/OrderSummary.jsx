import { motion } from "framer-motion";

import { formatCurrency } from "../utils/format";
import OrderItemCard from "./OrderItemCard";

function OrderSummary({ items = [], subtotal = 0, title = "Order summary" }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 rounded-3xl border border-white/20 bg-slate-950/25 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-white/70">{title}</p>
        <p className="mt-1 text-sm text-white/75">Review items and totals before placing your order.</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <OrderItemCard
            key={item.id}
            layoutId={`checkout-line-${item.id}`}
            title={item.product_title}
            imageUrl={item.product_image}
            quantity={item.quantity}
            unitPrice={item.product_price}
            lineTotal={item.line_total}
          />
        ))}
      </div>

      <div className="h-px bg-white/20" />
      <div className="flex items-center justify-between text-white">
        <span className="text-sm font-medium">Total</span>
        <span className="text-xl font-semibold">{formatCurrency(subtotal)}</span>
      </div>
    </motion.aside>
  );
}

export default OrderSummary;
