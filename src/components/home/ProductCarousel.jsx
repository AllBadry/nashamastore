import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { getLatestProducts } from '../../api/products';
import { mapProduct } from '../../utils/product';
import ProductCard from '../products/ProductCard';
import Reveal from '../Reveal';

function CardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden w-48 md:w-56 shrink-0">
      <div className="aspect-square bg-neutral-100 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-1/3 bg-neutral-100 animate-pulse rounded-full"></div>
        <div className="h-3.5 w-full bg-neutral-100 animate-pulse rounded-full"></div>
        <div className="h-3.5 w-2/3 bg-neutral-100 animate-pulse rounded-full"></div>
        <div className="h-5 w-1/2 bg-neutral-100 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}

export default function ProductCarousel({ title = 'أحدث الهواتف', subtitle, limit = 10, fetcher = getLatestProducts, viewAll }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollerRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetcher(limit);
      setProducts(data.map(mapProduct));
    } catch (err) {
      setError(err.message || 'تعذر تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, [fetcher, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const scrollByCards = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cardWidth = scroller.querySelector('[data-card]')?.offsetWidth || 240;
    scroller.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  };

  const hasProducts = products.length > 0;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* عنوان القسم */}
        <Reveal>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
                {title}
              </h2>
              {subtitle && <p className="text-neutral-500 mt-2 font-medium">{subtitle}</p>}
            </div>

            {/* أزرار التمرير */}
            <div className="flex items-center gap-2">
              {viewAll && (
                <Link
                  to={viewAll}
                  className="hidden md:inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-sm transition-colors"
                >
                  عرض الكل <ChevronLeft size={16} />
                </Link>
              )}
              {hasProducts && (
                <>
                  <button
                    onClick={() => scrollByCards(-1)}
                    className="w-10 h-10 rounded-full border border-neutral-200 text-neutral-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center"
                    aria-label="التمرير للخلف"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => scrollByCards(1)}
                    className="w-10 h-10 rounded-full border border-neutral-200 text-neutral-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center"
                    aria-label="التمرير للأمام"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </Reveal>

        {/* الحالة: تحميل */}
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* الحالة: خطأ */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-medium mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              <RefreshCw size={16} /> إعادة المحاولة
            </button>
          </div>
        )}

        {/* الحالة: لا توجد منتجات */}
        {!loading && !error && !hasProducts && (
          <div className="text-center py-16 text-neutral-400 font-medium">
            لا توجد منتجات متاحة حالياً
          </div>
        )}

        {/* شريط المنتجات القابل للتمرير */}
        {!loading && hasProducts && (
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, i) => (
              <div key={product.id} data-card className="w-48 md:w-56 shrink-0 animate-card-in" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* رابط عرض الكل للجوال */}
        {!loading && hasProducts && viewAll && (
          <div className="mt-4 text-center md:hidden">
            <Link
              to={viewAll}
              className="inline-flex items-center justify-center gap-1.5 w-full bg-neutral-50 hover:bg-red-50 text-red-600 font-bold px-6 py-3 rounded-full border border-neutral-100 transition-colors"
            >
              عرض الكل <ChevronLeft size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
