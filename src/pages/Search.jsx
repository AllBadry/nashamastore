import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, PackageOpen, AlertCircle, Loader2 } from 'lucide-react';
import { getProducts } from '../api/products';
import { mapProduct } from '../utils/product';
import ProductCard from '../components/products/ProductCard';

const PAGE_SIZE = 12;

function SearchSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-neutral-100 rounded-full"></div>
        <div className="h-4 w-full bg-neutral-100 rounded-full"></div>
        <div className="h-5 w-1/2 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [input, setInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const runSearch = useCallback(async (q, skip = 0, append = false) => {
    if (!q) {
      setProducts([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError('');

    try {
      const res = await getProducts({ q, limit: PAGE_SIZE, skip });
      const list = (res.data || []).map(mapProduct);
      setProducts((prev) => (append ? [...prev, ...list] : list));
      setTotal(res.total || list.length);
      setHasMore((res.total || list.length) > skip + list.length);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(input.trim() ? { q: input.trim() } : {});
  };

  const loadMore = () => {
    runSearch(query, products.length, true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 animate-fade-up">
      {/* الهيدر */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mb-1 flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
          البحث في المتجر
        </h1>
        <p className="text-sm text-neutral-500 font-medium mb-5">
          ابحث عن الهواتف الذكية والإكسسوارات بسهولة
        </p>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-full p-1.5 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 transition-all">
          <div className="pr-3 pl-1 text-neutral-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: شاحن، باور بانك، آيفون..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-800 placeholder:text-neutral-400 font-medium min-w-0"
          />
          {input && (
            <button
              type="button"
              onClick={() => { setInput(''); setSearchParams({}); }}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-full px-6 py-2.5 transition-colors"
          >
            بحث
          </button>
        </form>
      </div>

      {/* المحتوى */}
      {!query ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center animate-float">
            <Search size={34} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-black text-neutral-800 mb-1">ابحث عن منتجك</h2>
          <p className="text-sm text-neutral-500 font-medium">اكتب كلمة البحث ثم اضغط زر البحث</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SearchSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle size={34} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-black text-neutral-800 mb-1">تعذر البحث</h2>
          <p className="text-sm text-neutral-500 font-medium">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center animate-float">
            <PackageOpen size={34} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-black text-neutral-800 mb-1">لا توجد نتائج</h2>
          <p className="text-sm text-neutral-500 font-medium mb-1">
            لم نجد أي منتجات تطابق «<span className="text-red-600 font-bold">{query}</span>»
          </p>
          <p className="text-xs text-neutral-400">جرّب كلمات أخرى مثل «شاحن» أو «سماعة»</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-black text-neutral-900">
              نتائج البحث عن «<span className="text-red-600">{query}</span>»
            </h2>
            <span className="text-sm text-neutral-400 font-medium">{total} منتج</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <div key={p.productId} className="animate-card-in" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white border border-neutral-200 hover:border-red-300 hover:text-red-600 text-sm font-black text-neutral-700 px-8 py-3.5 rounded-full transition-colors disabled:opacity-50"
              >
                {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                {loadingMore ? 'جارٍ التحميل...' : 'عرض المزيد'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
