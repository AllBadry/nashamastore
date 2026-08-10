import { Link } from 'react-router-dom';
import { Smartphone, Watch, Headphones, Zap, Shield } from 'lucide-react';
import Reveal from '../Reveal';

export default function FeaturedCategories() {
  // الأقسام مخصصة بالكامل للهواتف وملحقاتها فقط
  const categories = [
    { 
      name: 'هواتف آيفون', 
      path: '/brands/apple', 
      icon: <Smartphone size={32} strokeWidth={1.5} />,
      count: 'أحدث إصدارات Apple'
    },
    { 
      name: 'هواتف سامسونج', 
      path: '/brands/samsung', 
      icon: <Smartphone size={32} strokeWidth={1.5} />,
      count: 'سلسلة Galaxy الذكية'
    },
    { 
      name: 'ساعات ذكية', 
      path: '/category/wearables/smart-watch', 
      icon: <Watch size={32} strokeWidth={1.5} />,
      count: 'ساعات Apple و Kieslect'
    },
    { 
      name: 'سماعات وصوتيات', 
      path: '/category/wearables/earbuds', 
      icon: <Headphones size={32} strokeWidth={1.5} />,
      count: 'سماعات لاسلكية أصلية'
    },
    { 
      name: 'شواحن وباور بانك', 
      path: '/category/accessories/chargers', 
      icon: <Zap size={32} strokeWidth={1.5} />,
      count: 'شحن سريع آمن'
    },
    { 
      name: 'كفرات وحماية', 
      path: '/category/accessories/protection', 
      icon: <Shield size={32} strokeWidth={1.5} />,
      count: 'حماية متكاملة للشاشة'
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* عنوان القسم */}
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
                تسوق حسب القسم
              </h2>
              <p className="text-neutral-500 mt-2 font-medium">أحدث الهواتف الذكية والملحقات الأصلية بين يديك</p>
            </div>
          </div>
        </Reveal>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Reveal key={index} delay={index * 80}>
              <Link 
                to={category.path}
                className="group relative bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)] hover:border-red-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* تأثير الدائرة الحمراء في الخلفية عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* الأيقونة */}
                <div className="w-16 h-16 rounded-full bg-neutral-50 group-hover:bg-red-600 group-hover:text-white text-neutral-700 flex items-center justify-center mb-4 transition-all duration-300 relative z-10 group-hover:scale-110">
                  {category.icon}
                </div>
                
                {/* اسم القسم */}
                <h3 className="font-bold text-neutral-900 mb-1 relative z-10 group-hover:text-red-600 transition-colors text-sm md:text-base">
                  {category.name}
                </h3>
                
                {/* تفاصيل إضافية */}
                <span className="text-[11px] text-neutral-500 font-medium relative z-10">
                  {category.count}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}