import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg sm:p-12">
      <p className="text-xs uppercase tracking-[0.24em] text-white/70">Your Cart</p>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">No items yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
        Curate your premium AI fashion collection by adding pieces from the shop.
      </p>
      <Link
        to="/shop"
        className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#e6535c] transition hover:bg-[#fff1f1]"
      >
        Explore Products
      </Link>
    </div>
  );
}

export default EmptyCart;
