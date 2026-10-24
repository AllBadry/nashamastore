import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n';
import CartView from '../cart/CartView';
import CheckoutModal from '../cart/CheckoutModal';
import {
  getServerCart,
  syncLocalCartToServer,
  replaceServerCart,
  createOrder,
  createNcOrder,
  newIdempotencyKey,
} from '../../lib/ordersApi';
import { getWallet } from '../../lib/walletApi';

const Cart = () => {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalNC, setTotalNC] = useState(0);
  const [balance, setBalance] = useState(0);
  const [submitted, setSubmitted] = useState(null); // الطلب المُنشأ

  // عند تحميل لوحة التحكم: نزامن سلّة المتصفح مع السيرفر ثم نعرض سلّة الحساب
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [merged, wallet] = await Promise.all([
          syncLocalCartToServer(),
          getWallet().catch(() => null),
        ]);
        if (active) {
          setItems(merged);
          if (wallet) setBalance(wallet.balance);
        }
      } catch (err) {
        // في حال فشل المزامنة، نحاول جلب السلّة المحفوظة على الأقل
        try {
          const cart = await getServerCart();
          if (active) setItems(cart);
        } catch {
          if (active) setError(err?.response?.data?.message || t('common.error'));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const applyCart = async (next) => {
    setItems(next);
    try {
      const saved = await replaceServerCart(next);
      setItems(saved);
    } catch {
      /* نحتفظ بالتحديث المحلي عند فشل الشبكة */
    }
  };

  const onQty = (id, qty) => {
    if (qty <= 0) {
      applyCart(items.filter((i) => i.id !== id));
      return;
    }
    applyCart(items.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const onRemove = (id) => applyCart(items.filter((i) => i.id !== id));

  const handleCheckout = ({ total: amount, totalNC: amountNC }) => {
    setTotal(amount);
    setTotalNC(amountNC || 0);
    setCheckoutOpen(true);
  };

  const submitOrder = async ({ receiptFile, senderNumber }) => {
    const order = await createOrder({ receiptFile, senderNumber });
    setCheckoutOpen(false);
    setItems([]);
    setSubmitted(order);
  };

  // الدفع الكامل من رصيد المحفظة — المبلغ يُحسَب على السيرفر
  const submitNcOrder = async () => {
    const { order, balance: newBalance } = await createNcOrder({ idempotencyKey: newIdempotencyKey() });
    setCheckoutOpen(false);
    setItems([]);
    setBalance(newBalance);
    setSubmitted(order);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="dash-in card p-12 text-center text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  // شاشة نجاح إرسال الطلب
  if (submitted) {
    return (
      <div className="dash-in space-y-4">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full grid place-items-center bg-emerald-500/15 border border-emerald-500/30 mb-4">
            <svg className="w-7 h-7 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white">{t('dashboard.cart.submittedTitle')}</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto leading-relaxed">
            {submitted?.payment?.method === 'nc'
              ? `${t('dashboard.cart.submittedDescNC')} (${submitted?.totalNC || 0} NC)`
              : t('dashboard.cart.submittedDesc')}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            <span className="text-xs text-gray-400 font-bold">{t('orders.orderCode')}:</span>
            <span dir="ltr" className="text-sm font-black text-white tracking-widest">{submitted.orderCode}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard?tab=orders"
              className="rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              {t('dashboard.cart.goOrders')}
            </Link>
            <Link
              to="/games"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors"
            >
              {t('dashboard.cart.continue')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="dash-in flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-2xl text-white">{t('dashboard.cart.title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('dashboard.cart.desc')}</p>
        </div>
        <Link to="/games" className="text-sm font-bold text-[#ef4444] hover:text-white transition-colors">
          {t('dashboard.cart.goShop')} ←
        </Link>
      </div>

      {error && (
        <p className="dash-in text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <CartView
        className="dash-in"
        items={items}
        onQty={onQty}
        onRemove={onRemove}
        onCheckout={handleCheckout}
        checkoutLabel={t('dashboard.cart.checkout')}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={total}
        totalNC={totalNC}
        balance={balance}
        onSubmitted={submitOrder}
        onSubmittedNC={submitNcOrder}
      />
    </div>
  );
};

export default Cart;
