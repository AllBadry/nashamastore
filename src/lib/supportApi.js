// ============================================================================
//  طبقة ربط تیکت الدعم (Support) بالسيرفر
//  تُستخدم بعد تسجيل الدخول فقط. تیکت واحد مفتوح لكل عميل على شكل شات.
// ============================================================================

import apiClient from '../api/client';

// تیکت العميل الحالي (الأحدث) — قد يكون null إن لم يوجد
export const getMyTicket = async () => {
  const res = await apiClient.get('/support/ticket');
  return res.data?.data?.ticket || null;
};

// كل تیکتات العميل
export const getMyTickets = async () => {
  const res = await apiClient.get('/support/tickets');
  return res.data?.data?.tickets || [];
};

// فتح تیکت جديد (رسالة أولى اختيارية مع موضوع)
export const createTicket = async ({ subject, message }) => {
  const res = await apiClient.post('/support/tickets', { subject, message });
  return res.data?.data?.ticket;
};

// الردّ على التیکت المفتوح
export const replyTicket = async ({ message }) => {
  const res = await apiClient.post('/support/tickets/reply', { message });
  return res.data?.data?.ticket;
};
