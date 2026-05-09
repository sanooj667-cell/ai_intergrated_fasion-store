import { motion } from "framer-motion";

import ProductSection from "../components/ProductSection";

const premiumShades = [
  {
    title: "Women Gallery",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=420&q=80",
    tone: "bg-[#ffb8c0]",
  },
  {
    title: "Children Fashion",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=420&q=80",
    tone: "bg-[#f2d47a]",
  },
  {
    title: "Men's Fashion",
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=420&q=80",
    tone: "bg-[#e3d9d7]",
  },
  {
    title: "Women's Fashion",
    image:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=420&q=80",
    tone: "bg-[#b89f90]",
  },
];

const categoryItems = [
  { key: "dress", label: "Dresses" },
  { key: "tshirt", label: "T-shirts" },
  { key: "denim", label: "Denim" },
  { key: "jacket", label: "Jackets" },
  { key: "coat", label: "Coats" },
  { key: "shoes", label: "Shoes" },
];

function CategoryIcon({ kind }) {
  if (kind === "dress") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m8 4 4 3 4-3" />
        <path d="M8 7 5 20h14L16 7" />
      </svg>
    );
  }
  if (kind === "tshirt") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m8 6 4 2 4-2 3 3-3 2v9H8v-9L5 9z" />
      </svg>
    );
  }
  if (kind === "denim") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8l1 16h-3l-2-7-2 7H7z" />
      </svg>
    );
  }
  if (kind === "jacket") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8l2 5-2 2v9H8v-9L6 9z" />
        <path d="M12 4v16" />
      </svg>
    );
  }
  if (kind === "coat") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 4h6l1 5-1 11H9L8 9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 16c2-2 4-2 6 0 2-2 4-2 6 0" />
      <path d="M7 16V9l4-3 4 3v7" />
    </svg>
  );
}

function HomePage() {
  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="hero-panel relative overflow-hidden lg:h-[calc(100vh-6.2rem)] lg:min-h-[520px] lg:max-h-[640px]"
      >
        <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Content Area */}
          <div className="flex h-full flex-col justify-center space-y-5 px-8 py-10 sm:px-12 lg:px-16 lg:py-0 xl:px-20">
            <p className="text-sm font-medium text-white/90">Exclusive Offer 20% Off This Week</p>
            <h1 className="max-w-md text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.5rem]">
              Stylish Female Clothes
            </h1>
            <p className="max-w-md text-white/90">
              Made from soft, durable fabric with trend-first cuts for modern street and daily wear.
            </p>

            <div className="flex w-full max-w-md flex-wrap items-center gap-3 rounded-full bg-white/25 p-2">
              <button type="button" className="rounded-full bg-white/90 px-6 py-2.5 text-sm font-medium text-[#e6535c] transition hover:bg-white">
                Select Category
              </button>
              <button type="button" className="rounded-full bg-[#ef5f67] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:bg-[#e74b58]">
                Shop Now
              </button>
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/20 p-3 shadow-inner backdrop-blur-sm">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
                  alt="Customer 1"
                  className="h-10 w-10 rounded-full border-2 border-[#ff4b5d] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Customer 2"
                  className="h-10 w-10 rounded-full border-2 border-[#ff4b5d] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=120&q=80"
                  alt="Customer 3"
                  className="h-10 w-10 rounded-full border-2 border-[#ff4b5d] object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Our Happy Customers</p>
                <p className="text-xs text-white/90">★★★★★ 4.9 (455+ Reviews)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-white/90">Not Yet Member?</span>
              <button type="button" className="rounded-full border border-white/60 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25">
                Sign Up Now
              </button>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="relative flex min-h-[380px] items-end justify-center px-4 pt-10 sm:min-h-[450px] lg:min-h-full lg:px-0 lg:pt-0">
            <div className="absolute bottom-6 h-[320px] w-[320px] rounded-full bg-white/20 sm:h-[400px] sm:w-[400px] lg:bottom-1/2 lg:translate-y-1/2 lg:h-[480px] lg:w-[480px]" />
            <img
              src="/hero-model2.png"
              alt="Fashion hero"
              className="relative z-10 h-auto max-h-[400px] w-[90%] max-w-[420px] object-contain object-bottom drop-shadow-[0_20px_30px_rgba(160,36,51,0.5)] sm:max-h-[480px] lg:absolute lg:bottom-0 lg:max-h-[90%] lg:w-auto lg:max-w-[550px]"
            />
          </div>
        </div>
      </motion.div>

      <section className="space-y-5">
        <h2 className="section-title">Premium Shades</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {premiumShades.map((item) => (
            <article
              key={item.title}
              className={`flex items-center gap-3 rounded-full p-2 pr-4 shadow-sm ${item.tone}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#4a4e57]">{item.title}</p>
                <button type="button" className="mt-1 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-[#e6535c]">
                  Click Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="section-title">Category</h2>
        <div className="glass-panel flex flex-wrap items-center justify-center gap-4 p-5">
          <button
            type="button"
            className="rounded-full border border-[#ef5f67] bg-[#fff1f1] px-4 py-2 text-sm font-semibold text-[#e6535c]"
          >
            All
          </button>
          {categoryItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fff1f1] hover:text-[#e6535c]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe4e7] text-[#e6535c]">
                <CategoryIcon kind={item.key} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <ProductSection
        title="Trending Products"
        subtitle="Top picks fetched live from your Django API"
        emptyTitle="No products in catalog"
        emptyText="Add products from Django admin to display them here."
      />
    </section>
  );
}

export default HomePage;
