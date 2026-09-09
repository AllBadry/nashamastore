export default function PageHeader({ eyebrow, title, accent, description }) {
  return (
    <div className="relative w-full pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-white overflow-hidden border-b border-neutral-100">
      <div className="absolute top-0 left-[15%] w-[8%] h-full bg-gradient-to-b from-blue-100 to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-0 left-[35%] w-[12%] h-full bg-gradient-to-b from-orange-100 via-pink-100 to-transparent opacity-50 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 right-[20%] w-[30%] h-[40%] bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row items-end justify-between gap-12">
        <div className="flex flex-col max-w-2xl">
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 font-mono">
            {eyebrow}
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-neutral-900 tracking-tight leading-[1.1]">
            {title} <br className="hidden md:block" />
            {accent && (
              <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">
                {accent}
              </span>
            )}
          </h1>
        </div>

        {description && (
          <p className="text-neutral-500 font-medium max-w-sm leading-relaxed text-sm lg:pb-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}