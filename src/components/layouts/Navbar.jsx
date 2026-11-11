import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n';
import { hasSession, onAuthChange } from '../../lib/authState';
import { getCartCount, onShelfChange } from '../../lib/shelf';
import NotificationBell from './NotificationBell';

// زر تبديل اللغة: يعرض اللغة الأخرى التي سيتحول إليها الموقع
const LanguageToggle = ({ compact = false }) => {
  const { isArabic, toggleLang, t } = useLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      title={t('common.toggleTitle')}
      aria-label={t('common.toggleTitle')}
      className={
        compact
          ? 'flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors'
          : 'flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold tracking-widest text-gray-300 hover:text-white hover:border-[#8b151a]/60 transition-colors duration-200'
      }
    >
      <svg
        className={compact ? 'w-5 h-5' : 'w-4 h-4'}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      <span className={compact ? 'text-[10px]' : ''}>{isArabic ? 'EN' : 'ع'}</span>
    </button>
  );
};

const HeartIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const CartIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const DashboardIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const Navbar = () => {
  const { t } = useLang();
  const [authed, setAuthed] = useState(() => hasSession());
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount);

  // متابعة حالة الجلسة: عند تسجيل الدخول/الخروج يتحدّث النافبار فوراً
  useEffect(() => onAuthChange(() => setAuthed(hasSession())), []);

  // متابعة السلة: يتحدّث العدّاد عند كل إضافة/إزالة
  useEffect(() => onShelfChange(() => setCartCount(getCartCount())), []);

  const closeAll = () => setIsOpen(false);

  // الوجهة حسب الجلسة: الزوار للصفحات المستقلة، المسجّلون للوحة التحكم
  const cartTo = authed ? '/dashboard?tab=cart' : '/cart';
  const favoritesTo = authed ? '/dashboard?tab=favorites' : '/favorites';

  const links = [
    { to: '/', name: t('nav.home') },
    { to: '/games', name: t('nav.games') },
    { to: '/about', name: t('nav.about') },
    { to: '/contact', name: t('nav.contact') },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* الشعار */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3" onClick={closeAll}>
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="font-bold text-xl tracking-widest uppercase">Nashama</span>
          </Link>

          {/* روابط الشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeAll}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* أيقونات (لغة، مفضلة، السلة، الدخول) */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageToggle />

            {authed && <NotificationBell />}

            <Link
              to={favoritesTo}
              title={t('nav.favorites')}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              <HeartIcon />
            </Link>

            <Link
              to={cartTo}
              title={t('nav.cart')}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute top-1 end-1 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {authed ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8b151a] to-[#ef4444] text-white text-xs font-bold shadow-lg hover:shadow-[#8b151a]/30 transition-all duration-200"
              >
                <DashboardIcon className="w-4 h-4" />
                <span>{t('nav.dashboard')}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8b151a] to-[#ef4444] text-white text-xs font-bold shadow-lg hover:shadow-[#8b151a]/30 transition-all duration-200"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* زر القائمة للشاشات الصغيرة */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('nav.menuClose') : t('nav.menuOpen')}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== قائمة الموبايل ===== */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[80vh] opacity-100 bg-[#0a0a0a] border-b border-white/5' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-2 pb-6 flex flex-col items-start">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeAll}
              className="block w-full text-start py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded px-3 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="w-full h-px bg-white/10 my-4"></div>

          {/* أيقونات الموبايل */}
          <div className="flex w-full items-center justify-around py-2">
            <Link
              to={favoritesTo}
              onClick={closeAll}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <HeartIcon />
              <span className="text-[10px]">{t('nav.favorites')}</span>
            </Link>

            {authed ? (
              <Link
                to="/dashboard"
                onClick={closeAll}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <DashboardIcon />
                <span className="text-[10px]">{t('nav.dashboard')}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeAll}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <UserIcon />
                <span className="text-[10px]">{t('nav.login')}</span>
              </Link>
            )}

            <Link
              to={cartTo}
              onClick={closeAll}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors relative"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -end-2 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px]">{t('nav.cart')}</span>
            </Link>

            {authed && <NotificationBell />}
            <LanguageToggle compact />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
