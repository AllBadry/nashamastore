import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Search, User, Menu, Phone, Heart, 
  Smartphone, Headphones, Watch, Flame, X, ShieldCheck, Zap, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatPrice } from '../../utils/product';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoggedIn, loading, cartCount, cartTotal, wishlistIds, logout } = useAuthStore();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // عند فتح البحث يتم التركيز على الحقل تلقائياً
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const openSearch = () => {
    setSearchOpen(true);
    setIsMobileMenuOpen(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    setSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // تأثير الزجاج الغائم عند التمرير للأسفل
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <header className={`w-full sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'}`}>
        
        {/* 1. الشريط العلوي (Top Bar) - أسود وأبيض بناءً على طلبك */}
        <div className="bg-black text-white text-[11px] md:text-xs py-2 border-b border-gray-800">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                <Phone size={14} className="text-red-500" /> 
                <span className="font-semibold tracking-wider" dir="ltr">0798500771</span>
              </span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-600 mx-1"></span>
              <span className="hidden md:flex items-center gap-1.5 text-gray-200">
                <ShieldCheck size={14} className="text-red-500" /> كفالة الوكيل الرسمي
              </span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-600 mx-1"></span>
              <span className="hidden md:flex items-center gap-1.5 text-gray-200">
                <Zap size={14} className="text-red-500" /> توصيل سريع
              </span>
            </div>
            <div className="flex items-center gap-4 font-medium text-gray-200">
              <Link to="/return-policy" className="hover:text-red-500 transition-colors">سياسة الإرجاع</Link>
              <span className="w-px h-3 bg-gray-600"></span>
              <button className="hover:text-red-500 font-bold uppercase tracking-widest transition-colors">EN</button>
            </div>
          </div>
        </div>

        {/* 2. القسم الرئيسي (Main Header) */}
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* الشعار */}
          <Link to="/" className="flex-shrink-0 z-50">
            <img 
              src="/NHSS.png" 
              alt="نشامى ستور" 
              className="h-10 md:h-14 object-contain hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* شريط البحث - يظهر كزر يفتح حقل بحث موسّع */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <button
              onClick={openSearch}
              className="flex items-center w-full bg-slate-100 hover:bg-slate-200/70 rounded-full px-5 py-3 transition-colors group text-right"
            >
              <div className="pl-3 pr-0 text-slate-400 group-hover:text-red-500 transition-colors">
                <Search size={19} />
              </div>
              <span className="text-sm text-slate-400 font-medium">البحث عن أجهزة وملحقات...</span>
            </button>
          </div>

          {/* أيقونات المستخدم والسلة - خطوط رفيعة وأنيقة */}
          <div className="flex items-center gap-5 md:gap-6 text-slate-700 z-50">
            {/* زر البحث (يظهر على جميع الشاشات) */}
            <button
              onClick={openSearch}
              title="البحث"
              className="flex flex-col items-center hover:text-red-500 transition-colors"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <Link to="/wishlist" className="relative hidden md:flex flex-col items-center hover:text-red-500 transition-colors group" title="المفضلة">
              <div className="relative">
                <Heart size={22} strokeWidth={1.5} className="group-hover:fill-red-50 transition-all" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                  </span>
                )}
              </div>
            </Link>
            
            {loading ? (
              <span className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" title="..."></span>
            ) : isLoggedIn ? (
              <div className="relative group flex items-center">
                <Link to="/profile" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                  <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-700 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                    {user?.name?.charAt(0) || 'م'}
                  </span>
                  <span className="hidden xl:block text-sm font-bold max-w-[8rem] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="تسجيل الخروج"
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center hover:text-red-500 transition-colors">
                <User size={22} strokeWidth={1.5} />
                <span className="text-[10px] font-bold mt-0.5">دخول</span>
              </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 hover:text-red-500 transition-colors group bg-slate-50 hover:bg-red-50 px-3 py-2 rounded-full">
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-sm font-bold">{formatPrice(cartTotal)}</span>
            </Link>

            {/* زر فتح قائمة الموبايل */}
            <button 
              className="lg:hidden p-2 -mr-2 text-slate-700 hover:text-red-500 transition-colors bg-slate-50 rounded-full"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* 2.5. حقل البحث الموسّع - يظهر عند الضغط على زر البحث */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            searchOpen ? 'max-h-28 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={submitSearch} className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1.5 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 transition-all">
              <div className="pr-3 pl-1 text-slate-400">
                <Search size={20} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن هاتف، شاحن، باور بانك..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-800 placeholder:text-neutral-400 font-medium min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full px-6 py-2.5 transition-colors"
              >
                بحث
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                title="إغلاق"
                className="shrink-0 p-2 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* 3. شريط التصنيفات (Navigation Links) - نقي ومتمركز */}
        <nav className="hidden lg:block border-t border-slate-100">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center gap-8 text-[14px] font-semibold text-slate-600">
              
              <li>
                <Link to="/offers" className="flex items-center gap-1.5 py-3.5 text-red-500 hover:text-red-600 transition-colors">
                  <Flame size={16} />
                  <span>عروض الهواتف</span>
                </Link>
              </li>

              {[
                { name: 'آيفون', path: '/brands/apple' },
                { name: 'سامسونج', path: '/brands/samsung' },
                { name: 'هواتف أندرويد', path: '/category/smartphones/android' },
                { name: 'سماعات وصوتيات', path: '/category/wearables/earbuds' },
                { name: 'ساعات ذكية', path: '/category/wearables/smart-watch' },
                { name: 'شواحن وكابلات', path: '/category/accessories/chargers' },
              ].map((link, index) => (
                <li key={index} className="relative group">
                  <Link 
                    to={link.path} 
                    className="flex items-center py-3.5 hover:text-slate-900 transition-colors duration-300"
                  >
                    {link.name}
                    {/* نقطة حمراء ناعمة تظهر عند التمرير */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* 4. قائمة الموبايل الجانبية (Mobile Drawer) - ناعمة بحواف دائرية */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl rounded-l-3xl transform transition-transform duration-500 ease-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* ترويسة الدرج */}
        <div className="flex items-center justify-between p-6 pb-4">
          <img src="/NHSS.png" alt="نشامى ستور" className="h-8" />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* بحث الموبايل */}
        <form onSubmit={submitSearch} className="px-6 pb-4">
          <div className="flex items-center w-full bg-slate-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <Search size={18} className="text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className="w-full bg-transparent border-none outline-none text-sm text-slate-700"
            />
          </div>
        </form>

        {/* الروابط في الموبايل - تصميم فقاعات (Bubbles) */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <ul className="flex flex-col gap-2 font-semibold text-slate-600 text-sm">
            <li>
              <Link to="/offers" className="flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 text-red-600 mb-2">
                <div className="p-1.5 bg-white rounded-full text-red-500 shadow-sm"><Flame size={16} /></div>
                عروض الهواتف
              </Link>
            </li>
            {[
              { name: 'آيفون - Apple', path: '/brands/apple', icon: <Smartphone size={18} /> },
              { name: 'سامسونج - Galaxy', path: '/brands/samsung', icon: <Smartphone size={18} /> },
              { name: 'هواتف أندرويد', path: '/category/smartphones/android', icon: <Smartphone size={18} /> },
              { name: 'سماعات وصوتيات', path: '/category/wearables/earbuds', icon: <Headphones size={18} /> },
              { name: 'ساعات ذكية', path: '/category/wearables/smart-watch', icon: <Watch size={18} /> },
              { name: 'شواحن وباور بانك', path: '/category/accessories/chargers', icon: <Zap size={18} /> },
            ].map((item, i) => (
              <li key={i}>
                <Link to={item.path} className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <div className="text-slate-400">{item.icon}</div>
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/wishlist" className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <div className="text-slate-400"><Heart size={18} /></div>
                <span>قائمة المفضلة</span>
                {wishlistIds.length > 0 && (
                  <span className="mr-auto text-[10px] font-black text-white bg-red-500 w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}