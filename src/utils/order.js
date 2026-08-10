// بيانات حالة الطلب (التسمية والألوان) للعرض في الواجهة
export const ORDER_STATUS = {
  pending: {
    label: 'قيد المراجعة',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  processing: {
    label: 'قيد التجهيز',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  shipped: {
    label: 'تم الشحن',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  delivered: {
    label: 'تم التسليم',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  cancelled: {
    label: 'ملغي',
    className: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'الدفع عند الاستلام',
  card: 'بطاقة ائتمان',
  installments: 'تقسيط',
};

export const statusMeta = (status) => ORDER_STATUS[status] || ORDER_STATUS.pending;

export function formatOrderDate(value) {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
