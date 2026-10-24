// ============================================================================
//  خطّاف الوصول إلى اللغة والترجمة — ملف منفصل حتى لا يختلط بالمكونات
// ============================================================================

import { useContext } from 'react';

import { LanguageContext } from './context';

export function useLang() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLang must be used inside a LanguageProvider');
  }

  return context;
}

export default useLang;
