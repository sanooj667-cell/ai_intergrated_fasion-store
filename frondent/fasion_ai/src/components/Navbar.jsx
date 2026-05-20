import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const THEME_STYLES = {
  girls: {
    shell:
      "bg-[#ff6b6e]/20 border border-white/25 shadow-[0_20px_50px_rgba(230,70,85,0.12),inset_0_1px_0_rgba(255,255,255,0.4)]",
    accent: "text-[#e6535c]",
    ring: "ring-[#ef6a6c]",
    glow: "bg-[#ff8a8e]/40",
    cta: "text-[#e6535c] hover:bg-[#fff5f6]",
    badge: "bg-[#ffe8ea] text-[#d94753]",
  },
  mens: {
    shell:
      "bg-black/30 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
    accent: "text-[#333]",
    ring: "ring-[#333]",
    glow: "bg-white/25",
    cta: "text-[#333] hover:bg-[#f5f5f5]",
    badge: "bg-[#ececec] text-[#333]",
  },
  kids: {
    shell:
      "bg-[#f2d47a]/25 border border-white/25 shadow-[0_20px_50px_rgba(212,172,13,0.12),inset_0_1px_0_rgba(255,255,255,0.4)]",
    accent: "text-[#b9770e]",
    ring: "ring-[#d4ac0d]",
    glow: "bg-[#f2d47a]/50",
    cta: "text-[#b9770e] hover:bg-[#fffdf5]",
    badge: "bg-[#fff6d6] text-[#9a6b08]",
  },
};

function navLinkClass({ isActive }) {
  return [
    "group relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300",
    isActive
      ? "bg-white/35 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
      : "text-white/88 hover:bg-white/20 hover:text-white",
    isActive ? "" : "",
  ].join(" ");
}

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

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

function Navbar({ inHero = false, theme = "girls" }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { totalQuantity, iconPulse } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = THEME_STYLES[theme] || THEME_STYLES.girls;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const primaryLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
  ];

  const accountLinks = isAuthenticated
    ? [
      { to: "/addresses", label: "Addresses" },
      { to: "/orders", label: "Orders" },
      ...(user?.is_staff ? [{ to: "/admin", label: "Admin", badge: "Staff" }] : []),
    ]
    : [];

  const linkClass = navLinkClass;

  const iconBtn =
    "relative inline-flex items-center justify-center rounded-full bg-white/15 p-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-white/28 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full shrink-0 px-4 pt-3 sm:px-6 ${inHero ? "sticky top-0 z-50" : "sticky top-0 z-40"}`}
    >
      <nav
        className={`relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2 text-white backdrop-blur-2xl backdrop-saturate-150 sm:rounded-[1.35rem] sm:px-5 sm:py-2.5 ${t.shell} ${scrolled ? "scale-[0.99] shadow-[0_12px_40px_rgba(0,0,0,0.18)]" : ""
          } transition-all duration-500`}
      >
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full blur-2xl ${t.glow}`}
          animate={{ x: [0, 12, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute -right-6 top-0 h-20 w-20 rounded-full blur-2xl ${t.glow}`}
          animate={{ x: [0, -10, 0], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        <Link
          to="/"
          className="relative z-10 inline-flex min-w-0 items-center"
          onClick={() => setMobileOpen(false)}
        >
          <img src="/logo.png" alt="LotteMart" className="h-8 sm:h-10 object-contain drop-shadow-sm" />
        </Link>

        <motion.div
          layout
          className="relative z-10 hidden items-center gap-0.5 rounded-full bg-black/10 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] md:flex"
        >
          {primaryLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/25"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
          {accountLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {({ isActive }) => (
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.badge ? (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${t.badge}`}>
                      {item.badge}
                    </span>
                  ) : null}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/25"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </span>
              )}
            </NavLink>
          ))}
          <Link
            to="/shop"
            className="group relative ml-0.5 rounded-full px-3.5 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/20"
          >
            <span className="relative z-10">Sale</span>
            <span className="absolute -right-1 -top-1 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#e6535c] shadow-sm">
              20%
            </span>
          </Link>
        </motion.div>

        <motion.div
          layout
          className="relative z-10 flex items-center gap-1.5 sm:gap-2"
        >
          <button type="button" className={`${iconBtn} hidden sm:inline-flex`} aria-label="Wishlist">
            <HeartIcon className="h-4 w-4" />
          </button>
          <Link
            to="/cart"
            className={iconBtn}
            aria-label={totalQuantity > 0 ? `Cart, ${totalQuantity} items` : "Cart"}
            onClick={() => setMobileOpen(false)}
          >
            <motion.span
              key={iconPulse}
              className="inline-flex"
              initial={false}
              animate={iconPulse > 0 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <CartIcon className="h-4 w-4" />
            </motion.span>
            {totalQuantity > 0 ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold shadow-md ${t.accent}`}
              >
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </motion.span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <motion.div layout className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/profile"
                className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-white/28 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95"
                aria-label="Profile"
                onClick={() => setMobileOpen(false)}
              >
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold uppercase">{user?.email?.[0] || "?"}</span>
                )}
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/22"
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-[0_10px_28px_rgba(0,0,0,0.15)] transition ${t.cta}`}
              >
                Sign Up
              </Link>
            </motion.div>
          )}

          <button
            type="button"
            className={`${iconBtn} md:hidden`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`fixed left-4 right-4 top-[4.5rem] z-50 overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-2xl md:hidden bg-gradient-to-br ${t.shell}`}
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Menu
              </p>
              <motion.div className="flex flex-col gap-1">
                {[...primaryLinks, ...accountLinks].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-white/30 text-white" : "text-white/90 hover:bg-white/15"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                      {item.badge ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.badge}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  </motion.div>
                ))}
                <Link
                  to="/shop"
                  className="mt-1 flex items-center justify-between rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Shop sale
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#e6535c]">20% off</span>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-4 flex flex-col gap-2 pt-4"
              >
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-1">
                    <p className="truncate text-xs text-white/75">{user?.email}</p>
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="rounded-xl bg-white/10 py-3 text-center text-sm font-semibold text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`rounded-xl bg-white py-3 text-center text-sm font-semibold shadow-lg ${t.accent}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
