import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import ProductGrid from '../components/shared/ProductGrid';
import { fetchApi } from '../lib/api';

export default function BrandPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ slug: null, products: [], error: null });

  useEffect(() => {
    let cancelled = false;
    fetchApi(`/api/products?brand=${slug}&limit=40`)
      .then((data) => {
        if (!cancelled) setState({ slug, products: data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ slug, products: [], error: err.message || 'Failed to load brand products' });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loading = state.slug !== slug;
  const products = state.slug === slug ? state.products : [];
  const error = state.slug === slug ? state.error : null;

  const title = (slug || 'Brand')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-20">
      <PageHeader
        eyebrow="Brand Store"
        title={title}
        description={`Explore the latest ${title} smart devices and innovations in our store.`}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        <nav className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/brands" className="hover:text-neutral-900 transition-colors">Brands</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900">{title}</span>
        </nav>

        <ProductGrid products={products} loading={loading} error={error} emptyText="لا توجد منتجات لهذه الماركة" />
      </div>
    </div>
  );
}