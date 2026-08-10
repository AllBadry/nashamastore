import { RefreshCcw, Clock, ShieldCheck, PackageCheck, FileWarning, HelpCircle, PhoneCall } from 'lucide-react';
import StaticPageHeader from '../../components/StaticPageHeader';
import StaticSection from '../../components/StaticSection';
import Reveal from '../../components/Reveal';

const CONTACT_PHONE = '0798500771';

export default function ReturnPolicy() {
  return (
    <div className="space-y-8 pb-10">
      <StaticPageHeader
        icon={<RefreshCcw size={36} strokeWidth={1.5} />}
        title="سياسة الإرجاع والاستبدال"
        subtitle="نحرص في نشامى ستور على رضاك التام، لذا نوضح لك بكل شفافية ووضوح شروط وأحكام الإرجاع والاستبدال قبل إتمام طلبك."
      />

      <div className="space-y-6">
        <StaticSection
          icon={<Clock size={20} />}
          title="مدة الإرجاع والاستبدال"
          delay={0}
        >
          <p>
            يحق لك إرجاع أو استبدال أي منتج خلال <strong className="text-neutral-900">14 يوماً</strong> من تاريخ
            استلام الطلب، بشرط استيفاء جميع الشروط الموضحة في هذه السياسة.
          </p>
          <p>
            يُحتسب تاريخ بدء المدة من يوم استلامك الطلب الفعلي، ويجب إشعارنا بقرار الإرجاع قبل انتهاء هذه المدة
            إما هاتفياً أو عبر قنوات التواصل الرسمية لدينا.
          </p>
        </StaticSection>

        <StaticSection
          icon={<PackageCheck size={20} />}
          title="شروط قبول الإرجاع"
          delay={80}
        >
          <ul className="list-disc pr-6 space-y-2 marker:text-red-500">
            <li>أن يكون المنتج بحالته الأصلية دون أي خدوش أو أضرار أو آثار استخدام واضحة.</li>
            <li>أن تكون جميع الملحقات والكرتونة والبطاقات الضامنة ملحقة بالمنتج بشكل كامل.</li>
            <li>ألا يكون المنتج قد فُعل أو سُجلت عليه أي بيانات شخصية (خاصة بالساعات الذكية والأجهزة).</li>
            <li>إرفاق فاتورة الشراء أو أي إثبات صحيح للطلب (رقم الطلب يكفي).</li>
          </ul>
        </StaticSection>

        <StaticSection
          icon={<FileWarning size={20} />}
          title="الحالات التي لا يشملها الإرجاع"
          delay={160}
        >
          <ul className="list-disc pr-6 space-y-2 marker:text-red-500">
            <li>المنتجات التي تم فتح غلافها أو إتلافه أو استخدامها بخلاف المعاينة البسيطة.</li>
            <li>المنتجات المستعملة أو التي ظهرت عليها علامات استخدام واضحة.</li>
            <li>الأضرار الناتجة عن سوء الاستخدام أو التخزين غير الصحيح أو العبث بالمنتج.</li>
            <li>المنتجات التي انقضت مدة الضمان عليها أو التي أصابها الضرر بسبب الماء أو الصدمات.</li>
            <li>الإكسسوارات الاستهلاكية ومواد الحماية التي فُتح غلافها لأسباب صحية (كالسماعات داخل الأذن).</li>
          </ul>
        </StaticSection>

        <StaticSection
          icon={<RefreshCcw size={20} />}
          title="كيفية إتمام الإرجاع أو الاستبدال"
          delay={240}
        >
          <ol className="list-decimal pr-6 space-y-2 marker:font-bold marker:text-red-500">
            <li>تواصل معنا هاتفياً أو عبر الواتساب على الرقم <strong className="text-neutral-900" dir="ltr">{CONTACT_PHONE}</strong> خلال مدة الإرجاع.</li>
            <li>جهّز المنتج بحالته الأصلية مع كامل محتوياته وكرتونه.</li>
            <li>بعد فحص المنتج وقبول الإرجاع، يتم إما استبداله بمنتج آخر أو استرداد قيمته.</li>
            <li>في حال الاستبدال، يُرسل لك البديل فور توافره، أو تُرجع لك القيمة كاملة حسب اختيارك.</li>
          </ol>
        </StaticSection>

        <StaticSection
          icon={<ShieldCheck size={20} />}
          title="الضمان وكفالة الوكيل"
          delay={320}
        >
          <p>
            جميع منتجاتنا أصلية 100% وتتمتع بكفالة الوكيل الرسمي في الأردن. في حال اكتشاف عيب مصنعي خلال فترة
            الضمان، يلتزم المورد باستبدال القطعة أو إصلاحها دون أي تكلفة عليك.
          </p>
          <p>
            الضمان لا يشمل الأضرار الناتجة عن سوء الاستخدام أو الصدمات أو دخول السوائل، ويُشترط تقديم الفاتورة
            عند أي طلب ضمان.
          </p>
        </StaticSection>

        <StaticSection
          icon={<HelpCircle size={20} />}
          title="الأسئلة الشائعة حول الإرجاع"
          delay={400}
        >
          <p><strong className="text-neutral-900">كم تستغرق عملية استرداد المبلغ؟</strong></p>
          <p>
            تُعاد قيمة المبلغ لنفس وسيلة الدفع خلال مدة تتراوح بين <strong className="text-neutral-900">3 و 10 أيام عمل</strong> حسب
            شركة الدفع والبنك.
          </p>
          <p><strong className="text-neutral-900">من يتحمل تكلفة شحن الإرجاع؟</strong></p>
          <p>
            يتحمل العميل تكلفة الشحن في حال الإرجاع بدون سبب مبرر، بينما تتحمل نشامى ستور التكلفة كاملة إذا كان
            المنتج معيباً أو خطأً في الطلب.
          </p>
        </StaticSection>

        <Reveal delay={480}>
          <section className="bg-red-600 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-right">
              <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <PhoneCall size={22} />
              </span>
              <div>
                <h3 className="font-black text-lg">لديك سؤال عن سياسة الإرجاع؟</h3>
                <p className="text-white/80 text-sm font-medium">فريقنا جاهز لمساعدتك في أي وقت من 9 صباحاً حتى 10 مساءً</p>
              </div>
            </div>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="bg-white text-red-600 font-black px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors whitespace-nowrap"
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
