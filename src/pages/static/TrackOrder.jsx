import { useState } from 'react';
import { PackageSearch, Search, PhoneCall, PackageCheck, Truck, MapPin, AlertCircle } from 'lucide-react';
import StaticPageHeader from '../../components/StaticPageHeader';

const CONTACT_PHONE = '0798500771';

// مراحل وهمية لعرض حالة الطلب التجريبية
const DEMO_STAGES = [
  { icon: <PackageCheck size={18} />, title: 'تم استلام الطلب', desc: 'تم تأكيد طلبك ومعالجته', done: true },
  { icon: <Truck size={18} />, title: 'قيد التوصيل', desc: 'الطلب في طريقه إليك الآن', done: true },
  { icon: <MapPin size={18} />, title: 'قريب منك', desc: 'المندوب في منطقتك، استعد لاستلام الطلب', done: false },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('يرجى إدخال رقم الطلب ورقم الهاتف معاً');
      setSearched(false);
      return;
    }
    setError('');
    setSearched(true);
  };

  return (
    <div className="space-y-8 pb-10">
      <StaticPageHeader
        icon={<PackageSearch size={36} strokeWidth={1.5} />}
        title="تتبع طلبك"
        subtitle="أدخل رقم طلبك ورقم هاتفك المسجلين عند الشراء لمتابعة حالة شحنتك خطوة بخطوة."
      />

      {/* نموذج البحث عن الطلب */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label htmlFor="orderId" className="block text-sm font-bold text-neutral-700 mb-2">
              رقم الطلب
            </label>
            <input
              id="orderId"
              type="text"
              dir="ltr"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="مثال: 100245"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-neutral-700 mb-2">
              رقم الهاتف المسجل
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXX"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            <Search size={18} /> تتبع الطلب
          </button>
        </form>

        {error && (
          <div className="mt-5 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-xl px-4 py-3">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}
      </section>

      {/* نتيجة التتبع التجريبية */}
      {searched && !error && (
        <section className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-black text-neutral-900 flex items-center gap-2">
              <PackageSearch size={20} className="text-red-600" /> حالة الطلب
              <span className="text-neutral-400 font-bold text-sm" dir="ltr">#{orderId}</span>
            </h2>
            <span className="text-xs font-black bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-4 py-1.5">
              قيد التوصيل
            </span>
          </div>

          <div className="relative">
            {/* الخط الزمني */}
            <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-neutral-100"></div>

            <div className="space-y-8">
              {DEMO_STAGES.map((stage, i) => (
                <div key={i} className="relative flex items-start gap-5 pr-0">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-white ${
                      stage.done
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {stage.icon}
                  </span>
                  <div className="pt-1">
                    <h3 className={`font-black ${stage.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {stage.title}
                    </h3>
                    <p className="text-sm font-medium text-neutral-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 rounded-2xl p-5">
            <p className="text-sm font-bold text-neutral-600 text-center sm:text-right">
              لم تجد طلبك أو واجهت مشكلة في التتبع؟
            </p>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition-colors whitespace-nowrap"
              dir="ltr"
            >
              <PhoneCall size={16} /> {CONTACT_PHONE}
            </a>
          </div>
        </section>
      )}

      {/* خطوات ما بعد الشراء */}
      {!searched && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <PackageCheck size={22} />, title: 'تأكيد الطلب', desc: 'يصلك تأكيد فوري بعد إتمام الطلب ورقم متابعة خاص بك.' },
            { icon: <Truck size={22} />, title: 'الشحن والتوصيل', desc: 'نشحن طلبك خلال 24 ساعة ونصلك بسرعة داخل الأردن.' },
            { icon: <PhoneCall size={22} />, title: 'دعم المتابعة', desc: 'فريقنا يتابع شحنتك حتى تستلمها بأمان تام.' },
          ].map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-6 text-center">
              <span className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </span>
              <h3 className="font-black text-neutral-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
