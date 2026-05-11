import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/25 text-white shadow-[0_8px_18px_rgba(255,255,255,0.16)]"
      : "text-white/90 hover:bg-white/15 hover:text-white"
  }`;

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 20s-6.6-3.9-9-8.1A5.5 5.5 0 1 1 12 6a5.5 5.5 0 1 1 9 5.9C18.6 16.1 12 20 12 20Z" />
    </svg>
  );
}

function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 4h2l2.2 10.3a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20 7H7.1" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </svg>
  );
}

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 px-4 pt-3 sm:px-6"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.2rem] border border-white/20 bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-4 py-3 text-white shadow-[0_16px_34px_rgba(231,75,88,0.26)] backdrop-blur-lg sm:px-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
            JC
          </span>
          <span className="text-sm font-semibold tracking-wide text-white sm:text-base">
            John Clothes
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <NavLink to="/addresses" className={navLinkClass}>
                Addresses
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
            </>
          )}
          <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
            Deals
          </button>
          <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
            About Us
          </button>
          <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
            Blog
          </button>
          <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            className="hidden rounded-full border border-white/25 bg-white/10 p-2.5 text-white/90 transition hover:bg-white/20 hover:text-white sm:inline-flex"
            aria-label="Wishlist"
          >
            <HeartIcon className="h-4 w-4" />
          </button>
          <Link
            to="/cart"
            className="hidden rounded-full border border-white/25 bg-white/10 p-2.5 text-white/90 transition hover:bg-white/20 hover:text-white sm:inline-flex"
            aria-label="Cart"
          >
            <CartIcon className="h-4 w-4" />
          </Link>
          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 sm:inline">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
