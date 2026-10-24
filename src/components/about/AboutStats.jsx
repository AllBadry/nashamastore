import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { stats } from '../../data/about';
import { useLang } from '../../i18n';

const AboutStats = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const labels = t('about.stats');

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        still: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { still } = context.conditions;

        const ctx = gsap.context(() => {
          gsap.from('.stats-item', {
            y: 60,
            opacity: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' },
          });

          // خط فاصل يمتد مع التمرير
          gsap.from('.stats-rule', {
            scaleX: 0,
            transformOrigin: 'right center',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' },
          });

          if (still) return;

          // عدّاد تصاعدي لكل رقم عند ظهوره
          const counters = gsap.utils.toArray('.stats-value');

          counters.forEach((counter) => {
            const target = parseFloat(counter.dataset.target) || 0;
            const { prefix = '', suffix = '' } = counter.dataset;
            const duration = target > 100 ? 2 : 1.2;

            const output = { value: 0 };

            gsap.to(output, {
              value: target,
              duration,
              ease: 'power2.out',
              scrollTrigger: { trigger: counter, start: 'top 92%', once: true },
              onUpdate: () => {
                counter.textContent =
                  `${prefix}${Math.round(output.value).toLocaleString('en-US')}${suffix}`;
              },
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
      className="relative bg-[#05060a] py-20 md:py-28 border-y border-white/5 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b151a]/40 to-transparent"></div>

      <div className="max-w-[1200px] mx-auto section-pad relative z-10">
        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {stats.map((stat, index) => (
            <div key={stat.id} className="stats-item text-center lg:text-center px-2">
              <span className="text-[10px] tracking-[0.3em] text-[#8b151a]/70 uppercase">
                {stat.id}
              </span>

              <p
                className="stats-value font-['Bebas_Neue',_sans-serif] text-[3.2rem] sm:text-[4rem] lg:text-[5rem] leading-none text-white my-3 tabular-nums"
                data-target={stat.target}
                data-prefix={stat.prefix || ''}
                data-suffix={stat.suffix || ''}
              >
                {`${stat.prefix || ''}${stat.target.toLocaleString('en-US')}${stat.suffix || ''}`}
              </p>

              <div className="stats-rule h-px w-12 mx-auto bg-gradient-to-r from-transparent via-[#8b151a] to-transparent mb-4"></div>

              <p className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase">
                {labels[index].label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
