import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { values } from '../../data/about';
import { useLang } from '../../i18n';

// أيقونات القيم (بدون مكتبة أيقونات خارجية)
const ICONS = {
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  bolt: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  eye: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </>
  ),
  headset: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
    />
  ),
};

const AboutValues = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const items = t('about.values');

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      },
      () => {
        const ctx = gsap.context(() => {
          gsap.from('.values-heading', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.values-heading', start: 'top 88%' },
          });

          gsap.from('.value-card', {
            y: 70,
            opacity: 0,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power3.out',
            // إزالة التحويل بعد الانتهاء حتى يعمل hover في Tailwind
            clearProps: 'transform',
            scrollTrigger: { trigger: '.values-grid', start: 'top 85%' },
          });

          // توهج يتتبع البطاقة أثناء ظهورها
          gsap.utils.toArray('.value-card').forEach((card) => {
            card.addEventListener('mouseenter', () => {
              gsap.to(card.querySelector('.value-glow'), {
                opacity: 1,
                duration: 0.5,
              });
            });

            card.addEventListener('mouseleave', () => {
              gsap.to(card.querySelector('.value-glow'), {
                opacity: 0,
                duration: 0.5,
              });
            });
          });
        }, sectionRef);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#090909] py-28 md:py-36 overflow-hidden font-sans"
    >
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[#8b151a]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto section-pad relative z-10">
        <div className="values-heading text-center mb-14 md:mb-20">
          <span className="text-[#8b151a] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
            {t('about.valuesSection.overline')}
          </span>
          <h2 className="font-['Bebas_Neue',_sans-serif] text-[3.2rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] text-white mt-5">
            {t('about.valuesSection.title')}{' '}
            <span className="text-[#8b151a]">{t('about.valuesSection.titleAccent')}</span>
          </h2>
        </div>

        <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {values.map((value, index) => (
            <article
              key={value.id}
              className="value-card group relative glass rounded-2xl p-7 overflow-hidden transition-transform duration-500 hover:-translate-y-2"
            >
              {/* توهج التحويم */}
              <span className="value-glow absolute -top-16 -right-16 w-40 h-40 bg-[#8b151a]/20 blur-3xl rounded-full opacity-0 transition-opacity duration-500 pointer-events-none"></span>

              <span className="text-[10px] tracking-[0.3em] text-[#8b151a]/70 uppercase">
                {value.id}
              </span>

              <span className="mt-6 mb-5 w-12 h-12 rounded-xl border border-[#8b151a]/30 bg-[#8b151a]/10 flex items-center justify-center text-[#ef4444] group-hover:scale-110 transition-transform duration-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  {ICONS[value.icon]}
                </svg>
              </span>

              <h3 className="font-display text-base md:text-lg text-white">{items[index].title}</h3>
              <span className="text-[10px] tracking-[0.25em] text-[#8b151a] uppercase">
                {value.id}
              </span>

              <p className="font-ar text-sm leading-loose text-gray-400 mt-4">{items[index].desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
