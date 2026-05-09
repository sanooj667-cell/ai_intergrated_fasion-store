import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel space-y-4 p-10 text-center"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-[#e6535c]">404</p>
      <h1 className="text-3xl font-semibold text-slate-800">Page not found</h1>
      <p className="text-sm text-slate-600">The page you requested does not exist.</p>
      <Link to="/shop" className="btn-ghost inline-flex rounded-lg px-5 py-2 text-sm">
        Return to Shop
      </Link>
    </motion.div>
  );
}

export default NotFoundPage;
