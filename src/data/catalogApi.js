// ============================================================================
//  طبقة ربط كتالوج الألعاب بالـ API — مصدر الحقيقة هو قاعدة البيانات
//  تُحوّل استجابة الباك اند إلى الشكل الذي تتوقعه مكوّنات المتجر،
//  وتخزّن نسخة محلية كي تعمل صفحات السلة/المفضلة بدون إعادة جلب.
// ============================================================================

import apiClient from '../api/client';
import { gameCatalog, gameArt, GAME_FALLBACK } from './gamesCatalog';

const CACHE_KEY = 'nashama-catalog';

// يحوّل قيمة الصورة القادمة من الباك اند إلى رابط قابل للعرض
export const resolveImage = (image) => {
  if (!image) return GAME_FALLBACK;
  const s = String(image).trim();
  if (/^(https?:)?\/\//i.test(s) || s.startsWith('/') || s.startsWith('data:')) return s;
  return gameArt(s);
};

// يحوّل مستند اللعبة من الباك اند إلى شكل كتالوج المتجر
export const normalizeGame = (raw) => {
  const rating = Number(raw?.rating);
  const price = Number(raw?.price);
  const oldPrice = Number(raw?.oldPrice);
  const priceNC = Number(raw?.priceNC);
  return {
    id: raw?.slug || raw?.id || raw?._id,
    _id: raw?._id,
    title: raw?.title || '',
    tag: raw?.tag || '',
    rating: Number.isFinite(rating) ? rating : 0,
    price: Number.isFinite(price) ? price : 0,
    priceNC: Number.isFinite(priceNC) ? Math.max(0, Math.floor(priceNC)) : 0,
    old: Number.isFinite(oldPrice) ? oldPrice : 0,
    platforms: raw?.platform ? [raw.platform] : [],
    img: resolveImage(raw?.image),
    accountType: raw?.accountType || 'shared',
    mode: raw?.mode || 'online',
    description: raw?.description || '',
    featured: !!raw?.featured,
  };
};

export const readCatalogCache = () => {
  try {
    const value = JSON.parse(localStorage.getItem(CACHE_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writeCatalogCache = (games) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(games));
  } catch {
    /* تجاهل أخطاء التخزين */
  }
};

// جلب الألعاب من الـ API وتحويلها + تحديث النسخة المحلية
export const fetchGames = async (params = {}) => {
  const res = await apiClient.get('/games', { params: { limit: 60, ...params } });
  const raw = res.data?.data?.games || [];
  const games = raw.map(normalizeGame);
  writeCatalogCache(games);
  return {
    games,
    total: res.data?.total ?? games.length,
    pages: res.data?.pages ?? 1,
  };
};

// إيجاد لعبة محفوظة (سلة/مفضلة) بالاعتماد على النسخة المحلية ثم الكتالوج الثابت
export const findGameById = (id) => {
  if (!id) return null;
  const cached = readCatalogCache().find((g) => g.id === id || g._id === id);
  if (cached) return cached;
  return gameCatalog.find((g) => g.id === id) || null;
};
