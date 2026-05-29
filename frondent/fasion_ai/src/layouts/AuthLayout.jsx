import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-4 pb-6 pt-6 text-slate-900 sm:px-6">
      <div className="mesh-bg pointer-events-none fixed inset-0 -z-20" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(244,111,113,0.24),transparent_45%),radial-gradient(circle_at_88%_16%,rgba(255,170,177,0.22),transparent_35%),radial-gradient(circle_at_75%_85%,rgba(255,220,223,0.3),transparent_42%)]" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.4rem] bg-[#ef6a6c] px-4 py-3 text-white shadow-[0_12px_28px_rgba(231,75,88,0.24)] sm:px-6"
      >
        <Link to="/" className="inline-flex items-center">
          <span className="text-xl font-black tracking-widest text-white font-sans italic lowercase">
            vexo
          </span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          Back Home
        </Link>
      </motion.div>

      <main className="mx-auto mt-6 flex w-full max-w-7xl flex-1 items-center py-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
