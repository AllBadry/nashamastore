import { createContext } from 'react';

export const CartContext = createContext(null);

export const STORAGE_KEY = 'nashama_cart';

export function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}