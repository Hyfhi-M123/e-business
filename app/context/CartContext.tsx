"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  tag?: string;
  // Database fields
  db_id?: string; // UUID from cart_items table
  product_id?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  selectedItemIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  selectedCartTotal: number;
  selectedCartCount: number;
  isSyncing: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const isMigratingRef = useRef(false);

  const userEmail = user?.email || null;

  // === LOAD: Ambil data keranjang ===
  useEffect(() => {
    setIsMounted(true);

    if (userEmail) {
      // User sudah login → load dari database
      loadFromDatabase(userEmail);
    } else {
      // Guest → load dari localStorage
      const stored = localStorage.getItem("trailforge_cart");
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
        setSelectedItemIds(items.map((i: any) => i.id));
      }
      setDbLoaded(false);
    }
  }, [userEmail]);

  // === SAVE ke localStorage (untuk guest) ===
  useEffect(() => {
    if (isMounted && !userEmail) {
      localStorage.setItem("trailforge_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted, userEmail]);

  // === Database Functions ===
  const loadFromDatabase = async (email: string) => {
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/cart?user_id=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const dbItems: CartItem[] = data.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          originalPrice: item.original_price,
          image: item.image,
          quantity: item.quantity,
          category: item.category || "",
          tag: item.tag,
          db_id: item.id,
          product_id: item.product_id,
        }));
        setCartItems(dbItems);
        setSelectedItemIds(dbItems.map(i => i.id));
      } else {
        // Jika DB kosong tapi ada localStorage, migrasi ke DB
        const stored = localStorage.getItem("trailforge_cart");
        if (stored && !isMigratingRef.current) {
          isMigratingRef.current = true;
          const localItems = JSON.parse(stored) as CartItem[];
          if (localItems.length > 0) {
            // Bersihkan localStorage lebih awal untuk mencegah race condition
            localStorage.removeItem("trailforge_cart");
            // Migrasi setiap item ke database
            for (const item of localItems) {
              await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: email,
                  product_id: item.id,
                  product_name: item.name,
                  price: item.price,
                  original_price: item.originalPrice,
                  image: item.image,
                  category: item.category,
                  tag: item.tag,
                  quantity: item.quantity,
                }),
              });
            }
            // Reload dari DB setelah migrasi
            const res2 = await fetch(`/api/cart?user_id=${encodeURIComponent(email)}`);
            const data2 = await res2.json();
            if (data2.items) {
              const migratedItems: CartItem[] = data2.items.map((item: any) => ({
                id: item.product_id,
                name: item.product_name,
                price: item.price,
                originalPrice: item.original_price,
                image: item.image,
                quantity: item.quantity,
                category: item.category || "",
                tag: item.tag,
                db_id: item.id,
                product_id: item.product_id,
              }));
              setCartItems(migratedItems);
              setSelectedItemIds(migratedItems.map(i => i.id));
            }
          }
          isMigratingRef.current = false;
        }
      }
      setDbLoaded(true);
    } catch (err) {
      console.error("Failed to load cart from database:", err);
      // Fallback ke localStorage
      const stored = localStorage.getItem("trailforge_cart");
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
        setSelectedItemIds(items.map((i: any) => i.id));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToDatabase = async (action: string, payload: any) => {
    if (!userEmail) return;
    try {
      if (action === "add") {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userEmail, ...payload }),
        });
      } else if (action === "update") {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userEmail, ...payload }),
        });
      } else if (action === "delete") {
        await fetch(`/api/cart?product_id=${payload.product_id}&user_id=${encodeURIComponent(userEmail)}`, {
          method: "DELETE",
        });
      } else if (action === "clear") {
        await fetch(`/api/cart?user_id=${encodeURIComponent(userEmail)}&clear_all=true`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error(`Cart sync failed (${action}):`, err);
    }
  };

  // === Cart Actions ===
  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    const existing = cartItems.find(i => i.id === item.id);

    if (existing) {
      // Update quantity di database
      if (userEmail) {
        syncToDatabase("update", { product_id: item.id, quantity: existing.quantity + qty });
      }
      setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      // Insert baru ke database
      syncToDatabase("add", {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        original_price: item.originalPrice,
        image: item.image,
        category: item.category,
        tag: item.tag,
        quantity: qty,
      });
      setCartItems(prev => [...prev, { ...item, quantity: qty, product_id: item.id }]);
    }
    setSelectedItemIds(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
    setIsCartOpen(true);

    // Reload dari DB untuk mendapatkan db_id yang baru
    if (userEmail) {
      setTimeout(() => loadFromDatabase(userEmail), 500);
    }
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (userEmail && item) {
      syncToDatabase("delete", { product_id: item.id });
    }
    setCartItems(prev => prev.filter(i => i.id !== id));
    setSelectedItemIds(prev => prev.filter(i => i !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQ = Math.max(1, item.quantity + delta);
      if (userEmail) {
        syncToDatabase("update", { product_id: item.id, quantity: newQ });
      }
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQ } : i));
    }
  };

  const clearCart = () => {
    if (userEmail) {
      syncToDatabase("clear", {});
    }
    setCartItems([]);
    setSelectedItemIds([]);
    localStorage.removeItem("trailforge_cart");
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const selectedItems = cartItems.filter(i => selectedItemIds.includes(i.id));
  const selectedCartTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedCartCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleSelect = (id: string) => {
    setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (select: boolean) => {
    if (select) setSelectedItemIds(cartItems.map(i => i.id));
    else setSelectedItemIds([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      selectedItemIds, toggleSelect, toggleSelectAll, selectedCartTotal, selectedCartCount, isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
