import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

// ============================================
// 🛒 Cart Context
// ============================================
// এই কনটেক্সট শপিং কার্ট ম্যানেজ করে
// গেম সিলেক্ট, Cart-এ যোগ, চেকআউট সব এখানে

const CartContext = createContext();

// ============================================
// 🪝 Custom Hook
// ============================================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// ============================================
// 📦 Provider Component
// ============================================
export const CartProvider = ({ children }) => {
  // localStorage থেকে কার্ট লোড
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bafi-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // কুপন state
  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('bafi-coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ============================================
  // 💾 Save to localStorage
  // ============================================
  useEffect(() => {
    try {
      localStorage.setItem('bafi-cart', JSON.stringify(items));
    } catch (err) {
      console.error('Cart save error:', err);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('bafi-coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('bafi-coupon');
      }
    } catch (err) {
      console.error('Coupon save error:', err);
    }
  }, [coupon]);

  // ============================================
  // ➕ Add to Cart
  // ============================================
  const addToCart = useCallback((game) => {
    setItems((prev) => {
      // আগে থেকে থাকলে quantity বাড়াই
      const existing = prev.find((item) => item.id === game.id);
      if (existing) {
        return prev.map((item) =>
          item.id === game.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      // নতুন আইটেম যোগ
      return [...prev, { ...game, quantity: 1 }];
    });
  }, []);

  // ============================================
  // ➖ Remove from Cart
  // ============================================
  const removeFromCart = useCallback((gameId) => {
    setItems((prev) => prev.filter((item) => item.id !== gameId));
  }, []);

  // ============================================
  // 🔄 Update Quantity
  // ============================================
  const updateQuantity = useCallback((gameId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== gameId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === gameId ? { ...item, quantity } : item
      )
    );
  }, []);

  // ============================================
  // 🔼 Increase Quantity
  // ============================================
  const increaseQuantity = useCallback((gameId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === gameId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  }, []);

  // ============================================
  // 🔽 Decrease Quantity
  // ============================================
  const decreaseQuantity = useCallback((gameId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === gameId);
      if (!item) return prev;

      if ((item.quantity || 1) <= 1) {
        return prev.filter((i) => i.id !== gameId);
      }
      return prev.map((i) =>
        i.id === gameId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  // ============================================
  // 🗑️ Clear Cart
  // ============================================
  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  // ============================================
  // 🎟️ Apply Coupon
  // ============================================
  const applyCoupon = useCallback((couponData) => {
    setCoupon(couponData);
  }, []);

  // ============================================
  // ❌ Remove Coupon
  // ============================================
  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  // ============================================
  // ✅ Check if in Cart
  // ============================================
  const isInCart = useCallback(
    (gameId) => items.some((item) => item.id === gameId),
    [items]
  );

  // ============================================
  // 📊 Computed Values
  // ============================================
  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // কুপন ডিসকাউন্ট হিসাব
  let discount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else if (coupon.discount_type === 'fixed') {
      discount = Math.min(coupon.discount_value, subtotal);
    }
  }

  // ট্যাক্স (ঐচ্ছিক - চাইলে ০ করে দিন)
  const tax = 0;

  // ফাইনাল টোটাল
  const total = Math.max(0, subtotal - discount + tax);

  // ============================================
  // 🎁 Context Value
  // ============================================
  const value = {
    // State
    items,
    coupon,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,

    // Computed
    totalItems,
    subtotal,
    discount,
    tax,
    total,
    isEmpty: items.length === 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;