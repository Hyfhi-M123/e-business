"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  tag?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  cartTotal: number;
  cartCount: number;
  selectedItemIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  selectedCartTotal: number;
  selectedCartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("trailforge_cart");
    if (stored) {
      const items = JSON.parse(stored);
      setCartItems(items);
      setSelectedItemIds(items.map((i: any) => i.id));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("trailforge_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setSelectedItemIds(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
    setIsCartOpen(true); // Membuka drawer saat barang ditambahkan
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    setSelectedItemIds(prev => prev.filter(i => i !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }));
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
      cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      selectedItemIds, toggleSelect, toggleSelectAll, selectedCartTotal, selectedCartCount
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
