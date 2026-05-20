import { useState } from "react";
import { Link } from "react-router-dom";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 22c.4-2.2.8-4.5 1.3-6.5C8.3 14 7 12 7 9.8c0-3.3 2.4-6.3 6.3-6.3 3.4 0 6 2.4 6 5.8 0 3.7-2 6.8-5.2 6.8-1 0-2-.5-2.3-1.2l-.7 2.7c-.3 1.2-1 2.6-1.5 3.4a11 11 0 1 0 8.4-19.3" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const socialLinks = [
    { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
    { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
    { name: "Pinterest", icon: PinterestIcon, href: "https://pinterest.com" },
    { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com" },
  ];

  const collections = [
    { label: "New Arrivals", to: "/shop" },
    { label: "Trending Now", to: "/shop" },
    { label: "Women's Collection", to: "/shop" },
    { label: "Men's Collection", to: "/shop" },
    { label: "Premium Shades", to: "/shop" },
    { label: "Seasonal Sale", to: "/shop" },
  ];

  const supportLinks = [
    { label: "Track My Order", to: "/orders" },
    { label: "My Profile", to: "/profile" },
    { label: "Shopping Cart", to: "/cart" },
    { label: "Shipping Policies", to: "/shop" },
    { label: "Returns & Exchanges", to: "/shop" },
    { label: "Help & Support", to: "/shop" },
  ];

  const aiSuite = [
    { label: "AI Outfit Recommender", to: "/shop" },
    { label: "Virtual Styling Assistant", to: "/" },
    { label: "Predictive Trend Gallery", to: "/shop" },
    { label: "Smart Size Calculator", to: "/shop" },
    { label: "Customer Wardrobe Log", to: "/profile" },
  ];

  return (
    <footer className="relative mt-24 border-t border-[#ffd8dc]/80 bg-white/80 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(239,95,103,0.04)]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        
        {/* VIP Newsletter Signup Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff2f3] via-white to-[#fff8f9] p-8 md:p-10 lg:p-12 border border-[#ffe1e4] shadow-[0_12px_30px_rgba(239,95,103,0.04)] mb-16">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#ef5f67]/5 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#f2d47a]/8 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffe8ea] text-[10px] font-bold uppercase tracking-wider text-[#e74b58]">
                ★ Exclusive Member Club
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Unlock 15% Off Your First Order
              </h3>
              <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
                Join our fashion VIP circle. Receive instant access to style drops, secret sales, and smart AI-personalized styling recommendations.
              </p>
            </div>
            
            <div className="w-full lg:max-w-md">
              <form onSubmit={handleSubscribe} className="relative flex items-center p-1.5 rounded-full bg-white border border-[#ffd5d9] focus-within:border-[#ef5f67] focus-within:ring-2 focus-within:ring-[#ef5f67]/20 transition-all duration-300 shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#ef5f67] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#e74b58] active:scale-95 transition-all duration-200"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-[#e74b58] font-semibold text-center lg:text-left animate-pulse">
                  ✓ Successful subscription! Check your inbox for the discount code.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 mb-16">
          {/* Logo & Brand Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="LotteMart Logo" 
                className="h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-all duration-300" 
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed pr-6">
              LotteMart is an AI-integrated fashion powerhouse delivering responsive streetwear designs, premium wardrobe selection, and tailored style recomendations for the modern dresser.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 text-slate-600 text-sm">
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-[#ef5f67]" />
                <span>+1 (800) 555-MODE</span>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-[#ef5f67]" />
                <a href="mailto:support@lottemart.com" className="hover:text-[#ef5f67] transition-all">support@lottemart.com</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-4 w-4 text-[#ef5f67]" />
                <span>808 Atelier Ave, Fashion District, NY</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] border border-[#ffd8dc] text-[#ef5f67] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#ef5f67] hover:text-white"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Shop Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-[#ffe4e7] pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {collections.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-slate-500 hover:text-[#ef5f67] transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-[#ffe4e7] pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-slate-500 hover:text-[#ef5f67] transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Suite Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-[#ffe4e7] pb-2">
              AI Styling Suite
            </h4>
            <ul className="space-y-2.5">
              {aiSuite.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-slate-500 hover:text-[#ef5f67] transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-[#ffd8dc]/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-medium">
          <p className="order-2 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} LotteMart. All rights reserved.
          </p>
          
          <p className="order-3 md:order-2 text-center text-[11px] tracking-wide text-slate-400">
            Powered by <span className="text-[#ef5f67]">Django DRF</span> &amp; <span className="text-[#ef5f67]">React</span> with Tailwind.
          </p>

          <div className="order-1 md:order-3 flex flex-wrap justify-center items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#fff1f1] border border-[#ffd8dc] font-semibold text-[9px] tracking-widest text-[#ef5f67] uppercase">Visa</span>
            <span className="px-2.5 py-1 rounded bg-[#fff1f1] border border-[#ffd8dc] font-semibold text-[9px] tracking-widest text-[#ef5f67] uppercase">Mastercard</span>
            <span className="px-2.5 py-1 rounded bg-[#fff1f1] border border-[#ffd8dc] font-semibold text-[9px] tracking-widest text-[#ef5f67] uppercase">Paypal</span>
            <span className="px-2.5 py-1 rounded bg-[#fff1f1] border border-[#ffd8dc] font-semibold text-[9px] tracking-widest text-[#ef5f67] uppercase">Apple Pay</span>
            <span className="px-2.5 py-1 rounded bg-[#fff1f1] border border-[#ffd8dc] font-semibold text-[9px] tracking-widest text-[#ef5f67] uppercase">Stripe</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

