import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { getFavorites, getCartCount } from '../../lib/shelf';

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
};

const DashboardStat = ({ label, value, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
    <div className="flex items-center gap-2 text-gray-500 mb-2">
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

const Overview = ({ user }) => {
  const { t } = useLang();
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  const roleLabel = t(`dashboard.stats.role.${user?.role}`) || t('dashboard.stats.role.user');
  const isStaff = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div ref={ref} className="space-y-6">
      <div className="dash-in rounded-2xl border border-white/10 bg-gradient-to-br from-[#8b151a]/20 to-transparent p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-2xl text-white">{t('dashboard.overview.welcome')}</h2>
            <p className="text-sm text-gray-400 mt-1">{t('dashboard.overview.welcomeDesc')}</p>
          </div>
          {isStaff && (
            <span className="rounded-full border border-[#ef4444]/40 bg-[#ef4444]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fca5a5]">
              {t('dashboard.stats.staff')}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="dash-in">
          <DashboardStat
            label={t('dashboard.stats.favorites')}
            value={getFavorites().length}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
          />
        </div>
        <div className="dash-in">
          <DashboardStat
            label={t('dashboard.stats.cart')}
            value={getCartCount()}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
        </div>
        <div className="dash-in">
          <DashboardStat
            label={t('dashboard.stats.memberSince')}
            value={formatDate(user?.createdAt)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
          />
        </div>
        <div className="dash-in">
          <DashboardStat
            label={t('dashboard.stats.lastLogin')}
            value={formatDate(user?.lastLoginAt)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="dash-in rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-bold text-white mb-4">{t('dashboard.overview.quickTitle')}</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/games" className="rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
            {t('dashboard.overview.goBrowse')}
          </Link>
          <Link to="/dashboard?tab=cart" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors">
            {t('dashboard.overview.goCart')}
          </Link>
          <Link to="/dashboard?tab=favorites" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors">
            {t('dashboard.overview.goFav')}
          </Link>
        </div>
      </div>

      <div className="dash-in rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-wrap items-center gap-3">
        <span className="text-xs text-gray-500 font-bold">{t('dashboard.settings.nameLabel')} :</span>
        <span className="text-sm font-bold text-white">{user?.name}</span>
        <span className="mx-2 h-4 w-px bg-white/10"></span>
        <span className="text-xs text-gray-500 font-bold">{t('dashboard.settings.emailLabel')} :</span>
        <span className="text-sm font-bold text-white/90">{user?.email}</span>
        <span className="mx-2 h-4 w-px bg-white/10"></span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-300">
          {roleLabel}
        </span>
      </div>
    </div>
  );
};

export default Overview;