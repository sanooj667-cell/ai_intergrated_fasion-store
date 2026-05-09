import { useEffect, useState } from "react";

import { getProducts } from "../api/products";
import Loader from "./Loader";
import ProductGrid from "./ProductGrid";

function ProductSection({
  title = "Featured Products",
  subtitle = "Fresh picks from the catalog",
  queryParams = {},
  emptyTitle = "No products available",
  emptyText = "Please add products in admin and refresh.",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const querySignature = JSON.stringify(queryParams || {});

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      const parsedQueryParams = querySignature ? JSON.parse(querySignature) : {};
      try {
        const payload = await getProducts({
          page: 1,
          page_size: 4,
          ...parsedQueryParams,
        });
        if (!active) return;
        setProducts(Array.isArray(payload?.results) ? payload.results : []);
      } catch {
        if (!active) return;
        setError("Unable to load products right now.");
        setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [querySignature]);

  return (
    <section className="space-y-4">
      <div className="glass-panel space-y-2 p-5">
        <h2 className="section-title text-left text-2xl">{title}</h2>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      {loading ? <Loader label="Loading product section..." /> : null}
      {!loading && error ? <div className="glass-panel p-6 text-[#e6535c]">{error}</div> : null}
      {!loading && !error ? <ProductGrid products={products} emptyTitle={emptyTitle} emptyText={emptyText} /> : null}
    </section>
  );
}

export default ProductSection;
