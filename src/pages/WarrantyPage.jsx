import { ShieldCheck, Headset, Wrench, BadgeCheck } from 'lucide-react';
import InfoPage from '../components/shared/InfoPage';

export default function WarrantyPage() {
  return (
    <InfoPage
      eyebrow="Warranty & Maintenance"
      title="Official"
      accent="Warranty Guaranteed."
      description="Every product we sell is 100% authentic and covered by an official dealer warranty in Jordan."
      sections={[
        {
          icon: <BadgeCheck size={20} />,
          title: '100% Authentic Products',
          body: 'All devices and accessories are sourced directly from authorized distributors, ensuring genuine products with valid serial numbers.',
        },
        {
          icon: <ShieldCheck size={20} />,
          title: 'Warranty Coverage',
          body: [
            'Smartphones & wearables: 12-month official warranty',
            'Audio devices: 6-month official warranty',
            'Accessories & cables: 3-month warranty',
          ],
        },
        {
          icon: <Wrench size={20} />,
          title: 'What We Cover',
          body: 'Manufacturing defects in workmanship and materials. Physical damage, liquid damage, and unauthorized repair are not covered.',
        },
        {
          icon: <Headset size={20} />,
          title: 'Maintenance Support',
          body: 'Our certified technicians offer after-sales maintenance and software support throughout the warranty period and beyond at competitive rates.',
        },
      ]}
    />
  );
}