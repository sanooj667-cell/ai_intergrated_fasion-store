import { motion } from "framer-motion";

import { formatCurrency } from "../utils/format";
import OrderItemCard from "./OrderItemCard";

function OrderSummary({ items = [], subtotal = 0, title = "Order summary" }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="glass-panel space-y-4 bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#e6535c]">{title}</p>
        <p className="mt-1 text-sm text-slate-500">Review items and totals before placing your order.</p>
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

      <div className="h-px bg-[#ffd8dc]" />
      <div className="flex items-center justify-between text-slate-800">
        <span className="text-sm font-medium">Total</span>
        <span className="text-xl font-semibold text-[#e6535c]">{formatCurrency(subtotal)}</span>
      </div>
    </motion.aside>
  );
}

export default OrderSummary;
