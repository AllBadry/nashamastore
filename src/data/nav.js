// ============================================================================
//  بيانات قائمة التنقل الرئيسية + قائمة "جميع الأقسام"
//  هذا الملف يحتوي على البنية والروابط فقط — النصوص في src/i18n
// ============================================================================

import { cover } from './games';

// الروابط الرئيسية في الشريط العلوي (بترتيبها يطابق nav.links في القاموس)
export const mainNavLinks = [
  { to: '/' },
  { to: '/games' },
  { to: '/skins' },
  { to: '/about' },
  { to: '/contact' },
];

// أقسام القائمة المنسدلة الكبيرة (النصوص تحت nav.sections.<key>)
export const megaSections = [
  { key: 'games', artKey: 'cyberpunk', to: '/games' },
  { key: 'accounts', artKey: 'spiderman2', to: '/accounts' },
  { key: 'subscriptions', artKey: 'starfield', to: '/subscriptions' },
  { key: 'skins', artKey: 'blackMyth', to: '/skins' },
  { key: 'credits', artKey: 'gtaV', to: '/credits' },
  { key: 'traders', artKey: 'eldenRing', href: '/#traders' },
];

// المنصات المدعومة داخل القائمة (أسماء علام تجارية — لا تُترجم)
export const platforms = [
  { name: 'Steam', key: 'steam' },
  { name: 'Epic Games', key: 'epic' },
  { name: 'Xbox', key: 'xbox' },
  { name: 'PlayStation', key: 'playstation' },
  { name: 'Nintendo', key: 'nintendo' },
  { name: 'Riot Games', key: 'riot' },
  { name: 'EA App', key: 'ea' },
  { name: 'Ubisoft Connect', key: 'ubisoft' },
];

// روابط سريعة داخل القائمة (نصوصها بالترتيب تحت nav.footerLinks)
export const megaFooterLinks = [
  { href: '/#offers' },
  { to: '/categories' },
  { to: '/contact' },
  { to: '/about' },
];

// الصورة المصغّرة للقسم
export const sectionArt = (key) => cover(key);