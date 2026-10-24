import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import apiClient from '../../api/client';
import AuthField from '../auth/AuthField';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Settings = ({ user, onLogout }) => {
  const { t } = useLang();
  const ref = useRef(null);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('error');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const nextErr = {};
    if (!current) nextErr.current = t('auth.errors.passwordRequired');
    if (!next) nextErr.next = t('auth.errors.passwordRequired');
    else if (!PASSWORD_PATTERN.test(next)) nextErr.next = t('auth.errors.passwordWeak');
    if (!confirm) nextErr.confirm = t('auth.errors.confirmRequired');
    else if (confirm !== next) nextErr.confirm = t('auth.errors.confirmMismatch');
    setErrors(nextErr);
    return Object.keys(nextErr).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiClient.patch('/auth/update-password', {
        currentPassword: current,
        newPassword: next,
        newPasswordConfirm: confirm,
      });

      const token = response.data?.accessToken;
      if (token) localStorage.setItem('accessToken', token);

      setNotice(t('dashboard.settings.saved'));
      setNoticeType('success');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (error) {
      setNotice(error.response?.data?.message || t('dashboard.settings.errGeneric'));
      setNoticeType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="space-y-6">
      <div className="dash-in">
        <h2 className="font-black text-2xl text-white">{t('dashboard.settings.title')}</h2>
      </div>

      <div className="dash-in rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-bold text-white mb-4">{t('dashboard.settings.profile')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs font-bold text-gray-500">{t('dashboard.settings.nameLabel')}</span>
            <span className="block text-sm font-bold text-white mt-1">{user?.name}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-500">{t('dashboard.settings.emailLabel')}</span>
            <span className="block text-sm font-bold text-white/90 mt-1">{user?.email}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="dash-in space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-bold text-white">{t('dashboard.settings.passwordTitle')}</h3>

        <AuthField
          id="current-password"
          label={t('dashboard.settings.current')}
          type={showCurrent ? 'text' : 'password'}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="••••••••"
          error={errors.current}
          autoComplete="current-password"
          onToggle={() => setShowCurrent((v) => !v)}
        />

        <div>
          <AuthField
            id="new-password"
            label={t('dashboard.settings.new')}
            type={showNext ? 'text' : 'password'}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="••••••••"
            error={errors.next}
            autoComplete="new-password"
            onToggle={() => setShowNext((v) => !v)}
          />
          <p className="mt-1.5 text-[10px] text-gray-500">{t('dashboard.settings.hint')}</p>
        </div>

        <AuthField
          id="confirm-password"
          label={t('dashboard.settings.confirmNew')}
          type={showConfirm ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          error={errors.confirm}
          autoComplete="new-password"
          onToggle={() => setShowConfirm((v) => !v)}
        />

        {notice && (
          <div
            className={`rounded-xl border px-4 py-3 text-xs leading-relaxed font-bold ${
              noticeType === 'success'
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : 'border-[#8b151a]/40 bg-[#8b151a]/10 text-[#fca5a5]'
            }`}
          >
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? t('dashboard.settings.saving') : t('dashboard.settings.save')}
        </button>
      </form>

      <button
        type="button"
        onClick={onLogout}
        className="dash-in w-full py-3.5 rounded-xl border border-[#ef4444]/40 text-[#fca5a5] text-sm font-bold hover:bg-[#ef4444]/10 transition-colors"
      >
        {t('dashboard.settings.logoutBtn')}
      </button>
    </div>
  );
};

export default Settings;