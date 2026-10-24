import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutStats from '../components/about/AboutStats';
import AboutTimeline from '../components/about/AboutTimeline';
import AboutShowcase from '../components/about/AboutShowcase';
import AboutValues from '../components/about/AboutValues';
import AboutCta from '../components/about/AboutCta';
import { useLang } from '../i18n';

const AboutUs = () => {
  const { lang } = useLang();

  // إعادة حساب مواضع ScrollTrigger بعد تحميل صور الأقسام
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('load', refresh);

    // مهلة قصيرة لتغطية الصور الكسولة
    const timer = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(timer);
    };
  }, []);

  // تبديل اللغة يغيّر طول النصوص، فيلزم تحديث مواضع المؤثرات
  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => window.clearTimeout(timer);
  }, [lang]);

  return (
    <main className="bg-[#05060a] text-white font-sans">
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutTimeline />
      <AboutShowcase />
      <AboutValues />
      <AboutCta />
    </main>
  );
};

export default AboutUs;
