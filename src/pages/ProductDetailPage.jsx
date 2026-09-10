import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2, ChevronRight, ShoppingBag, Check, Truck, ShieldCheck,
  RotateCcw, BadgeCheck, Minus, Plus,
} from 'lucide-react';
import Reveal from '../components/shared/Reveal';
import { CartContext } from '../context/cartContext';
import { fetchApi } from '../lib/api';
import {
  extractGallery, getProductPrice, getOldPrice,
  formatPrice, isProductOnSale,
} from '../lib/product';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);
  const [state, setState] = useState({ slug: null, product: null, error: null });
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchApi(`/api/products/${slug}`)
      .then((data) => {
        if (cancelled) return;
        const product = Array.isArray(data) ? data[0] : data;
        setState({ slug, product, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ slug, product: null, error: err.message || 'Product not found' });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const isLoading = state.slug !== slug;
  const product = state.slug === slug ? state.product : null;
  const error = state.slug === slug ? state.error : null;

  const gallery = product ? extractGallery(product) : [];
  const price = product ? getProductPrice(product) : null;
  const oldPrice = product ? getOldPrice(product) : null;
  const onSale = product ? isProductOnSale(product) || (oldPrice && Number(oldPrice) > Number(price)) : false;

  const handleAdd = (e) => {
    e.preventDefault();
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      {isLoading && (
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-neutral-900" />
        </div>
      )}

      {error && !isLoading && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-40 text-center">
          <div className="p-10 bg-white rounded-3xl border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">تعذر العثور على المنتج</h2>
            <p className="text-neutral-500 mb-6">{error}</p>
            <Link to="/products" className="inline-flex px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
              Back to Products
            </Link>
          </div>
        </div>
      )}

      {product && !isLoading && (
        <>
          <div className="w-full bg-white border-b border-neutral-100">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-6">
              <nav className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                <ChevronRight size={14} />
                <Link to="/products" className="hover:text-neutral-900 transition-colors">Products</Link>
                {product.brand?.slug && (
                  <>
                    <ChevronRight size={14} />
                    <Link to={`/brands/${product.brand.slug}`} className="hover:text-neutral-900 transition-colors">
                      {product.brand.name}
                    </Link>
                  </>
                )}
                <ChevronRight size={14} />
                <span className="text-neutral-900 truncate max-w-[200px]">{product.name}</span>
              </nav>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* Image gallery */}
              <Reveal>
                <div className="sticky top-28 space-y-4">
                  <div className="relative bg-white rounded-[2rem] border border-neutral-100 overflow-hidden h-[430px] md:h-[520px] flex items-center justify-center p-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent mix-blend-multiply opacity-60"></div>
                    {onSale && (
                      <span className="absolute top-5 left-5 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        Sale
                      </span>
                    )}
                    {gallery[activeImage] ? (
                      <img
                        src={gallery[activeImage]}
                        alt={product.name}
                        className="relative z-10 w-full h-full object-contain mix-blend-darken"
                      />
                    ) : (
                      <span className="relative z-10 text-neutral-300 font-bold">{product.brand?.name || 'NASHAMA'}</span>
                    )}
                  </div>

                  {gallery.length > 1 && (
                    <div className="flex gap-3">
                      {gallery.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white transition-all ${
                            activeImage === i ? 'border-blue-600' : 'border-neutral-100 hover:border-neutral-300'
                          }`}
                        >
                          <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Product info */}
              <Reveal delay={100}>
                <div className="space-y-8">
                  <div>
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                      {product.brand?.name || 'Nashama Store'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight mt-3">
                      {product.name}
                    </h1>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-neutral-900">{formatPrice(price)}</span>
                    {oldPrice && Number(oldPrice) > Number(price) && (
                      <span className="text-lg text-neutral-400 line-through font-medium mb-1">
                        {formatPrice(oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity + Add to cart */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    <div className="flex items-center gap-4 bg-white border border-neutral-200 rounded-full px-4 py-2 w-fit">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center font-black text-neutral-900">{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={handleAdd}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-sm font-bold text-white transition-all duration-300 ${
                        added ? 'bg-green-500' : 'bg-neutral-900 hover:bg-blue-600'
                      }`}
                    >
                      {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                      {added ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Truck, title: 'Fast Delivery', desc: 'Same-day dispatch in Amman' },
                      { icon: ShieldCheck, title: 'Official Warranty', desc: 'Authentic, dealer-guaranteed' },
                      { icon: RotateCcw, title: 'Easy Returns', desc: '14-day hassle-free returns' },
                    ].map((b) => (
                      <div key={b.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-neutral-100">
                        <b.icon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{b.title}</h4>
                          <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="prose prose-neutral max-w-none">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">Description</h3>
                      <div
                        className="text-neutral-600 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </div>
                  )}

                  {/* FAQs */}
                  {product.faqs && product.faqs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Product FAQ</h3>
                      <div className="space-y-3">
                        {product.faqs.map((faq, i) => (
                          <div key={faq.productFaqId || i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                            <button
                              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                            >
                              <span className="text-sm font-bold text-neutral-900">{faq.question}</span>
                              <Plus size={18} className={`text-neutral-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`} />
                            </button>
                            {openFaq === i && (
                              <p className="px-6 pb-5 text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <BadgeCheck size={18} className="text-blue-600" />
                      {product.categories.map((cat) => (
                        <Link
                          key={cat.categoryId}
                          to={`/category/${cat.slug}`}
                          className="px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}