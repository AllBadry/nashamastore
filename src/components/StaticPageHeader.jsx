import Reveal from './Reveal';

// ترويسة موحّدة لصفحات السياسات والمعلومات (سياسة الإرجاع، الشروط، الأسئلة الشائعة...)
export default function StaticPageHeader({ icon, title, subtitle }) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-800 text-white p-8 md:p-12">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-red-600/30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-5 animate-scale-in">
            {icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
            {title}
          </h1>
          <p className="text-white/75 font-medium max-w-2xl animate-fade-up" style={{ animationDelay: '220ms' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
