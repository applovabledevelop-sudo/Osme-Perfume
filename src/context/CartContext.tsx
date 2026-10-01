import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useSettings } from './SettingsContext';

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  amount: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string;
  appliedCoupon: AppliedCoupon | null;
  couponError: string | null;
  isCartDrawerOpen: boolean;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  couponCode: '',
  appliedCoupon: null,
  couponError: null,
  isCartDrawerOpen: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyCoupon: async () => false,
  removeCoupon: () => {},
  openCartDrawer: () => {},
  closeCartDrawer: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem('luxora_coupon') || '';
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxora_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [items]);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;

  // Evaluate coupon
  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round(((subtotal * appliedCoupon.amount) / 100) * 100) / 100;
    } else {
      discount = Math.min(subtotal, appliedCoupon.amount);
    }
  }

  const freeThreshold = settings.freeShippingThreshold || 75;
  const shipping = subtotal >= freeThreshold || items.length === 0 ? 0 : 8.0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length === 0 ? 0 : Math.round(taxableAmount * 0.04 * 100) / 100;
  const total = items.length === 0 ? 0 : Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

  const addToCart = (product: Product, size?: string, quantity = 1) => {
    const selectedSize = size || product.size || (product.variants?.[0]?.size ?? '50ml');
    let itemPrice = product.price;
    let itemSku = product.sku;
    let maxStock = product.stock;

    if (product.variants && product.variants.length > 0) {
      const matched = product.variants.find((v) => v.size === selectedSize);
      if (matched) {
        itemPrice = matched.price;
        itemSku = matched.sku;
        maxStock = matched.stock;
      }
    }

    const cartItemId = `${product.id}-${selectedSize}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i));
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || '/images/hero_perfume.jpg',
          size: selectedSize,
          sku: itemSku,
          price: itemPrice,
          quantity: Math.min(quantity, maxStock),
          maxStock,
        };
        return [...prev, newItem];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('luxora_cart');
    localStorage.removeItem('luxora_coupon');
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    setCouponError(null);
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    // Call server validation API or local check
    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode: clean }),
      });
      const data = await res.json();
      if (data.appliedCoupon) {
        setAppliedCoupon(data.appliedCoupon);
        setCouponCode(clean);
        localStorage.setItem('luxora_coupon', clean);
        return true;
      } else {
        // Fallback for demo code
        if (clean === 'WELCOME10') {
          setAppliedCoupon({
            code: 'WELCOME10',
            type: 'percentage',
            amount: 10,
            discountAmount: (subtotal * 10) / 100,
          });
          setCouponCode('WELCOME10');
          return true;
        } else if (clean === 'LUXURY20' && subtotal >= 150) {
          setAppliedCoupon({
            code: 'LUXURY20',
            type: 'percentage',
            amount: 20,
            discountAmount: (subtotal * 20) / 100,
          });
          setCouponCode('LUXURY20');
          return true;
        }
        setCouponError('Invalid or expired coupon code for this order total.');
        return false;
      }
    } catch {
      if (clean === 'WELCOME10') {
        setAppliedCoupon({
          code: 'WELCOME10',
          type: 'percentage',
          amount: 10,
          discountAmount: (subtotal * 10) / 100,
        });
        setCouponCode('WELCOME10');
        return true;
      }
      setCouponError('Unable to validate coupon.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    localStorage.removeItem('luxora_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponCode,
        appliedCoupon,
        couponError,
        isCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
