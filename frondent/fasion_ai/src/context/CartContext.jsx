import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getCartItems } from "../api/cart";
import AddToCartModal from "../components/AddToCartModal";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [addedProduct, setAddedProduct] = useState(null);
  const [iconPulse, setIconPulse] = useState(0);

  const refreshCart = useCallback(
    async (preloadedData) => {
      if (!isAuthenticated) {
        setTotalQuantity(0);
        return;
      }
      try {
        const data = preloadedData ?? (await getCartItems());
        const items = Array.isArray(data?.items) ? data.items : [];
        const qty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        setTotalQuantity(qty);
      } catch {
        setTotalQuantity(0);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    if (authLoading) return;
    refreshCart();
  }, [authLoading, isAuthenticated, refreshCart]);

  const notifyProductAdded = useCallback(
    (product) => {
      if (product) {
        setAddedProduct(product);
      }
      setIconPulse((n) => n + 1);
      refreshCart();
    },
    [refreshCart],
  );

  const dismissAdded = useCallback(() => setAddedProduct(null), []);

  const value = useMemo(
    () => ({
      totalQuantity,
      refreshCart,
      notifyProductAdded,
      dismissAdded,
      iconPulse,
    }),
    [totalQuantity, refreshCart, notifyProductAdded, dismissAdded, iconPulse],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {addedProduct ? <AddToCartModal key={addedProduct.id} product={addedProduct} onClose={dismissAdded} /> : null}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
