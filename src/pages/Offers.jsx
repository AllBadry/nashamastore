import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, PackageOpen, AlertCircle, Loader2, Tag, ArrowLeft, Sparkles, Timer, ArrowDownRight, ShoppingCart } from 'lucide-react';
import { getProducts } from '../api/products';
import { mapProduct } from '../utils/product';
import ProductCard from '../components/products/ProductCard';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { id: 'newest', label: 'الأحدث' },
  { id: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { id: 'price-desc', label: 'السعر: من الأعلى للأقل' },
  { id: 'discount', label: 'أعلى خصم' },
];

function discountOf(p) {
  if (!p.isOffer || !p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}

function OffersSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-square bg-neutral-100"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-neutral-200 rounded-full"></div>
        <div className="h-4 w-full bg-neutral-200 rounded-full"></div>
        <div className="h-5 w-1/2 bg-red-100 rounded-full mt-4"></div>
      </div>
    </div>
  );
}

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState('newest');

  const fetchOffers = useCallback(async (skip = 0, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError('');

    try {
      const res = await getProducts({ offer: true, limit: PAGE_SIZE, skip });
      const list = (res.data || []).map(mapProduct);
      setProducts((prev) => (append ? [...prev, ...list] : list));
      setTotal(res.total || list.length);
      setHasMore((res.total || list.length) > skip + list.length);
    } catch (err) {
      setError(err.message || 'تعذر تحميل العروض');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // فرز المنتجات
  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'discount': return list.sort((a, b) => discountOf(b) - discountOf(a));
      default: return list;
    }
  }, [products, sort]);

  // استخراج "صفقة الموسم" (أعلى خصم)
  const topOffer = useMemo(() => {
    if (!products.length) return null;
    return [...products].sort((a, b) => discountOf(b) - discountOf(a))[0];
  }, [products]);

  const maxDiscount = topOffer ? discountOf(topOffer) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 pb-16 font-sans">
      
      {/* ستايلات الخوارق (Supernatural Animations) */}
      <style>
        {`
          /* حركة الأجرام المضيئة العشوائية */
          @keyframes orb-float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.2); }
            66% { transform: translate(-20px, 20px) scale(0.8); }
          }
          @keyframes orb-float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40px, 30px) scale(0.9); }
            66% { transform: translate(20px, -40px) scale(1.1); }
          }
          /* طفو المنتج بطل العرض */
          @keyframes hero-product-float {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
          /* مرور لمعان الضوء على الزر */
          @keyframes shine-sweep {
            0% { left: -100%; }
            20% { left: 200%; }
            100% { left: 200%; }
          }
          /* الدخول المتدرج للبطاقات */
          @keyframes fade-up-stagger {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up-stagger {
            animation: fade-up-stagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      {/* 1. هيرو "صفقة الموسم" (يظهر فقط إذا كان هناك عروض) */}
      {!loading && !error && topOffer && (
        <div className="relative w-full rounded-[2.5rem] bg-neutral-950 text-white overflow-hidden shadow-[0_20px_50px_-12px_rgba(220,38,38,0.3)] mt-6 border border-neutral-800">
          
          {/* الخلفية الحركية (Animated Orbs) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-red-600/20 blur-[100px] rounded-full mix-blend-screen" style={{ animation: 'orb-float-1 12s infinite ease-in-out' }}></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-red-800/20 blur-[120px] rounded-full mix-blend-screen" style={{ animation: 'orb-float-2 15s infinite ease-in-out' }}></div>
            {/* شبكة ناعمة لإعطاء طابع تقني */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-10">
            
            {/* محتوى الصفقة (يمين) */}
            <div className="flex-1 text-right w-full">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 font-black px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
                <Flame size={18} className="animate-pulse" />
                <span className="tracking-wide text-sm">صفقة الموسم الحارقة</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
                {topOffer.name}
              </h1>
              
              <p className="text-neutral-400 text-lg mb-8 max-w-xl font-medium">
                اغتنم الفرصة الآن! وفر مبالغ ضخمة على أحدث التقنيات قبل نفاد الكمية. العرض لفترة محدودة جداً.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-neutral-900/80 border border-neutral-700/50 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <span className="block text-neutral-500 text-sm font-bold line-through mb-1">
                      {topOffer.oldPrice} د.أ
                    </span>
                    <span className="block text-3xl font-black text-white" dir="ltr">
                      {topOffer.price} <span className="text-xl text-red-500">د.أ</span>
                    </span>
                  </div>
                  <div className="h-12 w-px bg-neutral-700"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-neutral-400 font-bold mb-1">الخصم</span>
                    <span className="bg-red-600 text-white font-black px-3 py-1 rounded-lg text-lg flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      <ArrowDownRight size={18} /> {maxDiscount}%
                    </span>
                  </div>
                </div>

                <Link 
                  to={`/product/${topOffer.slug}`}
                  className="relative overflow-hidden group bg-white text-black hover:bg-neutral-200 font-black px-8 py-5 rounded-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] w-full sm:w-auto justify-center"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 skew-x-[-20deg]" style={{ animation: 'shine-sweep 4s infinite' }}></span>
                  <ShoppingCart size={22} className="relative z-10" />
                  <span className="relative z-10 text-lg">اشتري الآن</span>
                </Link>
              </div>
            </div>

            {/* صورة المنتج الطافية (يسار) */}
            <div className="flex-1 w-full flex justify-center relative">
              {/* هالة إضاءة خلف الهاتف */}
              <div className="absolute inset-0 bg-red-600/30 blur-[80px] rounded-full scale-75"></div>
              {topOffer.image ? (
                <img 
                  src={topOffer.image} 
                  alt={topOffer.name} 
                  className="relative z-10 w-64 md:w-80 lg:w-96 object-contain drop-shadow-[0_40px_30px_rgba(0,0,0,0.8)]"
                  style={{ animation: 'hero-product-float 6s ease-in-out infinite' }}
                />
              ) : (
                <div className="relative z-10 w-64 md:w-80 lg:w-96 aspect-square flex items-center justify-center text-neutral-600 font-black">
                  لا تتوفر صورة
                </div>
              )}
              {/* شارة مؤقت عائمة */}
              <div className="absolute top-10 left-0 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Timer size={24} className="text-red-500" />
                <div className="text-right">
                  <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">ينتهي قريباً</span>
                  <span className="block font-black text-sm">أسرع بالطلب</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. شريط التحكم والفرز */}
      {(products.length > 0 || loading) && (
        <div className="flex items-center justify-between flex-wrap gap-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-neutral-200 p-4 shadow-sm sticky top-24 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="block text-sm font-black text-neutral-900">كل العروض المتاحة</span>
              <span className="block text-xs font-bold text-neutral-500">{total} منتج مخفض</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-100/80 p-1.5 rounded-xl border border-neutral-200/60 hover:border-neutral-300 transition-colors">
            <span className="text-xs font-bold text-neutral-500 px-2 hidden sm:block">ترتيب حسب:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border-none rounded-lg text-sm font-bold text-neutral-800 px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 3. شبكة المنتجات */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <OffersSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 mb-2">عذراً، حدث خطأ ما</h2>
          <p className="text-neutral-500 font-medium mb-8 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchOffers()}
            className="inline-flex items-center gap-2 bg-black hover:bg-red-600 text-white font-black px-8 py-4 rounded-xl transition-colors shadow-lg active:scale-95"
          >
            <Loader2 size={20} /> تحديث الصفحة
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
            <PackageOpen size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 mb-2">لا توجد عروض حالياً</h2>
          <p className="text-neutral-500 font-medium mb-8">
            نقوم بتحديث عروضنا باستمرار، تابعنا قريباً لاصطياد أفضل الصفقات!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl transition-transform hover:scale-105 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
          >
            <ArrowLeft size={20} /> العودة للرئيسية
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((p, i) => (
              /* دخول درامي متدرج لكل بطاقة */
              <div 
                key={p.productId} 
                className="animate-fade-up-stagger" 
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-10">
              <button
                onClick={() => fetchOffers(products.length, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-3 bg-white border-2 border-neutral-200 hover:border-black hover:bg-black hover:text-white text-base font-black text-neutral-800 px-10 py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group"
              >
                {loadingMore ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-red-600 group-hover:bg-white transition-colors"></span>
                )}
                {loadingMore ? 'جارٍ جلب المزيد...' : 'اكتشف المزيد من العروض'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}