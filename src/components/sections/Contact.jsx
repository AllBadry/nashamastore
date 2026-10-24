import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. أنيميشن العنوان السينمائي
      gsap.from(".contact-header", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 85%",
        }
      });

      // 2. أنيميشن معلومات التواصل (تنزلق من اليسار)
      gsap.from(infoRef.current.children, {
        x: -80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
        }
      });

      // 3. أنيميشن نموذج الاتصال (ينزلق من اليمين)
      gsap.from(formRef.current, {
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#090909] py-32 px-4 md:px-8 font-sans overflow-hidden border-t border-white/5">
      
      {/* إضاءة خلفية (Spotlight) لمركز التواصل */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8b151a]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#8b151a]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* شبكة خلفية خفيفة جداً (Grid Pattern) لتعزيز طابع الـ Sci-fi */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto relative z-20">
        
        {/* الترويسة السينمائية */}
        <div className="contact-header flex flex-col items-center text-center mb-20">
          <span className="text-[#8b151a] font-bold tracking-[0.3em] uppercase text-xs mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#8b151a] animate-pulse rounded-full"></span>
            Secure Channel Open
            <span className="w-2 h-2 bg-[#8b151a] animate-pulse rounded-full"></span>
          </span>
          <h2 className="font-['Bebas_Neue',_sans-serif] text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {t('home.contact.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#8b151a] to-red-900">
              {t('home.contact.titleAccent')}
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-4 tracking-widest uppercase">
            {t('home.contact.subtitle')}
          </p>
        </div>

        {/* تقسيم الشاشة (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* الجانب الأيسر: معلومات التواصل */}
          <div ref={infoRef} className="flex flex-col gap-6">
            
            {/* كرت الديسكورد */}
            <div className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden cursor-pointer hover:border-[#8b151a]/50 transition-colors duration-500">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#8b151a] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"></div>
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#8b151a]/20 transition-colors duration-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              </div>
              <div>
                <h4 className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1 group-hover:text-[#8b151a] transition-colors">{t('home.contact.communityLabel')}</h4>
                <p className="text-xl text-white font-bold tracking-wide">{t('home.contact.community')}</p>
              </div>
            </div>

            {/* كرت البريد الإلكتروني */}
            <div className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden cursor-pointer hover:border-[#8b151a]/50 transition-colors duration-500">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#8b151a] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom delay-75"></div>
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#8b151a]/20 transition-colors duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1 group-hover:text-[#8b151a] transition-colors">{t('home.contact.directLabel')}</h4>
                <p className="text-xl text-white font-bold tracking-wide">{t('home.contact.direct')}</p>
              </div>
            </div>

            {/* كرت أوقات العمل */}
            <div className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 flex items-center gap-6 overflow-hidden cursor-default hover:border-[#8b151a]/50 transition-colors duration-500">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#8b151a] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom delay-150"></div>
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#8b151a]/20 transition-colors duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1 group-hover:text-[#8b151a] transition-colors">{t('home.contact.uptimeLabel')}</h4>
                <p className="text-xl text-white font-bold tracking-wide">{t('home.contact.uptime')}</p>
              </div>
            </div>

          </div>


          {/* الجانب الأيمن: نموذج الاتصال (The Console) */}
          <div ref={formRef} className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* شريط زينة علوي يحاكي واجهة التطبيقات */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b151a] to-transparent opacity-50"></div>
            
            <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              
              {/* حقل الاسم */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('home.contact.nameLabel')}</label>
                <input 
                  type="text" 
                  placeholder={t('home.contact.namePlaceholder')} 
                  className="w-full bg-[#090909] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#8b151a] transition-colors"
                />
              </div>

              {/* حقل البريد */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('home.contact.emailLabel')}</label>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="w-full bg-[#090909] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#8b151a] transition-colors text-left dir-ltr"
                />
              </div>

              {/* حقل الرسالة */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('home.contact.messageLabel')}</label>
                <textarea 
                  rows="4"
                  placeholder={t('home.contact.messagePlaceholder')} 
                  className="w-full bg-[#090909] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#8b151a] transition-colors resize-none"
                ></textarea>
              </div>

              {/* زر الإرسال */}
              <button className="group relative w-full bg-[#8b151a] text-white overflow-hidden rounded-xl mt-4">
                {/* تأثير الإضاءة عند الهوفر */}
                <div className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-500 ease-out z-0"></div>
                
                <div className="relative z-10 py-5 flex items-center justify-center gap-3 group-hover:text-black transition-colors duration-500">
                  <span className="font-['Bebas_Neue',_sans-serif] text-3xl tracking-wider pt-1">
                    {t('home.contact.submit')}
                  </span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;