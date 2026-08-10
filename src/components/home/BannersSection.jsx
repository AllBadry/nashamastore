import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Headphones, ShieldCheck, ArrowUpLeft } from 'lucide-react';

export default function BannersSection() {
  const sectionRef = useRef(null);
  const b1Ref = useRef(null);
  const b2Ref = useRef(null);
  const b3Ref = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const offset = rect.top - window.innerHeight / 2;
            
            // قمنا بتحجيم القيمة بين -1 و 1 لكي لا تخرج عن السيطرة أبداً
            const normalized = Math.max(-1, Math.min(1, offset / (window.innerHeight / 2)));

            // البنر الأول: الحد الأقصى للنزول 20 بكسل فقط
            if (b1Ref.current) {
              b1Ref.current.style.transform = `
                translate3d(0, ${normalized * 20}px, 0) 
                rotateX(${normalized * 5}deg) 
                scale(${1 - Math.abs(normalized) * 0.02})
              `;
            }
            
            // البنر الثاني: الحد الأقصى للحركة 30 بكسل
            if (b2Ref.current) {
              b2Ref.current.style.transform = `
                translate3d(0, ${normalized * 30}px, 0) 
                rotateY(${normalized * -6}deg)
              `;
            }
            
            // البنر الثالث (الذي كان يسبب المشكلة): لن يصعد أو ينزل أكثر من 30 بكسل
            if (b3Ref.current) {
              b3Ref.current.style.transform = `
                translate3d(0, ${normalized * -30}px, 0) 
                rotateY(${normalized * 6}deg)
              `;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // تم تغيير overflow-visible إلى overflow-hidden لمنع أي تداخل مع الأقسام الأخرى
    <section ref={sectionRef} className="py-24 overflow-hidden bg-neutral-50 relative">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]" style={{ perspective: '1200px' }}>
          
          {/* ======================================= */}
          {/* البنر الأول */}
          {/* ======================================= */}
          <div 
            ref={b1Ref} 
            className="lg:col-span-8 h-full transition-transform duration-[300ms] ease-out will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link
              to="/offers"
              className="group block relative w-full h-full rounded-[2.5rem] bg-neutral-950 p-10 md:p-14 overflow-hidden shadow-xl hover:shadow-[0_20px_50px_-15px_rgba(220,38,38,0.25)] transition-all duration-500 border border-neutral-900"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/30 rounded-full blur-[80px] group-hover:scale-150 transition-all duration-1000"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-red-500 border border-white/10 px-4 py-2 rounded-xl mb-6 shadow-md">
                    <Flame size={20} className="animate-pulse" />
                    <span className="text-sm font-bold tracking-wide">أقوى العروض</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] max-w-xl mb-4">
                    اكتشف صفقات الموسم <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-500 to-red-300">الاستثنائية</span>
                  </h3>
                  <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-md">
                    خصومات ضخمة على أحدث الهواتف الذكية. الكميات تنفد بسرعة!
                  </p>
                </div>
                
                <div className="mt-10 flex items-center gap-4 text-white font-black text-lg group-hover:text-red-500 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300 group-hover:-rotate-45 shadow-lg">
                    <ArrowUpLeft size={28} />
                  </div>
                  <span>تسوق العروض الآن</span>
                </div>
              </div>
            </Link>
          </div>

          {/* ======================================= */}
          {/* العمود الثاني: البنرات الصغيرة */}
          {/* ======================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* البنر الثاني (العلوي) */}
            <div 
              ref={b2Ref} 
              className="flex-1 transition-transform duration-[300ms] ease-out will-change-transform"
            >
              <Link
                to="/category/wearables/earbuds"
                className="group block relative w-full h-full rounded-[2.5rem] bg-white p-8 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-md">
                    <Headphones size={28} strokeWidth={1.5} />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-2xl font-black text-neutral-900 mb-2">الصوتيات</h3>
                    <p className="text-neutral-500 font-medium text-sm">سماعات أصلية بعزل ضوضاء فائق لتجربة استماع خيالية.</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* البنر الثالث (السفلي) */}
            <div 
              ref={b3Ref} 
              className="flex-1 transition-transform duration-[300ms] ease-out will-change-transform"
            >
              <Link
                to="/brands/apple"
                className="group block relative w-full h-full rounded-[2.5rem] bg-gradient-to-br from-red-600 to-red-800 p-8 overflow-hidden shadow-lg hover:shadow-red-600/30 transition-all duration-500"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-md">
                    <ShieldCheck size={28} strokeWidth={1.5} />
                  </div>
                  <div className="mt-8 text-white">
                    <h3 className="text-2xl font-black mb-2">كفالة الوكيل</h3>
                    <p className="text-white/90 font-medium text-sm">أجهزتك في أمان. تسوق بضمان رسمي من الوكلاء المعتمدين.</p>
                  </div>
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}