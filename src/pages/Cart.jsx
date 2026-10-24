import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import { hasSession } from '../lib/authState';
import CartView from '../components/cart/CartView';
import LoginRequiredModal from '../components/cart/LoginRequiredModal';

const Cart = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [loginModal, setLoginModal] = useState(false);

  useEffect(() => {
    document.title = `${t('cart.title')} — Nashama`;
    const ctx = gsap.context(() => {
      gsap.from('.cart-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    }, ref);
    return () => ctx.revert();
  }, [t]);

  // المسجّلون يستخدمون سلة لوحة التحكم
  if (hasSession()) {
    return <Navigate to="/dashboard?tab=cart" replace />;
  }

  return (
    <section ref={ref} dir="rtl" className="relative bg-[#05060a] min-h-screen pt-28 pb-24 overflow-hidden font-sans">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.12),transparent_65%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="cart-in mb-8">
          <span className="text-[10px] tracking-[0.35em] text-[#8b151a] uppercase font-bold">NASHAMA</span>
          <h1 className="font-['Bebas_Neue',_sans-serif] text-4xl md:text-5xl text-white tracking-wide mt-1">
            {t('cart.title')}
          </h1>
          <p className="text-gray-400 text-sm mt-2">{t('cart.subtitle')}</p>
        </div>

        <CartView onCheckout={() => setLoginModal(true)} />
      </div>

      <LoginRequiredModal open={loginModal} onClose={() => setLoginModal(false)} />
    </section>
  );
};

export default Cart;
