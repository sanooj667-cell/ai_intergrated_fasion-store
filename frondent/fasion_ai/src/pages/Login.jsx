import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})?.[0]?.[0] ||
        "Unable to login right now. Please try again.";
      setError(String(detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5 rounded-[2rem] border border-[#ffd7da] bg-white/55 p-6 backdrop-blur-md lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
      >
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#e6535c]">Welcome back</p>
        <h1 className="text-4xl font-bold leading-tight text-[#2f3440] sm:text-5xl">
          Sign in to continue your fashion journey.
        </h1>
        <p className="max-w-md text-sm text-[#7a808a]">
          Access your profile, saved choices, and personalized storefront with secure JWT authentication.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="glass-panel rounded-[2rem] border border-[#ffd4d8] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#4e5561]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#ffd4d8] bg-white px-4 py-3 text-sm text-[#2f3440] outline-none transition focus:border-[#ef5f67] focus:ring-2 focus:ring-[#ffd7da]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#4e5561]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#ffd4d8] bg-white px-4 py-3 text-sm text-[#2f3440] outline-none transition focus:border-[#ef5f67] focus:ring-2 focus:ring-[#ffd7da]"
              placeholder="Enter your password"
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-[#ffd2d7] bg-[#fff1f1] px-3 py-2 text-sm text-[#d94753]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#ef5f67] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,95,103,0.3)] transition hover:bg-[#e74b58] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-[#7a808a]">
            New here?{" "}
            <Link to="/register" className="font-semibold text-[#e6535c] hover:text-[#df4450]">
              Create an account
            </Link>
          </p>
        </form>
      </motion.section>
    </div>
  );
}

export default Login;
