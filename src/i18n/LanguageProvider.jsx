// ============================================================================
//  Language context: state, localStorage persistence, html lang/dir, and `t()`
// ============================================================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_LANG,
  dictionaries,
  LanguageContext,
  STORAGE_KEY,
  SUPPORTED,
} from './context';

// قراءة اللغة المفضلة: المحفوظة، وإلا لغة المتصفح إن كانت مدعومة، وإلا الافتراضي
function readInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch {
    // localStorage قد يكون معطلاً (وضع التصفح الخاص) — نتجاهله بهدوء
  }

  const browser = (window.navigator?.language || '').slice(0, 2).toLowerCase();
  if (SUPPORTED.includes(browser)) return browser;

  return DEFAULT_LANG;
}

// يبحث عن قيمة نصية داخل القاموس باستخدام مسار مثل 'home.hero.search'
// يعيد المصفوفات والكائنات كما هي، وإن لم يوجد المفتاح يعيد المسار نفسه
function resolve(dictionary, path) {
  return path.split('.').reduce((node, part) => {
    if (node === null || node === undefined) return undefined;
    return node[part];
  }, dictionary);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitialLang);

  const isArabic = lang === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  // مزامنة اللغة والاتجاه مع <html> وحفظ الاختيار
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    root.setAttribute('data-lang', lang);

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // تجاهل: الحفظ ليس حرجاً لعرض الترجمة
    }
  }, [lang, dir]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = useCallback(
    (path) => {
      if (!path) return '';
      const value = resolve(dictionaries[lang], path);
      return value === undefined ? path : value;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, dir, isArabic, setLang, toggleLang, t }),
    [lang, dir, isArabic, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageProvider;
