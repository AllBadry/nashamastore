import { useEffect, useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import ProductGrid from '../components/shared/ProductGrid';
import { fetchApi } from '../lib/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/api/products?limit=100')
      .then(setAll)
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setIsLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all.filter((product) => {
      const name = String(product.name || '').toLowerCase();
      const brand = String(product.brand?.name || '').toLowerCase();
      const cats = (product.categories || [])
        .map((c) => c.name)
        .join(' ')
        .toLowerCase();
      return name.includes(q) || brand.includes(q) || cats.includes(q);
    });
  }, [query, all]);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-20">
      <PageHeader
        eyebrow="Search Store"
        title="Find"
        accent="What You Need."
        description="Search by product name, brand, or category across our full catalog."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pb-12">
        <div className="relative w-full max-w-xl -mt-8 mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type product, brand, category..."
            autoFocus
            className="w-full bg-white border border-neutral-200 rounded-full py-4 pr-12 pl-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-neutral-400 font-medium shadow-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {query.trim() === '' ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
            <h3 className="text-xl font-bold text-neutral-900">Start typing to search</h3>
            <p className="text-neutral-500 mt-2 text-sm">We'll instantly filter the catalog for you.</p>
          </div>
        ) : results.length === 0 && !isLoading ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
            <h3 className="text-xl font-bold text-neutral-900">لا توجد نتائج</h3>
            <p className="text-neutral-500 mt-2 text-sm">جرب كلمة أخرى أو تصفح الأقسام.</p>
          </div>
        ) : (
          <ProductGrid
            products={results}
            loading={false}
            error={error}
            emptyText="لا توجد نتائج"
          />
        )}
      </div>
    </div>
  );
}