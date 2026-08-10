import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Home, RefreshCw, SearchX, BadgeCheck, Truck, ShieldCheck } from 'lucide-react';
import { getProducts } from '../api/products';
import { mapProduct } from '../utils/product';
import ProductCard from '../components/products/ProductCard';
import Reveal from '../components/Reveal';
import { resolveCategory } from '../constants/categories';

const PAGE_SIZE = 20;

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100"></div>
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-1/3 bg-neutral-100 rounded-full"></div>
        <div className="h-3.5 w-full bg-neutral-100 rounded-full"></div>
        <div className="h-3.5 w-2/3 bg-neutral-100 rounded-full"></div>
        <div className="h-5 w-1/2 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default function CategoryListing() {
  const { categorySlug, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // القسم النشط: الفرع إن وُجد وإلا القسم الرئيسي
  const activeSlug = subCategory || categorySlug;
  const active = resolveCategory(activeSlug);
  const parent = resolveCategory(categorySlug);

  // slugs حقيقية تُرسل للـ API: القسم النشط أو أقسام الأبناء
  const apiSlugs = useMemo(() => {
    if (active?.apiSlugs?.length) return active.apiSlugs;
    if (active?.children?.length) {
      return active.children.flatMap((childSlug) => {
        const child = resolveCategory(childSlug);
        return child?.apiSlugs?.length ? child.apiSlugs : [childSlug];
      });
    }
    return [activeSlug];
  }, [active, activeSlug]);

  const loadPage = useCallback(
    async (from, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError('');
      try {
        const res = await getProducts({
          categories: apiSlugs,
          limit: PAGE_SIZE,
          skip: from,
        });
        const mapped = (res.data || []).map(mapProduct);
        setProducts((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotal(res.total);
        setSkip(from + PAGE_SIZE);
      } catch (err) {
        setError(err.message || 'تعذر تحميل المنتجات');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [apiSlugs]
  );

  useEffect(() => {
    setProducts([]);
    setTotal(0);
    setSkip(0);
    loadPage(0);
  }, [loadPage]);

  const hasMore = skip < total;
  const displayName = active?.name || activeSlug;
  const Icon = active?.icon || parent?.icon || null;
  const children = parent?.children?.length ? parent.children : null;
  const chips = children?.map((childSlug) => resolveCategory(childSlug)).filter(Boolean);

  return (
    <div className="space-y-8 pb-10">
      {/* شريط الخبز (Breadcrumb) */}
      <Reveal>
        <nav className="flex items-center gap-2 text-sm text-neutral-500 font-medium overflow-x-auto whitespace-nowrap">
          <Link to="/" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
            <Home size={15} /> الرئيسية
          </Link>
          <ChevronRight size={14} className="text-neutral-300" />
          <span className="text-neutral-900 font-bold">{parent?.name || displayName}</span>
          {subCategory && activeSlug !== categorySlug && (
            <>
              <ChevronRight size={14} className="text-neutral-300" />
              <span className="text-red-600 font-bold">{displayName}</span>
            </>
          )}
        </nav>
      </Reveal>

      {/* القسم الرئيسي للتصنيف */}
      <Reveal delay={80}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-rose-500 text-white p-8 md:p-14">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {Icon && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 animate-scale-in">
                <Icon size={44} strokeWidth={1.5} />
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight animate-fade-up" style={{ animationDelay: '120ms' }}>
              {displayName}
            </h1>

            <p className="text-white/80 font-medium mb-6 animate-fade-up" style={{ animationDelay: '220ms' }}>
              {loading
                ? 'جاري جلب المنتجات...'
                : total > 0
                  ? `نعرض لك ${total} ${total === 1 ? 'منتج' : total === 2 ? 'منتجان' : 'منتجات'} أصلية 100%`
                  : 'منتجات أصلية 100% بكفالة الوكيل'}
            </p>

            {/* شارات الثقة */}
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '320ms' }}>
              {[
                { icon: <BadgeCheck size={16} />, label: 'منتجات أصلية' },
                { icon: <ShieldCheck size={16} />, label: 'كفالة الوكيل' },
                { icon: <Truck size={16} />, label: 'توصيل سريع' },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sm font-bold text-white/90"
                >
                  <span className="text-white/80">{item.icon}</span> {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* شرائح التصنيفات الفرعية */}
      {chips && chips.length > 0 && (
        <Reveal delay={140}>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/category/${categorySlug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                !subCategory
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              الكل
            </Link>
            {chips.map((chip) => (
              <Link
                key={chip.name}
                to={`/category/${categorySlug}/${chip.slug}`}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                  subCategory === chip.slug
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {chip.name}
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      {/* الحالة: تحميل */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      )}

      {/* الحالة: خطأ */}
      {!loading && error && (
        <Reveal>
          <div className="text-center py-20">
            <p className="text-neutral-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => loadPage(0)}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              <RefreshCw size={16} /> إعادة المحاولة
            </button>
          </div>
        </Reveal>
      )}

      {/* الحالة: لا توجد منتجات */}
      {!loading && !error && products.length === 0 && (
        <Reveal>
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 animate-float">
              <SearchX size={36} strokeWidth={1.5} />
            </div>
            <p className="text-neutral-500 font-medium mb-2">لا توجد منتجات في هذا القسم حالياً</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              <Home size={16} /> العودة للرئيسية
            </Link>
          </div>
        </Reveal>
      )}

      {/* شبكة المنتجات */}
      {!loading && products.length > 0 && (
        <div>
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
                {displayName}
              </h2>
              <span className="text-sm font-bold text-neutral-400">{total} منتج</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-card-in"
                style={{ animationDelay: `${Math.min(i, 15) * 45}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* زر تحميل المزيد */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => loadPage(skip, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-red-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> جاري التحميل...
                  </>
                ) : (
                  'تحميل المزيد'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
