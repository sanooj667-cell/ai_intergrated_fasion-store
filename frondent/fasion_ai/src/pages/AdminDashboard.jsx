import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminProducts,
  getAdminStats,
  getAdminUsers,
  updateAdminProduct,
} from "../api/admin";
import { getCategories } from "../api/categories";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/format";

const TABS = [
  { id: "overview", label: "Reports" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "users", label: "Users" },
];

const emptyProductForm = () => ({
  category: "",
  title: "",
  description: "",
  price: "",
  cost_price: "0",
  brand: "",
  gender: "",
  sizes: "",
  colors: "",
  stock: "0",
});

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [categories, setCategories] = useState([]);

  const [orders, setOrders] = useState({ results: [], count: 0, next: null, previous: null });
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [users, setUsers] = useState({ results: [], count: 0, next: null, previous: null });
  const [usersPage, setUsersPage] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [products, setProducts] = useState({ results: [], count: 0, next: null, previous: null });
  const [productsPage, setProductsPage] = useState(1);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productImage, setProductImage] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productFormError, setProductFormError] = useState("");

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    try {
      const data = await getAdminStats({ days: 14 });
      setStats(data);
    } catch (err) {
      setStatsError(err?.response?.data?.detail || "Could not load reports.");
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadOrders = useCallback(async (page = 1) => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await getAdminOrders({ page });
      setOrders({
        results: data.results || [],
        count: data.count ?? 0,
        next: data.next || null,
        previous: data.previous || null,
      });
    } catch (err) {
      setOrdersError(err?.response?.data?.detail || "Could not load orders.");
      setOrders({ results: [], count: 0, next: null, previous: null });
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const data = await getAdminUsers({ page });
      setUsers({
        results: data.results || [],
        count: data.count ?? 0,
        next: data.next || null,
        previous: data.previous || null,
      });
    } catch (err) {
      setUsersError(err?.response?.data?.detail || "Could not load users.");
      setUsers({ results: [], count: 0, next: null, previous: null });
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async (page = 1) => {
    setProductsLoading(true);
    setProductsError("");
    try {
      const data = await getAdminProducts({ page });
      setProducts({
        results: data.results || [],
        count: data.count ?? 0,
        next: data.next || null,
        previous: data.previous || null,
      });
    } catch (err) {
      setProductsError(err?.response?.data?.detail || "Could not load products.");
      setProducts({ results: [], count: 0, next: null, previous: null });
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadCategories();
  }, [loadStats, loadCategories]);

  useEffect(() => {
    if (tab === "orders") loadOrders(ordersPage);
  }, [tab, ordersPage, loadOrders]);

  useEffect(() => {
    if (tab === "users") loadUsers(usersPage);
  }, [tab, usersPage, loadUsers]);

  useEffect(() => {
    if (tab === "products") loadProducts(productsPage);
  }, [tab, productsPage, loadProducts]);

  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm());
    setProductImage(null);
    setProductFormError("");
    setProductModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      category: String(p.category_id ?? ""),
      title: p.title || "",
      description: p.description || "",
      price: String(p.price ?? ""),
      cost_price: String(p.cost_price ?? "0"),
      brand: p.brand || "",
      gender: p.gender || "",
      sizes: p.sizes || "",
      colors: p.colors || "",
      stock: String(p.stock ?? "0"),
    });
    setProductImage(null);
    setProductFormError("");
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setProductSaving(false);
    setProductFormError("");
  };

  const buildProductFormData = () => {
    const fd = new FormData();
    fd.append("category", productForm.category);
    fd.append("title", productForm.title.trim());
    if (productForm.description) fd.append("description", productForm.description);
    fd.append("price", productForm.price);
    fd.append("cost_price", productForm.cost_price || "0");
    if (productForm.brand) fd.append("brand", productForm.brand);
    if (productForm.gender) fd.append("gender", productForm.gender);
    if (productForm.sizes) fd.append("sizes", productForm.sizes);
    if (productForm.colors) fd.append("colors", productForm.colors);
    fd.append("stock", productForm.stock || "0");
    if (productImage) fd.append("image", productImage);
    return fd;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.category) {
      setProductFormError("Choose a category.");
      return;
    }
    if (!productForm.title.trim()) {
      setProductFormError("Title is required.");
      return;
    }
    setProductSaving(true);
    setProductFormError("");
    try {
      const fd = buildProductFormData();
      if (editingProductId) {
        if (!productImage) {
          fd.delete("image");
        }
        await updateAdminProduct(editingProductId, fd);
      } else {
        await createAdminProduct(fd);
      }
      closeProductModal();
      await loadProducts(productsPage);
    } catch (err) {
      const detail = err?.response?.data;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.detail ||
            (detail && typeof detail === "object"
              ? Object.entries(detail)
                  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                  .join(" · ")
              : "Could not save product.");
      setProductFormError(msg);
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteAdminProduct(id);
      await loadProducts(productsPage);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Delete failed.";
      window.alert(msg);
    }
  };

  const chartMax = useMemo(() => {
    if (!stats?.sales_daily?.length) return 1;
    return Math.max(...stats.sales_daily.map((d) => Number(d.sales) || 0), 1);
  }, [stats]);

  const tabBtn = (id) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      tab === id
        ? "bg-[#e6535c] text-white shadow-md"
        : "border border-[#ffd8dc] bg-white/80 text-[#5a5f6a] hover:bg-[#fff5f5]"
    }`;

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e6535c]">Staff</p>
            <h1 className="mt-1 text-3xl font-bold text-[#2f3440]">Admin dashboard</h1>
            <p className="mt-2 text-sm text-[#7a808a]">
              Reports, catalog management, orders, and registered users (staff accounts only).
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadStats()}
            className="self-start rounded-full border border-[#ffd8dc] bg-[#fff8f8] px-4 py-2 text-sm font-semibold text-[#e6535c] transition hover:bg-[#ffecef]"
          >
            Refresh reports
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={tabBtn(t.id)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {tab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {statsLoading ? (
            <Loader label="Loading reports..." />
          ) : statsError ? (
            <div className="glass-panel rounded-2xl border border-red-200 bg-red-50/90 p-6 text-sm text-red-800">
              {statsError}
            </div>
          ) : stats ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Sales (paid orders)",
                    value: formatCurrency(stats.summary?.total_sales_paid),
                  },
                  {
                    label: "Est. profit (paid)",
                    value: formatCurrency(stats.summary?.total_profit_paid),
                    hint: "Based on unit cost on each product.",
                  },
                  { label: "Orders", value: String(stats.summary?.orders_total ?? 0), hint: `${stats.summary?.orders_paid ?? 0} paid` },
                  { label: "Users", value: String(stats.summary?.users_total ?? 0) },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="glass-panel rounded-2xl border border-[#ffd8dc] bg-[#fffdfd] p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa1ab]">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#2f3440]">{card.value}</p>
                    {card.hint ? <p className="mt-2 text-xs text-[#7a808a]">{card.hint}</p> : null}
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="glass-panel rounded-2xl border border-[#ffd8dc] bg-white/90 p-6">
                  <h2 className="text-lg font-bold text-[#2f3440]">Orders by status</h2>
                  <ul className="mt-4 space-y-2">
                    {(stats.orders_by_status || []).map((row) => (
                      <li
                        key={row.order_status}
                        className="flex items-center justify-between rounded-xl border border-[#ffe8ea] bg-[#fff8f8] px-4 py-2 text-sm"
                      >
                        <span className="font-medium text-[#2f3440]">{row.label}</span>
                        <span className="tabular-nums text-[#e6535c]">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel rounded-2xl border border-[#ffd8dc] bg-white/90 p-6">
                  <h2 className="text-lg font-bold text-[#2f3440]">Paid sales (last 14 days)</h2>
                  <div className="mt-4 flex h-44 items-end gap-1">
                    {(stats.sales_daily || []).map((d, i) => {
                      const v = Number(d.sales) || 0;
                      const px = Math.round((v / chartMax) * 140);
                      return (
                        <div
                          key={d.date ? `${d.date}-${i}` : `day-${i}`}
                          className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                          title={`${d.date}: ${formatCurrency(v)}`}
                        >
                          <div
                            className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-[#e6535c] to-[#ff8a8e]"
                            style={{ height: `${Math.max(px, 4)}px` }}
                          />
                          <span className="truncate text-[9px] text-[#9aa1ab]">
                            {d.date ? d.date.slice(5) : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-[#7a808a]">
                    Paid orders only. Set <span className="font-mono">cost_price</span> on products for meaningful
                    profit.
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </motion.div>
      )}

      {tab === "products" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#2f3440]">Products</h2>
            <button
              type="button"
              onClick={openCreateProduct}
              className="rounded-full bg-[#e6535c] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#d94a52]"
            >
              Add product
            </button>
          </div>
          {productsError ? (
            <p className="mt-4 text-sm text-red-600">{productsError}</p>
          ) : null}
          {productsLoading ? (
            <div className="mt-8">
              <Loader label="Loading products..." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#ffe8ea]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fff5f5] text-xs uppercase tracking-wide text-[#9aa1ab]">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffe8ea]">
                  {products.results.map((p) => (
                    <tr key={p.id} className="bg-white/80">
                      <td className="px-4 py-3 font-medium text-[#2f3440]">{p.title}</td>
                      <td className="px-4 py-3 text-[#5a5f6a]">{p.category?.name || "—"}</td>
                      <td className="px-4 py-3 tabular-nums">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3 tabular-nums">{formatCurrency(p.cost_price)}</td>
                      <td className="px-4 py-3 tabular-nums">{p.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="mr-2 rounded-full border border-[#ffd8dc] px-3 py-1 text-xs font-semibold text-[#e6535c] hover:bg-[#fff5f5]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-[#5a5f6a]">
            <span>
              {products.count} product{products.count === 1 ? "" : "s"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!products.previous || productsLoading}
                onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!products.next || productsLoading}
                onClick={() => setProductsPage((p) => p + 1)}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
        >
          <h2 className="text-xl font-bold text-[#2f3440]">All orders</h2>
          {ordersError ? <p className="mt-4 text-sm text-red-600">{ordersError}</p> : null}
          {ordersLoading ? (
            <div className="mt-8">
              <Loader label="Loading orders..." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#ffe8ea]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fff5f5] text-xs uppercase tracking-wide text-[#9aa1ab]">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffe8ea]">
                  {orders.results.map((o) => (
                    <tr key={o.id} className="bg-white/80">
                      <td className="px-4 py-3 font-mono text-xs text-[#2f3440]">#{o.id}</td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-[#5a5f6a]" title={o.user_email}>
                        {o.user_email}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{formatCurrency(o.total_price)}</td>
                      <td className="px-4 py-3 capitalize">{o.payment_status}</td>
                      <td className="px-4 py-3">{o.order_status_label}</td>
                      <td className="px-4 py-3 text-xs text-[#7a808a]">
                        {o.created_at ? new Date(o.created_at).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-[#5a5f6a]">
            <span>{orders.count} orders</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!orders.previous || ordersLoading}
                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!orders.next || ordersLoading}
                onClick={() => setOrdersPage((p) => p + 1)}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] bg-white/90 p-6 shadow-[0_22px_45px_rgba(239,95,103,0.12)] backdrop-blur-xl sm:p-8"
        >
          <h2 className="text-xl font-bold text-[#2f3440]">Users</h2>
          {usersError ? <p className="mt-4 text-sm text-red-600">{usersError}</p> : null}
          {usersLoading ? (
            <div className="mt-8">
              <Loader label="Loading users..." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#ffe8ea]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fff5f5] text-xs uppercase tracking-wide text-[#9aa1ab]">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Staff</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffe8ea]">
                  {users.results.map((u) => (
                    <tr key={u.id} className="bg-white/80">
                      <td className="px-4 py-3 font-mono text-xs">{u.id}</td>
                      <td className="px-4 py-3 font-medium text-[#2f3440]">{u.email}</td>
                      <td className="px-4 py-3">{u.is_customer ? "Yes" : "—"}</td>
                      <td className="px-4 py-3">{u.is_staff ? "Yes" : "—"}</td>
                      <td className="px-4 py-3 tabular-nums">{u.order_count}</td>
                      <td className="px-4 py-3 text-xs text-[#7a808a]">
                        {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-[#5a5f6a]">
            <span>{users.count} users</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!users.previous || usersLoading}
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!users.next || usersLoading}
                onClick={() => setUsersPage((p) => p + 1)}
                className="rounded-full border border-[#ffd8dc] px-4 py-1.5 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {productModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-[#2f3440]">
                {editingProductId ? "Edit product" : "New product"}
              </h3>
              <button
                type="button"
                onClick={closeProductModal}
                className="rounded-full border border-[#ffd8dc] px-3 py-1 text-sm text-[#5a5f6a]"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSaveProduct}>
              {productFormError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {productFormError}
                </p>
              ) : null}
              <label className="block text-sm font-medium text-[#2f3440]">
                Category
                <select
                  required
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.category}
                  onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-[#2f3440]">
                Title
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.title}
                  onChange={(e) => setProductForm((f) => ({ ...f, title: e.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-[#2f3440]">
                Description
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#2f3440]">
                  Price (USD)
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                    value={productForm.price}
                    onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-[#2f3440]">
                  Unit cost (USD)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                    value={productForm.cost_price}
                    onChange={(e) => setProductForm((f) => ({ ...f, cost_price: e.target.value }))}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#2f3440]">
                  Brand
                  <input
                    className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                    value={productForm.brand}
                    onChange={(e) => setProductForm((f) => ({ ...f, brand: e.target.value }))}
                  />
                </label>
                <label className="block text-sm font-medium text-[#2f3440]">
                  Gender
                  <input
                    className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                    value={productForm.gender}
                    onChange={(e) => setProductForm((f) => ({ ...f, gender: e.target.value }))}
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-[#2f3440]">
                Sizes (comma-separated)
                <input
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm((f) => ({ ...f, sizes: e.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-[#2f3440]">
                Colors (comma-separated)
                <input
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.colors}
                  onChange={(e) => setProductForm((f) => ({ ...f, colors: e.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-[#2f3440]">
                Stock
                <input
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-xl border border-[#ffd8dc] bg-white px-3 py-2 text-sm"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-[#2f3440]">
                Image {editingProductId ? "(optional)" : ""}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm"
                  onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                />
              </label>
              <button
                type="submit"
                disabled={productSaving}
                className="w-full rounded-full bg-[#e6535c] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d94a52] disabled:opacity-60"
              >
                {productSaving ? "Saving…" : editingProductId ? "Save changes" : "Create product"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminDashboard;
