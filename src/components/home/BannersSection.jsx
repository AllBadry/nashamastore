import { Link } from 'react-router-dom';
import { Tag, Headphones, ShieldCheck, ChevronLeft } from 'lucide-react';
import Reveal from '../Reveal';

export default function BannersSection() {
  const banners = [
    {
      title: 'عروض وتخفيضات حصرية',
      subtitle: 'خصومات كبيرة على أحدث الهواتف الذكية والإكسسوارات',
      cta: 'تسوق العروض',
      to: '/offers',
      icon: <Tag size={40} strokeWidth={1.5} />,
      className: 'from-red-600 via-red-700 to-neutral-900',
      big: true,
    },
    {
      title: 'سماعات أصلية 100%',
      subtitle: 'أحدث سماعات AirPods والأيربودز الأصلية',
      cta: 'اكتشف',
      to: '/category/wearables/earbuds',
      icon: <Headphones size={36} strokeWidth={1.5} />,
      className: 'from-neutral-900 to-neutral-700',
    },
    {
      title: 'كفالة الوكيل الرسمي',
      subtitle: 'جميع منتجاتنا أصلية ومضمونة',
      cta: 'تصفح',
      to: '/brands/apple',
      icon: <ShieldCheck size={36} strokeWidth={1.5} />,
      className: 'from-neutral-800 via-neutral-700 to-red-700',
    },
  ];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {banners.map((banner, i) => (
            <Reveal key={banner.title} delay={i * 120} className={banner.big ? 'md:col-span-2' : ''}>
              <Link
                to={banner.to}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${banner.className} text-white p-8 md:p-10 min-h-[220px] md:min-h-[260px] flex flex-col justify-between hover:shadow-[0_20px_50px_-20px_rgba(220,38,38,0.5)] hover:-translate-y-1 transition-all duration-300`}
              >
                {/* دائرة زخرفية */}
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-10 w-48 h-48 rounded-full bg-black/20 pointer-events-none"></div>

                {/* الأيقونة */}
                <div className="absolute top-8 left-8 opacity-90 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 animate-float">
                  {banner.icon}
                </div>

                {/* المحتوى */}
                <div className="relative mt-16 max-w-md">
                  <h3 className="text-2xl md:text-3xl font-black mb-3 leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-white/80 font-medium mb-6 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-full text-sm group-hover:bg-red-600 group-hover:text-white transition-colors group-hover:gap-3">
                    {banner.cta} <ChevronLeft size={16} />
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
