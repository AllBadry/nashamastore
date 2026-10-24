import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { showcaseBands, cover } from '../../data/about';
import { useLang } from '../../i18n';

const AboutShowcase = () => {
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
          gsap.from('.showcase-heading', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.showcase-heading', start: 'top 88%' },
          });

          // شريط أفقي يُسحب مع التمرير الرأسي (يبدو كتمرير جانبي)
          gsap.utils.toArray('.showcase-track').forEach((track) => {
            const direction = parseFloat(track.dataset.direction) || 1;

            gsap.fromTo(
              track,
              { xPercent: direction * 50 },
              {
                xPercent: direction * -50,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });

          // الأغلفة نفسها ترتفع قليلاً عند التمرير
          gsap.utils.toArray('.showcase-item').forEach((item) => {
            gsap.from(item, {
              y: 40,
              opacity: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 95%' },
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
      className="relative bg-[#05060a] py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto section-pad relative z-10 mb-14">
        <div className="showcase-heading text-center">
          <span className="text-[#8b151a] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
            {t('about.showcase.overline')}
          </span>
          <h2 className="font-['Bebas_Neue',_sans-serif] text-[3.2rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] text-white mt-5">
            {t('about.showcase.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8b151a]">
              {t('about.showcase.titleAccent')}
            </span>
          </h2>
          <p className="font-ar text-sm md:text-base text-gray-400 mt-5 max-w-xl mx-auto leading-relaxed">
            {t('about.showcase.desc')}
          </p>
        </div>
      </div>

      {/* ===== شرائط الأغلفة المتوازية ===== */}
      <div className="relative space-y-5 md:space-y-7">
        {showcaseBands.map((band, bandIndex) => (
          <div key={bandIndex} className="overflow-hidden">
            <div
              className="showcase-track flex gap-4 md:gap-6 w-max"
              data-direction={band.direction}
            >
              {/* نكرر القائمة مرة ثانية لاستمرار الحركة */}
              {[0, 1].map((copy) =>
                band.items.map((key) => (
                  <div
                    key={`${copy}-${key}`}
                    className="showcase-item relative w-[150px] sm:w-[190px] md:w-[230px] shrink-0 overflow-hidden rounded-lg border border-white/5"
                    aria-hidden={copy === 1}
                  >
                    <img
                      src={cover(key)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05060a]/80 via-transparent to-transparent"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* تلاشٍ عند الحواف */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-l from-transparent to-[#05060a]"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-r from-transparent to-[#05060a]"></div>
    </section>
  );
};

export default AboutShowcase;
