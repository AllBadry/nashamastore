import { create } from 'zustand';
import * as authApi from '../api/auth';
import { useOrdersStore } from './ordersStore';

const sumQuantities = (cart) => (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
const sumTotal = (cart) =>
  (cart || []).reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0), 0);

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  cart: [],
  cartCount: 0,
  cartTotal: 0,

  // استرجاع الجلسة عند تحميل التطبيق (من التوكن المخزّن)
  restoreSession: async () => {
    if (!authApi.getToken()) {
      set({ loading: false, isLoggedIn: false });
      return;
    }

    try {
      const user = await authApi.getMe();
      set({ user, isLoggedIn: true, loading: false });
      await get().fetchCart();
    } catch {
      authApi.setToken(null);
      set({ user: null, isLoggedIn: false, cart: [], cartCount: 0, cartTotal: 0, loading: false });
    }
  },

  login: async ({ email, password }) => {
    const user = await authApi.login({ email, password });
    set({ user, isLoggedIn: true });
    await get().fetchCart();
    return user;
  },

  signup: async (data) => {
    const user = await authApi.signup(data);
    set({ user, isLoggedIn: true });
    await get().fetchCart();
    return user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isLoggedIn: false, cart: [], cartCount: 0, cartTotal: 0 });
      useOrdersStore.getState().reset();
    }
  },

  setUser: (user) => set({ user, isLoggedIn: Boolean(user) }),

  // تحديث حالة السلة محلياً من مصفوفة عناصر معزّزة
  applyCart: (items) => set({
    cart: items || [],
    cartCount: sumQuantities(items),
    cartTotal: Number(sumTotal(items).toFixed(2)),
  }),

  // جلب السلة من الخادم (مع تفاصيل المنتجات)
  fetchCart: async () => {
    try {
      const cart = await authApi.getCart();
      get().applyCart(cart);
      return cart;
    } catch {
      return get().cart;
    }
  },

  addToCart: async ({ productId, quantity = 1 }) => {
    const cart = await authApi.addToCart({ productId, quantity });
    get().applyCart(cart);
    return cart;
  },

  updateCartItem: async (productId, quantity) => {
    const cart = await authApi.updateCartItem(productId, quantity);
    get().applyCart(cart);
    return cart;
  },

  removeFromCart: async (productId) => {
    const cart = await authApi.removeFromCart(productId);
    get().applyCart(cart);
    return cart;
  },

  clearCart: async () => {
    await authApi.clearCart();
    get().applyCart([]);
  },
}));
