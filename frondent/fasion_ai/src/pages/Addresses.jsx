import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { createAddress, deleteAddress, getAddresses, updateAddress } from "../api/addresses";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const fieldClass =
  "mt-1.5 w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/45 focus:bg-white/15";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-white/70";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  is_default: false,
};

function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const defaultEmail = useMemo(() => user?.email || "", [user?.email]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load your saved addresses.");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, email: prev.email || defaultEmail }));
  }, [defaultEmail]);

  const startCreate = () => {
    setEditingId(null);
    setFormError("");
    setForm({ ...emptyForm, email: defaultEmail });
  };

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setFormError("");
    setForm({
      full_name: addr.full_name || "",
      email: addr.email || defaultEmail,
      phone: addr.phone || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      postal_code: addr.postal_code || "",
      is_default: Boolean(addr.is_default),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress(form);
      }
      await refresh();
      startCreate();
    } catch (err) {
      const data = err?.response?.data;
      const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : null;
      const val = firstKey ? data[firstKey] : null;
      setFormError(
        typeof val === "string" ? val : Array.isArray(val) && val[0] ? String(val[0]) : "Unable to save address.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await deleteAddress(id);
      await refresh();
      if (editingId === id) startCreate();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.75rem] border border-white/20 bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] p-6 text-white shadow-[0_18px_34px_rgba(231,75,88,0.3)] backdrop-blur-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/80">Addresses</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Shipping addresses</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
              Save and edit delivery details for faster premium checkout.
            </p>
          </div>
          <Link
            to="/checkout"
            className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
          >
            Back to checkout
          </Link>
        </div>
      </motion.div>

      {loading ? <Loader label="Loading addresses…" /> : null}

      {!loading && error ? (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur-lg">
          <p className="text-lg font-semibold">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Saved</p>
              <button
                type="button"
                onClick={startCreate}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
              >
                New address
              </button>
            </div>

            <AnimatePresence>
              {addresses.map((addr) => (
                <motion.article
                  key={addr.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold">{addr.full_name}</p>
                        {addr.is_default ? (
                          <span className="rounded-full border border-emerald-300/50 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-white/75">{addr.email}</p>
                      <p className="mt-1 text-sm text-white/75">{addr.phone}</p>
                      <p className="mt-2 text-sm text-white/85">{addr.address}</p>
                      <p className="mt-1 text-sm text-white/75">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(addr)}
                        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === addr.id}
                        onClick={() => handleDelete(addr.id)}
                        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busyId === addr.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {!addresses.length ? (
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white/80 backdrop-blur-lg">
                <p className="text-sm">No saved addresses yet.</p>
              </div>
            ) : null}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg sm:p-8"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                {editingId ? "Edit address" : "Add address"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Delivery details</h2>
              <p className="mt-1 text-sm text-white/75">These details can be used during checkout.</p>
            </div>

            {formError ? (
              <div className="rounded-3xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-white backdrop-blur-lg">
                {formError}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={labelClass}>Full name</span>
                <input
                  className={fieldClass}
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label>
                <span className={labelClass}>Email</span>
                <input
                  type="email"
                  className={fieldClass}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label>
                <span className={labelClass}>Phone</span>
                <input
                  className={fieldClass}
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Street address</span>
                <input
                  className={fieldClass}
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label>
                <span className={labelClass}>City</span>
                <input
                  className={fieldClass}
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label>
                <span className={labelClass}>State / Region</span>
                <input
                  className={fieldClass}
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Postal code</span>
                <input
                  className={fieldClass}
                  value={form.postal_code}
                  onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))}
                  required
                  disabled={saving}
                />
              </label>
              <label className="sm:col-span-2 flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
                <span className="text-sm font-medium text-white/85">Set as default</span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#ef6a6c]"
                  checked={form.is_default}
                  onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
                  disabled={saving}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update address" : "Save address"}
            </button>
          </motion.form>
        </div>
      ) : null}
    </section>
  );
}

export default Addresses;

