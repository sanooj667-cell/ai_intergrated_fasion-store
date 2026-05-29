import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getProductDetail, getProducts } from "../api/products";
import { generateTryOn, getTryOnHistory } from "../api/tryon";
import { addToCart } from "../api/cart";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

const CLOTHING_TYPES = [
  { id: "upper", label: "Upper Body", desc: "Shirts, jackets, tees" },
  { id: "lower", label: "Lower Body", desc: "Pants, shorts, skirts" },
  { id: "overall", label: "Full Outfit", desc: "Dresses, jumpsuits, suits" },
];

const SCANNER_PHASES = [
  "Uploading your image to secure storage...",
  "Running AI face & body keypoint alignment...",
  "Draping product textures onto outline...",
  "Refining lighting, wrinkles, and shadows (Flux AI)...",
  "Synthesizing high-resolution output details...",
];

function TryOn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProductId = searchParams.get("product_id");

  const { notifyProductAdded } = useCart();

  // Selected Product & Image State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [clothType, setClothType] = useState("upper");

  // Loading & Generation States
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scanPhaseIdx, setScanPhaseIdx] = useState(0);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);

  // Cart Status
  const [cartAdding, setCartAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // 1. Fetch products list and target product
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getProducts({ page_size: 100 });
        setProductList(data.results || []);
      } catch (err) {
        console.error("Failed to load catalog products", err);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!initialProductId) {
      setSelectedProduct(null);
      return;
    }

    const fetchSelectedProduct = async () => {
      setFetchingProduct(true);
      setError("");
      try {
        const data = await getProductDetail(initialProductId);
        setSelectedProduct(data.product || null);
      } catch (err) {
        setError("Could not load the chosen product details.");
      } finally {
        setFetchingProduct(false);
      }
    };

    fetchSelectedProduct();
  }, [initialProductId]);

  // 2. Fetch User Try-on History
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getTryOnHistory();
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch tryon history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 3. Stagger AI scanning messages
  useEffect(() => {
    let interval;
    if (generating) {
      setScanPhaseIdx(0);
      interval = setInterval(() => {
        setScanPhaseIdx((prev) => (prev < SCANNER_PHASES.length - 1 ? prev + 1 : prev));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [generating]);

  // Handle image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setUserImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  // Submit tryon generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError("Please select a product to try on.");
      return;
    }
    if (!userImage) {
      setError("Please upload a picture of yourself.");
      return;
    }

    setError("");
    setGenerating(true);
    setSuccessResult(null);

    const formData = new FormData();
    formData.append("user_image", userImage);
    formData.append("product_id", selectedProduct.id);
    formData.append("cloth_type", clothType);

    try {
      const result = await generateTryOn(formData);
      setSuccessResult(result);
      fetchHistory(); // Refresh history list
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "AI Try-on service failed. Make sure Replicate is configured correctly in backend settings."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    setCartAdding(true);
    setCartMessage("");
    try {
      await addToCart({ product_id: selectedProduct.id, quantity: 1 });
      notifyProductAdded(selectedProduct);
      setCartMessage("Added to your shopping cart!");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      setCartMessage("Could not add product to cart. Try logging in again.");
    } finally {
      setCartAdding(false);
    }
  };

  // Filter products by search input
  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel space-y-4 p-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-[#ef6a6c]/10 blur-3xl pointer-events-none" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f1] px-3 py-1 text-xs font-semibold text-[#e6535c] uppercase tracking-wider">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
          </svg>
          Interactive Fitting Room
        </span>
        <h1 className="text-shine text-3xl font-semibold sm:text-4xl">AI Virtual Try-On</h1>
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
          Upload your portrait and see how different store items fit you instantly using advanced deep-learning diffusion models.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Step Columns */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Step 1: Product Selection */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff0f1] text-xs font-bold text-[#e6535c]">
                  1
                </span>
                Select Clothing Item
              </h2>

              {fetchingProduct ? (
                <div className="py-4 text-center text-sm text-slate-500">Retrieving product information...</div>
              ) : selectedProduct ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#fffbfc] p-3">
                  <img
                    src={selectedProduct.image_url || selectedProduct.image}
                    alt={selectedProduct.title}
                    className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedProduct.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{selectedProduct.brand || "Vexo Collection"}</p>
                    <p className="text-sm font-bold text-[#e6535c] mt-0.5">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setSearchParams({});
                    }}
                    className="rounded-full hover:bg-slate-100 p-1.5 text-slate-400 hover:text-slate-600 transition"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search catalog products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm shadow-sm focus:border-[#ef6a6c] focus:outline-none"
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  
                  {searchQuery && (
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg p-2 divide-y divide-slate-50 z-20 absolute w-full left-0 right-0">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setSearchQuery("");
                              setSearchParams({ product_id: prod.id });
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-[#fff5f6] rounded-lg transition text-left"
                          >
                            <img
                              src={prod.image_url || prod.image}
                              alt={prod.title}
                              className="h-10 w-10 rounded object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{prod.title}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{formatCurrency(prod.price)}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-slate-400">No products match your search.</div>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                    {productList.slice(0, 6).map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setSearchParams({ product_id: prod.id });
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-[#fff5f6] border border-transparent hover:border-[#ffdee1] rounded-lg transition text-left"
                      >
                        <img
                          src={prod.image_url || prod.image}
                          alt={prod.title}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-slate-800 truncate">{prod.title}</p>
                          <p className="text-[10px] text-[#e6535c] font-bold">{formatCurrency(prod.price)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Clothing Placement Selector */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff0f1] text-xs font-bold text-[#e6535c]">
                  2
                </span>
                Specify Fitting Placement
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {CLOTHING_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setClothType(type.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition text-center ${
                      clothType === type.id
                        ? "border-[#ef6a6c] bg-[#fff0f1] text-[#e6535c]"
                        : "border-slate-100 hover:border-slate-300 text-slate-600 bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold">{type.label}</span>
                    <span className="text-[9px] opacity-75 mt-0.5 hidden sm:inline">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Face & Body Image Upload */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff0f1] text-xs font-bold text-[#e6535c]">
                  3
                </span>
                Upload Your Photo
              </h2>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition ${
                  imagePreview
                    ? "border-slate-200 bg-slate-50"
                    : "border-slate-300 bg-white hover:bg-slate-50/50 hover:border-[#ef6a6c]"
                }`}
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={imagePreview}
                      alt="User Portrait"
                      className="h-44 w-auto rounded-lg object-contain border border-slate-200 shadow-md bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUserImage(null);
                        setImagePreview("");
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#e6535c] hover:underline"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f1] text-[#e6535c]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Drag and drop your photo here</p>
                    <p className="text-xs text-slate-400">or click to browse your files (PNG, JPG)</p>
                    <label className="inline-block mt-3 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 cursor-pointer transition">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                💡 For best results, use a well-lit, full-body or upper-body photo standing in a neutral pose with a simple background, wearing form-fitting clothes.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-[#fff0f1] p-4 text-sm text-[#e6535c] font-medium border border-[#ffe4e6]"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={generating || !selectedProduct || !userImage}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#ef6a6c] to-[#f47a78] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(231,75,88,0.28)] transition hover:scale-[1.01] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                </svg>
                {generating ? "AI Dressing..." : "Generate AI Try-On"}
              </button>
            </div>

          </form>
        </div>

        {/* Loading / Results Preview Column */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 h-full flex flex-col min-h-[480px]">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">AI Viewport</h2>

            <div className="flex-1 flex flex-col justify-center items-center py-6">
              <AnimatePresence mode="wait">
                {generating ? (
                  /* Animated Scanning screen overlay */
                  <motion.div
                    key="generating-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6 text-center"
                  >
                    <div className="relative mx-auto h-60 w-44 rounded-lg overflow-hidden border border-slate-200 shadow-lg bg-white">
                      <img
                        src={imagePreview}
                        alt="Uploading Subject"
                        className="h-full w-full object-cover opacity-80"
                      />
                      {/* Scanning Line overlay */}
                      <motion.div
                        animate={{
                          y: ["0%", "100%", "0%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.2,
                          ease: "easeInOut",
                        }}
                        className="absolute left-0 right-0 h-1 bg-[#ef6a6c] shadow-[0_0_12px_#ef6a6c] z-10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-700">
                        <svg className="animate-spin h-4 w-4 text-[#e6535c]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Weaving Pixels...
                      </div>
                      <p className="text-xs text-slate-500 max-w-[220px] mx-auto italic min-h-[32px]">
                        "{SCANNER_PHASES[scanPhaseIdx]}"
                      </p>
                    </div>
                  </motion.div>
                ) : successResult ? (
                  /* Output result showcase */
                  <motion.div
                    key="results-viewport"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
                      <img
                        src={successResult.generated_image}
                        alt="Try-on Result"
                        className="w-full h-auto object-cover max-h-[360px]"
                      />
                    </div>
                    <div className="text-center space-y-3">
                      <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 border border-green-200">
                        ✨ Fitting Complete
                      </span>
                      <p className="text-xs text-slate-500">
                        AI created your tailored look successfully.
                      </p>
                      
                      <div className="flex gap-2 justify-center pt-2">
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          disabled={cartAdding}
                          className="rounded-full bg-[#ef5f67] hover:bg-[#e74b58] text-white text-xs font-semibold px-4 py-2 shadow transition"
                        >
                          {cartAdding ? "Adding..." : "Add Item to Cart"}
                        </button>
                        <a
                          href={successResult.generated_image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 transition"
                        >
                          Open Photo
                        </a>
                      </div>
                      {cartMessage && <p className="text-xs text-[#e6535c] font-medium animate-pulse">{cartMessage}</p>}
                    </div>
                  </motion.div>
                ) : (
                  /* Default Placeholder state */
                  <motion.div
                    key="placeholder-viewport"
                    className="text-center space-y-3 text-slate-400 py-10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-16 w-16 opacity-45">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">No active generation</p>
                    <p className="text-xs max-w-[200px] mx-auto">
                      Fill out forms on the left and hit generate to render your fitting look.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* History Showcase */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Your AI Fitting History</h2>
            <p className="text-xs text-slate-500">Revisit your previous style generations</p>
          </div>
          <button
            onClick={fetchHistory}
            className="rounded-full hover:bg-slate-100 p-2 text-slate-500 hover:text-slate-700 transition"
            title="Refresh History"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l.73-.73" />
            </svg>
          </button>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-sm text-slate-500">Retrieving previous fitting records...</div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-1 hover:border-[#ef6a6c] hover:shadow-md transition"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-50">
                  <img
                    src={item.generated_image || item.user_image}
                    alt="Fitting generation"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {!item.generated_image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                      In Queue / Failed
                    </div>
                  )}
                </div>
                <div className="p-1.5 min-w-0">
                  <p className="text-[10px] font-bold text-slate-700 truncate">{item.product_details?.title || "Item"}</p>
                  <p className="text-[9px] text-slate-400 capitalize">{item.cloth_type || "upper"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center text-slate-400 text-sm">
            You haven't generated any try-on style cards yet. Start by uploading a photo above!
          </div>
        )}
      </div>

      {/* Modal Popup Viewer */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute right-4 top-4 rounded-full bg-slate-100 hover:bg-slate-200 p-2 text-slate-600 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4.5 w-4.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div>
                <h3 className="text-lg font-bold text-slate-800">Virtual Fitting Details</h3>
                <p className="text-xs text-slate-500">Generated on {new Date(activeModalItem.created_at).toLocaleDateString()}</p>
              </div>

              {/* Grid showing input and outputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Uploaded Face portrait */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold text-center">Your Base Portrait</p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] bg-slate-50">
                    <img src={activeModalItem.user_image} alt="User portrait" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* 2. Target Outfit */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold text-center">Chosen Outfit</p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] bg-slate-50 flex flex-col justify-between p-3 relative">
                    <img
                      src={activeModalItem.product_details?.image_url || activeModalItem.product_details?.image || FALLBACK_IMAGE}
                      alt="Product outfit"
                      className="w-full h-4/5 object-cover rounded-lg"
                    />
                    <div className="pt-2 text-center">
                      <p className="text-xs font-semibold text-slate-800 truncate">{activeModalItem.product_details?.title}</p>
                      <p className="text-xs text-[#e6535c] font-bold">{formatCurrency(activeModalItem.product_details?.price)}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Result */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-bold text-center">AI Fitting Result</p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] bg-slate-50 relative">
                    {activeModalItem.generated_image ? (
                      <img src={activeModalItem.generated_image} alt="Fitting output" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-semibold p-4 text-center">
                        Image is queueing or generation encountered an error.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeModalItem.generated_image && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={activeModalItem.generated_image}
                    download="ai_tryon_result.png"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 shadow transition"
                  >
                    Download Styled Look
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!activeModalItem.product) return;
                      try {
                        await addToCart({ product_id: activeModalItem.product, quantity: 1 });
                        setCartMessage("Added item to your cart!");
                        setTimeout(() => setCartMessage(""), 3000);
                      } catch {
                        alert("Failed to add product to cart.");
                      }
                    }}
                    className="rounded-full bg-[#ef5f67] hover:bg-[#e74b58] text-white text-xs font-semibold px-5 py-2.5 shadow transition"
                  >
                    Add Outfit to Cart
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default TryOn;
