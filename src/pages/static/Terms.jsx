import { FileText, ShoppingBag, CreditCard, ShieldCheck, UserCheck, Lock, Scale, Info, PhoneCall } from 'lucide-react';
import StaticPageHeader from '../../components/StaticPageHeader';
import StaticSection from '../../components/StaticSection';
import Reveal from '../../components/Reveal';

const CONTACT_PHONE = '0798500771';

export default function Terms() {
  return (
    <div className="space-y-8 pb-10">
      <StaticPageHeader
        icon={<FileText size={36} strokeWidth={1.5} />}
        title="شروط الاستخدام"
        subtitle="باستخدامك موقع نشامى ستور فإنك توافق على الشروط والأحكام التالية، لذا نرجو قراءتها بعناية قبل إتمام أي عملية شراء."
      />

      <div className="space-y-6">
        <StaticSection icon={<ShoppingBag size={20} />} title="إتمام الطلبات والدفع" delay={0}>
          <ul className="list-disc pr-6 space-y-2 marker:text-red-500">
            <li>يُعد إتمام الطلب والتأكيد عليه إقراراً منك بصحة البيانات المدخلة ودقتها.</li>
            <li>أسعار المنتجات المعروضة نهائية وتشمل ضريبة القيمة المضافة وفق الساري في المملكة الأردنية الهاشمية.</li>
            <li>نحتفظ بحق رفض أو إلغاء أي طلب في حال وجود خطأ في السعر أو توفر المنتج أو البيانات.</li>
            <li>تُحدد تكلفة التوصيل عند إتمام الطلب وتُعرض لك بوضوح قبل تأكيد الدفع.</li>
          </ul>
        </StaticSection>

        <StaticSection icon={<CreditCard size={20} />} title="وسائل الدفع" delay={80}>
          <ul className="list-disc pr-6 space-y-2 marker:text-red-500">
            <li>الدفع كاش عند الاستلام.</li>
            <li>بطاقات الائتمان والسحب (فيزا / ماستركارد) عبر بوابة دفع آمنة ومشفرة.</li>
            <li>خيارات التقسيط عبر شركائنا حسب التوافر (ValU وغيرها).</li>
            <li>لا نحتفظ بأي بيانات بطاقات ائتمانية على خوادمنا أبداً.</li>
          </ul>
        </StaticSection>

        <StaticSection icon={<UserCheck size={20} />} title="حساب العميل ومسؤوليته" delay={160}>
          <p>
            أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور الخاصة بك، وعن جميع النشاطات التي تتم من خلال
            حسابك. نرجو إشعارنا فوراً بأي استخدام غير مصرح به.
          </p>
        </StaticSection>

        <StaticSection icon={<ShieldCheck size={20} />} title="التوصيل والتسليم" delay={240}>
          <ul className="list-disc pr-6 space-y-2 marker:text-red-500">
            <li>تُشحن الطلبات داخل عمّان خلال 24 ساعة عمل من تأكيد الطلب، وإلى باقي المحافظات خلال 1-3 أيام عمل.</li>
            <li>نرجو فحص الطرد عند الاستلام قبل التوقيع على الاستلام، وإشعارنا بأي نقص أو تلف خلال 48 ساعة.</li>
            <li>لا يُعتبر الطلب مسلماً إلا بعد استلامه والتوقيع عليه من العميل أو من ينوب عنه.</li>
          </ul>
        </StaticSection>

        <StaticSection icon={<Lock size={20} />} title="الخصوصية وحماية البيانات" delay={320}>
          <p>
            نحترم خصوصيتك ولا نشارك بياناتك الشخصية مع أي جهة خارجية إلا بالقدر اللازم لتنفيذ الطلب (مثل شركات
            التوصيل). تُستخدم بياناتك فقط لتحسين تجربتك وتقديم الدعم اللازم، وفق سياسة الخصوصية السارية لدينا.
          </p>
        </StaticSection>

        <StaticSection icon={<Scale size={20} />} title="الملكية الفكرية" delay={400}>
          <p>
            جميع محتويات الموقع من نصوص وصور وعلامات تجارية وأكواد برمجية هي ملك لنشامى ستور أو لأصحابها الأصليين،
            ولا يجوز استخدامها أو نسخها أو توزيعها دون إذن كتابي مسبق.
          </p>
        </StaticSection>

        <StaticSection icon={<Info size={20} />} title="تعديل الشروط والأحكام" delay={480}>
          <p>
            نحتفظ بحق تعديل هذه الشروط في أي وقت، وتصبح التعديلات سارية بمجرد نشرها على الموقع. يُعد استمرارك
            في استخدام الموقع بعد التعديل موافقة ضمنية على الشروط المحدثة.
          </p>
        </StaticSection>

        <Reveal delay={560}>
          <section className="bg-neutral-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-right">
              <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <PhoneCall size={22} className="text-red-500" />
              </span>
              <div>
                <h3 className="font-black text-lg">تحتاج توضيحاً إضافياً حول الشروط؟</h3>
                <p className="text-neutral-400 text-sm font-medium">يسعدنا الإجابة على جميع استفساراتك</p>
              </div>
            </div>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="bg-red-600 text-white font-black px-8 py-3.5 rounded-full hover:bg-red-700 transition-colors whitespace-nowrap"
              dir="ltr"
            >
              {CONTACT_PHONE}
            </a>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
