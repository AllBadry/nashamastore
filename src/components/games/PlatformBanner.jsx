import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { platformMeta } from '../../data/gamesCatalog';
import { useLang } from '../../i18n';

const PlatformBanner = ({ active, counts, onSelect }) => {
  const { t, isArabic } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.platform-card', {
        y: 60,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="games-platforms" className="relative bg-[#090909] py-24 font-sans overflow-hidden border-t border-white/5">
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#8b151a]/8 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* الترويسة */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#8b151a] shadow-[0_0_10px_rgba(139,21,26,0.8)] animate-pulse"></span>
          <h2 className="text-sm font-bold text-[#8b151a] tracking-widest uppercase">
            {t('games.platforms.overline')}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h3
            className={`${
              isArabic ? 'font-ar font-black' : "font-['Bebas_Neue',_sans-serif]"
            } text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-white tracking-wide`}
          >
            {t('games.platforms.titleLine1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#8b151a] to-[#4d0a0d]">
              {t('games.platforms.titleLine2')}
            </span>
          </h3>
          <p className="font-ar text-gray-400 text-sm max-w-sm leading-relaxed">
            {t('games.platforms.desc')}
          </p>
        </div>

        {/* بطاقات المنصات */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {platformMeta.map((p) => {
            const isActive = active === p.key;
            return (
              <button
                key={p.key}
                onClick={() => onSelect(p.key)}
                className={`platform-card group relative overflow-hidden rounded-2xl border text-start transition-all duration-300 ${
                  isActive
                    ? 'border-[#8b151a] shadow-[0_0_35px_rgba(139,21,26,0.35)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative h-36 md:h-44 overflow-hidden">
                  <img
                    src={p.art}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/35 to-transparent"></div>
                  <div
                    className="absolute inset-0 mix-blend-overlay"
                    style={{ background: `linear-gradient(155deg, ${p.accent}66, transparent 60%)` }}
                  ></div>

                  {/* شارة المنصة */}
                  <span
                    className="absolute top-4 start-4 w-11 h-11 rounded-lg flex items-center justify-center text-white font-['Bebas_Neue',_sans-serif] text-lg shadow-lg"
                    style={{ background: p.color, border: `1px solid ${p.accent}55` }}
                  >
                    {p.short}
                  </span>

                  {isActive && (
                    <span className="absolute top-4 end-4 flex items-center gap-1.5 bg-[#8b151a] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      {t('games.platforms.active')}
                    </span>
                  )}
                </div>

                <div className="p-4 bg-[#0d0d0d] border-t border-white/5 group-hover:border-[#8b151a]/40 transition-colors duration-300">
                  <h4 className="font-display text-base md:text-lg text-white tracking-wide">
                    {p.name}
                  </h4>
                  <p className="font-ar text-[11px] text-gray-500 mt-1">
                    {counts[p.key]} {t('games.platforms.titles')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformBanner;