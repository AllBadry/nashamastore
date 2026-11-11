import React, { useState } from 'react';

const iconMap = {
  overview: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  orders: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  cart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  purchases: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  favorites: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  wallet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  ),
  support: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.232-.41.048-.821.087-1.234.117-.312.022-.618.166-.842.39l-2.121 2.121a.75.75 0 01-1.28-.53v-1.72a.75.75 0 00-.75-.75H9.75A2.25 2.25 0 017.5 14.494V10.83c0-1.136.847-2.1 1.98-2.232A48.86 48.86 0 0012 8.475" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 3.75h-8.25A2.25 2.25 0 007.5 6v3h-2.25A2.25 2.25 0 003 11.25v6a2.25 2.25 0 002.25 2.25h2.25" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  more: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// التبويبات الظاهرة مباشرة في شريط الأسفل (باقي التبويبات داخل "المزيد")
const PRIMARY_KEYS = ['overview', 'cart', 'orders', 'wallet'];

const DashboardNav = ({
  items,
  active,
  onChange,
  onLogout,
  logoutLabel = 'تسجيل الخروج',
  variant = 'sidebar',
  moreLabel = 'المزيد',
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const select = (key) => {
    setMoreOpen(false);
    onChange(key);
  };

  if (variant === 'bottom') {
    const primary = items.filter((item) => PRIMARY_KEYS.includes(item.key));
    const secondary = items.filter((item) => !PRIMARY_KEYS.includes(item.key));
    const moreActive = secondary.some((item) => item.key === active);

    return (
      <>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#0a0b12]/95 backdrop-blur-xl">
          <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
            {primary.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => select(item.key)}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
                    isActive ? 'text-[#fca5a5]' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#ef4444]' : ''}>{iconMap[item.key]}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
                moreActive ? 'text-[#fca5a5]' : 'text-gray-500 hover:text-white'
              }`}
            >
              <span className={moreActive ? 'text-[#ef4444]' : ''}>{iconMap.more}</span>
              <span className="whitespace-nowrap">{moreLabel}</span>
            </button>
          </div>
        </nav>

        {moreOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMoreOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-white/10 bg-[#0d0f18] px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-sm font-bold text-white">{moreLabel}</p>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  aria-label={moreLabel}
                >
                  {iconMap.close}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {secondary.map((item) => {
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => select(item.key)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-[11px] font-bold transition-colors ${
                        isActive
                          ? 'border-[#8b151a]/50 bg-[#8b151a]/15 text-white'
                          : 'border-white/5 bg-white/[0.03] text-gray-400 hover:text-white'
                      }`}
                    >
                      {iconMap[item.key]}
                      <span className="text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onLogout();
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-2 py-3 text-[11px] font-bold text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  {iconMap.logout}
                  <span className="text-center leading-tight">{logoutLabel}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="flex lg:flex-col items-stretch gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`flex items-center gap-3 shrink-0 rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-200 ${
              isActive
                ? 'bg-gradient-to-l from-[#8b151a] to-[#ef4444] text-white shadow-lg shadow-[#8b151a]/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {iconMap[item.key]}
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-3 shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-[#fca5a5] hover:bg-white/5 transition-colors duration-200"
      >
        {iconMap.logout}
        <span className="whitespace-nowrap">{logoutLabel}</span>
      </button>
    </nav>
  );
};

export default DashboardNav;
