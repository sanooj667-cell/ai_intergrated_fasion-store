import { motion } from "framer-motion";

import ProductCard from "./ProductCard";

function ProductGrid({ products, emptyTitle = "No products found", emptyText = "Try adjusting search or filters." }) {
  if (!products.length) {
    return (
      <div className="glass-panel p-10 text-center">
        <h3 className="text-xl font-semibold text-[#e6535c]">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{emptyText}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
          },
        },
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ProductGrid;
