import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, ArrowUpLeft } from 'lucide-react';

const categories = [
  { id: '01', title: 'الكل', slug: '' },
  { id: '02', title: 'الهواتف الذكية', slug: 'smartphones' },
  { id: '03', title: 'الساعات الذكية', slug: 'wearables' },
  { id: '04', title: 'الصوتيات', slug: 'audio' },
  { id: '05', title: 'الإكسسوارات', slug: 'accessories' },
];

const extractImage = (product) => {
  const media = product?.media;
  if (!media) return null;
  if (media.cover && Array.isArray(media.cover) && media.cover.length > 0) return media.cover[0].preview || media.cover[0].src;
  if (media.gallery && Array.isArray(media.gallery) && media.gallery.length > 0) return media.gallery[0].preview || media.gallery[0].src;
  if (typeof media === 'string') return media;
  if (product.imageCover && typeof product.imageCover === 'string') return product.imageCover;
  return null;
};

const extractPrice = (priceData) => {
  if (!priceData) return null;
  if (typeof priceData === 'number' || typeof priceData === 'string') return priceData;
  if (typeof priceData === 'object') return priceData.amount || priceData.value || priceData.price || null;
  return null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const categoryQuery = activeCategory.slug ? `?category=${activeCategory.slug}&limit=20` : '?limit=20';
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products${categoryQuery}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || 'فشل جلب المنتجات');
        }
      } catch (err) {
        console.error('خطأ في الاتصال:', err);
        setError('تعذر الاتصال بالخادم.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-20">
      
      {/* 
        الهيرو سيكشن (Yandex Scale Style)
      */}
      <div className="relative w-full pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-white overflow-hidden border-b border-neutral-100">
        <div className="absolute top-0 left-[15%] w-[8%] h-full bg-gradient-to-b from-blue-100 to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-0 left-[35%] w-[12%] h-full bg-gradient-to-b from-orange-100 via-pink-100 to-transparent opacity-50 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[40%] bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 font-mono">
              Explore Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-light text-neutral-900 tracking-tight leading-[1.1]">
              Only Technology <br />
              <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">Makes the Future.</span>
            </h1>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col gap-6">
            <p className="text-neutral-500 font-medium max-w-sm leading-relaxed text-sm">
              We have been working with top global tech brands to bring you the best devices. So, let's begin the journey.
            </p>
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                placeholder="ابحث عن منتج..." 
                className="w-full bg-[#F7F7F8] border-none rounded-full py-4 pr-12 pl-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-neutral-400 font-medium shadow-inner"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        
        {/* 
          شريط التصنيفات اللاصق (Sticky Nav) 
        */}
        <div className="sticky top-6 z-40 bg-white/80 backdrop-blur-xl border border-neutral-200/80 rounded-full p-2 mb-12 flex items-center gap-2 overflow-x-auto hide-scrollbar shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {categories.map((cat) => {
            const isActive = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive 
                  ? 'bg-neutral-900 text-white shadow-md transform scale-[1.02]' 
                  : 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* 
          شبكة المنتجات (Dense Grid)
          يملأ الفراغات تلقائياً ويجعل التصميم أنيقاً ومتماسكاً
        */}
        <main className="w-full">
          {error && (
            <div className="w-full p-8 bg-red-50 text-red-600 rounded-3xl font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
              <h3 className="text-xl font-bold text-neutral-900">لا توجد منتجات</h3>
              <p className="text-neutral-500 mt-2 text-sm">لم نعثر على أي منتجات في هذا القسم حالياً.</p>
            </div>
          ) : (
            // تم استخدام grid-flow-dense لملء الفراغات بذكاء
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-flow-dense auto-rows-[380px]">
              
              {products.map((product, index) => {
                // لكسر الملل: بعض المنتجات (مثلاً الأول وكل خامس منتج) تأخذ مساحة عمودين وتكون أفقية
                const isWide = index === 0 || index % 5 === 0;
                const colSpan = isWide ? 'sm:col-span-2' : 'col-span-1';

                const imageUrl = extractImage(product);
                const currentPrice = extractPrice(product.price) || extractPrice(product.variance?.price) || extractPrice(product.variance?.stock?.price);

                return (
                  <Link 
                    to={`/product/${product.slug}`}
                    key={product.productId || index}
                    // كرت المنتج مصمم ليتناسب مع الارتفاع الثابت (380px) سواء كان عمودياً أو أفقياً
                    className={`group relative bg-white rounded-[2rem] p-5 flex overflow-hidden border border-neutral-100 hover:border-neutral-300 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 ${colSpan} ${isWide ? 'flex-col sm:flex-row items-center gap-6' : 'flex-col justify-between'}`}
                  >
                    
                    {/* النصف الخاص بالصورة */}
                    <div className={`relative rounded-3xl overflow-hidden bg-[#F7F7F8] flex items-center justify-center flex-shrink-0 ${isWide ? 'w-full sm:w-[45%] h-48 sm:h-full' : 'w-full h-48 mb-4'}`}>
                      
                      {/* خلفية جمالية خفيفة */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 to-transparent mix-blend-multiply opacity-50"></div>
                      
                      {product.variance?.stock?.isOffer && (
                        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                          Sale
                        </div>
                      )}

                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-6 mix-blend-darken group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
                        />
                      )}
                    </div>

                    {/* النصف الخاص بالنصوص والتفاصيل */}
                    <div className={`flex flex-col justify-between h-full relative z-20 ${isWide ? 'w-full sm:w-[55%] py-4' : 'w-full flex-grow'}`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            {product.brand?.name || 'Edition'}
                          </span>
                        </div>
                        
                        <h3 className={`font-black text-neutral-900 leading-tight tracking-tight transition-colors group-hover:text-blue-600 line-clamp-2 ${isWide ? 'text-2xl md:text-3xl mb-3' : 'text-lg'}`} title={product.name}>
                          {product.name}
                        </h3>
                        
                        {isWide && product.description && (
                          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 font-medium">
                            {product.description.replace(/<[^>]+>/g, '')}
                          </p>
                        )}
                      </div>
                      
                      {/* منطقة السعر والزر */}
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Price</span>
                          <span className={`font-black text-neutral-900 ${isWide ? 'text-2xl' : 'text-xl'}`}>
                            {currentPrice ? `${currentPrice} د.أ` : 'N/A'}
                          </span>
                        </div>
                        
                        {/* زر عصري */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-neutral-100 text-neutral-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300">
                          <ArrowUpLeft size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                  </Link>
                );
              })}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}