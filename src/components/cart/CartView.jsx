import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n';
import { GAME_FALLBACK } from '../../data/gamesCatalog';
import { findGameById } from '../../data/catalogApi';
import { getCart, setCartQty, removeFromCart } from '../../lib/shelf';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

// عرض السلّة — يعمل بطريقتين:
//   • مُتحكَّم به (controlled): نمرّر items/onQty/onRemove/onCheckout (لوحة العميل — سلّة السيرفر).
//   • تلقائي (auto): إن لم تُمرَّر items يقرأ من localStorage (صفحة الزائر المستقلة).
const CartView = ({ className = '', items: itemsProp, onQty, onRemove, onCheckout, checkoutLabel }) => {
  const { t } = useLang();
  const controlled = Array.isArray(itemsProp);
  const [localCart, setLocalCart] = useState(getCart);

  const handleQty = (id, qty) => {
    if (controlled) {
      onQty?.(id, qty);
      return;
    }
    setCartQty(id, qty);
    setLocalCart(getCart());
  };

  const handleRemove = (id) => {
    if (controlled) {
      onRemove?.(id);
      return;
    }
    removeFromCart(id);
    setLocalCart(getCart());
  };

  const items = controlled
    ? itemsProp
    : localCart.map((entry) => {
        const game = findGameById(entry.id);
        return {
          id: entry.id,
          qty: entry.qty,
          title: game?.title || t('cart.unknownItem'),
          img: game?.img || GAME_FALLBACK,
          price: game?.price || 0,
          old: game?.old || 0,
          platform: game?.platforms?.[0] || '',
        };
      });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotalNC = items.reduce((sum, item) => sum + (Number(item.priceNC) || 0) * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const hasNC = subtotalNC > 0;

  if (items.length === 0) {
    return (
      <div className={`cart-in rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center ${className}`}>
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        <h2 className="text-xl font-black text-white">{t('cart.empty')}</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">{t('cart.emptyDesc')}</p>
        <Link
          to="/games"
          className="inline-block rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          {t('cart.browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start ${className}`}>
      <div className="cart-in space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <img
              src={item.img || GAME_FALLBACK}
              alt={item.title}
              onError={(e) => { e.currentTarget.src = GAME_FALLBACK; }}
              className="w-24 h-32 object-cover rounded-xl shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
              <div>
                <h3 className="font-bold text-white leading-snug">{item.title}</h3>
                {item.platform && (
                  <span className="inline-block mt-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                    {item.platform}
                  </span>
                )}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-white">{money(item.price)}</span>
                  {item.old > item.price && (
                    <span className="text-xs text-gray-500 line-through">{money(item.old)}</span>
                  )}
                  {(Number(item.priceNC) || 0) > 0 && (
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                      {item.priceNC} NC
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-white/15">
                  <button
                    type="button"
                    aria-label={t('cart.qty')}
                    onClick={() => handleQty(item.id, item.qty - 1)}
                    className="w-9 h-9 grid place-items-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white">{item.qty}</span>
                  <button
                    type="button"
                    aria-label={t('cart.qty')}
                    onClick={() => handleQty(item.id, item.qty + 1)}
                    className="w-9 h-9 grid place-items-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-[#fca5a5]">{money(item.price * item.qty)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-xs font-bold text-gray-500 hover:text-[#ef4444] transition-colors"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="cart-in lg:sticky lg:top-32 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-black text-white text-lg mb-4">{t('cart.orderSummary')}</h2>

        <div className="flex justify-between text-sm text-gray-400 py-2">
          <span>{t('cart.items')}</span>
          <span className="text-white font-bold">{count}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400 py-2">
          <span>{t('cart.subtotal')}</span>
          <span className="text-white font-bold">{money(subtotal)}</span>
        </div>
        {hasNC && (
          <div className="flex justify-between text-sm text-gray-400 py-2">
            <span>{t('cart.subtotalNC')}</span>
            <span className="text-amber-300 font-bold">{subtotalNC} NC</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-400 py-2">
          <span>{t('cart.shipping')}</span>
          <span className="text-emerald-400 font-bold">{t('cart.shippingFree')}</span>
        </div>

        <div className="flex justify-between items-center border-t border-white/10 mt-3 pt-4">
          <span className="font-bold text-white">{t('cart.total')}</span>
          <span className="text-2xl font-black text-white">{money(subtotal)}</span>
        </div>
        {hasNC && (
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-white">{t('cart.totalNC')}</span>
            <span className="text-2xl font-black text-amber-300">{subtotalNC} NC</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onCheckout?.({ total: subtotal, totalNC: subtotalNC })}
          className="mt-6 w-full rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          {checkoutLabel || t('cart.checkout')}
        </button>

        <Link
          to="/games"
          className="mt-4 block text-center rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors"
        >
          {t('cart.continueShopping')}
        </Link>
      </aside>
    </div>
  );
};

export default CartView;
