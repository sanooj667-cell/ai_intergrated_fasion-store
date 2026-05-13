import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/30 text-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] ring-1 ring-white/35"
      : "text-white/92 hover:bg-white/18 hover:text-white"
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

function Navbar({ inHero = false, theme = "girls" }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { totalQuantity, iconPulse } = useCart();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`w-full shrink-0 bg-transparent px-4 pt-3 sm:px-6 ${inHero ? "sticky top-0 z-50" : "sticky top-0 z-40"}`}
    >
      <nav className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.2rem] border border-white/45 px-4 py-3 text-white shadow-[0_16px_48px_rgba(160,40,55,0.28),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-[1.35] ring-1 ring-white/25 sm:px-6 bg-gradient-to-r ${theme === "mens" ? "from-[#434343]/58 via-white/[0.14] to-[#000000]/58 shadow-[0_16px_48px_rgba(0,0,0,0.28)]" : theme === "kids" ? "from-[#f2d47a]/58 via-white/[0.14] to-[#d4ac0d]/58 shadow-[0_16px_48px_rgba(212,172,13,0.28)]" : "from-[#ef6a6c]/58 via-white/[0.14] to-[#f47a78]/58"}`}>
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="rounded-full border border-white/50 bg-white/22 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
            JC
          </span>
          <span className="text-sm font-semibold tracking-wide text-white sm:text-base">John Clothes</span>
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
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/18 hover:text-white"
          >
            Deals
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/18 hover:text-white"
          >
            About Us
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/18 hover:text-white"
          >
            Blog
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/18 hover:text-white"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            className="hidden rounded-full border border-white/35 bg-white/12 p-2.5 text-white/95 transition hover:bg-white/22 hover:text-white sm:inline-flex"
            aria-label="Wishlist"
          >
            <HeartIcon className="h-4 w-4" />
          </button>
          <Link
            to="/cart"
            className="relative inline-flex rounded-full border border-white/35 bg-white/12 p-2.5 text-white/95 transition hover:bg-white/22 hover:text-white"
            aria-label={totalQuantity > 0 ? `Cart, ${totalQuantity} items` : "Cart"}
          >
            <motion.span
              key={iconPulse}
              className="inline-flex"
              initial={false}
              animate={iconPulse > 0 ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <CartIcon className="h-4 w-4" />
            </motion.span>
            {totalQuantity > 0 ? (
              <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold shadow-sm ring-2 ${theme === "mens" ? "text-[#333] ring-[#333]" : theme === "kids" ? "text-[#b9770e] ring-[#b9770e]" : "text-[#e6535c] ring-[#ef6a6c]"}`}>
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="hidden max-w-[10rem] truncate rounded-full bg-white/18 px-3 py-1 text-xs font-medium text-white/95 sm:inline">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/45 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/22"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/45 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/22"
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-md transition hover:bg-[#fff8f8] ${theme === "mens" ? "text-[#333]" : theme === "kids" ? "text-[#b9770e]" : "text-[#e6535c]"}`}
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
