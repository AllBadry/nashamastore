import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, LogIn, UserPlus,
  AlertCircle, CheckCircle2, Loader2, ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Field({ icon, label, type = 'text', value, onChange, placeholder, dir, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;

  return (
    <label className="block">
      <span className="text-sm font-bold text-neutral-700 mb-1.5 block">{label}</span>
      <div className="relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </span>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          autoComplete={autoComplete}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 pl-4 pr-12 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  );
}

export default function Login() {
  const [mode, setMode] = useState('login'); // login | signup
  const { login, signup } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
        setError('يرجى تعبئة جميع الحقول المطلوبة');
        return;
      }
      if (form.password !== form.passwordConfirm) {
        setError('كلمة المرور وتأكيدها غير متطابقين');
        return;
      }
      if (form.password.length < 8) {
        setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        return;
      }
    } else {
      if (!form.email || !form.password) {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
        setSuccess('تم إنشاء الحساب بنجاح، أهلاً بك في نشامى ستور!');
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-6 md:py-12">
      <div className="w-full max-w-md animate-fade-up">
        {/* الهيدر */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25 animate-float">
            <ShoppingBag size={30} />
          </div>
          <h1 className="text-3xl font-black text-neutral-900 mb-2">
            {mode === 'login' ? 'أهلاً بعودتك' : 'أنشئ حسابك الجديد'}
          </h1>
          <p className="text-neutral-500 font-medium">
            {mode === 'login'
              ? 'سجّل دخولك لمتابعة تسوقك والمفضلة والطلبات'
              : 'انضم إلينا واستمتع بتجربة تسوق أفضل'}
          </p>
        </div>

        {/* التبويب */}
        <div className="grid grid-cols-2 bg-neutral-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`py-2.5 rounded-xl text-sm font-black transition-all ${
              mode === 'login'
                ? 'bg-white text-red-600 shadow'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            className={`py-2.5 rounded-xl text-sm font-black transition-all ${
              mode === 'signup'
                ? 'bg-white text-red-600 shadow'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* الرسائل */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-2xl p-4 mb-5 animate-scale-in">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 text-sm font-bold rounded-2xl p-4 mb-5 animate-scale-in">
            <CheckCircle2 size={18} className="shrink-0" /> {success}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8 space-y-4">
          {mode === 'signup' && (
            <Field
              icon={<User size={18} />}
              label="الاسم الكامل"
              value={form.name}
              onChange={set('name')}
              placeholder="مثال: أحمد محمد"
              autoComplete="name"
            />
          )}

          <Field
            icon={<Mail size={18} />}
            label="البريد الإلكتروني"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="example@email.com"
            dir="ltr"
            autoComplete="email"
          />

          {mode === 'signup' && (
            <Field
              icon={<Phone size={18} />}
              label="رقم الهاتف (اختياري)"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="079xxxxxxxx"
              dir="ltr"
              autoComplete="tel"
            />
          )}

          <Field
            icon={<Lock size={18} />}
            label="كلمة المرور"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            dir="ltr"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'signup' && (
            <Field
              icon={<Lock size={18} />}
              label="تأكيد كلمة المرور"
              type="password"
              value={form.passwordConfirm}
              onChange={set('passwordConfirm')}
              placeholder="••••••••"
              dir="ltr"
              autoComplete="new-password"
            />
          )}

          {mode === 'signup' && (
            <p className="text-[11px] text-neutral-400 font-medium">
              كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل مع حرف كبير وحرف صغير ورقم ورمز خاص
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : mode === 'login' ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 font-medium mt-6">
          بمتابعتك، أنت توافق على{' '}
          <Link to="/service-usage" className="text-red-600 hover:underline font-bold">شروط الاستخدام</Link>
          {' '}و{' '}
          <Link to="/return-policy" className="text-red-600 hover:underline font-bold">سياسة الخصوصية</Link>
        </p>
      </div>
    </div>
  );
}
