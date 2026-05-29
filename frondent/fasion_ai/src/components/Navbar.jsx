import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../api/cart";

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

function navLinkClass({ isActive }, inHero = false) {
  if (inHero) {
    return [
      "group relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300",
      isActive
        ? "bg-white/35 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
        : "text-white/88 hover:bg-white/20 hover:text-white",
    ].join(" ");
  } else {
    return [
      "group relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300",
      isActive
        ? "bg-[#fff1f2] text-[#e6535c] shadow-[0_4px_12px_rgba(239,95,103,0.08)]"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    ].join(" ");
  }
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
  const { totalQuantity, iconPulse, notifyProductAdded } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
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
    { to: "/tryon", label: "AI Try-On" },
  ];

  const accountLinks = isAuthenticated
    ? [
      { to: "/addresses", label: "Addresses" },
      { to: "/orders", label: "Orders" },
      ...(user?.is_staff ? [{ to: "/admin", label: "Admin", badge: "Staff" }] : []),
    ]
    : [];

  const getLinkClass = (props) => navLinkClass(props, inHero);

  const iconBtn = inHero
    ? "relative inline-flex items-center justify-center rounded-full bg-white/15 p-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-white/28 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95"
    : "relative inline-flex items-center justify-center rounded-full bg-slate-50 p-2.5 text-slate-700 border border-slate-200/60 shadow-sm transition duration-300 hover:scale-105 hover:bg-slate-100 hover:text-[#ef5f67] active:scale-95";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full shrink-0 px-4 pt-3 sm:px-6 ${inHero ? "sticky top-0 z-50" : "sticky top-0 z-40"}`}
    >
      <nav
        className={`relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all duration-500 sm:rounded-[1.35rem] sm:px-5 sm:py-2.5 ${
          inHero
            ? `${t.shell} text-white backdrop-blur-2xl backdrop-saturate-150`
            : "bg-white/80 border border-[#ffd7da]/80 shadow-[0_10px_30px_rgba(239,95,103,0.06)] text-slate-800 backdrop-blur-md"
        } ${scrolled ? "scale-[0.99] shadow-[0_12px_40px_rgba(0,0,0,0.18)]" : ""}`}
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
          <span className={`text-xl sm:text-2xl font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-sans italic lowercase transition ${
            inHero ? "text-white" : "text-[#e6535c]"
          }`}>
            vexo
          </span>
        </Link>

        <motion.div
          layout
          className={`relative z-10 hidden items-center gap-0.5 rounded-full p-1 md:flex transition ${
            inHero ? "bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" : "bg-slate-100/80 border border-slate-200/40"
          }`}
        >
          {primaryLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={getLinkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && inHero ? (
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
            <NavLink key={item.to} to={item.to} className={getLinkClass}>
              {({ isActive }) => (
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.badge ? (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      inHero ? t.badge : "bg-[#ffe8ea] text-[#d94753]"
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                  {isActive && inHero ? (
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
            className={`group relative ml-0.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              inHero ? "text-white/95 hover:bg-white/20" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
            }`}
          >
            <span className="relative z-10">Sale</span>
            <span className={`absolute -right-1 -top-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-sm ${
              inHero ? "bg-white text-[#e6535c]" : "bg-[#ef5f67] text-white"
            }`}>
              20%
            </span>
          </Link>
        </motion.div>

        <motion.div
          layout
          className="relative z-10 flex items-center gap-1.5 sm:gap-2"
        >
          <button 
            type="button" 
            onClick={() => setWishlistOpen(true)}
            className={`${iconBtn} relative inline-flex`} 
            aria-label="Wishlist"
          >
            <HeartIcon className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-md transition ${
                inHero ? `bg-white ${t.accent}` : "bg-[#ef5f67] text-white"
              }`}>
                {wishlist.length}
              </span>
            )}
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
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-md transition ${
                  inHero ? `bg-white ${t.accent}` : "bg-[#ef5f67] text-white"
                }`}
              >
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </motion.span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <motion.div layout className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/profile"
                className={`relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition duration-300 hover:scale-105 active:scale-95 ${
                  inHero
                    ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm hover:bg-white/28 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60 shadow-sm"
                }`}
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
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  inHero
                    ? "bg-white/10 text-white hover:bg-white/22"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  inHero
                    ? `bg-white shadow-[0_10px_28px_rgba(0,0,0,0.15)] ${t.cta}`
                    : "bg-[#ef5f67] text-white shadow-[0_6px_18px_rgba(239,95,103,0.2)] hover:bg-[#e74b58]"
                }`}
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
              className={`fixed left-4 right-4 top-[4.5rem] z-50 overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-2xl md:hidden ${
                inHero
                  ? `bg-gradient-to-br ${t.shell}`
                  : "bg-white/95 border border-slate-200 text-slate-800"
              }`}
            >
              <p className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                inHero ? "text-white/70" : "text-slate-400"
              }`}>
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
                        `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? inHero
                              ? "bg-white/30 text-white"
                              : "bg-[#fff1f2] text-[#e6535c]"
                            : inHero
                              ? "text-white/90 hover:bg-white/15"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                      {item.badge ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inHero ? t.badge : "bg-[#ffe8ea] text-[#d94753]"
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  </motion.div>
                ))}
                <Link
                  to="/shop"
                  className={`mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    inHero ? "bg-white/20 text-white" : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Shop sale
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    inHero ? "bg-white text-[#e6535c]" : "bg-[#ef5f67] text-white"
                  }`}>
                    20% off
                  </span>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-150/40"
              >
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-1">
                    <p className={`truncate text-xs ${inHero ? "text-white/75" : "text-slate-500"}`}>{user?.email}</p>
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className={`rounded-xl py-3 text-center text-sm font-semibold transition ${
                        inHero ? "bg-white/10 text-white" : "bg-slate-50 border border-slate-200 text-slate-700"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`rounded-xl py-3 text-center text-sm font-semibold shadow-lg transition ${
                        inHero ? `bg-white ${t.accent}` : "bg-[#ef5f67] text-white"
                      }`}
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

      {/* Wishlist Drawer Modal */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
              onClick={() => setWishlistOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-white/95 backdrop-blur-2xl shadow-2xl p-6 flex flex-col border-l border-slate-100 text-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="#ef5f67" stroke="#ef5f67" className="h-5 w-5 animate-pulse">
                      <path d="M12 20s-6.6-3.9-9-8.1A5.5 5.5 0 1 1 12 6a5.5 5.5 0 1 1 9 5.9C18.6 16.1 12 20 12 20Z" />
                    </svg>
                    My Favorites
                  </h3>
                  <p className="text-xs text-slate-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                </div>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="rounded-full hover:bg-slate-100 p-2 text-slate-500 hover:text-slate-700 transition"
                  aria-label="Close Favorites"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4.5 w-4.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                      <img
                        src={item.image_url || item.image}
                        alt={item.title}
                        className="h-16 w-16 rounded-xl object-cover bg-white border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link 
                            to={`/product/${item.id}`}
                            onClick={() => setWishlistOpen(false)}
                            className="text-xs font-bold text-slate-800 hover:text-[#ef5f67] transition block truncate"
                          >
                            {item.title}
                          </Link>
                          <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">{item.brand || "Vexo Collection"}</p>
                        </div>
                        <p className="text-xs font-extrabold text-[#ef5f67] mt-1">{item.price ? `$${Number(item.price).toFixed(2)}` : ''}</p>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-slate-400 hover:text-[#ef5f67] p-1 transition"
                          title="Remove from favorites"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={async () => {
                            try {
                              await addToCart({ product_id: item.id, quantity: 1 });
                              notifyProductAdded(item);
                            } catch {
                              alert("Unable to add item to cart.");
                            }
                          }}
                          className="rounded-full bg-[#ef5f67] hover:bg-[#e74b58] text-white text-[10px] font-bold px-3 py-1.5 shadow-sm transition active:scale-95"
                        >
                          + Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 space-y-4 text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-16 w-16 opacity-40">
                      <path d="M12 20s-6.6-3.9-9-8.1A5.5 5.5 0 1 1 12 6a5.5 5.5 0 1 1 9 5.9C18.6 16.1 12 20 12 20Z" />
                    </svg>
                    <p className="text-sm font-semibold">Your favorites list is empty</p>
                    <p className="text-xs max-w-[240px] mx-auto leading-relaxed">
                      Tap the heart icon on any product detailing page to save your favorite styles here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
