import { useState } from 'react';


// بيانات البطاقات مع إحداثيات موقعها الأساسية (لتسهيل حساب الحركة)
const cards = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
    xDesk: -26, // موقع X على الشاشات الكبيرة (بالـ rem)
    xMob: -7,   // موقع X على الموبايل
    y: 3,       // موقع Y
    rot: -15,   // زاوية الميلان الأساسية
    z: 10
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop',
    xDesk: -13,
    xMob: -3.5,
    y: -2,
    rot: 8,
    z: 20
  },
  {
    id: 3,
    title: 'Apple Watch Ultra',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop',
    xDesk: 0,
    xMob: 0,
    y: 1,
    rot: -3,
    z: 30
  },
  {
    id: 4,
    title: 'AirPods Pro',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
    xDesk: 13,
    xMob: 3.5,
    y: -1.5,
    rot: -12,
    z: 20
  },
  {
    id: 5,
    title: 'MacBook Air M2',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    xDesk: 26,
    xMob: 7,
    y: 4,
    rot: 18,
    z: 10,
    hideMobile: true
  }
];

export default function HeroSection() {
  // تتبع الـ ID الخاص بالبطاقة التي يقف عليها الماوس
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative w-full min-h-[90vh] bg-[#F8F9FA] overflow-hidden flex flex-col justify-between pt-20 pb-12">
      
      {/* الكلمة العملاقة الملونة في الخلفية */}
      <div className="absolute top-[6%] md:top-[12%] left-0 w-full flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <span className="hidden md:flex text-[1.2rem] md:text-[2rem] font-black text-neutral-800 mb-[-1.5rem] md:mb-[-3rem] z-10 bg-[#F8F9FA] px-6 py-1 rounded-full shadow-sm">
          Welcome To
        </span>
        <h1 
          className="text-[18vw] md:text-[16vw] font-black uppercase tracking-tighter drop-shadow-xl opacity-90 -mb-[12vw] md:mb-0"
          style={{ 
            background: 'linear-gradient(to right, #4285F4, #EA4335, #FBBC05, #34A853)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'gradient-shift 8s linear infinite'
          }}
        >
          NASHAMA
        </h1>
      </div>

      {/* منطقة البطاقات المتناثرة المتفاعلة */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex items-center justify-center mt-[4.5rem] md:mt-32 mb-16 px-4">
        
        {/* أسهم يدوية ورسومات (Doodles) */}
        <div className="absolute left-[5%] md:left-[10%] top-[-40px] hidden md:flex flex-col items-center z-40">
          <p className="text-sm font-mono text-neutral-600 mb-2 transform -rotate-12 bg-white/70 px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-neutral-100">أكثر من 1000 منتج</p>
          <svg width="60" height="60" viewBox="0 0 100 100" className="transform rotate-[120deg] text-neutral-400">
            <path d="M10,50 Q40,10 90,50 M80,35 L95,52 L75,65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="absolute right-[5%] md:right-[10%] bottom-[0px] hidden md:flex flex-col items-center z-40">
          <svg width="60" height="60" viewBox="0 0 100 100" className="transform -rotate-[20deg] text-neutral-400 mb-2">
            <path d="M90,50 Q60,90 10,50 M20,65 L5,48 L25,35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm font-mono text-neutral-600 transform rotate-6 bg-white/70 px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-neutral-100">عروض يومية مذهلة</p>
        </div>

        {/* مجموعة البطاقات */}
        <div className="relative flex justify-center items-center w-full h-[350px] md:h-[450px]">
          {cards.map((card) => {
            // حسابات الحركة الفيزيائية المذهلة
            let pushX = 0;
            let pushY = 0;
            let scale = 1;
            let pushRot = card.rot;
            let zIndex = card.z;
            let shadow = '0 15px 35px rgba(0,0,0,0.06)'; // ظل افتراضي

            if (hoveredCard === card.id) {
              // عندما تقف الماوس على هذه البطاقة: ترتفع، تكبر، وتستقيم
              pushX = 0;
              pushY = -4; // ترتفع للأعلى
              scale = 1.2; // تكبر بنسبة 20%
              pushRot = 0; // تستقيم تماماً
              zIndex = 100; // تأتي للمقدمة
              shadow = '0 40px 80px rgba(0,0,0,0.25)'; // ظل عميق جداً
            } else if (hoveredCard !== null) {
              // عندما تقف الماوس على بطاقة "أخرى":
              // حساب المسافة بين هذه البطاقة والبطاقة المحددة لإبعادها تدريجياً
              const diff = card.id - hoveredCard; 
              
              pushX = diff * 2.5; // كل بطاقة تبتعد بمقدار 2.5rem مضروباً في المسافة
              pushY = 1.5; // تنزل للأسفل قليلاً لتعطي المساحة للبطاقة المرتفعة
              scale = 0.92; // تصغر قليلاً
              pushRot = card.rot + (diff * 2); // يزيد ميلانها مبتعدة عن المركز
              shadow = '0 10px 20px rgba(0,0,0,0.04)'; // ظل خفيف جداً
            }

            return (
              <div 
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`polaroid-card absolute w-36 h-52 md:w-56 md:h-72 bg-white p-2 md:p-3 pb-10 md:pb-16 rounded-xl border border-neutral-100 flex flex-col cursor-pointer ${card.hideMobile ? 'hidden md:flex' : 'flex'}`}
                style={{
                  // ربط متغيرات CSS الخاصة بالحركة
                  '--x-desk': `${card.xDesk}rem`,
                  '--x-mob': `${card.xMob}rem`,
                  '--y': `${card.y}rem`,
                  '--push-x': `${pushX}rem`,
                  '--push-y': `${pushY}rem`,
                  '--push-rot': `${pushRot}deg`,
                  '--scale': scale,
                  zIndex: zIndex,
                  boxShadow: shadow,
                  // الأنيميشن الأولي لدخول البطاقات عند فتح الصفحة
                  animation: `fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${card.delay} both`
                }}
              >
                
                {/* ترويسة بولارويد صغيرة */}
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[9px] md:text-[11px] font-mono text-neutral-800 font-bold tracking-tight">NASHAMA</span>
                  <span className={`text-[7px] md:text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm transition-colors duration-500 ${hoveredCard === card.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500'}`}>
                    {card.category}
                  </span>
                </div>

                {/* منطقة الصورة الفعلية للمنتج */}
                <div className="relative flex-grow w-full overflow-hidden bg-neutral-100 rounded-md">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out"
                    style={{
                      transform: hoveredCard === card.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  {/* لمعة زجاجية تتحرك عند الهوفر */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 transition-all duration-[1s] ease-out"
                    style={{
                      opacity: hoveredCard === card.id ? 1 : 0,
                      transform: hoveredCard === card.id ? 'translateX(100%)' : 'translateX(-100%)'
                    }}
                  ></div>
                </div>

                {/* اسم المنتج في أسفل البولارويد */}
                <div className="absolute bottom-3 md:bottom-5 left-0 w-full text-center px-2">
                  <h3 className={`text-[11px] md:text-sm font-bold font-sans tracking-tight transition-colors duration-500 ${hoveredCard === card.id ? 'text-blue-600' : 'text-neutral-800'}`}>
                    {card.title}
                  </h3>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>

      

      {/* 
        إعدادات CSS المسؤولة عن النعومة (Smoothness) العالية 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .polaroid-card {
          /* المنحنى المسؤول عن السلاسة والبطء التدريجي المريح جداً للعين */
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      z-index 0s;
          /* الحسابات الدقيقة للحركة للموبايل كافتراضي */
          transform: translateX(calc(var(--x-mob) + var(--push-x)))
                     translateY(calc(var(--y) + var(--push-y)))
                     rotate(var(--push-rot))
                     scale(var(--scale));
        }

        /* الحسابات الدقيقة للحركة للشاشات الكبيرة */
        @media (min-width: 768px) {
          .polaroid-card {
            transform: translateX(calc(var(--x-desk) + var(--push-x)))
                       translateY(calc(var(--y) + var(--push-y)))
                       rotate(var(--push-rot))
                       scale(var(--scale));
          }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(80px) scale(0.8); }
          100% { opacity: 1; }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
}