import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CreditCard, Wallet, BadgeCheck, ChevronLeft } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-neutral-950 text-gray-300 pt-16 pb-8 font-sans mt-20 overflow-hidden">
      
      {/* شريط علوي متدرج يضيف لمسة فخمة بدلاً من الخط الصلب */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-900 via-red-600 to-neutral-900"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* العمود الأول: الشعار الدائري ونبذة */}
          <div className="space-y-6">
            
            {/* اللوغو الدائري المضيء */}
            <Link to="/" className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full p-2.5 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:scale-105 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 border-2 border-transparent hover:border-red-500">
              <img src="/NHcom.png" alt="نشامى ستور" className="w-full h-full object-contain" />
            </Link>
            
            <p className="text-sm leading-relaxed text-neutral-400">
              نشامى ستور هو وجهتك الأولى في الأردن لأحدث الهواتف الذكية والإكسسوارات الأصلية. نضمن لك أفضل الأسعار مع كفالة الوكيل الرسمي وتجربة تسوق آمنة 100%.
            </p>
            
            {/* أيقونات التواصل الاجتماعي الدائرية */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> روابط سريعة
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { name: 'عروض وتخفيضات', path: '/offers' },
                { name: 'هواتف آيفون', path: '/brands/apple' },
                { name: 'هواتف سامسونج', path: '/brands/samsung' },
                { name: 'الساعات الذكية', path: '/category/wearables/smart-watch' },
                { name: 'الشواحن والكابلات', path: '/category/accessories/chargers' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="flex items-center gap-2 text-neutral-400 hover:text-red-500 hover:-translate-x-2 transition-all duration-300">
                    <ChevronLeft size={14} className="text-neutral-700" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: خدمة العملاء */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> خدمة العملاء
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { name: 'سياسة الإرجاع والاستبدال', path: '/return-policy' },
                { name: 'شروط الاستخدام', path: '/service-usage' },
                { name: 'تتبع طلبك', path: '/track-order' },
                { name: 'الأسئلة الشائعة', path: '/faq' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="flex items-center gap-2 text-neutral-400 hover:text-red-500 hover:-translate-x-2 transition-all duration-300">
                    <ChevronLeft size={14} className="text-neutral-700" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: تواصل معنا */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> تواصل معنا
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-colors flex-shrink-0">
                  <MapPin size={14} className="text-red-500" />
                </div>
                <span className="mt-1">الأردن، عمّان<br/>الشارع الرئيسي، مجمع نشامى</span>
              </li>
              <li className="flex items-center gap-3 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-colors flex-shrink-0">
                  <Phone size={14} className="text-red-500" />
                </div>
                <span dir="ltr" className="font-semibold text-white tracking-wider">0798500771</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer hover:text-red-500 transition-colors">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-colors flex-shrink-0">
                  <Mail size={14} className="text-red-500" />
                </div>
                <span>support@nashamastore.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* الشريط السفلي: حقوق النشر وطرق الدفع */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-sm text-neutral-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} <span className="text-white font-bold tracking-wide">نشامى ستور</span>.
          </div>

          {/* طرق الدفع المتوفرة في المتجر */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-neutral-500 ml-2 uppercase tracking-wider">طرق الدفع:</span>
            <div className="bg-neutral-900/50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-neutral-800 hover:border-neutral-700 transition-colors" title="الدفع عند الاستلام">
              <Wallet size={16} className="text-green-500" />
              <span className="text-xs font-bold text-neutral-300">كاش</span>
            </div>
            <div className="bg-neutral-900/50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-neutral-800 hover:border-neutral-700 transition-colors" title="بطاقة ائتمان">
              <CreditCard size={16} className="text-blue-500" />
              <span className="text-xs font-bold text-neutral-300">فيزا</span>
            </div>
            <div className="bg-neutral-900/50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-neutral-800 hover:border-neutral-700 transition-colors" title="ValU">
              <BadgeCheck size={16} className="text-yellow-500" />
              <span className="text-xs font-bold text-neutral-300">ValU</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}