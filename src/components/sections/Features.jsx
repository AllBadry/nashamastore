import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. أنيميشن العنوان: دخول سينمائي من الأسفل مع تلاشي
      gsap.from(".cinematic-title", {
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cinematic-title",
          start: "top 85%",
        }
      });

      // 2. أنيميشن البطاقات: تأثير "تركيز عدسة الكاميرا" (Blur to Focus)
      gsap.fromTo(cardsRef.current, 
        { 
          y: 100, 
          opacity: 0, 
          scale: 1.1, 
          filter: "blur(15px)" 
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          stagger: 0.2, // تأخير درامي بين كل بطاقة
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuresData = [
    {
      id: "01",
      key: "delivery",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "02",
      key: "checkout",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: "03",
      key: "support",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      )
    },
    {
      id: "04",
      key: "quality",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#090909] py-32 px-4 md:px-8 font-sans overflow-hidden border-t border-white/5">
      
      {/* 1. إضاءة درامية في الخلفية (Cinematic Spotlights) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#8b151a]/10 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>
      
      {/* 2. تأثير التظليل السينمائي على الحواف (Vignette Edge) */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-10"></div>

      <div className="max-w-[1200px] mx-auto relative z-20">
        
        {/* الترويسة السينمائية */}
        <div className="cinematic-title flex flex-col items-center text-center mb-24">
          <span className="text-[#8b151a] font-bold tracking-[0.3em] uppercase text-xs mb-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#8b151a]"></span>
            {t('home.features.overline')}
            <span className="w-8 h-[1px] bg-[#8b151a]"></span>
          </span>
          <h2 className="font-['Bebas_Neue',_sans-serif] text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {t('home.features.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
              {t('home.features.titleAccent')}
            </span>
          </h2>
        </div>

        {/* شبكة المميزات */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuresData.map((feature, index) => {
            const copy = t(`home.features.items.${feature.key}`);

            return (
            <div 
              key={feature.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 overflow-hidden hover:border-[#8b151a]/50 transition-colors duration-500 cursor-default flex flex-col justify-between min-h-[320px]"
            >
              
              {/* الرقم العملاق الشفاف في الخلفية (3D Depth) */}
              <div className="absolute -bottom-6 -right-4 font-['Bebas_Neue',_sans-serif] text-[8rem] leading-none text-white/[0.03] group-hover:text-[#8b151a]/10 transition-colors duration-700 pointer-events-none select-none z-0">
                {feature.id}
              </div>

              {/* تأثير إضاءة عند تمرير الماوس (Hover Flare) */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#8b151a]/0 via-transparent to-[#8b151a]/0 group-hover:from-[#8b151a]/10 transition-all duration-700 z-0"></div>

              {/* الأيقونة */}
              <div className="relative z-10 text-gray-500 group-hover:text-white transition-colors duration-500 mb-8 group-hover:scale-110 transform origin-left">
                {feature.icon}
              </div>

              {/* النصوص */}
              <div className="relative z-10 mt-auto">
                <h4 className="font-['Bebas_Neue',_sans-serif] text-3xl tracking-wide text-white mb-1 group-hover:text-[#8b151a] transition-colors duration-500">
                  {copy.title}
                </h4>
                <h5 className="text-sm font-bold text-gray-300 mb-3 tracking-wide">
                  {copy.subtitle}
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-500">
                  {copy.desc}
                </p>
              </div>
              
              {/* شريط التحميل السفلي (ديكور سينمائي) */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#8b151a] w-0 group-hover:w-full transition-all duration-700 ease-out z-10"></div>
            </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;