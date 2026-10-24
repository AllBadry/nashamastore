import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import AuthField from '../components/auth/AuthField';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import apiClient from '../api/client'; // استدعاء عميل الـ API
import { cover } from '../data/games';
import { storeAuth } from '../lib/authState';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // حركة الدخول للصفحة (GSAP)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-panel', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' });
      gsap.from('.login-field', { y: 26, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.15 });
      gsap.from('.login-visual', { opacity: 0, scale: 1.08, duration: 1.6, ease: 'power3.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // بارالاكس للصورة الجانبية
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.to('.login-visual img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = t('auth.errors.emailRequired');
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = t('auth.errors.emailInvalid');
    }

    if (!password) {
      next.password = t('auth.errors.passwordRequired');
    } else if (password.length < 8) {
      next.password = t('auth.errors.passwordShort');
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice('');

    if (!validate()) return;

    setLoading(true);

    try {
      // إرسال الطلب للباك إند الفعلي
      const response = await apiClient.post('/auth/login', { 
        email: email.trim(), 
        password 
      });

      // حفظ الـ Access Token (الـ Refresh Token يُحفظ تلقائياً في الـ Cookies)
      const { accessToken, data } = response.data;
      storeAuth({ accessToken, user: data.user });

      setNotice(t('auth.success'));
      
      // توجيه المستخدم إلى لوحة التحكم
      setTimeout(() => navigate('/dashboard'), 500);

    } catch (error) {
      // التقاط رسائل الخطأ من الباك إند (مثل: البريد خاطئ، الحساب مقفول)
      const errorMessage = error.response?.data?.message || t('auth.errorGeneric');
      setNotice(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setNotice(t('auth.notReady')); // يمكن ربطها لاحقاً بـ Firebase أو Google OAuth
  };

  const notReadyNotice = () => {
    setNotice(t('auth.notReady'));
  };

  return (
    <section ref={sectionRef} className="relative bg-[#05060a] min-h-screen pt-28 pb-20 overflow-hidden font-sans" dir="rtl">
      {/* توهج خلفي */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.18),transparent_65%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          
          {/* ===== النموذج ===== */}
          <div className="login-panel bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 md:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.85)] flex flex-col justify-center">
            <span className="inline-flex items-center gap-3 text-[#8b151a] font-bold tracking-[0.2em] uppercase text-[10px]">
              <span className="w-8 h-px bg-[#8b151a]"></span>
              {t('auth.overline') || 'بوابة الدخول'}
            </span>

            <h1 className="font-black text-4xl sm:text-5xl text-white mt-5 tracking-tight">
              {t('auth.title') || 'مرحباً بعودتك'}
            </h1>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed font-medium">
              {t('auth.subtitle') || 'سجل دخولك الآن للوصول إلى مكتبة ألعابك ومتابعة أحدث العروض.'}
            </p>

            {/* Google */}
            <div className="login-field mt-8">
              <GoogleAuthButton onClick={handleGoogle} label={t('auth.google') || 'المتابعة باستخدام Google'} />
            </div>

            {/* فاصل */}
            <div className="login-field flex items-center gap-4 my-7">
              <span className="h-px flex-1 bg-white/10"></span>
              <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold">
                {t('auth.divider') || 'أو باستخدام البريد'}
              </span>
              <span className="h-px flex-1 bg-white/10"></span>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="login-field">
                <AuthField
                  id="email"
                  label={t('auth.email') || 'البريد الإلكتروني'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <AuthField
                  id="password"
                  label={t('auth.password') || 'كلمة المرور'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  error={errors.password}
                  autoComplete="current-password"
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>

              {/* تذكرني + نسيت كلمة المرور */}
              <div className="login-field flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#8b151a] cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-medium">{t('auth.remember') || 'تذكرني'}</span>
                </label>

                <button type="button" onClick={notReadyNotice} className="text-xs font-bold text-[#8b151a] hover:text-[#ef4444] transition-colors">
                  {t('auth.forgot') || 'نسيت كلمة المرور؟'}
                </button>
              </div>

              {/* رسالة الخطأ أو النجاح */}
              {notice && (
                <div className={`login-field rounded-xl border px-4 py-3 text-xs leading-relaxed font-bold ${
                  notice === t('auth.success') 
                    ? 'border-green-500/40 bg-green-500/10 text-green-400' 
                    : 'border-[#8b151a]/40 bg-[#8b151a]/10 text-[#fca5a5]'
                }`}>
                  {notice}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="login-field w-full py-4 rounded-xl bg-gradient-to-r from-[#8b151a] to-[#ef4444] text-white font-bold shadow-lg hover:shadow-[#8b151a]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (t('auth.submitting') || 'جاري التحقق...') : (t('auth.submit') || 'تسجيل الدخول')}
              </button>
            </form>

            {/* إنشاء حساب */}
            <div className="login-field mt-7 pt-6 border-t border-white/10">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/15 text-white/90 text-sm font-bold hover:border-[#8b151a]/70 hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0112 21.75c-2.973 0-5.703-1.268-7.628-2.515z" />
                </svg>
                {t('auth.create') || 'أنشئ حساباً جديداً'}
              </Link>
              <p className="text-[11px] text-gray-500 font-medium text-center mt-3">
                {t('auth.noAccount') || 'ليس لديك حساب؟'}
              </p>
            </div>
          </div>

          {/* ===== الجانب البصري (البوستر) ===== */}
          <div className="login-visual relative hidden lg:block rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.85)]">
            <div className="absolute inset-0 -top-[12%] h-[124%]">
              <img
                src={cover('loginbanner')}
                alt="Gaming background"
                className="w-full h-full object-cover will-change-transform"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/50 to-transparent"></div>

            <div className="relative h-full flex flex-col justify-end p-10 z-10">
              <span className="text-[10px] tracking-[0.2em] font-bold text-[#ef4444] bg-white/10 backdrop-blur-md w-max px-3 py-1 rounded-full uppercase mb-4">
                {t('auth.visual.brand')}
              </span>

              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                {t('auth.visual.titleTop')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-[#8b151a]">
                  {t('auth.visual.titleBottom')}
                </span>
              </h2>

              <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
                {t('auth.visual.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;