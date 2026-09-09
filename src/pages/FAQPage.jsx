import { useState } from 'react';
import { Plus, MessageCircleQuestion } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Reveal from '../components/shared/Reveal';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Delivery in Amman takes 1–2 business days, and 2–4 business days for other governorates. You will receive a tracking number once your order ships.',
  },
  {
    q: 'Are your products original?',
    a: 'Yes, 100%. All products are sourced from authorized distributors and come with an official dealer warranty in Jordan.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash on delivery, credit/debit cards, and secure online payment options including valU for flexible installments.',
  },
  {
    q: 'Can I return a product if I change my mind?',
    a: 'Yes. You have 14 days to return or exchange an unused product in its original packaging. See our Returns & Exchanges page for details.',
  },
  {
    q: 'How can I track my order?',
    a: 'Use the Track Order page with the order number sent to you via SMS and email, or contact our support team for live updates.',
  },
  {
    q: 'Do you offer maintenance after purchase?',
    a: 'Our certified technicians provide after-sales maintenance and software support throughout the warranty period and beyond.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      <PageHeader
        eyebrow="Help Center"
        title="Frequently"
        accent="Asked Questions."
        description="Quick answers to the most common questions. Can't find what you're looking for? Our team is one message away."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-14">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 70}>
              <div
                className={`bg-white rounded-3xl border transition-all duration-300 ${
                  open === i ? 'border-neutral-300 shadow-[0_20px_60px_rgba(0,0,0,0.06)]' : 'border-neutral-100 hover:border-neutral-300'
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 px-8 py-6 text-left"
                >
                  <span className="text-base font-black text-neutral-900">{faq.q}</span>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      open === i ? 'bg-blue-600 text-white rotate-45' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <Plus size={18} />
                  </span>
                </button>
                {open === i && (
                  <p className="px-8 pb-7 -mt-2 text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                )}
              </div>
            </Reveal>
          ))}

          <Reveal delay={400}>
            <div className="flex flex-col items-center text-center py-12">
              <MessageCircleQuestion size={32} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-black text-neutral-900">Still have questions?</h3>
              <p className="text-neutral-500 text-sm mt-2 mb-6">Our support team responds within minutes during working hours.</p>
              <span className="inline-flex px-8 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                Contact Support
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}