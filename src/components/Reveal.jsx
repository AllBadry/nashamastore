import { useEffect, useRef, useState } from 'react';

// مكوّن خفيف لإظهار العنصر بحركة ناعمة عند وصوله لنافذة الرؤية
export default function Reveal({ children, className = '', delay = 0, y = 28 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? undefined : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
