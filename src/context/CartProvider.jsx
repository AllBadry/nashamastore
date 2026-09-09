import { useState, useMemo, useEffect, useCallback } from 'react';
import { extractImage, getProductPrice } from '../lib/product';
import { CartContext, STORAGE_KEY, readCart } from './cartContext';

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / privacy errors
    }
  }, [items]);

  const addToCart = useCallback((product) => {
    const image = extractImage(product);
    const price = getProductPrice(product);
    const id = String(product.productId || product.slug);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { id, slug: product.slug, name: product.name, image, price, qty: 1 },
      ];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, qty } : item));
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, totalCount, totalPrice, addToCart, updateQty, removeItem, clearCart }),
    [items, totalCount, totalPrice, addToCart, updateQty, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}