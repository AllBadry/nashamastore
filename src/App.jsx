import React, { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { LanguageProvider, useLang } from './i18n';
import { hasSession, clearAuth, onAuthChange } from './lib/authState';

// تحميل كسول للصفحات: لا تدخل حزمة الـ JS إلا عند طلبها
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Games = lazy(() => import('./pages/Games'));
const Cart = lazy(() => import('./pages/Cart'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Contact = lazy(() => import('./pages/Contact'));

// إعادة الصفحة إلى أعلى القائمة عند كل انتقال بين المسارات
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

// مراقب الخمول: ينهي الجلسة محلياً بعد 15 دقيقة دون نشاط (يطابق مهلة السيرفر)
function SessionIdleWatcher() {
  useEffect(() => {
    const idleMs = (parseInt(import.meta.env.VITE_SESSION_IDLE_MINUTES, 10) || 15) * 60 * 1000;
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    let timer;
    const reset = () => {
      clearTimeout(timer);
      if (!hasSession()) return;
      timer = setTimeout(() => clearAuth(), idleMs);
    };
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    const off = onAuthChange(reset);
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      off();
    };
  }, []);
  return null;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-12 h-12 border-2 border-[#8b151a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// صفحة مؤقتة للروابط الجديدة قبل إنشاء صفحاتها الفعلية
function ComingSoon() {
  const { t } = useLang();

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center font-sans bg-[#090909]">
      <span className="text-[10px] tracking-[0.35em] text-[#8b151a] uppercase font-bold">
        NASHAMA
      </span>
      <h1 className="font-['Bebas_Neue',_sans-serif] text-5xl md:text-7xl text-white tracking-wide">
        {t('common.comingSoon')}
      </h1>
      <p className="text-gray-400 text-sm max-w-md">{t('common.comingSoonDesc')}</p>
      <Link
        to="/"
        className="mt-4 bg-[#8b151a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
      >
        {t('common.backHome')}
      </Link>
    </section>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />

        <div className="App">
          <SessionIdleWatcher />
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<ComingSoon />} />
            </Routes>
          </Suspense>

          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
