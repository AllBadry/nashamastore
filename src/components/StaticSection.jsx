import Reveal from './Reveal';

// قسم محتوى منسّق داخل الصفحات الثابتة
export default function StaticSection({ icon, title, children, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            {icon}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-neutral-900">{title}</h2>
        </div>
        <div className="text-neutral-600 leading-relaxed space-y-3">{children}</div>
      </section>
    </Reveal>
  );
}
