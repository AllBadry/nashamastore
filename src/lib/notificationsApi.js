// ============================================================================
//  طبقة ربط التنبيهات (Notifications) بالسيرفر
//  تُستخدم بعد تسجيل الدخول (عميل أو موظف).
// ============================================================================

import apiClient from '../api/client';

// جلب آخر تنبيهات المستخدم + عدد غير المقروء
export const getNotifications = async (limit = 20) => {
  const res = await apiClient.get('/notifications', { params: { limit } });
  return res.data?.data || { notifications: [], unread: 0 };
};

// جلب عدد غير المقروء فقط (للاستقصاء الدوري الخفيف)
export const getUnreadCount = async () => {
  const res = await apiClient.get('/notifications/unread-count');
  return res.data?.data?.unread ?? 0;
};

// تعليم تنبيه واحد كمقروء
export const markNotificationRead = async (id) => {
  const res = await apiClient.patch(`/notifications/${id}/read`);
  return res.data?.data || {};
};

// تعليم كل التنبيهات كمقروءة
export const markAllNotificationsRead = async () => {
  const res = await apiClient.post('/notifications/read-all');
  return res.data?.data || {};
};
