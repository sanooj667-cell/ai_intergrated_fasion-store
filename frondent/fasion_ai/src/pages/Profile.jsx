import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Profile() {
  const { user, refreshProfile, logout } = useAuth();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true;

    const sync = async () => {
      if (user) {
        setLoading(false);
        return;
      }
      await refreshProfile();
      if (mounted) setLoading(false);
    };

    sync();
    return () => {
      mounted = false;
    };
  }, [refreshProfile, user]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-24">
        <Loader label="Fetching your profile..." />
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-4xl flex-col justify-center space-y-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="glass-panel overflow-hidden rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6535c]">My account</p>
            <h1 className="mt-2 text-3xl font-bold text-[#2f3440] sm:text-4xl">Profile</h1>
            <p className="mt-2 text-sm text-[#7a808a]">Authenticated user details from your DRF backend.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[#ffd0d4] bg-[#fff1f1] px-5 py-2.5 text-sm font-semibold text-[#e6535c] transition hover:bg-[#ffe7ea]"
          >
            Logout
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06 }}
        className="glass-panel rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
      >
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#ffd8dc] bg-[#fff8f8] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa1ab]">Email</dt>
            <dd className="mt-2 text-sm font-medium text-[#2f3440]">{user?.email || "-"}</dd>
          </div>
          <div className="rounded-2xl border border-[#ffd8dc] bg-[#fff8f8] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa1ab]">User ID</dt>
            <dd className="mt-2 text-sm font-medium text-[#2f3440]">{user?.id ?? "-"}</dd>
          </div>
          <div className="rounded-2xl border border-[#ffd8dc] bg-[#fff8f8] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa1ab]">Customer</dt>
            <dd className="mt-2 text-sm font-medium text-[#2f3440]">{user?.is_customer ? "Yes" : "No"}</dd>
          </div>
          <div className="rounded-2xl border border-[#ffd8dc] bg-[#fff8f8] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa1ab]">Account status</dt>
            <dd className="mt-2 text-sm font-medium text-[#2f3440]">{user?.is_active ? "Active" : "Inactive"}</dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}

export default Profile;
