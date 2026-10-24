import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { getMyPurchases } from '../../lib/ordersApi';
import { resolveImage } from '../../data/catalogApi';
import OrderDetailModal from '../orders/OrderDetailModal';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};

const Purchases = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await getMyPurchases();
        if (active) setPurchases(list);
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

  // تفكيك الطلبات إلى ألعاب مفردة (كل لعبة = بطاقة قابلة للفتح)
  const games = purchases.flatMap((order) =>
    (order.items || []).map((item, idx) => ({ key: `${order._id}-${idx}`, order, item }))
  );

  return (
    <div ref={ref} className="space-y-4">
      <div className="dash-in">
        <h2 className="font-black text-2xl text-white">{t('dashboard.purchases.title')}</h2>
        <p className="text-sm text-gray-400 mt-1">{t('dashboard.purchases.desc')}</p>
      </div>

      {loading ? (
        <div className="dash-in card p-10 text-center text-gray-500">{t('common.loading')}</div>
      ) : games.length === 0 ? (
        <div className="dash-in flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <svg className="w-14 h-14 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="font-bold text-white">{t('dashboard.purchases.empty')}</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">{t('dashboard.purchases.emptyDesc')}</p>
          <Link to="/games" className="mt-6 rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
            {t('dashboard.purchases.browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map(({ key, order, item }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(order)}
              className="dash-in text-start flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#8b151a]/50 transition-colors"
            >
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="w-20 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{money(item.price)}</p>
                <p className="text-[11px] text-emerald-400 mt-2 font-bold">{t('dashboard.purchases.open')}</p>
                {order.deliveredAt && (
                  <p className="text-[10px] text-gray-600 mt-0.5">{formatDate(order.deliveredAt)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <OrderDetailModal order={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Purchases;
