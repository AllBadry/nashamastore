import Reveal from './Reveal';

export default function InfoPage({ eyebrow, title, accent, description, sections }) {
  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      <div className="relative w-full pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-white overflow-hidden border-b border-neutral-100">
        <div className="absolute top-0 left-[15%] w-[8%] h-full bg-gradient-to-b from-blue-100 to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-0 left-[35%] w-[12%] h-full bg-gradient-to-b from-orange-100 via-pink-100 to-transparent opacity-50 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[40%] bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="flex flex-col max-w-2xl">
            <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 font-mono">{eyebrow}</span>
            <h1 className="text-5xl md:text-6xl font-light text-neutral-900 tracking-tight leading-[1.1]">
              {title} <br className="hidden md:block" />
              {accent && (
                <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">{accent}</span>
              )}
            </h1>
          </div>
          {description && (
            <p className="text-neutral-500 font-medium max-w-sm leading-relaxed text-sm lg:pb-2">{description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <Reveal
              key={section.title}
              delay={i * 80}
              className={section.full ? 'md:col-span-2' : ''}
            >
              <div className={`bg-white rounded-[2rem] border border-neutral-100 p-8 md:p-10 h-full ${section.full ? '' : 'hover:border-neutral-300 transition-colors'}`}>
                <div className="flex items-start gap-4 mb-5">
                  <span className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 tracking-tight pt-2">{section.title}</h2>
                </div>
                {Array.isArray(section.body) ? (
                  <ul className="space-y-3">
                    {section.body.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-neutral-600 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-600 text-sm leading-relaxed">{section.body}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}