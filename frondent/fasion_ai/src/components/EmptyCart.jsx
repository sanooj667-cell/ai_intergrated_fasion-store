import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <div className="glass-panel p-8 text-center sm:p-12">
      <p className="text-xs uppercase tracking-[0.24em] text-[#e6535c] font-bold">Your Cart</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">No items yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 font-medium leading-relaxed">
        Curate your premium AI fashion collection by adding pieces from the shop.
      </p>
      <Link
        to="/shop"
        className="mt-6 inline-flex rounded-full bg-[#ef5f67] hover:bg-[#e74b58] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition shadow-md active:scale-95"
      >
        Explore Products
      </Link>
    </div>
  );
}

export default EmptyCart;
