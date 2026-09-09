import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import ProductGrid from '../components/shared/ProductGrid';
import { fetchApi } from '../lib/api';

export default function TrendsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/api/products?limit=40')
      .then((data) =>
        data
          .slice()
          .sort((a, b) => Number(b.avgRate) - Number(a.avgRate))
      )
      .then(setProducts)
      .catch((err) => setError(err.message || 'Failed to load trending products'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-20">
      <PageHeader
        eyebrow="What's Hot"
        title="Trending"
        accent="Right Now."
        description="The most loved devices by our community, ranked by real customer ratings and demand."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="flex items-center gap-2 mb-10">
          <TrendingUp size={18} className="text-blue-600" />
          <span className="text-sm font-bold text-neutral-700">
            Most popular ({products.length})
          </span>
        </div>

        <ProductGrid products={products} loading={isLoading} error={error} emptyText="لا توجد منتجات حالياً" />
      </div>
    </div>
  );
}