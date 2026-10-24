import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLang } from '../../i18n';
import { gameArt } from '../../data/gamesCatalog';

// مكون مساعد لتغليف الكلمات والصور
const AnimatedItem = ({ children, className, isText = true }) => {
  const itemRef = useRef(null);

  // عند مرور الماوس (Hover)
  const onEnter = () => {
    // حركة التكبير والميلان الخفيفة من GSAP
    gsap.to(itemRef.current, { 
      scale: 1.05, 
      skewX: -5, 
      filter: "drop-shadow(0px 0px 20px rgba(139, 21, 26, 0.6))", 
      duration: 0.3,
      ease: "back.out(1.7)" 
    });
    
    // تفعيل لمعة الضوء التي تمر عبر النص
    if (isText) {
      itemRef.current.classList.add('is-hovered');
    }
  };

  // عند إبعاد الماوس
  const onLeave = () => {
    gsap.to(itemRef.current, { 
      scale: 1, 
      skewX: 0,
      filter: "drop-shadow(0px 0px 0px rgba(139, 21, 26, 0))", 
      duration: 0.3, 
    });
    
    // إيقاف اللمعة وإعادة النص للون الأبيض الطبيعي
    if (isText) {
      itemRef.current.classList.remove('is-hovered');
    }
  };

  return (
    <div 
      ref={itemRef} 
      // تطبيق كلاس hover-shine على النصوص فقط
      className={`hero-element ${className || ''} inline-block cursor-default transition-colors ${isText ? 'hover-shine' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
};

const Hero = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. أنيميشن الدخول
      gsap.from(".hero-element", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1, 
        ease: "power3.out",
      });

      // 2. أنيميشن صندوق البحث
      gsap.from(".bottom-element", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.8 
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-[120px] pb-16 px-6 font-sans overflow-hidden text-white flex flex-col justify-center">
      
      {/* 
        ستايل تأثير "مرور اللمعة" (Sweep Shine)
        النص في وضعه الطبيعي أبيض، وعند الهوفر يمر شعاع أحمر من اليسار لليمين
      */}
      <style>
        {`
          .hover-shine {
            color: #ffffff; /* اللون الطبيعي للنص */
            position: relative;
          }
          
          /* اللمعة تتفعل فقط عند الهوفر */
          .hover-shine.is-hovered {
            /* تدرج لوني: أبيض -> أحمر عنابي -> أبيض */
            background: linear-gradient(120deg, #ffffff 30%, #8b151a 50%, #ffffff 70%);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            /* أنيميشن يمرر اللمعة بسرعة 1.2 ثانية وتتكرر طوال فترة الهوفر */
            animation: sweep-shine 1.2s infinite linear;
          }

          @keyframes sweep-shine {
            0% {
              background-position: 200% center;
            }
            100% {
              background-position: -100% center;
            }
          }
        `}
      </style>

      {/* خلفية الفيديو */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/Video Project.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* ================= القسم العلوي ================= */}
        <div className="flex flex-col items-center justify-center text-center uppercase font-bold tracking-tighter w-full">
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 text-5xl md:text-7xl lg:text-8xl">
            <AnimatedItem className="flex items-start gap-1">
              <span>{t('home.hero.experience')}</span>
              <span className="text-xl md:text-2xl mt-1">{t('home.hero.the')}</span>
            </AnimatedItem>
            <AnimatedItem isText={false}>
              <img 
                src={gameArt('1409 - Cyberpunk 2077')} 
                alt="VR Element" 
                className="w-12 h-16 md:w-20 md:h-28 object-cover rounded-lg"
              />
            </AnimatedItem>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-2 md:mt-4 text-5xl md:text-7xl lg:text-8xl">
            <AnimatedItem isText={false}>
              <img 
                src={gameArt('1435 - Call of Duty Black Ops III + DLC')} 
                alt="VR Headset User" 
                className="w-40 h-28 md:w-64 md:h-40 object-cover rounded-2xl border border-white/5"
              />
            </AnimatedItem>
            <AnimatedItem>
              <span>{t('home.hero.nextLevel')}</span>
            </AnimatedItem>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-2 md:mt-4 text-5xl md:text-7xl lg:text-8xl">
            <AnimatedItem>
              <span>{t('home.hero.ofWireless')}</span>
            </AnimatedItem>
            <AnimatedItem isText={false}>
              <img 
                src={gameArt("2338 - Assassin's Creed II Deluxe Edition")} 
                alt="VR Action" 
                className="w-32 h-20 md:w-48 md:h-28 object-cover rounded-xl border border-white/5"
              />
            </AnimatedItem>
          </div>

        </div>

        {/* ================= القسم السفلي: صندوق البحث التكتيكي ================= */}
        <div className="relative mt-20 md:mt-24 w-full max-w-3xl mx-auto">
          
          <div className="bottom-element flex items-center gap-2 mb-3 px-2 text-[#8b151a] font-bold text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#8b151a] rounded-full animate-pulse"></span>
            {t('home.hero.searchInit')}
          </div>

          <div className="bottom-element relative group w-full h-16 md:h-20 flex bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 transition-colors duration-300 focus-within:border-[#8b151a]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#8b151a] transition-all duration-300 group-focus-within:w-16"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#8b151a]"></div>
            
            <div className="flex items-center justify-center px-4 md:px-6 text-gray-500 group-focus-within:text-[#8b151a] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input 
              type="text" 
              placeholder={t('home.hero.placeholder')} 
              className="w-full h-full bg-transparent text-white font-mono text-xs md:text-sm tracking-widest focus:outline-none placeholder-gray-600"
            />

            <button 
              className="relative h-full px-8 md:px-14 bg-[#8b151a] hover:bg-white text-white hover:text-black transition-colors duration-300 flex items-center justify-center shrink-0"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <span className="font-['Bebas_Neue',_sans-serif] text-2xl md:text-3xl tracking-widest pt-1">
                {t('home.hero.search')}
              </span>
            </button>
          </div>

          <div className="bottom-element flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{t('home.hero.popularTargets')}</span>
            {t('home.hero.tags').map((tag, idx) => (
              <button 
                key={idx} 
                className="group relative bg-[#111] border border-white/5 hover:border-transparent px-4 py-1.5 flex items-center gap-2 overflow-hidden transition-all duration-300"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b151a] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300"></span>
                <span className="text-[10px] text-gray-400 group-hover:text-white uppercase font-bold tracking-widest transition-colors z-10">
                  {tag}
                </span>
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;