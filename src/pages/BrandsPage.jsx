import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Reveal from '../components/shared/Reveal';
import { fetchApi } from '../lib/api';

const abstractBackgrounds = [
  'bg-gradient-to-br from-blue-100 via-orange-50 to-purple-200',
  'bg-gradient-to-tr from-cyan-100 via-teal-50 to-blue-200',
  "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(66,133,244,0.1)_10px,rgba(66,133,244,0.1)_20px)] bg-blue-50",
];

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi('/api/brands')
      .then(setBrands)
      .catch((err) => setError(err.message || 'Failed to load brands'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      <PageHeader
        eyebrow="Partners & Brands"
        title="Our"
        accent="Brand Ecosystem."
        description="The world's leading tech manufacturers, all in one place — authentic products with official regional warranties."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
          </div>
        )}

        {error && (
          <div className="w-full p-8 bg-red-50 text-red-600 rounded-3xl font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, index) => {
              const logoUrl = brand.media?.logo?.preview || brand.logo || null;
              const bgStyle = abstractBackgrounds[index % abstractBackgrounds.length];

              return (
                <Reveal key={brand.brandId || brand.slug || index} delay={index * 60}>
                  <Link
                    to={`/brands/${brand.slug}`}
                    className="group flex flex-col w-full h-[300px] bg-white rounded-3xl overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-500"
                  >
                    <div className={`relative flex-grow w-full ${bgStyle} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                      <div className="relative z-10 w-28 h-28 bg-white rounded-3xl shadow-lg flex items-center justify-center p-5 group-hover:scale-110 transition-transform duration-700 ease-out">
                        {logoUrl ? (
                          <img src={logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-5xl font-black text-neutral-900">{brand.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="relative p-6 flex items-center justify-between bg-white">
                      <div>
                        <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Brand</span>
                        <h3 className="text-xl font-black text-neutral-900">{brand.name}</h3>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 group-hover:scale-110 transition-all duration-300 shadow-md">
                        <Plus size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}