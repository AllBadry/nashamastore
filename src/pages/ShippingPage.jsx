import { Truck, Package, Clock, MapPin, ShieldCheck } from 'lucide-react';
import InfoPage from '../components/shared/InfoPage';

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Shipping Policy"
      title="Fast &"
      accent="Reliable Delivery."
      description="We deliver across Jordan with trusted couriers. Here's everything you need to know about shipping times and costs."
      sections={[
        {
          icon: <Truck size={20} />,
          title: 'Delivery Areas',
          body: 'We deliver to all governorates across the Hashemite Kingdom of Jordan, including Amman, Zarqa, Irbid, Aqaba, and beyond.',
        },
        {
          icon: <Clock size={20} />,
          title: 'Delivery Times',
          body: [
            'Amman: 1–2 business days',
            'Other governorates: 2–4 business days',
            'Pre-orders: dispatch date stated on the product page',
          ],
        },
        {
          icon: <Package size={20} />,
          title: 'Shipping Cost',
          body: 'Free shipping on all orders. Cash on delivery is available with no extra fees.',
        },
        {
          icon: <MapPin size={20} />,
          title: 'Order Tracking',
          body: 'Once your order ships, you will receive a tracking number via SMS and email so you can follow every step of the journey.',
        },
        {
          icon: <ShieldCheck size={20} />,
          title: 'Inspection on Delivery',
          body: 'You have the right to inspect your package in front of the courier before accepting it. If anything is wrong, refuse the delivery and contact us immediately.',
          full: true,
        },
      ]}
    />
  );
}