import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { platformMeta } from '../../data/gamesCatalog';
import { getFavorites, toggleFavorite, addToCart } from '../../lib/shelf';
import { useLang } from '../../i18n';

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-[#ef4444]' : 'text-white/80'} transition-colors duration-200`}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const CartIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const GameCard = ({ game, t }) => {
  const [fav, setFav] = useState(() => getFavorites().includes(game.id));
  const [added, setAdded] = useState(false);

  const onFav = () => {
    setFav(toggleFavorite(game.id).includes(game.id));
  };

  const onAdd = () => {
    addToCart(game.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const price = Number(game.price) || 0;
  const old = Number(game.old) || 0;
  const priceNC = Math.max(0, Math.floor(Number(game.priceNC) || 0));
  const rating = Number(game.rating) || 0;
  const hasDiscount = old > price && old > 0;
  const pct = hasDiscount ? Math.round((1 - price / old) * 100) : 0;
  const chips = platformMeta.filter((p) => game.platforms.includes(p.key));

  return (
    <article className="game-card group relative bg-[#101010] border border-white/8 rounded-2xl overflow-hidden hover:border-[#8b151a]/60 transition-colors duration-300 flex flex-col">
      {/* الغلاف */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.img}
          alt={game.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

        {/* الوسم */}
        <span className="absolute top-3 start-3 bg-[#8b151a] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-lg">
          {game.tag}
        </span>

        {/* المفضلة */}
        <button
          onClick={onFav}
          title={fav ? t('games.card.inFavorites') : t('games.card.favorite')}
          aria-label={fav ? t('games.card.inFavorites') : t('games.card.favorite')}
          className="absolute top-3 end-3 w-9 h-9 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-[#8b151a] transition-colors duration-200"
        >
          <HeartIcon filled={fav} />
        </button>

        {/* شريط الخصم يظهر عند الهوفر */}
        {hasDiscount && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/75 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {t('games.card.save')}
            </span>
            <span className="text-white font-['Bebas_Neue',_sans-serif] text-lg leading-none">
              -{pct}%
            </span>
          </div>
        )}
      </div>

      {/* المعلومات */}
      <div className="flex flex-col flex-1 p-4">
        <h4 className="font-display text-base md:text-lg text-white leading-snug tracking-wide truncate">
          {game.title}
        </h4>

        <div className="flex items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-300">
            <StarIcon /> {rating.toFixed(1)}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 ms-auto">
            {chips.map((p) => (
              <span
                key={p.key}
                title={p.name}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white font-['Bebas_Neue',_sans-serif] text-[10px] border border-white/10"
                style={{ background: p.color }}
              >
                {p.short}
              </span>
            ))}
          </span>
        </div>

        {/* السعر */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* السعر بالدينار */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-500">
              {t('games.card.priceJOD')}
            </span>
            <div className="flex items-end gap-1.5 mt-0.5">
              <span className="font-['Bebas_Neue',_sans-serif] text-2xl leading-none text-white tracking-wide">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="font-['Bebas_Neue',_sans-serif] text-xs leading-none text-gray-500 line-through pb-0.5">
                  ${old.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* السعر بالـ NC */}
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-400/80">
              {t('games.card.priceNC')}
            </span>
            <div className="flex items-end gap-1.5 mt-0.5">
              <span className="font-['Bebas_Neue',_sans-serif] text-2xl leading-none text-amber-300 tracking-wide" dir="ltr">
                {priceNC}
              </span>
              <span className="font-['Bebas_Neue',_sans-serif] text-xs leading-none text-amber-400/70 pb-0.5">NC</span>
            </div>
          </div>
        </div>
        {hasDiscount && (
          <div className="mt-2 inline-flex items-center gap-1.5 self-start bg-white/10 text-gray-300 text-[10px] font-bold rounded-full px-2.5 py-1">
            {t('games.card.save')} {pct}%
          </div>
        )}

        {/* الزر */}
        <button
          onClick={onAdd}
          className={`mt-auto w-full mt-5 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-[#8b151a] text-white hover:bg-white hover:text-black'
          }`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t('games.card.added')}
            </>
          ) : (
            <>
              <CartIcon />
              {t('games.card.add')}
            </>
          )}
        </button>
      </div>
    </article>
  );
};

const GameGrid = ({ games, loading, error, onRetry, activePlatform, onPlatform, sort, onSort }) => {
  const { t } = useLang();
  const gridRef = useRef(null);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const cards = root.querySelectorAll('.game-card');
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40 },
        {
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start: 'top 88%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [games, activePlatform, sort]);

  const sortOptions = useMemo(
    () => [
      { key: 'featured', label: t('games.filters.sortFeatured') },
      { key: 'rating', label: t('games.filters.sortRating') },
      { key: 'priceAsc', label: t('games.filters.sortPriceAsc') },
      { key: 'priceDesc', label: t('games.filters.sortPriceDesc') },
      { key: 'discount', label: t('games.filters.sortDiscount') },
    ],
    [t]
  );

  return (
    <section ref={gridRef} id="games-grid" className="relative bg-[#090909] py-24 scroll-mt-[80px] font-sans overflow-hidden border-t border-white/5">
      {/* شريط الأدوات الثابت */}
      <div className="sticky top-[80px] z-30 bg-[#090909]/92 backdrop-blur-md border-y border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center gap-3">
          {/* أزرار المنصات */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onPlatform('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all duration-200 ${
                activePlatform === 'all'
                  ? 'bg-[#8b151a] text-white border-[#8b151a] shadow-[0_0_16px_rgba(139,21,26,0.4)]'
                  : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {t('games.filters.all')}
            </button>
            {platformMeta.map((p) => (
              <button
                key={p.key}
                onClick={() => onPlatform(p.key)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-all duration-200 ${
                  activePlatform === p.key
                    ? 'bg-[#8b151a] text-white border-[#8b151a] shadow-[0_0_16px_rgba(139,21,26,0.4)]'
                    : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}

            <span className="font-ar text-xs text-gray-600 ms-2">
              {games.length} {t('games.filters.results')}
            </span>
          </div>

          {/* الترتيب */}
          <div className="flex items-center gap-2 flex-wrap lg:ms-auto">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => onSort(opt.key)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all duration-200 ${
                  sort === opt.key
                    ? 'text-[#8b151a] border-[#8b151a]/60 bg-[#8b151a]/10'
                    : 'text-gray-500 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* الترويسة */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-10 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#8b151a] shadow-[0_0_10px_rgba(139,21,26,0.8)] animate-pulse"></span>
        <h2 className="text-sm font-bold text-[#8b151a] tracking-widest uppercase">
          {t('games.filters.overline')}
        </h2>
      </div>

      {/* الشبكة */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <span className="w-10 h-10 rounded-full border-2 border-white/15 border-t-[#8b151a] animate-spin"></span>
          <p className="font-ar text-gray-400 text-sm mt-4">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center py-16">
          <p className="font-ar text-gray-400 text-sm max-w-md leading-relaxed">
            {t('games.filters.error')}
          </p>
          <button
            onClick={() => onRetry && onRetry()}
            className="mt-6 bg-[#8b151a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            {t('games.filters.retry')}
          </button>
        </div>
      ) : games.length > 0 ? (
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {games.map((game) => (
              <GameCard key={game.id} game={game} t={t} />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center py-16">
          <p className="font-ar text-gray-400 text-sm max-w-md leading-relaxed">
            {t('games.filters.empty')}
          </p>
          <button
            onClick={() => onPlatform('all')}
            className="mt-6 bg-[#8b151a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            {t('games.filters.all')}
          </button>
        </div>
      )}
    </section>
  );
};

export default GameGrid;