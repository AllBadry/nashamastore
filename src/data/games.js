import { assetUrl } from './gamesCatalog';

const IMG = (name) => `games/${encodeURIComponent(name).replace(/%2B/g, '+')}`;

export const IMG_FALLBACK = IMG('2587 - Red Dead Redemption 2');

export const art = {
  redDead2: IMG('2587 - Red Dead Redemption 2'),
  cyberpunk: IMG('1409 - Cyberpunk 2077'),
  eldenRing: IMG('2289 - Elden Ring'),
  hogwarts: IMG('2285 - Hogwarts Legacy'),
  baldursGate3: IMG("2610 - Baldur's Gate 3"),
  blackMyth: IMG('2043 - Black Myth Wukong'),
  ghostTsushima: IMG("2353 - Ghost of Tsushima Director's Cut"),
  spiderman2: IMG("2384 - Marvel's Spider-Man 2"),
  dyingLight2: IMG('2302 - Dying Light 2 Stay Human Reloaded Edition'),
  starfield: IMG('2519 - Starfield'),
  acMirage: IMG("1540 - Assassin's Creed Mirage"),
  tlou1: IMG('1465 - The Last of Us Part I'),
  gtaV: IMG('1773 - Grand Theft Auto V'),
  cs2: IMG('2087 - Counter Strike Condition Zero'),
  forza: IMG('2549 - Forza Horizon 5'),
  skyrim: IMG('2210 - The Elder Scrolls V Skyrim Special Edition'),
  gothamKnights: IMG('2588 - Gotham Knights'),
  acII: IMG("2338 - Assassin's Creed II Deluxe Edition"),
  witcher2: IMG("1772 - The Witcher 2 Assassin's of Kings Enhanced Edition"),
  earthDefense: IMG('2336 - Age of Empires Definitive Edition'),
  loginbanner: 'loginbanner',
};

// art يُنتج مساراً نسبياً بلا امتداد، فيُرجع الخادم صفحة HTML بدل الصورة.
// استخدم cover للحصول على مسار صورة صحيح (متوافق مع base + .jpg).
export const cover = (key) => assetUrl(`${art[key]}.jpg`);

export const heroArt = [
  { src: art.redDead2, title: 'Red Dead Redemption 2', tag: 'Open World' },
  { src: art.cyberpunk, title: 'Cyberpunk 2077', tag: 'Action RPG' },
  { src: art.eldenRing, title: 'Elden Ring', tag: 'Souls Like' },
  { src: art.starfield, title: 'Starfield', tag: 'Space RPG' },
  { src: art.blackMyth, title: 'Black Myth: Wukong', tag: 'Action' },
];

export const marqueeItems = [
  'Cyberpunk 2077',
  'Elden Ring',
  'Red Dead Redemption 2',
  "Baldur's Gate 3",
  'Black Myth: Wukong',
  'Ghost of Tsushima',
  'Hogwarts Legacy',
  'Starfield',
  "Marvel's Spider-Man 2",
  "Assassin's Creed Mirage",
  'Dying Light 2',
  'Grand Theft Auto V',
  'Skyrim Special Edition',
  'The Last of Us Part I',
  'Xbox Game Pass',
  'PlayStation Plus',
];

export const categories = [
  {
    key: 'games',
    title: 'Games',
    ar: 'ألعاب',
    desc: 'Full PC & console game keys delivered instantly to your library.',
    count: '1,200+ titles',
    art: art.redDead2,
    accent: '#ef4444',
  },
  {
    key: 'subscriptions',
    title: 'Subscriptions',
    ar: 'اشتراكات',
    desc: 'Game Pass, PS Plus, Spotify, Netflix & more. Instant activation.',
    count: '40+ services',
    art: art.starfield,
    accent: '#ff2d55',
  },
  {
    key: 'accounts',
    title: 'Accounts',
    ar: 'حسابات',
    desc: 'Ready accounts with full email access & lifetime warranty.',
    count: '500+ in stock',
    art: art.spiderman2,
    accent: '#ff6b35',
  },
  {
    key: 'skins',
    title: 'Skins & Cosmetics',
    ar: 'سكنات',
    desc: 'Rare skins, battle passes & in-game currency at the best prices.',
    count: 'Rare drops',
    art: art.blackMyth,
    accent: '#f59e0b',
  },
  {
    key: 'credits',
    title: 'Credits & Codes',
    ar: 'شحن ورصيد',
    desc: 'Gift cards, wallet top-ups and DLC codes for every platform.',
    count: 'Instant codes',
    art: art.gtaV,
    accent: '#ec4899',
  },
];

