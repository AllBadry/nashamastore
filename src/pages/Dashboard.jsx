import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import apiClient from '../api/client';
import DashboardNav from '../components/dashboard/DashboardNav';
import Overview from '../components/dashboard/Overview';
import Cart from '../components/dashboard/Cart';
import Orders from '../components/dashboard/Orders';
import Purchases from '../components/dashboard/Purchases';
import Favorites from '../components/dashboard/Favorites';
import Wallet from '../components/dashboard/Wallet';
import Support from '../components/dashboard/Support';
import Settings from '../components/dashboard/Settings';
import { clearAuth, hasSession } from '../lib/authState';

const TABS = ['overview', 'cart', 'orders', 'purchases', 'favorites', 'wallet', 'support', 'settings'];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const Dashboard = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const active = TABS.includes(tabParam) ? tabParam : 'overview';

  const changeTab = (key) => {
    setSearchParams(key === 'overview' ? {} : { tab: key }, { replace: true });
  };

  const user = getStoredUser();

  useEffect(() => {
    if (!hasSession() || !getStoredUser()) return;
    document.title = t('dashboard.meta.title');
    const ctx = gsap.context(() => {
      gsap.from('.dash-panel', { y: 30, duration: 0.8, ease: 'power3.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, [t]);

  const handleLogout = async () => {
    try {
      await apiClient.get('/auth/logout');
    } catch {
      /* تجاهل أخطاء الخادم عند الخروج */
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  if (!hasSession() || !user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { key: 'overview', label: t('dashboard.nav.overview') },
    { key: 'cart', label: t('dashboard.nav.cart') },
    { key: 'orders', label: t('dashboard.nav.orders') },
    { key: 'purchases', label: t('dashboard.nav.purchases') },
    { key: 'favorites', label: t('dashboard.nav.favorites') },
    { key: 'wallet', label: t('dashboard.nav.wallet') },
    { key: 'support', label: t('dashboard.nav.support') },
    { key: 'settings', label: t('dashboard.nav.settings') },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#05060a] min-h-screen pt-28 pb-20 overflow-hidden font-sans" dir="rtl">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.12),transparent_65%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="dash-panel grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">

          <aside className="lg:sticky lg:top-28">
            <div className="mb-5 px-1">
              <h1 className="font-black text-2xl text-white">
                {t('dashboard.hello')}، {user?.name?.split(' ')[0] || ''}
              </h1>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.sub')}</p>
            </div>
            <DashboardNav
              items={navItems}
              active={active}
              onChange={changeTab}
              onLogout={handleLogout}
              logoutLabel={t('dashboard.nav.logout')}
            />
          </aside>

          <main>
            {active === 'overview' && <Overview user={user} />}
            {active === 'cart' && <Cart />}
            {active === 'orders' && <Orders />}
            {active === 'purchases' && <Purchases />}
            {active === 'favorites' && <Favorites />}
            {active === 'wallet' && <Wallet />}
            {active === 'support' && <Support />}
            {active === 'settings' && <Settings user={user} onLogout={handleLogout} />}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;