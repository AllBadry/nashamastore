import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import { GAME_FALLBACK } from '../data/gamesCatalog';
import { findGameById } from '../data/catalogApi';
import { hasSession } from '../lib/authState';
import { getFavorites, toggleFavorite, addToCart, onShelfChange } from '../lib/shelf';

const byId = (id) => findGameById(id);

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const Favorites = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [ids, setIds] = useState(getFavorites);

  const refresh = () => setIds(getFavorites());

  useEffect(() => {
    document.title = `${t('favorites.title')} — Nashama`;
    const ctx = gsap.context(() => {
      gsap.from('.fav-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, [t]);

  useEffect(() => onShelfChange(refresh), []);

  // المسجّلون يستخدمون المفضّلة داخل لوحة التحكم
  if (hasSession()) {
    return <Navigate to="/dashboard?tab=favorites" replace />;
  }

  const items = ids.map((id) => {
    const game = byId(id);
    return {
      id,
      title: game?.title || id,
      img: game?.img || GAME_FALLBACK,
      price: game?.price || 0,
      old: game?.old || 0,
      platform: game?.platforms?.[0] || '',
    };
  });

  return (
    <section ref={ref} dir="rtl" className="relative bg-[#05060a] min-h-screen pt-28 pb-24 overflow-hidden font-sans">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.12),transparent_65%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="fav-in mb-8">
          <span className="text-[10px] tracking-[0.35em] text-[#8b151a] uppercase font-bold">NASHAMA</span>
          <h1 className="font-['Bebas_Neue',_sans-serif] text-4xl md:text-5xl text-white tracking-wide mt-1">
            {t('favorites.title')}
          </h1>
          <p className="text-gray-400 text-sm mt-2">{t('favorites.subtitle')}</p>
        </div>

        {items.length === 0 ? (
          <div className="fav-in rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <h2 className="text-xl font-black text-white">{t('favorites.empty')}</h2>
            <p className="text-gray-400 text-sm mt-2 mb-6">{t('favorites.emptyDesc')}</p>
            <Link
              to="/games"
              className="inline-block rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              {t('favorites.browse')}
            </Link>
          </div>
        ) : (
          <div className="fav-in space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <img
                  src={item.img}
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
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-black text-white">{money(item.price)}</span>
                      {item.old > item.price && (
                        <span className="text-xs text-gray-500 line-through">{money(item.old)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(item.id)}
                      className="rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-5 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    >
                      {t('cart.addToCart')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { toggleFavorite(item.id); refresh(); }}
                      className="text-xs font-bold text-gray-500 hover:text-[#ef4444] transition-colors"
                    >
                      {t('favorites.remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;