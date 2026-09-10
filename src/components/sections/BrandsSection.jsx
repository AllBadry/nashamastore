import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Reveal from '../shared/Reveal';
import brandLogos from '../../data/brandLogos.json';

const getBrandLogo = (slug) => {
  const found = brandLogos.find((b) => b.slug === slug);
  return found ? found.image : null;
};

const abstractBackgrounds = [
  "bg-gradient-to-br from-blue-100 via-orange-50 to-purple-200",
  "bg-gradient-to-tr from-cyan-100 via-teal-50 to-blue-200",
  "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(66,133,244,0.1)_10px,rgba(66,133,244,0.1)_20px)] bg-blue-50"
];

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setBrands(data.data.slice(0, 6) || []);
        } else {
          setError(data.message || 'Failed to load brands');
        }
      } catch (err) {
        console.error('Connection error:', err);
        setError('Could not connect to brands server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (error) {
    return (
      <div className="w-full py-20 flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <section className="relative w-full py-28 overflow-hidden">
      
      {/* Soft vertical grid lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, #E2E8F0 1px, transparent 1px)',
          backgroundSize: '25% 100%'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-start gap-4 mb-16">
            <div className="mt-2 text-blue-600 font-light">
              <Plus size={32} strokeWidth={1} />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-light text-neutral-900 tracking-tight leading-snug">
                Partners & Brands : <br />
                <span className="font-bold text-blue-600">at the heart of our tech ecosystem</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {brands.map((brand, index) => {
              const logoUrl = getBrandLogo(brand.slug);
              const bgStyle = abstractBackgrounds[index % abstractBackgrounds.length];

              return (
                <Reveal key={brand.brandId} delay={index * 120}>
                  <Link
                    to={`/brands/${brand.slug}`}
                    className="group flex flex-col w-full h-[440px] bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-500 border border-neutral-100"
                  >
                    
                    {/* Upper half: Text */}
                    <div className="relative p-8 md:p-10 pb-16 flex-shrink-0 bg-white z-10">
                      <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">
                        Brand
                      </span>
                      <h3 className="text-2xl md:text-[1.7rem] font-medium text-neutral-900 leading-snug">
                        Discover the latest <strong className="font-black">{brand.name}</strong> smart devices and innovations in our store.
                      </h3>

                      <div className="absolute -bottom-4 left-8 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300">
                        <Plus size={16} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Lower half: Visual */}
                    <div className={`relative flex-grow w-full ${bgStyle} flex items-center justify-center overflow-hidden`}>
                      
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

                      <div className="relative z-10 w-36 h-36 bg-white rounded-3xl shadow-lg flex items-center justify-center p-5 group-hover:scale-110 transition-transform duration-700 ease-out">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={brand.name} 
                            loading="lazy"
                            decoding="async"
                            width={144}
                            height={144}
                            className="w-full h-full object-contain"
                            onError={(e) => { 
                              e.target.style.display = 'none'; 
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                            }}
                          />
                        ) : null}

                        <span className={`text-6xl font-black text-neutral-900 drop-shadow-md ${logoUrl ? 'hidden' : 'flex'}`}>
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                  </Link>
                </Reveal>
              );
            })}

          </div>
        )}

        {/* View all button */}
        <Reveal delay={200}>
          <div className="mt-12 flex items-center">
            <Link 
              to="/brands" 
              className="group flex items-center gap-4 text-xs font-bold text-neutral-900 tracking-widest uppercase hover:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-md">
                <ArrowLeft size={18} />
              </div>
              View all brands
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}