export const featuredGames = [
  {
    title: 'Red Dead Redemption 2',
    tag: 'Open World',
    price: '$22.99',
    old: '$59.99',
    rating: 9.6,
    art: art.redDead2,
  },
  {
    title: 'Cyberpunk 2077',
    tag: 'RPG',
    price: '$19.99',
    old: '$59.99',
    rating: 9.4,
    art: art.cyberpunk,
  },
  {
    title: 'Elden Ring',
    tag: 'Souls Like',
    price: '$31.99',
    old: '$59.99',
    rating: 9.8,
    art: art.eldenRing,
  },
  {
    title: "Baldur's Gate 3",
    tag: 'CRPG',
    price: '$39.99',
    old: '$59.99',
    rating: 9.7,
    art: art.baldursGate3,
  },
  {
    title: 'Black Myth: Wukong',
    tag: 'Action',
    price: '$32.99',
    old: '$59.99',
    rating: 9.3,
    art: art.blackMyth,
  },
  {
    title: 'Hogwarts Legacy',
    tag: 'Adventure',
    price: '$24.99',
    old: '$69.99',
    rating: 9.1,
    art: art.hogwarts,
  },
  {
    title: 'Ghost of Tsushima',
    tag: 'Open World',
    price: '$26.99',
    old: '$69.99',
    rating: 9.5,
    art: art.ghostTsushima,
  },
  {
    title: "Marvel's Spider-Man 2",
    tag: 'Action',
    price: '$30.99',
    old: '$69.99',
    rating: 9.4,
    art: art.spiderman2,
  },
  {
    title: 'Dying Light 2 Stay Human',
    tag: 'Survival',
    price: '$17.99',
    old: '$59.99',
    rating: 8.9,
    art: art.dyingLight2,
  },
  {
    title: 'Starfield',
    tag: 'Space RPG',
    price: '$19.99',
    old: '$69.99',
    rating: 8.7,
    art: art.starfield,
  },
  {
    title: "Assassin's Creed Mirage",
    tag: 'Stealth',
    price: '$18.99',
    old: '$49.99',
    rating: 8.8,
    art: art.acMirage,
  },
  {
    title: 'The Last of Us Part I',
    tag: 'Survival',
    price: '$23.99',
    old: '$59.99',
    rating: 9.6,
    art: art.tlou1,
  },
];

export const plans = [
  {
    name: 'Game Pass Ultimate',
    type: 'Monthly',
    price: '12',
    period: 'month',
    art: art.starfield,
    features: ['PC + Console + Cloud', 'Day-1 Game releases', 'EA Play included', 'Online multiplayer'],
    popular: false,
  },
  {
    name: 'PlayStation Plus',
    type: 'Premium',
    price: '16',
    period: 'month',
    art: art.ghostTsushima,
    features: ['Monthly games catalog', 'Cloud streaming', 'Exclusive discounts', '400+ titles'],
    popular: true,
  },
  {
    name: 'Xbox Game Pass Year',
    type: 'Yearly',
    price: '129',
    period: 'year',
    art: art.redDead2,
    features: ['Best value per month', 'All Ultimate perks', '12 months coverage', 'Priority support'],
    popular: false,
  },
];

export const platforms = [
  'Steam',
  'Xbox',
  'PlayStation',
  'Nintendo',
  'Epic Games',
  'Battle.net',
  'Riot Games',
  'Ubisoft',
  'Electronic Arts',
  'Minecraft',
];