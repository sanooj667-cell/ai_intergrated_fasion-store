import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("vexo_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync with state changes
  useEffect(() => {
    try {
      localStorage.setItem("vexo_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to localStorage", err);
    }
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      // Avoid duplicate entries
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    if (!productId) return;
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const isLiked = useCallback((productId) => {
    if (!productId) return false;
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isLiked,
    }),
    [wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isLiked]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
