import { Link } from 'react-router-dom';
import { Tag, Headphones, ShieldCheck, ChevronLeft, Flame } from 'lucide-react';
import Reveal from '../Reveal'; // تأكد من أن مسار الاستيراد صحيح لديك

export default function BannersSection() {
  const banners = [
    {
      title: 'عروض وتخفيضات حصرية',
      subtitle: 'خصومات نارية على أحدث الهواتف الذكية والإكسسوارات قبل نفاد الكمية',
      cta: 'اغتنم الفرصة',
      to: '/offers',
      icon: <Flame size={48} className="text-red-500" strokeWidth={1.5} />,
      bg: 'bg-neutral-950',
      border: 'border-neutral-800 hover:border-red-500/50',
      orb: 'bg-red-600/20',
      big: true,
    },
    {
      title: 'سماعات أصلية 100%',
      subtitle: 'أحدث الإصدارات بصوت نقي وعزل تام',
      cta: 'اكتشف الصوتيات',
      to: '/category/wearables/earbuds',
      icon: <Headphones size={36} className="text-white" strokeWidth={1.5} />,
      bg: 'bg-neutral-900',
      border: 'border-neutral-800 hover:border-neutral-500',
      orb: 'bg-white/5',
    },
    {
      title: 'كفالة الوكيل الرسمي',
      subtitle: 'تسوق بأمان، جميع الأجهزة مضمونة',
      cta: 'تصفح الأجهزة',
      to: '/brands/apple',
      icon: <ShieldCheck size={36} className="text-white" strokeWidth={1.5} />,
      bg: 'bg-red-950',
      border: 'border-red-900 hover:border-red-500',
      orb: 'bg-red-600/30',
    },
  ];

  return (
    <section className="py-10">
      <style>
        {`
          /* حركة الأجرام المضيئة داخل البنرات */
          @keyframes banner-orb-float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            50% { transform: translate(-30px, 20px) scale(1.5); opacity: 1; }
          }
          
          /* مرور الضوء على الزر */
          @keyframes button-shine {
            0% { left: -100%; }
            20% { left: 200%; }
            100% { left: 200%; }
          }
        `}
      </style>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, i) => (
            <Reveal key={banner.title} delay={i * 120} className={banner.big ? 'md:col-span-2' : ''}>
              <Link
                to={banner.to}
                className={`group relative overflow-hidden rounded-[2rem] ${banner.bg} border ${banner.border} text-white p-8 md:p-10 min-h-[260px] md:min-h-[300px] flex flex-col justify-between shadow-xl hover:shadow-[0_20px_50px_-15px_rgba(220,38,38,0.2)] hover:-translate-y-1.5 transition-all duration-500`}
              >
                {/* الجرم السماوي المضيء في الخلفية (Orb) */}
                <div 
                  className={`absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-150 ${banner.orb}`}
                  style={{ animation: 'banner-orb-float 8s ease-in-out infinite' }}
                ></div>
                
                {/* شبكة ناعمة للخلفية (Tech Grid) للمسة عصرية */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* الأيقونة العائمة */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-lg mb-8">
                  {banner.icon}
                </div>

                {/* المحتوى النصي والزر */}
                <div className="relative z-10 max-w-lg mt-auto">
                  <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-wide drop-shadow-md">
                    {banner.title}
                  </h3>
                  <p className="text-neutral-400 font-medium mb-8 leading-relaxed max-w-md">
                    {banner.subtitle}
                  </p>
                  
                  {/* الزر التفاعلي مع تأثير اللمعان */}
                  <span className="relative overflow-hidden inline-flex items-center gap-2 bg-white text-black font-black px-6 py-3.5 rounded-xl text-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-300 group-hover:gap-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                    {/* طبقة اللمعان المخفية التي تعبر فوق الزر */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 skew-x-[-20deg]" style={{ animation: 'button-shine 3s infinite' }}></span>
                    <span className="relative z-10">{banner.cta}</span> 
                    <ChevronLeft size={18} className="relative z-10" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}