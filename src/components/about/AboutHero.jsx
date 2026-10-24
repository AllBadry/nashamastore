import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { heroLayers } from '../../data/about';
import { useLang } from '../../i18n';

const AboutHero = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    // matchMedia يجمع بين الاستجابة للشاشة واحترام تفضيل تقليل الحركة
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        still: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktop, mobile, still } = context.conditions;

        const ctx = gsap.context(() => {
          // مقدمة: ظهور سطر سطر مع إخفاء خلف قناع
          gsap.from('.about-eyebrow', {
            opacity: 0,
            y: 30,
            duration: 1.1,
            ease: 'power3.out',
          });

          gsap.from('.about-title-line', {
            yPercent: 115,
            opacity: 0,
            duration: 1.5,
            stagger: 0.14,
            ease: 'power4.out',
            delay: 0.15,
          });

          gsap.from('.about-subtitle', {
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.6,
          });

          gsap.from('.about-scroll-hint', {
            opacity: 0,
            duration: 1,
            delay: 1.1,
          });

          // وضع الحركة المخفّضة: لا بارالاكس إطلاقاً
          if (still) return;

          // طبقة واحدة فقط على الموبايل لتوفير الأداء
          const speeds = desktop ? null : mobile ? [-14] : null;

          const layers = gsap.utils.toArray('.about-hero-layer');

          layers.forEach((layer, index) => {
            const speed = speeds ? speeds[index] || 0 : heroLayers[index].speed;

            gsap.to(layer, {
              yPercent: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          });

          // محتوى الهيرو يبتعد مع اختفاء تدريجي
          gsap.to('.about-hero-content', {
            yPercent: 22,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'center top',
              end: 'bottom top',
              scrub: true,
            },
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
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#05060a] flex items-center"
    >
      {/* ===== طبقات الصور: تتحرك بسرعات مختلفة مع التمرير =====
          ملاحظة: التمركز يتم عبر الغلاف الخارجي فقط، أما الصورة الداخلية
          (about-hero-layer) فهي التي يحرّكها GSAP، لأن GSAP يكتب خاصية
          transform مباشرة فيتعارض مع كلاسات translate في Tailwind. */}
      <div className="absolute inset-0 z-0">
        {heroLayers.map((layer, index) => (
          <div
            key={layer.src}
            className={`absolute left-1/2 -translate-x-1/2 h-[124%] ${
              index === 1 ? 'w-full' : 'hidden md:block w-[130%]'
            }`}
            style={{ top: '-12%' }}
          >
            <img
              src={layer.src}
              alt={t(layer.altKey)}
              // صورة الهيرو فوق الطية: تحميل فوري
              fetchPriority="high"
              decoding="async"
              className="about-hero-layer w-full h-full object-cover will-change-transform"
            />
          </div>
        ))}

        {/* تدرّجات داكنة لضمان قراءة النص فوق الصورة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#05060a]/55 to-[#05060a]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#05060a] via-transparent to-[#05060a]/80"></div>
        {/* تظليل الحواف السينمائي */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]"></div>
      </div>

      {/* ===== المحتوى ===== */}
      <div className="about-hero-content relative z-10 w-full section-pad pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="about-eyebrow flex items-center gap-3 mb-8">
            <span className="w-10 h-px bg-[#8b151a]"></span>
            <span className="text-[#8b151a] font-bold tracking-[0.35em] uppercase text-[10px] md:text-xs">
              {t('about.hero.eyebrow')}
            </span>
          </div>

          {/* كل سطر داخل قناع overflow-hidden لظهور سينمائي */}
          <h1 className="font-['Bebas_Neue',_sans-serif] leading-[0.85] text-white">
            {t('about.hero.titleLines').map((line, index, lines) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span
                  className={`about-title-line block text-[4.5rem] sm:text-[7rem] lg:text-[11rem] tracking-tight ${
                    index === lines.length - 1
                      ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8b151a]'
                      : ''
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <p className="about-subtitle lg:col-span-6 font-ar text-base md:text-lg leading-relaxed text-gray-300">
              {t('about.hero.subtitle')}
            </p>

            <div className="about-subtitle lg:col-span-6 flex items-center gap-4 justify-start lg:justify-end">
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20 lg:max-w-[120px]"></div>
              <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">
                EST. AMMAN — JORDAN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== مؤشر التمرير ===== */}
      <div className="about-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[9px] tracking-[0.4em] text-gray-500 uppercase">
          {t('about.hero.scrollHint')}
        </span>
        <span className="relative block w-px h-14 overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-[#8b151a] animate-pulse"></span>
        </span>
      </div>
    </section>
  );
};

export default AboutHero;
