import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { getFavorites, toggleFavorite } from '../../lib/shelf';
import { GAME_FALLBACK } from '../../data/gamesCatalog';
import { findGameById } from '../../data/catalogApi';

const Favorites = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [favs, setFavs] = useState(getFavorites);

  const items = useMemo(
    () =>
      favs
        .map((id) => findGameById(id))
        .filter(Boolean),
    [favs],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 24, duration: 0.7, stagger: 0.06, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, [items.length]);

  const remove = (id) => {
    toggleFavorite(id);
    setFavs(getFavorites());
  };

  return (
    <div ref={ref} className="space-y-4">
      <div className="dash-in flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-2xl text-white">{t('dashboard.favorites.title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('dashboard.favorites.desc')}</p>
        </div>
        <Link to="/games" className="text-sm font-bold text-[#ef4444] hover:text-white transition-colors">
          {t('dashboard.favorites.goShop')} ←
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="dash-in flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <svg className="w-14 h-14 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="font-bold text-white">{t('dashboard.favorites.empty')}</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">{t('dashboard.favorites.emptyDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((game) => (
            <div key={game.id} className="dash-in flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <img
                src={game.img || GAME_FALLBACK}
                alt={game.title}
                loading="lazy"
                className="w-20 h-20 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = GAME_FALLBACK;
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{game.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{game.tag}</p>
                <p className="text-sm font-black text-[#ef4444] mt-1">${(Number(game.price) || 0).toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(game.id)}
                className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-[#fca5a5] hover:border-[#ef4444]/40 transition-colors"
              >
                {t('dashboard.favorites.remove')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;