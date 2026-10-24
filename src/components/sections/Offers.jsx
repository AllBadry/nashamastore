import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../i18n';
import { gameArt } from '../../data/gamesCatalog';

gsap.registerPlugin(ScrollTrigger);

const Offers = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // أنيميشن لدخول البانر العلوي
      gsap.from(".offer-banner", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".offer-banner",
          start: "top 80%",
        }
      });

      // أنيميشن دخول تفاصيل العرض (صورة اللعبة والنصوص)
      gsap.from([".featured-text", ".featured-image"], {
        x: (index) => index === 0 ? -50 : 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: ".offer-banner",
          start: "top 80%",
        }
      });

      // أنيميشن لدخول بطاقات الألعاب السفلية
      gsap.from(".offer-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".offer-cards-container",
          start: "top 85%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // بيانات بطاقات الألعاب الأكثر مبيعاً
  const cardsData = t('home.offers.cards').map((card, index) => ({
    ...card,
    image: [
      gameArt('1409 - Cyberpunk 2077'),
      gameArt('1435 - Call of Duty Black Ops III + DLC'),
      gameArt("2338 - Assassin's Creed II Deluxe Edition"),
      gameArt('1448 - PGA Tour 2K21'),
      gameArt('1409 - Cyberpunk 2077'),
    ][index]
  }));

  return (
    <section ref={sectionRef} className="bg-[#090909] min-h-screen pb-16 pt-24 px-4 md:px-8 font-sans flex flex-col items-center">
      
      <div className="w-full max-w-[1200px] mx-auto">
        
        {/* ================= البانر العلوي (عرض اللعبة المميزة) ================= */}
        <div className="offer-banner relative w-full bg-[#111] text-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" 
             style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)" }}>
          
          {/* فيديو الخلفية للعبة */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen z-0"
          >
            {/* يمكنك تغيير مسار الفيديو ليكون خاصاً باللعبة المعروضة */}
            <source src="/videos/Major Crimes - Cyberpunk 2077 AMV.mp4" />
          </video>
          
          {/* تدرج لوني لتغميق الفيديو من اليسار (لإظهار النصوص بوضوح) ومن الأسفل */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/80 to-transparent pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#191b21] via-transparent to-transparent pointer-events-none z-0"></div>

          {/* محتوى البانر: ينقسم لنصوص على اليسار وصورة على اليمين */}
          <div className="relative z-10 p-6 md:p-12 pb-0 flex flex-col md:flex-row justify-between items-center h-full min-h-[400px]">
            
            {/* النصوص (تفاصيل اللعبة) */}
            <div className="featured-text w-full md:w-3/5 z-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#8b151a] text-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  {t('home.offers.dealOfWeek')}
                </span>
                <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">{t('home.offers.limited')}</span>
              </div>
              
              <h2 className="font-['Bebas_Neue',_sans-serif] text-[4rem] md:text-[6rem] leading-[0.85] tracking-wide mb-4 drop-shadow-2xl">
                CYBERPUNK 2077<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b151a] to-red-600">PHANTOM LIBERTY</span>
              </h2>
              
              <p className="text-gray-300 text-sm max-w-md mb-8 leading-relaxed">
                {t('home.offers.description')}
              </p>
            </div>

            {/* صورة اللعبة (الغلاف أو الشخصية) */}
            <div className="featured-image w-full md:w-2/5 mt-8 md:mt-0 relative h-[250px] md:h-[400px] flex justify-end items-end z-10">
              <img 
                src={gameArt('1409 - Cyberpunk 2077')} 
                alt="Cyberpunk Deal" 
                // الصورة مائلة قليلاً ومقصوصة لتعطي تأثيراً ديناميكياً 3D
                className="absolute bottom-0 right-0 h-full md:h-[110%] w-full object-cover object-center shadow-2xl border-l-4 border-t-4 border-[#8b151a]/20"
                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090909] to-transparent pointer-events-none" style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}></div>
            </div>

          </div>

          {/* الشريط السفلي الداكن (تفاصيل السعر وزر الشراء) */}
          <div className="relative z-30 bg-[#191b21] w-full p-6 md:px-12 md:py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t-4 border-[#8b151a]">
            
            <div className="flex w-full md:w-auto justify-between md:justify-start gap-8 md:gap-16">
              {/* السعر القديم */}
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t('home.offers.oldPrice')}</p>
                <p className="font-['Bebas_Neue',_sans-serif] text-3xl text-gray-500 line-through">$59.99</p>
              </div>
              {/* السعر الجديد (الخصم) */}
              <div>
                <p className="text-[#8b151a] text-[10px] font-bold uppercase tracking-widest mb-1 animate-pulse">{t('home.offers.currentOffer')}</p>
                <p className="font-['Bebas_Neue',_sans-serif] text-5xl text-white drop-shadow-[0_0_15px_rgba(139,21,26,0.6)]">$29.99</p>
              </div>
              {/* مؤقت انتهاء العرض */}
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t('home.offers.endsIn')}</p>
                <p className="font-['Bebas_Neue',_sans-serif] text-3xl text-white">48:00:00</p>
              </div>
            </div>

            {/* زر الشراء المائل */}
            <button 
              className="w-full md:w-auto bg-[#8b151a] hover:bg-white text-white hover:text-black transition-colors duration-300 flex items-center justify-center shrink-0 h-14 px-12"
              style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <span className="font-['Bebas_Neue',_sans-serif] text-2xl tracking-widest pt-1">
                {t('home.offers.claim')}
              </span>
            </button>

          </div>
        </div>


        {/* ================= قسم البطاقات السفلية ================= */}
        
        {/* الترويسة الصغيرة فوق البطاقات */}
        <div className="w-full mt-16 mb-6">
          <span className="text-[10px] text-[#8b151a] font-bold tracking-widest uppercase">
            {t('home.offers.topRated')}
          </span>
        </div>

        {/* حاوية البطاقات (شبكة من 5 أعمدة) */}
        <div className="offer-cards-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {cardsData.map((card, index) => (
            <div key={index} className="offer-card group flex flex-col bg-[#191b21] border-t-4 border-[#8b151a] cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg">
              
              {/* قسم الصورة */}
              <div className="relative h-48 md:h-64 overflow-hidden bg-black">
                {/* الترويسة الصغيرة داخل الصورة */}
                <div className="absolute top-2 left-2 z-10 flex gap-1 text-[8px] font-bold text-white/70">
                  <span className="bg-black/50 px-1 backdrop-blur-sm">NASHAMA</span>
                  <span className="bg-[#8b151a]/80 px-1 backdrop-blur-sm">{t('home.offers.cardTag')}</span>
                </div>
                
                <img 
                  src={card.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                
                {/* تدرج لوني أسفل الصورة لدمجها مع النص */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#191b21] to-transparent"></div>
              </div>

              {/* قسم النص السفلي */}
              <div className="p-4 pt-2 relative z-10 border-b-2 border-transparent group-hover:border-[#8b151a] transition-colors">
                <h4 className="font-['Bebas_Neue',_sans-serif] text-2xl md:text-3xl text-white tracking-wide leading-none mb-1">
                  {card.title}
                </h4>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  {card.subtitle}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Offers;