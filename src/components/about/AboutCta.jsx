import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';

const AboutCta = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        still: '(prefers-reduced-motion: reduce)',
      },
      () => {
        const ctx = gsap.context(() => {
          gsap.from('.cta-overline', {
            opacity: 0,
            y: 26,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.cta-overline', start: 'top 90%' },
          });

          gsap.from('.cta-title', {
            y: 60,
            opacity: 0,
            duration: 1.3,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.cta-title', start: 'top 90%' },
          });

          gsap.from('.cta-action', {
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.cta-action', start: 'top 92%' },
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
      className="relative bg-[#05060a] py-28 md:py-40 overflow-hidden"
    >
      {/* توهج خلفي */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.18),transparent_65%)]"></div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b151a]/40 to-transparent"></div>

      <div className="max-w-[1000px] mx-auto section-pad relative z-10 text-center">
        <span className="cta-overline text-[#8b151a] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
          {t('about.cta.overline')}
        </span>

        <h2 className="cta-title font-['Bebas_Neue',_sans-serif] text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.9] text-white mt-6">
          {t('about.cta.title')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8b151a]">
            {t('about.cta.titleAccent')}
          </span>
        </h2>

        <p className="font-ar text-base md:text-lg text-gray-400 mt-7 max-w-xl mx-auto leading-relaxed">
          {t('about.cta.desc')}
        </p>

        <div className="cta-action mt-11 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/#products" className="btn-primary px-8 py-4 w-full sm:w-auto text-center">
            {t('about.cta.primary')}
          </a>
          <a href="/#contact" className="btn-ghost px-8 py-4 w-full sm:w-auto text-center">
            {t('about.cta.secondary')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
