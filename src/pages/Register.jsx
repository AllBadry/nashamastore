import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import AuthField from '../components/auth/AuthField';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import apiClient from '../api/client';
import { cover } from '../data/games';
import { storeAuth } from '../lib/authState';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// يطابق التحقق في الباك إند: حرف كبير + حرف صغير + رقم + رمز خاص (8+)
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Register = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-panel', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' });
      gsap.from('.login-field', { y: 26, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.15 });
      gsap.from('.login-visual', { opacity: 0, scale: 1.08, duration: 1.6, ease: 'power3.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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

    if (!name.trim()) {
      next.name = t('auth.errors.nameRequired');
    } else if (name.trim().length < 2) {
      next.name = t('auth.errors.nameShort');
    }

    if (!email.trim()) {
      next.email = t('auth.errors.emailRequired');
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = t('auth.errors.emailInvalid');
    }

    if (!password) {
      next.password = t('auth.errors.passwordRequired');
    } else if (!PASSWORD_PATTERN.test(password)) {
      next.password = t('auth.errors.passwordWeak');
    }

    if (!confirm) {
      next.confirm = t('auth.errors.confirmRequired');
    } else if (confirm !== password) {
      next.confirm = t('auth.errors.confirmMismatch');
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
      const response = await apiClient.post('/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirm: confirm,
      });

      const { accessToken, data } = response.data;
      storeAuth({ accessToken, user: data.user });

      setNotice(t('auth.successSignup'));

      setTimeout(() => navigate('/dashboard'), 600);
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('auth.errorGeneric');
      setNotice(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setNotice(t('auth.notReady'));
  };

  return (
    <section ref={sectionRef} className="relative bg-[#05060a] min-h-screen pt-28 pb-20 overflow-hidden font-sans" dir="rtl">
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
              {t('auth.registerTitle') || 'أنشئ حسابك'}
            </h1>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed font-medium">
              {t('auth.registerSubtitle') || 'سجّل بياناتك للانضمام إلى نشامة — تسليم فوري وعروض حصرية للأعضاء.'}
            </p>

            <div className="login-field mt-8">
              <GoogleAuthButton onClick={handleGoogle} label={t('auth.google') || 'المتابعة باستخدام Google'} />
            </div>

            <div className="login-field flex items-center gap-4 my-7">
              <span className="h-px flex-1 bg-white/10"></span>
              <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold">
                {t('auth.divider') || 'أو باستخدام البريد'}
              </span>
              <span className="h-px flex-1 bg-white/10"></span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="login-field">
                <AuthField
                  id="name"
                  label={t('auth.name') || 'الاسم الكامل'}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.namePlaceholder') || 'مثال: أحمد العمري'}
                  error={errors.name}
                  autoComplete="name"
                />
              </div>

              <div className="login-field">
                <AuthField
                  id="email"
                  label={t('auth.email') || 'البريد الإلكتروني'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder') || 'name@example.com'}
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
                  placeholder={t('auth.passwordPlaceholder') || '••••••••'}
                  error={errors.password}
                  autoComplete="new-password"
                  onToggle={() => setShowPassword((v) => !v)}
                />
                <p className="mt-1.5 text-[10px] text-gray-500">
                  {t('auth.passwordHint') || 'حرف كبير، حرف صغير، رقم ورمز خاص (8 أحرف فأكثر)'}
                </p>
              </div>

              <div className="login-field">
                <AuthField
                  id="confirm"
                  label={t('auth.confirmPassword') || 'تأكيد كلمة المرور'}
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t('auth.confirmPlaceholder') || '••••••••'}
                  error={errors.confirm}
                  autoComplete="new-password"
                  onToggle={() => setShowConfirm((v) => !v)}
                />
              </div>

              {notice && (
                <div className={`login-field rounded-xl border px-4 py-3 text-xs leading-relaxed font-bold ${
                  notice === t('auth.successSignup')
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
                {loading ? (t('auth.registerSubmitting') || 'جارٍ إنشاء الحساب…') : (t('auth.registerSubmit') || 'إنشاء الحساب')}
              </button>
            </form>

            <div className="login-field mt-7 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-400 font-medium">
                {t('auth.haveAccount') || 'لديك حساب بالفعل؟'}
                <Link to="/login" className="text-white font-bold hover:text-[#ef4444] transition-colors mr-2">
                  {t('auth.loginNow') || 'سجّل دخولك'}
                </Link>
              </span>
            </div>
          </div>

          {/* ===== الجانب البصري (البوستر) ===== */}
          <div className="login-visual relative hidden lg:block rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.85)]">
            <div className="absolute inset-0 -top-[12%] h-[124%]">
              <img
                src={cover('cyberpunk')}
                alt="Gaming background"
                className="w-full h-full object-cover will-change-transform"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/50 to-transparent"></div>

            <div className="relative h-full flex flex-col justify-end p-10 z-10">
              <span className="text-[10px] tracking-[0.2em] font-bold text-[#ef4444] bg-white/10 backdrop-blur-md w-max px-3 py-1 rounded-full uppercase mb-4">
                Nashama Store
              </span>

              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                عالمك الرقمي <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-[#8b151a]">
                  بين يديك الآن
                </span>
              </h2>

              <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
                استمتع بأسعار حصرية، تسليم فوري للمفاتيح، ودعم فني على مدار الساعة لجميع ألعابك المفضلة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;