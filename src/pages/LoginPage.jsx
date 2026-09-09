import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus,
  ShieldCheck, Truck, RotateCcw, Check,
} from 'lucide-react';

const USERS_KEY = 'nashama_users';
const SESSION_KEY = 'nashama_user';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (mode === 'register' && form.name.trim().length < 3) next.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    const users = readUsers();

    if (mode === 'register') {
      if (users.some((u) => u.email === form.email)) {
        setErrors({ email: 'This email is already registered' });
        return;
      }
      const user = { name: form.name.trim(), email: form.email, phone: form.phone };
      writeUsers([...users, { ...user, password: form.password }]);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setMessage('Account created successfully!');
      setTimeout(() => navigate('/'), 800);
      return;
    }

    const found = users.find((u) => u.email === form.email && u.password === form.password);
    if (!found) {
      setErrors({ password: 'Email or password is incorrect' });
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: found.name, email: found.email, phone: found.phone }));
    setMessage('Welcome back!');
    setTimeout(() => navigate('/'), 800);
  };

  const inputClass = (err) =>
    `w-full bg-white border rounded-2xl py-4 px-5 pl-12 text-sm focus:outline-none transition-all placeholder-neutral-400 font-medium ${
      err
        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
        : 'border-neutral-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
    }`;

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 px-6 py-20 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-[15%] w-[8%] h-full bg-gradient-to-b from-blue-100 to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-0 left-[35%] w-[12%] h-full bg-gradient-to-b from-orange-100 via-pink-100 to-transparent opacity-50 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 right-[20%] w-[30%] h-[40%] bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Header */}
          <div className="px-8 md:px-12 pt-12 pb-8 bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-100">
            <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 font-mono block">
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </span>
            <h1 className="text-4xl font-light text-neutral-900 tracking-tight leading-tight">
              {mode === 'login' ? 'Sign in to' : 'Create your'} <br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">
                {mode === 'login' ? 'Nashama Store.' : 'Nashama account.'}
              </span>
            </h1>
          </div>

          {/* Mode tabs */}
          <div className="flex bg-[#F7F7F8] p-1.5 mx-8 md:mx-12 -mt-5 rounded-full relative z-10 border border-neutral-100 shadow-sm">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrors({}); setMessage(''); }}
                className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  mode === m ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 md:px-12 py-8 space-y-5">
            {message && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-sm font-bold">
                <Check size={18} /> {message}
              </div>
            )}

            {mode === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Full name" value={form.name} onChange={setField('name')} className={inputClass(errors.name)} />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="email" placeholder="Email address" value={form.email} onChange={setField('email')} className={inputClass(errors.email)} />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={setField('phone')} className={inputClass()} />
              </div>
            )}

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={setField('password')}
                className={inputClass(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {(errors.name || errors.email || errors.password) && (
              <p className="text-red-500 text-xs font-bold">
                {errors.name || errors.email || errors.password}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-neutral-900/10"
            >
              {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-center text-xs font-medium text-neutral-500">
              {mode === 'login' ? 'New to Nashama?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setMessage(''); }}
                className="text-blue-600 font-bold hover:underline"
              >
                {mode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>

        {/* Trust strip */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: 'Secure checkout' },
            { icon: Truck, label: 'Fast delivery' },
            { icon: RotateCcw, label: 'Easy returns' },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/70 border border-neutral-100 backdrop-blur-sm">
              <b.icon size={20} className="text-blue-600" />
              <span className="text-xs font-bold text-neutral-700">{b.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-xs text-neutral-400 font-medium">
          By continuing you agree to our{' '}
          <Link to="/warranty" className="text-neutral-700 underline underline-offset-2 hover:text-blue-600">Terms</Link> and{' '}
          <Link to="/shipping" className="text-neutral-700 underline underline-offset-2 hover:text-blue-600">Policies</Link>.
        </p>
      </div>
    </div>
  );
}