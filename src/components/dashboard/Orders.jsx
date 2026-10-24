import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { getMyOrders } from '../../lib/ordersApi';
import OrderStatusBadge from '../orders/OrderStatusBadge';
import OrderDetailModal from '../orders/OrderDetailModal';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const Orders = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await getMyOrders();
        if (active) setOrders(list);
      } catch {
        /* معالج عام */
      } finally {
        if (active) setLoading(false);
      }
    })();
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 24, duration: 0.7, stagger: 0.06, ease: 'power3.out' });
    }, ref);
    return () => {
      active = false;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      <div className="dash-in">
        <h2 className="font-black text-2xl text-white">{t('dashboard.orders.title')}</h2>
        <p className="text-sm text-gray-400 mt-1">{t('dashboard.orders.desc')}</p>
      </div>

      {loading ? (
        <div className="dash-in card p-10 text-center text-gray-500">{t('common.loading')}</div>
      ) : orders.length === 0 ? (
        <div className="dash-in flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <svg className="w-14 h-14 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-bold text-white">{t('dashboard.orders.empty')}</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">{t('dashboard.orders.emptyDesc')}</p>
          <Link to="/games" className="mt-6 rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
            {t('dashboard.orders.browse')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="dash-in flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {(order.items || []).slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image ? `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '')}${item.image.startsWith('/') ? '' : '/'}${item.image}` : ''}
                    alt=""
                    className="w-10 h-14 rounded-lg object-cover ring-2 ring-[#0d0e13]"
                    onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm font-bold text-white" dir="ltr">{order.orderCode}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.items?.length || 0} {t('orders.itemsCount')} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-white">{money(order.total)}</span>
                <OrderStatusBadge status={order.status} />
                <button
                  type="button"
                  onClick={() => setSelected(order)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/90 hover:bg-white/5 transition-colors"
                >
                  {t('orders.show')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderDetailModal order={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Orders;
