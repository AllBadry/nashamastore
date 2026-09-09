import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, error, emptyText = 'لا توجد منتجات' }) {
  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 text-red-600 rounded-3xl font-bold border border-red-100 text-center">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
        <h3 className="text-xl font-bold text-neutral-900">{emptyText}</h3>
        <p className="text-neutral-500 mt-2 text-sm">لم نتمكن من العثور على أي عناصر ضمن هذا القسم حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-flow-dense auto-rows-[380px]">
      {products.map((product, index) => (
        <ProductCard
          key={product.productId || product.slug || index}
          product={product}
          index={index}
          wide={index === 0 || index % 5 === 0}
        />
      ))}
    </div>
  );
}