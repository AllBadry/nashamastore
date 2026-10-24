import React from 'react';
import { useLang } from '../../i18n';

// شارة حالة الطلب مع لون مناسب لكل حالة
const STYLES = {
  pending_verification: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  paid: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  delivered: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const OrderStatusBadge = ({ status }) => {
  const { t } = useLang();
  const cls = STYLES[status] || 'border-white/15 bg-white/5 text-gray-300';
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {t(`orders.status.${status}`)}
    </span>
  );
};

export default OrderStatusBadge;
