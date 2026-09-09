import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, Sparkles, Loader2, ImageOff } from 'lucide-react';
import Reveal from '../shared/Reveal';

const noiseTexture = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

const gradients = [
  'from-[#ffc3a0] to-[#ffafbd]',
  'from-[#a1c4fd] to-[#c2e9fb]',
  'from-[#e0c3fc] to-[#8ec5fc]',
  'from-[#d4fc79] to-[#96e6a1]'
];

const extractPrice = (priceData) => {
  if (!priceData) return null;
  if (typeof priceData === 'number' || typeof priceData === 'string') return priceData;
  if (typeof priceData === 'object') {
    return priceData.amount || priceData.value || priceData.price || null;
  }
  return null;
};

const extractImage = (product) => {
  const media = product?.media;
  if (!media) return null;

  if (media.cover && Array.isArray(media.cover) && media.cover.length > 0) {
    return media.cover[0].preview || media.cover[0].src;
  }

  if (media.gallery && Array.isArray(media.gallery) && media.gallery.length > 0) {
    return media.gallery[0].preview || media.gallery[0].src;
  }

  if (typeof media === 'string') return media;
  if (product.imageCover && typeof product.imageCover === 'string') return product.imageCover;
  
  return null;
};

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/offers?limit=4`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        });

        const data = await response.json();

        if (data.success) {
          setOffers(data.data || []);
        } else {
          setError(data.message || 'Failed to load offers');
        }
      } catch (err) {
        console.error('Connection error:', err);
        setError('Could not connect to server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (error) {
    return (
      <div className="w-full py-24 flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <Reveal className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-sm font-semibold text-neutral-800">
            <Sparkles size={16} className="text-[#EA4335]" />
            Best Exclusive Offers
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            Upgrade Your Digital Experience <br />
            <span className="text-neutral-400 font-light">at unbeatable prices.</span>
          </h2>
        </Reveal>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {offers.map((product, index) => {
              console.log('Product data:', product.name, 'Images:', product.media);
              const gradient = gradients[index % gradients.length];
              const colSpan = (index === 0 || index === 3) ? 'lg:col-span-2' : 'lg:col-span-1';
              
              const imageUrl = extractImage(product);
              const currentPrice = extractPrice(product.price) || extractPrice(product.variance?.price) || extractPrice(product.variance?.stock?.price);
              const oldPrice = extractPrice(product.oldPrice) || extractPrice(product.variance?.oldPrice) || extractPrice(product.variance?.originalPrice);

              return (
                <Reveal key={product.productId || product.slug || index} className={colSpan} delay={index * 80}>
                  <div 
                    className="group relative bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
                  >
                    
                    <div className={`relative w-full h-64 md:h-72 bg-gradient-to-br ${gradient} flex items-center justify-center p-8 overflow-hidden`}>
                      <div 
                        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                        style={{ backgroundImage: noiseTexture }}
                      ></div>

                      <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#EA4335] shadow-sm">
                        Special Offer
                      </div>

                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out relative z-0"
                        />
                      ) : (
                        <div className="text-white/60 flex flex-col items-center">
                          <ImageOff size={48} />
                          <span className="text-sm mt-2 font-medium">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow justify-between bg-white relative z-10">
                      <div className="space-y-3 mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 line-clamp-1" title={product.name}>
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-neutral-500 text-sm leading-relaxed font-medium line-clamp-2">
                            {product.description.replace(/<[^>]+>/g, '')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-end justify-between gap-4 mt-auto">
                        <div className="flex flex-col">
                          {oldPrice && (
                            <span className="text-sm text-neutral-400 line-through font-medium">
                              {oldPrice} JD
                            </span>
                          )}
                          <span className="text-2xl font-black text-neutral-900">
                            {currentPrice ? `${currentPrice} JD` : 'Price Unavailable'}
                          </span>
                        </div>
                        
                        <Link 
                          to={`/product/${product.slug}`}
                          className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-[#EA4335] hover:scale-105 transition-all duration-300 shadow-md"
                        >
                          <ArrowUpLeft size={22} strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
