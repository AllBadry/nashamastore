import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { t } = useLang();
  const { pathname } = useLocation();
  const footerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // تحديث مواضع التمرير بعد أي تغيير في المسار حتى لا تتجمد العناصر
      ScrollTrigger.refresh();

      // أنيميشن لظهور النشرة البريدية — إزاحة فقط (بدون شفافية)
      gsap.from(".newsletter-box", {
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".newsletter-box",
          start: "top 90%",
        }
      });

      // أنيميشن متتابع لأعمدة الفوتر — إزاحة فقط
      gsap.from(".footer-col", {
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-links-container",
          start: "top 85%",
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <footer ref={footerRef} className="relative pt-20 pb-8 px-4 md:px-8 font-sans border-t border-white/5 overflow-hidden">
      
      {/* ================= خلفية الفوتر (صورة Valorant) ================= */}
      {/* 1. الصورة بوضوح أعلى وبدون mix-blend المخفي */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 z-0"
        style={{ backgroundImage: "url('/valorant-bg.jpg')" }}
      ></div>
      
      {/* 2. تدرج لوني خفيف جداً (شفاف في المنتصف) ليسمح للصورة بالظهور */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-black/30 to-[#050505] z-10 pointer-events-none"></div>

      {/* 3. إضاءة حمراء خفيفة (تأكدنا من رفعها فوق الصورة بالـ z-10) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b151a]/20 blur-[120px] rounded-[100%] pointer-events-none z-10"></div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* ================= صندوق النشرة البريدية (Newsletter) ================= */}
        {/* تم تحويله إلى زجاجي (backdrop-blur) لتظهر الصورة من خلفه */}
        <div className="newsletter-box bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* تأثيرات بصرية داخل الصندوق */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b151a]/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="w-full md:w-1/2 relative z-10">
            <span className="text-[#8b151a] font-bold tracking-widest uppercase text-[10px] mb-2 block">
              {t('footer.stayUpdated')}
            </span>
            <h3 className="font-['Bebas_Neue',_sans-serif] text-4xl md:text-5xl text-white tracking-wide leading-none mb-2">
              {t('footer.newsletterTitle')}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              {t('footer.newsletterDesc')}
            </p>
          </div>

          <div className="w-full md:w-1/2 relative z-10">
            <form className="flex w-full bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden focus-within:border-[#8b151a]/50 transition-colors shadow-inner" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')} 
                className="w-full bg-transparent text-white text-sm px-6 py-4 focus:outline-none"
              />
              <button className="bg-[#8b151a] hover:bg-white hover:text-black text-white font-bold text-xs tracking-widest uppercase px-8 transition-colors duration-300">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>


        {/* ================= الروابط وأعمدة الفوتر ================= */}
        <div className="footer-links-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 relative z-10">
          
          {/* العمود الأول: معلومات المتجر والشعار */}
          <div className="footer-col lg:col-span-4 flex flex-col gap-6">
            <h2 className="font-['Bebas_Neue',_sans-serif] text-4xl tracking-widest text-white flex items-center gap-2">
              <span className="w-3 h-8 bg-[#8b151a] inline-block"></span>
              NASHAMA
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed pe-0 md:pe-12">
              {t('footer.about')}
            </p>
            
            {/* أيقونات التواصل الاجتماعي */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { name: 'Discord', path: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.445.865-.608 1.25-1.845-.276-3.68-.276-5.487 0-.164-.393-.406-.874-.618-1.25a.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056 19.908 19.908 0 005.993 3.029.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.01c.12.099.246.198.373.292a.077.077 0 01-.007.128 12.299 12.299 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029 19.839 19.839 0 006.002-3.03.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.029zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.095 2.156 2.419 0 1.333-.955 2.419-2.156 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z' },
                { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
              ].map((social, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#8b151a] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(139,21,26,0.6)] hover:-translate-y-1 backdrop-blur-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* العمود الثاني: أقسام المتجر */}
          <div className="footer-col lg:col-span-3 lg:col-start-6 flex flex-col gap-5">
            <h4 className="font-['Bebas_Neue',_sans-serif] text-2xl tracking-widest text-white">{t('footer.categoriesTitle')}</h4>
            <ul className="flex flex-col gap-3">
              {t('footer.categories').map((link, idx) => (
                <li key={idx}>
                  {link === 'عننا' || link === 'About Us' || link === 'عن نَشِمَة' || /about/i.test(link) ? (
                    <a href="/about" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8b151a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  ) : (
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8b151a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: روابط سريعة */}
          <div className="footer-col lg:col-span-2 flex flex-col gap-5">
            <h4 className="font-['Bebas_Neue',_sans-serif] text-2xl tracking-widest text-white">{t('footer.quickTitle')}</h4>
            <ul className="flex flex-col gap-3">
              {t('footer.quick').map((link, idx) => (
                <li key={idx}>
                  {link === 'تواصل معنا' || link === 'Contact' || idx === 0 ? (
                    <a href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8b151a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  ) : (
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#8b151a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: الدعم والقانونية */}
          <div className="footer-col lg:col-span-2 flex flex-col gap-5">
            <h4 className="font-['Bebas_Neue',_sans-serif] text-2xl tracking-widest text-white">{t('footer.supportTitle')}</h4>
            <ul className="flex flex-col gap-3">
              {t('footer.support').map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-[#8b151a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ================= الشريط السفلي وحقوق النشر ================= */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          
          {/* أيقونات الدفع */}
          <div className="flex items-center gap-3">
            {['VISA', 'MASTERCARD', 'PAYPAL', 'APPLE PAY'].map((payment, idx) => (
              <div key={idx} className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[9px] font-bold tracking-widest text-gray-400 cursor-default">
                {payment}
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;