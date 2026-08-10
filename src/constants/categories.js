import { Smartphone, Watch, Headphones, Zap, Shield, AudioLines, Battery, Cable } from 'lucide-react';

// دليل التصنيفات: مفتاح = slug المستخدم في الرابط (حقيقي أو افتراضي)
// apiSlugs = التصنيفات الحقيقية المسموحة في الـ API (تُرسل مفصولة بفاصلة)
// children = التصنيفات الفرعية المعروضة في القائمة
export const CATEGORY_CATALOG = {
  // الهواتف الذكية
  smartphones: {
    name: 'الهواتف الذكية',
    icon: Smartphone,
    apiSlugs: ['smartphones'],
    children: ['android', 'iphone'],
  },
  android: { name: 'هواتف أندرويد', icon: Smartphone, apiSlugs: ['android'] },
  iphone: { name: 'هواتف آيفون', icon: Smartphone, apiSlugs: ['iphone'] },

  // الأجهزة القابلة للارتداء
  wearables: {
    name: 'الأجهزة القابلة للارتداء',
    icon: Watch,
    apiSlugs: ['wearables'],
    children: ['earbuds', 'smart-watch'],
  },
  earbuds: { name: 'سماعات ايربودز', icon: AudioLines, apiSlugs: ['earbuds'] },
  'smart-watch': { name: 'ساعات ذكية', icon: Watch, apiSlugs: ['smart-watch'] },

  // الإكسسوارات (مجموعة افتراضية تجمع التصنيفات الحقيقية)
  accessories: {
    name: 'الإكسسوارات',
    icon: Zap,
    children: ['chargers', 'protection', 'headphones', 'power-banks', 'cables'],
  },
  chargers: {
    name: 'شواحن وكوابل',
    icon: Zap,
    apiSlugs: [
      'mobile-and-tablet-chargers',
      'mobile-and-tablet-cables',
      'power-banks',
      'car-charger',
      'type-c-chargers',
      'iphone-charger',
    ],
  },
  protection: {
    name: 'كفرات وحماية',
    icon: Shield,
    apiSlugs: ['mobile-covers', 'mobile-screen-protector'],
  },
  headphones: { name: 'سماعات الرأس', icon: Headphones, apiSlugs: ['headphones'] },
  'power-banks': { name: 'باور بانك', icon: Battery, apiSlugs: ['power-banks'] },
  cables: { name: 'كوابل', icon: Cable, apiSlugs: ['mobile-and-tablet-cables'] },
};

// دالة مساعدة: تُرجع معلومات قسم من slug الرابط (حقيقي أو افتراضي)
export function resolveCategory(slug) {
  return CATEGORY_CATALOG[slug] || null;
}
