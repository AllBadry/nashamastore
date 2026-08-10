import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// يمرر تلقائياً لأعلى الصفحة عند كل تنقّل بين المسارات
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
