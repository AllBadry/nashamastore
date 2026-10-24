import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../i18n';
import { gameArt } from '../../data/gamesCatalog';

gsap.registerPlugin(ScrollTrigger);

const Categories = () => {
  const { t, isArabic } = useLang();
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // أنيميشن لكل قسم (Row) عند الوصول إليه بالسكرول
      rowsRef.current.forEach((row, i) => {
        const image = row.querySelector('.cat-image');
        const text = row.querySelector('.cat-text');
        
        // اتجاه الحركة يعتمد على ما إذا كان القسم زوجياً أم فردياً
        const isEven = i % 2 === 0;

        gsap.from(image, {
          x: isEven ? -100 : 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 75%",
          }
        });

        gsap.from(text, {
          x: isEven ? 100 : -100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 75%",
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // بيانات الأقسام: النصوص من القاموس والصور ثابتة (أقسام حسب نوع اللعبة)
  const categoriesData = [
    {
      id: 1,
      key: 'action',
      image: gameArt('1435 - Call of Duty Black Ops III + DLC')
    },
    {
      id: 2,
      key: 'rpg',
      image: gameArt('1409 - Cyberpunk 2077')
    },
    {
      id: 3,
      key: 'racing',
      image: gameArt('2549 - Forza Horizon 5')
    },
    {
      id: 4,
      key: 'horror',
      image: gameArt('2383 - Silent Hill 2 Remake')
    }
  ];

  return (
    <section ref={sectionRef} className="bg-[#090909] py-20 font-sans overflow-hidden border-t border-white/5">
      
      {/* ترويسة القسم العامة */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#8b151a] shadow-[0_0_10px_rgba(139,21,26,0.8)] animate-pulse"></span>
          <h2 className="text-sm font-bold text-[#8b151a] tracking-widest uppercase">{t('home.categories.overline')}</h2>
        </div>
        <h3 className="text-4xl md:text-5xl font-['Bebas_Neue',_sans-serif] text-white tracking-wide">
          {t('home.categories.title')}
        </h3>
      </div>

      <div className="w-full flex flex-col gap-12 md:gap-24">
        {categoriesData.map((cat, index) => {
          const isEven = index % 2 === 0;
          const copy = t(`home.categories.items.${cat.key}`);
          // عند RTL ينقلب تخطيط الصف بالكامل: القُطري يجب أن يذهب للجهة المقابلة للصورة
          const stripeRight = isEven !== isArabic;

          return (
            // حاوية القسم الواحد (Row)
            <div 
              key={cat.id} 
              ref={(el) => (rowsRef.current[index] = el)}
              className="relative w-full min-h-[400px] md:h-[500px] flex items-center group cursor-pointer"
            >
              
              {/* === الخلفية المائلة (Diagonal Slash) === */}
              <div 
                className={`absolute inset-y-0 w-full md:w-[65%] bg-[#121212] border-[#8b151a] transition-colors duration-500 group-hover:bg-[#1a1a1a] z-0
                  ${stripeRight ? 'right-0 border-l-4' : 'left-0 border-r-4'}
                `}
                style={{
                  // قص مائل معكوس أفقياً حسب جهة القُطري
                  clipPath: stripeRight 
                    ? "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" 
                    : "polygon(0 0, 85% 0, 100% 100%, 0 100%)"
                }}
              >
                {/* توهج أحمر خفيف داخل القطع المائل */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8b151a]/5 to-transparent opacity-50"></div>
              </div>


              {/* === المحتوى الداخلي === */}
              <div className={`relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between h-full gap-8 md:gap-0`}>
                
                {/* 1. الصورة (تكسر الإطار وتبرز فوق القطع المائل) */}
                <div className="cat-image w-full md:w-[45%] h-[300px] md:h-[120%] relative z-20 flex items-center justify-center">
                  <img 
                    src={cat.image} 
                    alt={copy.title} 
                    className="w-full h-full object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700 ease-out border border-white/5"
                    // إمالة خفيفة للصورة لتعزيز الإحساس الرياضي والديناميكي
                    style={{ transform: stripeRight ? 'perspective(1000px) rotateY(15deg) rotateX(5deg)' : 'perspective(1000px) rotateY(-15deg) rotateX(5deg)' }}
                  />
                </div>

                {/* 2. النصوص والإحصائيات */}
                <div className={`cat-text w-full md:w-[50%] flex flex-col ${isEven ? 'items-start text-start' : 'items-end text-end'} z-10`}>
                  
                  {/* البادج العلوي */}
                  <div className="border border-[#8b151a] text-[#8b151a] px-4 py-1 text-xs font-bold tracking-widest mb-6">
                    {copy.badge}
                  </div>
                  
                  {/* السطر الثانوي */}
                  <h4 className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase mb-1">
                    {copy.subtitle}
                  </h4>
                  
                  {/* العنوان الضخم */}
                  <h3 className="font-['Bebas_Neue',_sans-serif] text-[3.5rem] md:text-[5.5rem] leading-[0.85] tracking-wide text-white mb-8 drop-shadow-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-300">
                    {copy.title}
                  </h3>

                  {/* الإحصائيات (Stats) كما في الصورة المرفقة */}
                  <div className={`flex items-center gap-6 md:gap-12 w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                    {copy.stats.map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="font-['Bebas_Neue',_sans-serif] text-3xl md:text-4xl text-white tracking-wide">
                          {stat.value}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* زر التصفح */}
                  <Link to="/games" className={`mt-10 bg-[#8b151a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 ${isEven ? 'self-start' : 'self-end'}`}>
                    {t('home.categories.cta')}
                  </Link>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Categories;