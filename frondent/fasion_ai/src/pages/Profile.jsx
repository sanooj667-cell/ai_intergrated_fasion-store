import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import api from "../api/axios";

import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Profile() {
  const { user, refreshProfile, logout } = useAuth();
  const [loading, setLoading] = useState(!user);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profile_picture", file);

      await api.patch("/auth/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshProfile();
    } catch (err) {
      console.error("Failed to upload profile picture", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

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
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md sm:h-24 sm:w-24">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffb8c0] to-[#ef5f67] text-3xl font-bold uppercase text-white">
                  {user?.email?.[0] || "?"}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              <button
                type="button"
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-[10px] font-medium text-white opacity-0 transition-opacity hover:opacity-100 sm:text-xs"
              >
                Change
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6535c]">My account</p>
              <h1 className="mt-2 text-3xl font-bold text-[#2f3440] sm:text-4xl">Profile</h1>
              <p className="mt-2 text-sm text-[#7a808a]">Authenticated user details from your DRF backend.</p>
            </div>
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
