import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { cover } from '../../data/about';
import { useLang } from '../../i18n';

const AboutStory = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);

  // تقسيم كل فقرة إلى كلمات لتُكشف واحدة واحدة
  const paragraphs = useMemo(
    () =>
      t('about.story.paragraphs').map((text) =>
        text.split(' ').map((word, i) => ({ key: `${text.slice(0, 8)}-${i}`, word }))
      ),
    [t]
  );

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        still: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktop, still } = context.conditions;

        const ctx = gsap.context(() => {
          // الترويسة
          gsap.from('.story-overline', {
            opacity: 0,
            x: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.story-overline', start: 'top 88%' },
          });

          gsap.from('.story-title', {
            y: 70,
            opacity: 0,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.story-title', start: 'top 88%' },
          });

          // كل كلمة تُكشف من الأسفل
          gsap.utils.toArray('.story-paragraph').forEach((paragraph) => {
            const words = paragraph.querySelectorAll('.story-word');

            gsap.from(words, {
              opacity: 0,
              y: 26,
              filter: 'blur(6px)',
              duration: 0.9,
              stagger: 0.022,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: paragraph,
                start: 'top 85%',
              },
            });
          });

          gsap.from('.story-quote', {
            opacity: 0,
            scale: 0.94,
            duration: 1.3,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.story-quote', start: 'top 88%' },
          });

          if (still) return;

          // العمود الجانبي: بارالاكس رأسي +.counter-horizontal
          const column = document.querySelector('.story-image-column');

          if (column) {
            gsap.fromTo(
              column,
              { yPercent: -6 },
              {
                yPercent: 14,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          // غلاف داخل العمود يتحرك عكس الاتجاه
          const cover = document.querySelector('.story-cover');

          if (cover) {
            gsap.fromTo(
              cover,
              { yPercent: desktop ? 8 : 4, scale: 1.08 },
              {
                yPercent: desktop ? -10 : -5,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        }, sectionRef);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#090909] py-28 md:py-40 overflow-hidden font-sans"
    >
      {/* توهج خلفي */}
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[#8b151a]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto section-pad relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* ===== النص ===== */}
          <div className="lg:col-span-7">
            <span className="story-overline text-[#8b151a] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#8b151a]"></span>
              {t('about.story.overline')}
            </span>

            <h2 className="story-title font-['Bebas_Neue',_sans-serif] text-[3.2rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] text-white mb-10">
              {t('about.story.title')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8b151a]">
                {t('about.story.titleAccent')}
              </span>
            </h2>

            <div className="space-y-7">
              {paragraphs.map((words, pIndex) => (
                <p
                  key={pIndex}
                  className="story-paragraph font-ar text-[15px] md:text-lg leading-[2] text-gray-400"
                >
                  {words.map(({ key, word }) => (
                    <span key={key} className="story-word inline-block">
                      {word}&nbsp;
                    </span>
                  ))}
                </p>
              ))}
            </div>

            {/* اقتباس بارز */}
            <blockquote className="story-quote relative mt-12 ps-6 md:ps-8 border-e-2 border-[#8b151a]">
              <p className="font-display text-xl md:text-2xl leading-snug text-white/90">
                “{t('about.story.pullQuote')}”
              </p>
            </blockquote>
          </div>

          {/* ===== عمود الصور (بارالاكس) ===== */}
          <div className="lg:col-span-5">
            <div className="story-image-column relative will-change-transform">
              {/* الصورة الرئيسية */}
              <div className="story-cover relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] will-change-transform">
                <img
                  src={cover('cyberpunk')}
                  alt={t('about.story.media.cyberpunkAlt')}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[10px] tracking-[0.3em] text-[#8b151a] uppercase">
                    {t('about.story.media.featured')}
                  </span>
                  <p className="font-['Bebas_Neue',_sans-serif] text-2xl text-white mt-1">
                    CYBERPUNK 2077
                  </p>
                </div>
              </div>

              {/* بطاقة عائمة صغيرة */}
              <div className="absolute -bottom-6 -left-4 md:-left-8 glass-strong rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#8b151a]/20 border border-[#8b151a]/40 flex items-center justify-center text-[#8b151a] text-lg font-black">
                  N
                </span>
                <div>
                  <p className="font-display text-sm text-white">{t('about.story.media.authenticTitle')}</p>
                  <p className="text-[10px] text-gray-500 font-ar">{t('about.story.media.authenticSub')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
