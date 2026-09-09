import { useEffect, useState } from 'react';
import { Sparkles, BadgePercent } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import ProductGrid from '../components/shared/ProductGrid';
import { fetchApi } from '../lib/api';

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/api/products/offers?limit=30')
      .then(setProducts)
      .catch((err) => setError(err.message || 'Failed to load offers'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-20">
      <PageHeader
        eyebrow="Exclusive Deals"
        title="Special"
        accent="Offers & Discounts."
        description="Hand-picked devices at prices you won't find anywhere else. Limited quantities — grab them before they're gone."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="flex items-center gap-2 mb-10">
          <Sparkles size={18} className="text-red-500" />
          <span className="text-sm font-bold text-neutral-700">
            Latest offers ({products.length})
          </span>
          <BadgePercent size={18} className="text-red-500" />
        </div>

        <ProductGrid products={products} loading={isLoading} error={error} emptyText="لا توجد عروض حالياً" />
      </div>
    </div>
  );
}