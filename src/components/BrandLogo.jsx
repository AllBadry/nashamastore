import { useState } from 'react';
import { Store, Zap, Smartphone, Watch, AudioLines, Battery, Cpu, Headphones } from 'lucide-react';

// الشعارات المتوفرة محلياً في مجلد public/brands
const LOCAL_ICONS = {
  acer: 'acer.svg',
  amazon: 'amazon.svg',
  anker: 'anker.svg',
  apple: 'apple.svg',
  asus: 'asus.svg',
  baseus: 'baseus.png',
  belkin: 'belkin.svg',
  canon: 'canon.svg',
  choetech: 'choetech.png',
  doogee: 'doogee.png',
  dyson: 'dyson.svg',
  gopro: 'gopro.svg',
  'green-universal-': 'green-universal-.png',
  'harman-kardon': 'harman-kardon.svg',
  hifuture: 'hifuture.png',
  honor: 'honor.svg',
  hp: 'hp.svg',
  huawei: 'huawei.svg',
  hyperx: 'hyperx.svg',
  infinix: 'infinix.svg',
  insta360: 'insta360.svg',
  jbl: 'jbl.svg',
  joyroom: 'joyroom.png',
  kieslect: 'kieslect.png',
  lenovo: 'lenovo.svg',
  motorola: 'motorola.svg',
  nokia: 'nokia.svg',
  ravpower: 'ravpower.png',
  realme: 'realme.svg',
  'remax-': 'remax-.svg',
  samsung: 'samsung.svg',
  sigma: 'sigma.svg',
  sony: 'sony.svg',
  soundcore: 'soundcore.png',
  tecno: 'tecno.svg',
  'tp-link': 'tplink.svg',
  whoop: 'whoop.svg',
  wiwu: 'wiwu.png',
  xiaomi: 'xiaomi.svg',
  'nikon-': 'nikon.svg',
};

// أيقونات معبّرة للماركات التي لا تملك شعاراً محلياً
const BRAND_ICONS = {
  baseus: <Zap size={24} strokeWidth={1.8} />,
  choetech: <Zap size={24} strokeWidth={1.8} />,
  coteci: <Smartphone size={24} strokeWidth={1.8} />,
  joyroom: <AudioLines size={24} strokeWidth={1.8} />,
  kieslect: <Watch size={24} strokeWidth={1.8} />,
  momax: <Battery size={24} strokeWidth={1.8} />,
  others: <Store size={24} strokeWidth={1.8} />,
  powerology: <Zap size={24} strokeWidth={1.8} />,
  ravpower: <Battery size={24} strokeWidth={1.8} />,
  wiwu: <Cpu size={24} strokeWidth={1.8} />,
  yesido: <Headphones size={24} strokeWidth={1.8} />,
};

const FALLBACK_ICON = <Store size={24} strokeWidth={1.8} />;

// مكوّن يعرض شعار الماركة المحلي أو أيقونة معبّرة عند غيابه
export default function BrandLogo({ name, slug, size = 64, className = '' }) {
  const [failed, setFailed] = useState(false);
  const file = LOCAL_ICONS[slug];
  const fallbackIcon = BRAND_ICONS[slug] || FALLBACK_ICON;

  if (!file || failed) {
    return (
      <span
        className={`flex items-center justify-center leading-none select-none ${className}`}
        style={{ fontSize: size * 0.4 }}
      >
        {fallbackIcon}
      </span>
    );
  }

  return (
    <img
      src={`/brands/${file}`}
      alt={name}
      style={{ width: size * 0.75, height: size * 0.75 }}
      loading="lazy"
      onError={() => setFailed(true)}
      className="select-none"
      draggable={false}
    />
  );
}
