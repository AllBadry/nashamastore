import { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircleQuestion, ShoppingCart, Truck, CreditCard, RefreshCcw, ShieldCheck } from 'lucide-react';
import StaticPageHeader from '../../components/StaticPageHeader';
import Reveal from '../../components/Reveal';

const CONTACT_PHONE = '0798500771';

const FAQ_GROUPS = [
  {
    icon: <ShoppingCart size={20} />,
    title: 'الطلبات والشراء',
    items: [
      {
        q: 'كيف أقوم بإتمام طلب شراء؟',
        a: 'اختر المنتج المناسب، أضفه إلى السلة، ثم أكمل خطوات الدفع بتعبئة بياناتك واختيار وسيلة الدفع المناسبة. يصلك تأكيد فوري برقم الطلب.',
      },
      {
        q: 'هل يمكنني تعديل أو إلغاء طلبي بعد تأكيده؟',
        a: 'نعم، يمكنك إلغاء أو تعديل الطلب قبل شحنه. تواصل معنا هاتفياً فوراً ونحن سنساعدك بكل سرعة، وإذا كان الطلب قد شحن فعلياً فيمكنك استخدام سياسة الإرجاع.',
      },
      {
        q: 'هل أستطيع الطلب عبر الهاتف؟',
        a: 'بالتأكيد، يمكنك التواصل معنا على الرقم 0798500771 وسنساعدك بإتمام طلبك مباشرة عبر الهاتف أو الواتساب.',
      },
    ],
  },
  {
    icon: <Truck size={20} />,
    title: 'الشحن والتوصيل',
    items: [
      {
        q: 'كم تستغرق مدة التوصيل؟',
        a: 'داخل عمّان يتم التوصيل خلال 24 ساعة عمل، وإلى باقي المحافظات خلال 1-3 أيام عمل من تأكيد الطلب.',
      },
      {
        q: 'كم تبلغ تكلفة التوصيل؟',
        a: 'تُعرض تكلفة التوصيل بوضوح عند إتمام الطلب، وقد توفر لدينا عروض شحن مجاني على بعض الطلبات.',
      },
      {
        q: 'كيف أتتبع طلبي؟',
        a: 'استخدم صفحة "تتبع طلبك" في الموقع بإدخال رقم الطلب ورقم هاتفك، أو تواصل معنا لمعرفة حالة شحنتك في أي وقت.',
      },
    ],
  },
  {
    icon: <CreditCard size={20} />,
    title: 'الدفع',
    items: [
      {
        q: 'ما هي وسائل الدفع المتوفرة؟',
        a: 'نوفر الدفع كاش عند الاستلام، وبطاقات الائتمان والسحب (فيزا/ماستركارد) عبر بوابة دفع آمنة، إضافة إلى خيارات التقسيط المتاحة.',
      },
      {
        q: 'هل يمكنني الدفع عند الاستلام؟',
        a: 'نعم، الدفع كاش عند الاستلام متاح لجميع مناطق التوصيل داخل الأردن.',
      },
      {
        q: 'هل بيانات بطاقتي آمنة؟',
        a: 'تماماً، تتم جميع عمليات الدفع الإلكتروني عبر بوابات دفع معتمدة ومشفرة، ولا نخزن أي بيانات بطاقات على خوادمنا.',
      },
    ],
  },
  {
    icon: <RefreshCcw size={20} />,
    title: 'الإرجاع والاستبدال',
    items: [
      {
        q: 'هل يمكنني إرجاع منتج؟',
        a: 'نعم، يحق لك الإرجاع أو الاستبدال خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون المنتج بحالته الأصلية مع كامل محتوياته. راجع صفحة سياسة الإرجاع للتفاصيل.',
      },
      {
        q: 'كم يستغرق استرداد المبلغ؟',
        a: 'تُعاد القيمة لنفس وسيلة الدفع خلال 3-10 أيام عمل حسب شركة الدفع والبنك.',
      },
      {
        q: 'من يتحمل تكلفة شحن الإرجاع؟',
        a: 'إذا كان المنتج معيباً أو الخطأ منا، نتحمل التكلفة كاملة. أما الإرجاع بدون سبب مبرر فيتحملها العميل.',
      },
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'الضمان والأصالة',
    items: [
      {
        q: 'هل جميع المنتجات أصلية؟',
        a: 'نعم، جميع منتجاتنا أصلية 100% وتتمتع بكفالة الوكيل الرسمي في الأردن.',
      },
      {
        q: 'ماذا أفعل إذا كان المنتج معيباً؟',
        a: 'تواصل معنا خلال فترة الضمان مع إرفاق الفاتورة، وسنقوم باستبدال القطعة أو إصلاحها دون أي تكلفة عليك إذا كان العيب مصنعياً.',
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (groupIdx, itemIdx) => {
    const key = `${groupIdx}-${itemIdx}`;
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-8 pb-10">
      <StaticPageHeader
        icon={<HelpCircle size={36} strokeWidth={1.5} />}
        title="الأسئلة الشائعة"
        subtitle="جمعنا لك إجابات أكثر الأسئلة تكراراً حول الطلبات والشحن والدفع والإرجاع. لم تجد إجابتك؟ فريقنا جاهز لخدمتك."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FAQ_GROUPS.map((group, groupIdx) => (
          <Reveal key={group.title} delay={groupIdx * 80}>
            <section className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  {group.icon}
                </span>
                <h2 className="text-lg md:text-xl font-black text-neutral-900">{group.title}</h2>
              </div>

              <div className="space-y-3">
                {group.items.map((item, itemIdx) => {
                  const key = `${groupIdx}-${itemIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={item.q}
                      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                        isOpen ? 'border-red-200 bg-red-50/40' : 'border-neutral-100'
                      }`}
                    >
                      <button
                        onClick={() => toggle(groupIdx, itemIdx)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-right"
                      >
                        <span className={`font-bold text-sm ${isOpen ? 'text-red-600' : 'text-neutral-800'}`}>
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-red-600' : 'text-neutral-400'
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-4 pb-4 text-sm text-neutral-600 font-medium leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* لم تجد إجابتك */}
      <Reveal delay={480}>
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-800 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-right">
            <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <MessageCircleQuestion size={22} className="text-red-400" />
            </span>
            <div>
              <h3 className="font-black text-lg">لم تجد إجابتك في الأسئلة الشائعة؟</h3>
              <p className="text-white/70 text-sm font-medium">تواصل معنا مباشرة وسنجيب على استفسارك في أسرع وقت</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="bg-white text-red-600 font-black px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors whitespace-nowrap"
              dir="ltr"
            >
              {CONTACT_PHONE}
            </a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
