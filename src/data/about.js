// ============================================================================
//  بنية صفحة "من نحن" — الصور والأرقام فقط.
//  كل النصوص موجودة في src/i18n (ar.js و en.js) تحت المفتاح about
// ============================================================================

import { cover } from './games';

export { cover };

// صور الخلفية: ملفات صغيرة موجودة مباشرة في public (ليست من مجلد games)
const ROOT_IMG = (name) => `/${encodeURIComponent(name)}`;

export const aboutArt = {
  valorant: ROOT_IMG('valorant-bg.jpg'),
  fireshows: ROOT_IMG('fireshows.jpg'),
  f1: ROOT_IMG('F1 2025 - Opening Titles.jpg'),
  cypher: ROOT_IMG('Cypher valorant wallpaper pc (sinamtik).jpg'),
  champions: ROOT_IMG('VALORANT Champions _ BUCK.jpg'),
};

// طبقات الهيرو: altKey يشير إلى about.hero.layers في القاموس،
// وspeed هو مقدار الـ parallax بالنسب
export const heroLayers = [
  { key: 'valorant', src: aboutArt.valorant, altKey: 'about.hero.layers.valorant', speed: -24 },
  { key: 'fireshows', src: aboutArt.fireshows, altKey: 'about.hero.layers.fireshows', speed: -10 },
  { key: 'f1', src: aboutArt.f1, altKey: 'about.hero.layers.f1', speed: 10 },
];

// الأرقام المتحرّكة (target) مع رموزها — النصوص تحت about.stats في القاموس
export const stats = [
  { id: '01', target: 1100, suffix: '+' },
  { id: '02', target: 100, suffix: '%' },
  { id: '03', target: 24, suffix: '/7' },
  { id: '04', target: 5, prefix: '<', suffix: ' min' },
];

// المحطات: مراحل بدون تواريخ — artKey للصورة، والنصوص تحت about.timeline
export const timeline = [
  { id: '01', artKey: 'cyberpunk' },
  { id: '02', artKey: 'starfield' },
  { id: '03', artKey: 'blackMyth' },
  { id: '04', artKey: 'redDead2' },
  { id: '05', artKey: 'eldenRing' },
];

// القيم: أيقونة فقط — النصوص تحت about.values
export const values = [
  { id: '01', icon: 'shield' },
  { id: '02', icon: 'bolt' },
  { id: '03', icon: 'eye' },
  { id: '04', icon: 'headset' },
];

// شرائط الأغلفة المتحركة (شريطان يمران في اتجاهين متعاكسين)
export const showcaseBands = [
  {
    direction: -1,
    items: ['cyberpunk', 'eldenRing', 'hogwarts', 'starfield', 'gtaV', 'blackMyth'],
  },
  {
    direction: 1,
    items: ['redDead2', 'spiderman2', 'dyingLight2', 'acMirage', 'tlou1', 'witcher2'],
  },
];
