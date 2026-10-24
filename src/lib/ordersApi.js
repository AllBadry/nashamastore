// ============================================================================
//  طبقة ربط الطلبات والسلّة بالسيرفر (Orders API)
//  تُستخدم بعد تسجيل الدخول: مزامنة السلّة، إنشاء طلب مع إيصال، جلب الطلبات.
// ============================================================================

import apiClient from '../api/client';
import { getCart, clearCart } from './shelf';
import { normalizeGame } from '../data/catalogApi';

// يحوّل عنصر سلّة السيرفر إلى شكل كتالوج المتجر (نفس شكل findGameById)
export const normalizeServerCartItem = (item) => ({
  id: item?.slug || item?.id || String(item?.game),
  _id: item?.game,
  title: item?.title || '',
  price: Number(item?.price) || 0,
  priceNC: Math.max(0, Math.floor(Number(item?.priceNC) || 0)),
  old: Number(item?.old) || 0,
  img: item?.image || '',
  platforms: item?.platform ? [item.platform] : [],
  qty: Number(item?.qty) || 1,
  active: item?.active !== false,
});

// جلب سلّة المستخدم المحفوظة على السيرفر
export const getServerCart = async () => {
  const res = await apiClient.get('/orders/cart');
  const items = res.data?.data?.cart || [];
  return items.map(normalizeServerCartItem);
};

// مزامنة سلّة المتصفح (localStorage) مع السيرفر ثم إفراغها محلياً.
// تُنفَّذ مرة عند تحميل لوحة التحكم بعد تسجيل الدخول.
export const syncLocalCartToServer = async () => {
  const local = getCart();
  if (local.length === 0) return getServerCart();

  const res = await apiClient.put('/orders/cart', { cart: local });
  clearCart(); // نُفرغ النسخة المحلية لأن السلّة أصبحت مربوطة بالحساب
  const items = res.data?.data?.cart || [];
  return items.map(normalizeServerCartItem);
};

// استبدال سلّة السيرفر بالكامل (بعد تعديل الكميات/الحذف في اللوحة)
export const replaceServerCart = async (cart) => {
  const payload = cart.map((item) => ({ id: item.id || item._id, qty: item.qty }));
  const res = await apiClient.put('/orders/cart/replace', { cart: payload });
  const items = res.data?.data?.cart || [];
  return items.map(normalizeServerCartItem);
};

// إنشاء طلب مع رفع صورة الإيصال (multipart/form-data)
export const createOrder = async ({ receiptFile, senderNumber }) => {
  const form = new FormData();
  form.append('receipt', receiptFile);
  if (senderNumber) form.append('senderNumber', senderNumber);
  const res = await apiClient.post('/orders', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data?.order;
};

// توليد مفتاح فريد لمنع تكرار الدفع (idempotency)
export const newIdempotencyKey = () => {
  const rand = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return `nc-${rand}`;
};

// الدفع الكامل من رصيد المحفظة (Nashama Coin / NC)
// المبلغ يُحسَب على السيرفر حصراً — هنا نرسل مفتاح منع التكرار فقط.
export const createNcOrder = async ({ idempotencyKey }) => {
  const res = await apiClient.post('/orders/pay-nc', { idempotencyKey });
  return { order: res.data?.data?.order, balance: Number(res.data?.data?.balance) || 0 };
};

// طلبات المستخدم الحالي
export const getMyOrders = async () => {
  const res = await apiClient.get('/orders');
  return res.data?.data?.orders || [];
};

// مشترياتي (الطلبات المسلَّمة مع بياناتها)
export const getMyPurchases = async () => {
  const res = await apiClient.get('/orders/purchases');
  return res.data?.data?.purchases || [];
};

// يحوّل مسار صورة الإيصال إلى رابط كامل قابل للعرض
export const receiptUrl = (path) => {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export { normalizeGame };
