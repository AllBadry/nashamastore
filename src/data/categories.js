import { Smartphone, Watch, Headphones, PlugZap } from 'lucide-react';

export const categoryGroups = [
  {
    title: 'Phones',
    icon: Smartphone,
    color: 'text-[#4285F4] bg-blue-50',
    items: [
      { label: 'All Smartphones', slug: 'smartphones' },
      { label: 'Android Phones', slug: 'android' },
      { label: 'iPhone', slug: 'iphone' },
    ],
  },
  {
    title: 'Wearables',
    icon: Watch,
    color: 'text-[#EA4335] bg-red-50',
    items: [
      { label: 'Smartwatches', slug: 'smart-watch' },
      { label: 'Smartwatch Accessories', slug: 'smart-watch-accessories' },
      { label: 'Earbuds', slug: 'earbuds' },
      { label: 'Earbuds Accessories', slug: 'earbuds-accessories' },
      { label: 'Wearables Accessories', slug: 'wearables-accessories' },
    ],
  },
  {
    title: 'Accessories',
    icon: PlugZap,
    color: 'text-[#FBBC05] bg-yellow-50',
    items: [
      { label: 'Mobile Covers', slug: 'mobile-covers' },
      { label: 'Screen Protectors', slug: 'mobile-screen-protector' },
      { label: 'Chargers', slug: 'mobile-and-tablet-chargers' },
      { label: 'Cables', slug: 'mobile-and-tablet-cables' },
      { label: 'Power Banks', slug: 'power-banks' },
      { label: 'Wireless Chargers', slug: 'wireless-charger' },
      { label: 'Car Chargers', slug: 'car-charger' },
      { label: 'Type-C Chargers', slug: 'type-c-chargers' },
    ],
  },
  {
    title: 'Audio',
    icon: Headphones,
    color: 'text-[#34A853] bg-green-50',
    items: [
      { label: 'Headphones', slug: 'headphones' },
      { label: 'iPhone Chargers', slug: 'iphone-charger' },
    ],
  },
];