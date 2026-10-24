import React from 'react';
import { useLang } from '../../i18n';
import { resolveImage } from '../../data/catalogApi';
import { receiptUrl } from '../../lib/ordersApi';
import OrderStatusBadge from './OrderStatusBadge';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
};

// بوب اب تفاصيل الطلب للعميل (يشمل بيانات التسليم عند توفّرها)
const OrderDetailModal = ({ order, open, onClose }) => {
  const { t } = useLang();
  if (!open || !order) return null;

  const delivered = order.status === 'delivered';
  const rejected = order.status === 'rejected';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0e13] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white">{t('orders.details')}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1" dir="ltr">{order.orderCode}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">✕</button>
        </div>

        {/* العناصر */}
        <div className="mt-5 space-y-3">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="w-12 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {money(item.price)} × {item.qty}
                </p>
              </div>
              <span className="text-sm font-black text-white">{money(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="text-sm font-bold text-white">{t('orders.total')}</span>
            <span className="text-lg font-black text-white">{money(order.total)}</span>
          </div>
        </div>

        {/* صورة الإيصال */}
        {order.payment?.receiptImage && (
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-400 mb-2">{t('orders.receipt')}</p>
            <a href={receiptUrl(order.payment.receiptImage)} target="_blank" rel="noreferrer">
              <img
                src={receiptUrl(order.payment.receiptImage)}
                alt="receipt"
                className="max-h-52 rounded-xl border border-white/10 object-contain hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        )}

        {/* بيانات التسليم */}
        {delivered && order.deliverFields?.length > 0 && (
          <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
            <p className="text-sm font-black text-emerald-300 mb-3">{t('orders.deliveredData')}</p>
            <div className="space-y-2">
              {order.deliverFields.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 rounded-lg bg-black/20 px-3 py-2">
                  <span className="text-xs font-bold text-gray-400">{f.label}</span>
                  <span dir="ltr" className="text-sm font-bold text-white break-all text-end">{f.value}</span>
                </div>
              ))}
            </div>
            {order.deliverNote && (
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">{order.deliverNote}</p>
            )}
          </div>
        )}

        {/* سبب الرفض */}
        {rejected && (
          <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/5 p-5">
            <p className="text-sm font-black text-red-300 mb-1">{t('orders.rejectedTitle')}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{order.rejectReason || t('orders.rejectedDefault')}</p>
          </div>
        )}

        {/* الطوابع الزمنية */}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-500">
          <span>{t('orders.createdAt')}: {formatDate(order.createdAt)}</span>
          {order.deliveredAt && <span>{t('orders.deliveredAt')}: {formatDate(order.deliveredAt)}</span>}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
