// ============================================================================
//  طبقة ربط المحفظة (Nashama Coin / NC) بالسيرفر
//  1 دينار أردني = 10 NC. تُستخدم بعد تسجيل الدخول فقط.
// ============================================================================

import apiClient from '../api/client';

export const NC_PER_JOD = 10;

// الرابط الكامل لصورة الإيصال المرفوعة
export const receiptUrl = (path) => {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

// رصيد المحفظة الحالي + نسبة التحويل + رقم الاستلام
export const getWallet = async () => {
  const res = await apiClient.get('/wallet');
  const d = res.data?.data || {};
  return {
    balance: Number(d.balance) || 0,
    lifetimeTopup: Number(d.lifetimeTopup) || 0,
    rate: Number(d.rate) || NC_PER_JOD,
    currencyCode: d.currencyCode || 'NC',
    receiverNumber: d.receiverNumber || '',
  };
};

// طلبات شحن المستخدم
export const getMyTopups = async () => {
  const res = await apiClient.get('/wallet/topups');
  return res.data?.data?.topups || [];
};

// إنشاء طلب شحن: amountNC (يُحسب المقابل بالدينار على السيرفر)
export const createTopup = async ({ amountNC, receiptFile, senderNumber }) => {
  const form = new FormData();
  form.append('amountNC', String(amountNC));
  form.append('receipt', receiptFile);
  if (senderNumber) form.append('senderNumber', senderNumber);
  const res = await apiClient.post('/wallet/topups', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data?.topup;
};
