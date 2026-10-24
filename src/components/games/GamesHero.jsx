import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { gameArt } from '../../data/gamesCatalog';

const GamesHero = () => {
  const { t, isArabic } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // دخول سينمائي: تتابع العناصر
      gsap.from('.gh-eyebrow', { y: 30, duration: 0.8, ease: 'power3.out' });
      gsap.from('.gh-line', {
        y: 90,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.out',
        delay: 0.15,
      });
      gsap.from('.gh-sub', { y: 40, duration: 0.9, ease: 'power3.out', delay: 0.7 });
      gsap.from('.gh-cta', { y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.9 });
      gsap.from('.gh-scroll', { y: 20, duration: 0.8, delay: 1.3 });

      // باراللاكس: الخلفية تتحرك ببطء أثناء السكرول
      gsap.to('.gh-bg', {
        yPercent: 16,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // تلاشي المحتوى عند الخروج من الشاشة
      gsap.to('.gh-inner', {
        autoAlpha: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = t('games.marquee');
  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden font-sans bg-[#090909]"
    >
      {/* خلفية سينمائية */}
      <div className="absolute inset-0 overflow-hidden -z-20">
        <img
          src={gameArt('1409 - Cyberpunk 2077')}
          alt=""
          className="gh-bg absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/70 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8b151a]/15 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px] opacity-60"></div>
      </div>

      <div className="gh-inner relative z-10 max-w-7xl mx-auto w-full px-6 pt-[140px] pb-28">
        <div className="flex flex-col items-start">
          {/* الشريط العلوي */}
          <div className="gh-eyebrow flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b151a] shadow-[0_0_12px_rgba(139,21,26,0.9)] animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase text-[#8b151a]">
              {t('games.hero.eyebrow')}
            </span>
          </div>

          {/* العنوان السينمائي */}
          <h1 className="gh-line overflow-hidden">
            <span
              className={`block ${
                isArabic ? 'font-ar font-black' : "font-['Bebas_Neue',_sans-serif]"
              } leading-[0.9] text-white text-[3.4rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem] tracking-wide`}
            >
              {t('games.hero.titleLine1')}
            </span>
          </h1>
          <h1 className="gh-line overflow-hidden mt-1">
            <span
              className={`block ${
                isArabic ? 'font-ar font-black' : "font-['Bebas_Neue',_sans-serif]"
              } leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-[#8b151a] to-[#4d0a0d] text-[3.4rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem] tracking-wide`}
            >
              {t('games.hero.titleLine2')}
            </span>
          </h1>

          {/* الوصف */}
          <p className="gh-sub font-ar text-gray-300 text-sm md:text-lg max-w-xl mt-8 leading-loose">
            {t('games.hero.desc')}
          </p>

          {/* الأزرار */}
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <button
              onClick={() => scrollTo('#games-grid')}
              className="gh-cta group relative bg-[#8b151a] text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('games.hero.primary')}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => scrollTo('#games-platforms')}
              className="gh-cta px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-300 border border-white/15 hover:border-[#8b151a]/70 hover:text-white transition-colors duration-300"
            >
              {t('games.hero.secondary')}
            </button>
          </div>
        </div>
      </div>

      {/* مؤشر السكرول */}
      <div className="gh-scroll absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500 font-bold">
          {t('games.hero.scrollHint')}
        </span>
        <span className="w-5 h-9 rounded-full border border-white/25 flex justify-center pt-2">
          <span className="w-1 h-2 bg-[#8b151a] rounded-full animate-bounce"></span>
        </span>
      </div>

      {/* الشريط المتحرك (Marquee) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#8b151a]/95 border-t border-white/10 overflow-hidden py-3.5 rotate-[-1deg] scale-[1.02]">
        <div className="g-marquee-track flex whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
              {words.map((w, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center text-white font-['Bebas_Neue',_sans-serif] text-sm md:text-base uppercase tracking-[0.3em] px-6"
                >
                  {w}
                  <span className="ml-12 w-1.5 h-1.5 bg-white/70 rounded-full"></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gmarq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .g-marquee-track { animation: gmarq 30s linear infinite; }
        .g-marquee-track:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
};

export default GamesHero;