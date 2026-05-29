import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


import Navbar from "../components/Navbar";
import HeroDripDivider from "../components/HeroDripDivider";
import ProductSection from "../components/ProductSection";

const heroSlides = [
  {
    id: "girls",
    title: "Premium Unisex Fashion",
    subtitle: "Made from soft, durable fabric with trend-first cuts for modern street and daily wear for everyone.",
    offerText: "Exclusive Unisex Offer 20% Off This Week",
    gradient: "linear-gradient(180deg, #f07a78 0%, #ff4b5d 100%)",
    gradientStops: [
      { offset: "0%", color: "#f07a78" },
      { offset: "100%", color: "#ff4b5d" },
    ],
    btnColor: "bg-[#ef5f67] hover:bg-[#e74b58] shadow-red-500/30",
    textBtnColor: "text-[#e6535c]",
    img: "/hero-model2.png",
    avatarBorder: "border-[#ff4b5d]",
    theme: "girls"
  }
];

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="space-y-8">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <motion.div
          className="relative flex min-h-[100dvh] flex-col overflow-visible rounded-none text-white transition-all duration-700 ease-in-out"
        >
          <div className="relative flex min-h-0 flex-1 flex-col" style={{ background: slide.gradient }}>
            {/* Background elements wrapper - has overflow-hidden but doesn't wrap Navbar */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {/* Background Circle Wrapper with fixed top spacing to guarantee gap below Navbar and avoid inline style overrides */}
              <div className="absolute right-0 top-[130px] translate-x-[40%]">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="rounded-full bg-white/20 h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] lg:h-[850px] lg:w-[850px]" 
                />
              </div>
            </div>
            <Navbar inHero theme={slide.theme} />

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2"
              >
                {/* Left Content Area with staggered fade-in animations */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex h-full flex-col justify-center space-y-5 px-8 py-10 sm:px-12 lg:px-16 lg:py-0 xl:px-20"
                >
                  <motion.p variants={itemVariants} className="text-sm font-medium text-white/90">{slide.offerText}</motion.p>
                  <motion.h1 variants={itemVariants} className="max-w-md text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.5rem]">
                    {slide.title}
                  </motion.h1>
                  <motion.p variants={itemVariants} className="max-w-md text-white/90">
                    {slide.subtitle}
                  </motion.p>

                  <motion.div variants={itemVariants} className="flex w-full max-w-md flex-wrap items-center gap-3.5">
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }} 
                      type="button" 
                      className={`rounded-full bg-white/95 px-7 py-3.5 text-sm font-semibold transition hover:bg-white ${slide.textBtnColor} shadow-md`}
                    >
                      Select Category
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }} 
                      type="button" 
                      className={`rounded-full px-9 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 ${slide.btnColor}`}
                    >
                      Shop Now
                    </motion.button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="inline-flex items-center gap-3 rounded-2xl bg-white/20 p-3 shadow-inner backdrop-blur-sm w-fit">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
                        alt="Customer 1"
                        className={`h-10 w-10 rounded-full border-2 object-cover ${slide.avatarBorder}`}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                        alt="Customer 2"
                        className={`h-10 w-10 rounded-full border-2 object-cover ${slide.avatarBorder}`}
                      />
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Customer 3"
                        className={`h-10 w-10 rounded-full border-2 object-cover ${slide.avatarBorder}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Our Happy Customers</p>
                      <p className="text-xs text-white/90">★★★★★ 4.9 (455+ Reviews)</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
                    <span className="text-sm text-white/90">Not Yet Member?</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      type="button" 
                      className="rounded-full border border-white/60 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                    >
                      Sign Up Now
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Right Image Area with hover float animation */}
                <div className="relative flex min-h-[400px] items-end justify-center px-4 pt-10 sm:min-h-[480px] lg:min-h-full lg:px-0 lg:pt-0">
                  <motion.img
                    src={slide.img}
                    alt="Fashion hero"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0 
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      ease: "easeOut"
                    }}
                    className="relative z-10 h-auto max-h-[580px] w-[98%] max-w-[560px] object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.25)] sm:max-h-[680px] sm:max-w-[680px] lg:absolute lg:bottom-0 lg:max-h-[98vh] lg:w-auto lg:max-w-[min(820px,56vw)]"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          </div>


        </motion.div>
      </div>

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
