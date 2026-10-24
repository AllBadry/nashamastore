// ============================================================================
//  سياق اللغة والقواميس — لا يصدّر مكونات حتى يبقى Fast Refresh يعمل
// ============================================================================

import { createContext } from 'react';

import { ar } from './ar';
import { en } from './en';

export const dictionaries = { ar, en };

export const STORAGE_KEY = 'nashama-lang';
export const DEFAULT_LANG = 'ar';
export const SUPPORTED = Object.keys(dictionaries);

export const LanguageContext = createContext(null);
