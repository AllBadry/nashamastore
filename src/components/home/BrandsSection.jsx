import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { getBrands } from '../../api/products';
import BrandLogo from '../BrandLogo';
import Reveal from '../Reveal';

function BrandSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-neutral-100 p-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-neutral-100"></div>
      <div className="space-y-2">
        <div className="h-3.5 w-20 bg-neutral-100 rounded-full"></div>
        <div className="h-2.5 w-14 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      setError(err.message || 'تعذر تحميل الماركات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* عنوان القسم */}
        <Reveal>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
                تسوق حسب الماركة
              </h2>
              <p className="text-neutral-500 mt-2 font-medium">أشهر الماركات العالمية للهواتف والإكسسوارات</p>
            </div>
          </div>
        </Reveal>

        {/* الحالة: تحميل */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <BrandSkeleton key={i} />)}
          </div>
        )}

        {/* الحالة: خطأ */}
        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-neutral-500 font-medium mb-4">{error}</p>
            <button
              onClick={fetchBrands}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              <RefreshCw size={16} /> إعادة المحاولة
            </button>
          </div>
        )}

        {/* الحالة: لا توجد ماركات */}
        {!loading && !error && brands.length === 0 && (
          <div className="text-center py-10 text-neutral-400 font-medium">
            لا توجد ماركات متاحة حالياً
          </div>
        )}

        {/* شبكة الماركات */}
        {!loading && brands.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, i) => (
              <Reveal key={brand.brandId} delay={Math.min(i, 9) * 70}>
                <Link
                  to={`/brands/${brand.slug}`}
                  className="group flex items-center gap-3 bg-white rounded-2xl border border-neutral-100 p-4 hover:border-red-100 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-50 group-hover:bg-red-600 text-neutral-700 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
                    <BrandLogo name={brand.name} slug={brand.slug} size={24} className="text-neutral-700 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-neutral-900 group-hover:text-red-600 transition-colors text-sm truncate">
                      {brand.name}
                    </h3>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      تسوق الآن
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
