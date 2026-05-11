import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-2xl border border-white/25 bg-slate-950/35 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition focus:border-white/45 focus:bg-slate-950/45";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-white/70";

function CheckoutForm({ onSubmit, submitting = false, defaultEmail = "", defaultValues = null }) {
  const [fullName, setFullName] = useState(defaultValues?.full_name || "");
  const [email, setEmail] = useState(defaultValues?.email || defaultEmail);
  const [phone, setPhone] = useState(defaultValues?.phone || "");
  const [address, setAddress] = useState(defaultValues?.address || "");
  const [city, setCity] = useState(defaultValues?.city || "");
  const [state, setState] = useState(defaultValues?.state || "");
  const [postalCode, setPostalCode] = useState(defaultValues?.postal_code || "");

  useEffect(() => {
    if (defaultEmail) setEmail((current) => current || defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    if (!defaultValues) return;
    setFullName(defaultValues.full_name || "");
    setEmail(defaultValues.email || defaultEmail || "");
    setPhone(defaultValues.phone || "");
    setAddress(defaultValues.address || "");
    setCity(defaultValues.city || "");
    setState(defaultValues.state || "");
    setPostalCode(defaultValues.postal_code || "");
  }, [defaultEmail, defaultValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-white/20 bg-slate-950/25 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-white/70">Shipping</p>
        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Delivery details</h2>
        <p className="mt-1 text-sm text-white/75">Where should we send your curated fashion picks?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={labelClass}>Full name</span>
          <input
            className={fieldClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
            disabled={submitting}
          />
        </label>
        <label>
          <span className={labelClass}>Email</span>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={submitting}
          />
        </label>
        <label>
          <span className={labelClass}>Phone</span>
          <input
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            disabled={submitting}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Street address</span>
          <input
            className={fieldClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
            required
            disabled={submitting}
          />
        </label>
        <label>
          <span className={labelClass}>City</span>
          <input
            className={fieldClass}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
            required
            disabled={submitting}
          />
        </label>
        <label>
          <span className={labelClass}>State / Region</span>
          <input
            className={fieldClass}
            value={state}
            onChange={(e) => setState(e.target.value)}
            autoComplete="address-level1"
            required
            disabled={submitting}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Postal code</span>
          <input
            className={fieldClass}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            autoComplete="postal-code"
            required
            disabled={submitting}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </motion.form>
  );
}

export default CheckoutForm;
