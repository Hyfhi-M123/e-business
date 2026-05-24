"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type WishlistItem = {
  id: string; // product_id
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  discount: number;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  isSyncing: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const userEmail = user?.email || null;

  // === LOAD: Ambil data wishlist ===
  useEffect(() => {
    if (userEmail) {
      loadFromDatabase(userEmail);
    } else {
      setWishlistItems([]);
    }
  }, [userEmail]);

  const loadFromDatabase = async (email: string) => {
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/wishlist?user_id=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.items) {
        const dbItems: WishlistItem[] = data.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          originalPrice: item.original_price,
          image: item.image,
          category: item.category || "",
          discount: item.discount || 0,
        }));
        setWishlistItems(dbItems);
      }
    } catch (err) {
      console.error("Failed to load wishlist from database:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToDatabase = async (action: "add" | "delete", payload: any) => {
    if (!userEmail) return;
    try {
      if (action === "add") {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userEmail, ...payload }),
        });
      } else if (action === "delete") {
        await fetch(`/api/wishlist?product_id=${payload.product_id}&user_id=${encodeURIComponent(userEmail)}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error(`Wishlist sync failed (${action}):`, err);
    }
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!userEmail) return;
    const existing = wishlistItems.find(i => i.id === item.id);
    if (!existing) {
      setWishlistItems(prev => [item, ...prev]);
      syncToDatabase("add", {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        original_price: item.originalPrice,
        image: item.image,
        category: item.category,
        discount: item.discount,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (!userEmail) return;
    const existing = wishlistItems.find(i => i.id === productId);
    if (existing) {
      setWishlistItems(prev => prev.filter(i => i.id !== productId));
      syncToDatabase("delete", { product_id: productId });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(i => i.id === productId);
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, isSyncing
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
