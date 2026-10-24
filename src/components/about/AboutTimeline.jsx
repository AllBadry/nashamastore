import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { timeline, cover } from '../../data/about';
import { useLang } from '../../i18n';

const AboutTimeline = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const stages = t('about.timeline');

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        still: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { still } = context.conditions;

        const ctx = gsap.context(() => {
          // ===== الترويسة: كشف سينمائي =====
          gsap.from('.timeline-overline', {
            opacity: 0,
            y: 34,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.timeline-heading', start: 'top 88%' },
          });

          gsap.from('.timeline-title', {
            yPercent: 60,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.timeline-heading', start: 'top 88%' },
          });

          gsap.from('.timeline-lead', {
            opacity: 0,
            y: 24,
            duration: 1.1,
            delay: 0.25,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.timeline-heading', start: 'top 88%' },
          });

          // ===== الخط الزمني: شريط يتقدم + كرة ضوء تنزل معه =====
          gsap.fromTo(
            '.timeline-progress',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              transformOrigin: 'top center',
              scrollTrigger: {
                trigger: '.timeline-list',
                start: 'top 75%',
                end: 'bottom 65%',
                scrub: true,
              },
            }
          );

          if (still) return;

          // الكرة تسير بنصف سرعة التمرير => إحساس سينمائي بالعمق
          gsap.fromTo(
            '.timeline-orb',
            { top: '0%' },
            {
              top: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: '.timeline-list',
                start: 'top 75%',
                end: 'bottom 65%',
                scrub: true,
              },
            }
          );

          // توهج خلفي ينزاح مع التمرير
          gsap.fromTo(
            '.timeline-glow',
            { yPercent: -10 },
            {
              yPercent: 70,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );

          // ===== كل مرحلة =====
          gsap.utils.toArray('.timeline-item').forEach((item) => {
            const isRight = item.dataset.side === 'right';

            // البطاقة: انزلاق + blur من الجهة المقابلة
            gsap.from(item.querySelector('.timeline-card'), {
              x: isRight ? 80 : -80,
              y: 40,
              opacity: 0,
              filter: 'blur(10px)',
              duration: 1.3,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 86%' },
            });

            // الرقم الشبحي الكبير
            gsap.from(item.querySelector('.timeline-ghost'), {
              opacity: 0,
              scale: 1.35,
              duration: 1.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 86%' },
            });

            // صورة الغلاف: تكبير بطيء
            const image = item.querySelector('.timeline-thumb img');
            if (image) {
              gsap.fromTo(
                image,
                { scale: 1.25 },
                {
                  scale: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                  },
                }
              );
            }

            // توهج البطاقة
            gsap.from(item.querySelector('.timeline-dot'), {
              scale: 0,
              opacity: 0,
              duration: 0.8,
              ease: 'back.out(2.6)',
              delay: 0.1,
              scrollTrigger: { trigger: item, start: 'top 86%' },
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
      className="relative bg-[#090909] py-28 md:py-40 overflow-hidden"
    >
      {/* توهج ينزاح مع التمرير — الغلاف يحمل التوسيط والداخل هو الذي يحرّكه GSAP */}
      <div className="pointer-events-none absolute top-0 left-1/2 w-[900px] h-[600px] -translate-x-1/2">
        <div className="timeline-glow h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.22),transparent_65%)] blur-3xl will-change-transform"></div>
      </div>

      {/* ترويسة ملتصقة أعلى القسم */}
      <div className="timeline-heading relative z-10 max-w-[900px] mx-auto section-pad text-center mb-16 md:mb-24">
        <span className="timeline-overline inline-flex items-center gap-3 text-[#8b151a] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
          <span className="w-8 h-px bg-[#8b151a]"></span>
          {t('about.timelineSection.overline')}
        </span>

        <h2 className="timeline-title font-['Bebas_Neue',_sans-serif] text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.9] text-white mt-6 overflow-hidden">
          {t('about.timelineSection.title')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8b151a]">
            {t('about.timelineSection.titleAccent')}
          </span>
        </h2>

        <p className="timeline-lead font-ar text-sm md:text-base text-gray-400 mt-6 max-w-xl mx-auto leading-loose">
          {t('about.timelineSection.lead')}
        </p>
      </div>

      <div className="timeline-list relative max-w-[1100px] mx-auto section-pad z-10">
        {/* الخط الخلفي */}
        <div className="absolute top-0 bottom-0 left-[19px] md:left-1/2 md:-translate-x-1/2 w-px bg-white/10"></div>

        {/* شريط التقدم (الغلاف يحمل التمركز، والجزء الداخلي يُحرّك) */}
        <div className="absolute top-0 bottom-0 left-[19px] md:left-1/2 md:-translate-x-1/2 w-px overflow-visible">
          <div className="timeline-progress absolute inset-0 bg-gradient-to-b from-[#8b151a] via-[#ef4444] to-[#7f1d1d]"></div>
        </div>

        {/* كرة الضوء تنزل مع التمرير */}
        <div className="absolute top-0 bottom-0 left-[19px] md:left-1/2 md:-translate-x-1/2 w-px">
          <span className="timeline-orb absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 -translate-y-1/2 rounded-full bg-[#ef4444] shadow-[0_0_20px_6px_rgba(239,68,68,0.55)]"></span>
        </div>

        <div className="space-y-14 md:space-y-24">
          {timeline.map((entry, index) => {
            const isRight = index % 2 === 1;
            const stage = stages[index];

            return (
              <div
                key={entry.id}
                data-side={isRight ? 'right' : 'left'}
                className="timeline-item relative ps-14 md:ps-0 md:grid md:grid-cols-2 md:gap-20 items-center"
              >
                {/* الرقم الشبحي الكبير خلف البطاقة (الغلاف يحمل التوسيط) */}
                <span
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                    isRight ? 'left-0 md:left-auto md:right-8' : 'right-0 md:right-auto md:left-8'
                  }`}
                >
                  <span className="timeline-ghost block font-['Bebas_Neue',_sans-serif] text-[7rem] md:text-[11rem] leading-none text-white/[0.04]">
                    {entry.id}
                  </span>
                </span>

                {/* النقطة على الخط */}
                <span className="absolute left-[8px] md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center">
                  <span className="timeline-dot block w-3 h-3 rounded-full bg-[#090909] border-2 border-[#ef4444] shadow-[0_0_0_4px_rgba(139,21,26,0.18),0_0_18px_rgba(239,68,68,0.5)]"></span>
                </span>

                {/* العمود الأول: الصورة (يتناوب مع البطاقة) */}
                <div className={isRight ? 'md:order-2 md:ps-4' : 'md:order-1 md:pe-4'}>
                  <div className="timeline-thumb relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.75)]">
                    <img
                      src={cover(entry.artKey)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[16/10] object-cover will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/25 to-transparent"></div>
                    <span className="absolute top-4 start-4 text-[10px] tracking-[0.3em] text-[#ef4444]/80 uppercase">
                      {t('about.timelineSection.stage')} {entry.id}
                    </span>
                  </div>
                </div>

                {/* العمود الثاني: البطاقة */}
                <div className={isRight ? 'md:order-1 md:pe-4 md:text-start' : 'md:order-2 md:ps-4'}>
                  <div className="timeline-card glass relative rounded-2xl p-6 md:p-8 overflow-hidden">
                    {/* لمعة علوية */}
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ef4444]/60 to-transparent"></span>

                    <h3 className="font-display text-xl md:text-2xl text-white">
                      {stage.title}
                    </h3>

                    <p className="font-ar text-sm leading-loose text-gray-400 mt-4">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;
