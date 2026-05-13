import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { getCategories } from "../api/categories";
import { getProducts } from "../api/products";
import CategoryFilter from "../components/CategoryFilter";
import Loader from "../components/Loader";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import useDebounce from "../hooks/useDebounce";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS = {
  search: "",
  category: "",
  gender: "",
  brand: "",
  sizes: "",
  colors: "",
};

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(filters.search, 320);

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (active) {
          setCategories(Array.isArray(response) ? response : []);
        }
      } catch {
        if (active) {
          setCategories([]);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: PAGE_SIZE,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (filters.category) params.category = filters.category;
      if (filters.gender) params.gender = filters.gender;
      if (filters.brand.trim()) params.brand = filters.brand.trim();
      if (filters.sizes.trim()) params.sizes = filters.sizes.trim();
      if (filters.colors.trim()) params.colors = filters.colors.trim();

      try {
        const response = await getProducts(params);
        if (!active) return;

        const payload = response || {};
        setProducts(Array.isArray(payload.results) ? payload.results : []);
        setPagination({
          count: Number(payload.count) || 0,
          next: payload.next || null,
          previous: payload.previous || null,
        });
      } catch {
        if (!active) return;
        setError("Unable to load products right now.");
        setProducts([]);
        setPagination({
          count: 0,
          next: null,
          previous: null,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [
    page,
    debouncedSearch,
    filters.category,
    filters.gender,
    filters.brand,
    filters.sizes,
    filters.colors,
  ]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(pagination.count / PAGE_SIZE)), [pagination.count]);
  const startItem = useMemo(() => (pagination.count ? (page - 1) * PAGE_SIZE + 1 : 0), [page, pagination.count]);
  const endItem = useMemo(() => Math.min(page * PAGE_SIZE, pagination.count), [page, pagination.count]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const goToPreviousPage = () => setPage((current) => Math.max(current - 1, 1));
  const goToNextPage = () => setPage((current) => Math.min(current + 1, totalPages));

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel space-y-4 p-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#e6535c]">Runway Catalog</p>
        <h1 className="text-shine text-3xl font-semibold sm:text-4xl">Shop Premium AI Fashion Picks</h1>
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
          Search and filter fashion products by category, gender, brand, size, and colors in real time.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 lg:w-72 lg:min-w-[16rem] xl:w-80">
          <CategoryFilter
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <SearchBar value={filters.search} onChange={(value) => handleFilterChange("search", value)} onClear={() => handleFilterChange("search", "")} />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              Showing {startItem}-{endItem} of {pagination.count} products
            </p>
            <p>
              Page {page} of {totalPages}
            </p>
          </div>

          {loading ? <Loader label="Loading products..." /> : null}
          {!loading && error ? <div className="glass-panel p-6 text-[#e6535c]">{error}</div> : null}
          {!loading && !error ? <ProductGrid products={products} /> : null}

          {!loading && pagination.count > PAGE_SIZE ? (
            <div className="glass-panel flex items-center justify-between p-4">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={!pagination.previous}
                className="btn-ghost rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={!pagination.next}
                className="btn-primary rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ShopPage;
