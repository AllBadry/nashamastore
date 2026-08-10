import { create } from 'zustand';
import * as authApi from '../api/auth';

export const useOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: '',
  fetched: false,

  fetchOrders: async (force = false) => {
    if (get().fetched && !force) return;
    set({ loading: true, error: '' });
    try {
      const orders = await authApi.getMyOrders();
      set({ orders, loading: false, fetched: true });
    } catch (err) {
      set({ error: err.message || 'تعذر جلب الطلبات', loading: false });
    }
  },

  createOrder: async (payload) => {
    const order = await authApi.createOrder(payload);
    set({ orders: [order, ...get().orders], fetched: true });
    return order;
  },

  cancelOrder: async (orderId) => {
    const updated = await authApi.cancelOrder(orderId);
    set({
      orders: get().orders.map((o) => (o._id === updated._id ? updated : o)),
    });
    return updated;
  },

  reset: () => set({ orders: [], loading: false, error: '', fetched: false }),
}));
