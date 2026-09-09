import { RotateCcw, Store, CreditCard, Headset } from 'lucide-react';
import InfoPage from '../components/shared/InfoPage';

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Returns & Exchanges"
      title="Easy"
      accent="Hassle-Free Returns."
      description="Changed your mind? We've got you covered with a simple 14-day return and exchange policy."
      sections={[
        {
          icon: <RotateCcw size={20} />,
          title: '14-Day Return Window',
          body: 'You can return or exchange any product within 14 days of receiving it, as long as it is unused, in its original packaging, and with all accessories intact.',
        },
        {
          icon: <Store size={20} />,
          title: 'Valid Reasons',
          body: [
            'Unwanted or wrong item ordered',
            "Product doesn't match the description",
            'Damaged, defective, or faulty device',
          ],
        },
        {
          icon: <CreditCard size={20} />,
          title: 'Refunds',
          body: 'Approved refunds are processed within 3–5 business days to your original payment method. Cash payments are refunded in cash upon product pickup.',
        },
        {
          icon: <Headset size={20} />,
          title: 'How to Start a Return',
          body: 'Contact our support team with your order number, or visit any of our branches with the invoice and the product. Our team will handle the rest.',
        },
      ]}
    />
  );
}