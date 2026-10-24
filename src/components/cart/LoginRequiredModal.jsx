import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n';

// بوب اب يظهر للزوار عند محاولة إتمام الشراء — يطلب تسجيل الدخول
const LoginRequiredModal = ({ open, onClose }) => {
  const { t } = useLang();
  const navigate = useNavigate();

  if (!open) return null;

  const go = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0e13] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.8)] text-center">
        <div className="mx-auto w-14 h-14 rounded-full grid place-items-center bg-[#8b151a]/15 border border-[#8b151a]/30 mb-5">
          <svg className="w-7 h-7 text-[#fca5a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-white">{t('checkout.loginTitle')}</h3>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{t('checkout.loginDesc')}</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => go('/login')}
            className="w-full rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {t('checkout.goLogin')}
          </button>
          <button
            type="button"
            onClick={() => go('/register')}
            className="w-full rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors"
          >
            {t('checkout.goRegister')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors pt-1"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
