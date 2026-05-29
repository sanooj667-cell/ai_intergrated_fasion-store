import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { addToCart } from "../api/cart";
import { getProductDetail } from "../api/products";
import Loader from "../components/Loader";
import ProductGrid from "../components/ProductGrid";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80";

const getApiErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length) {
    return data.non_field_errors[0];
  }

  if (data && typeof data === "object") {
    const firstValue = Object.values(data)[0];
    if (Array.isArray(firstValue) && firstValue.length && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return "";
};

const parseCSV = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { notifyProductAdded } = useCart();
  const { isLiked, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getProductDetail(id, 4);

        if (!active) return;
        const payload = response || {};
        setProduct(payload.product || null);
        setRelatedProducts(Array.isArray(payload.related_products) ? payload.related_products : []);
      } catch {
        if (!active) return;
        setError("Product details are unavailable right now.");
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const sizes = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.sizes_list) && product.sizes_list.length) return product.sizes_list;
    return parseCSV(product.sizes);
  }, [product]);

  const colors = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.colors_list) && product.colors_list.length) return product.colors_list;
    return parseCSV(product.colors);
  }, [product]);

  if (loading) {
    return <Loader label="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="glass-panel space-y-4 p-8 text-center">
        <p className="text-lg font-semibold text-[#e6535c]">{error}</p>
        <Link to="/shop" className="btn-ghost inline-flex rounded-lg px-4 py-2 text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel space-y-4 p-8 text-center">
        <p className="text-lg font-semibold text-slate-800">Product not found.</p>
        <Link to="/shop" className="btn-ghost inline-flex rounded-lg px-4 py-2 text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const image = product.image_url || product.image || FALLBACK_IMAGE;
  const inStock = product.stock > 0;
  const handleAddToCart = async () => {
    if (authLoading) {
      setCartMessage("Checking your session. Please wait a moment.");
      return;
    }
    if (!isAuthenticated) {
      setCartMessage("Please login to add this item to cart.");
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!product?.id) {
      setCartMessage("Product is unavailable right now.");
      return;
    }
    if (!inStock) return;

    setAddLoading(true);
    setCartMessage("");
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      notifyProductAdded(product);
      setCartMessage("");
    } catch (error) {
      if (error?.response?.status === 401) {
        setCartMessage("Your session expired. Please login again.");
        navigate("/login", { state: { from: location } });
      } else {
        setCartMessage(getApiErrorMessage(error) || "Unable to add this item right now.");
      }
    } finally {
      setAddLoading(false);
    }
  };

  const liked = isLiked(product?.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <Link to="/shop" className="btn-ghost inline-flex rounded-lg px-4 py-2 text-sm">
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        <div className="glass-panel overflow-hidden h-[380px] sm:h-[480px] lg:h-full min-h-[380px] w-full bg-white flex items-center justify-center">
          <img src={image} alt={product.title} className="h-full w-full object-contain p-4" />
        </div>

        <div className="glass-panel space-y-5 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#e6535c]">{product.category?.name || "Collection"}</p>
          <h1 className="text-3xl font-semibold text-slate-800">{product.title}</h1>
          <p className="text-2xl font-semibold text-[#e6535c]">{formatCurrency(product.price)}</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || addLoading || authLoading}
              className="rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addLoading ? "Adding..." : authLoading ? "Checking..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/tryon?product_id=${product.id}`)}
              className="rounded-full bg-slate-800 hover:bg-slate-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
              </svg>
              AI Try-On
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f2] border border-[#ffe4e6] text-[#ef5f67] shadow-md transition-all hover:scale-105 active:scale-95"
              aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill={liked ? "#ef5f67" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                className="h-5 w-5 transition duration-300"
              >
                <path d="M12 20s-6.6-3.9-9-8.1A5.5 5.5 0 1 1 12 6a5.5 5.5 0 1 1 9 5.9C18.6 16.1 12 20 12 20Z" />
              </svg>
            </button>

            {!isAuthenticated && !authLoading ? (
              <Link to="/login" className="btn-ghost inline-flex rounded-lg px-4 py-2 text-sm">
                Login
              </Link>
            ) : null}
          </div>
          {cartMessage ? <p className="text-sm text-[#e6535c]">{cartMessage}</p> : null}

          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-600">
            {product.brand ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.brand}</span> : null}
            {product.gender ? <span className="rounded bg-[#fff0f1] px-2 py-1">{product.gender}</span> : null}
            <span className={`rounded px-2 py-1 text-white ${inStock ? "bg-[#ef5f67]" : "bg-slate-500"}`}>
              {inStock ? `In stock (${product.stock})` : "Out of stock"}
            </span>
          </div>

          {product.description ? <p className="text-sm leading-7 text-slate-600">{product.description}</p> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {sizes.length ? (
                  sizes.map((size) => (
                    <span key={size} className="rounded-md bg-[#fff0f1] px-2 py-1 text-xs text-slate-700">
                      {size}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Not specified</span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Colors</p>
              <div className="flex flex-wrap gap-2">
                {colors.length ? (
                  colors.map((color) => (
                    <span key={color} className="rounded-md bg-[#fff0f1] px-2 py-1 text-xs text-slate-700">
                      {color}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Not specified</span>
                )}
              </div>
            </div>
          </div>
          
          {/* AI Stylist Recommendation Note */}
          <div className="rounded-2xl bg-[#fff0f1]/70 border border-[#ffd5d9] p-4 text-sm text-slate-700 flex gap-3.5 mt-6 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ef5f67]/15 text-[#e6535c] text-sm">
              💡
            </span>
            <div className="space-y-1">
              <p className="font-bold text-[#e6535c] text-xs uppercase tracking-wider">AI Stylist Note</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                This {product.category?.name || "item"} is crafted for maximum versatility. We recommend pairing it with sleek sneakers and a layering denim jacket for an elevated, trend-first daily street style.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-shine text-2xl font-semibold">Related Products</h2>
        <ProductGrid
          products={relatedProducts}
          emptyTitle="No related products yet"
          emptyText="Explore more products from the shop page."
        />
      </div>
    </motion.section>
  );
}

export default ProductDetailPage;
