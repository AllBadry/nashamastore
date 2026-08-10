import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, Home, ShoppingCart, ShieldCheck, Truck,
  RefreshCcw, CreditCard, BadgeCheck, Star, Package, Minus, Plus,
  Loader2, CheckCircle2, AlertCircle, Cpu,
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../api/products';
import { formatPrice, mapProduct } from '../utils/product';
import ProductCard from '../components/products/ProductCard';
import Reveal from '../components/Reveal';
import CheckoutModal from '../components/CheckoutModal';
import { useAuthStore } from '../store/authStore';

function SkeletonBlock() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 w-1/3 bg-neutral-100 rounded-full"></div>
        <div className="h-6 w-3/4 bg-neutral-100 rounded-full"></div>
        <div className="h-4 w-1/2 bg-neutral-100 rounded-full"></div>
        <div className="h-10 w-1/3 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
}

function RelatedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-neutral-100 rounded-full"></div>
        <div className="h-4 w-full bg-neutral-100 rounded-full"></div>
        <div className="h-5 w-1/2 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, addToCart } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState('');

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError('');
    setProduct(null);
    setSelectedColor(null);
    setQuantity(1);
    setAddSuccess(false);
    setAddError('');
    try {
      const data = await getProductBySlug(productSlug);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'تعذر تحميل المنتج');
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // استخراج الألوان المتوفرة (variationAttributes) مع سعر وكمية كل لون
  const colors = useMemo(() => {
    if (!product) return [];
    const options = product.variationAttributes?.find((a) => a.type === 'color')?.options;

    if (options && options.length) {
      return options.map((o) => ({
        name: o.name || '',
        hex: o.hexCode || '#171717',
        image: o.media?.gallery?.[0]?.preview || o.media?.cover?.[0]?.preview || '',
        price: o.stock?.price?.value ?? 0,
        oldPrice: o.stock?.priceBeforeOffer?.value && o.stock.priceBeforeOffer.value > 0
          ? o.stock.priceBeforeOffer.value
          : 0,
        isOffer: o.stock?.isOffer === true,
        quantity: o.stock?.quantity,
        varianceName: o.variance?.name || product.name,
      }));
    }

    const stock = product.variance?.stock;
    return [{
      name: '',
      hex: '#171717',
      image: product.media?.cover?.[0]?.preview || product.media?.gallery?.[0]?.preview || '',
      price: stock?.price?.value ?? 0,
      oldPrice: stock?.priceBeforeOffer?.value && stock.priceBeforeOffer.value > 0
        ? stock.priceBeforeOffer.value
        : 0,
      isOffer: stock?.isOffer === true,
      quantity: stock?.quantity,
      varianceName: product.variance?.name || product.name,
    }];
  }, [product]);

  useEffect(() => {
    if (colors.length) setSelectedColor(colors[0]);
  }, [colors]);

  // المنتجات المشابهة
  useEffect(() => {
    if (!product) return;
    const categorySlug = product.categories?.[0]?.slug;
    if (!categorySlug) return;
    let cancelled = false;
    setRelatedLoading(true);
    getProducts({ category: categorySlug, limit: 5 })
      .then((res) => {
        if (cancelled) return;
        const list = (res.data || [])
          .filter((p) => p.slug !== product.slug)
          .slice(0, 4);
        setRelated(list.map(mapProduct));
      })
      .catch(() => {})
      .finally(() => !cancelled && setRelatedLoading(false));
    return () => { cancelled = true; };
  }, [product]);

  const color = selectedColor || {};
  const price = color.price ?? 0;
  const oldPrice = color.oldPrice ?? 0;
  const isOffer = color.isOffer === true && oldPrice > price;
  const discount = isOffer ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const stockQty = color.quantity;
  const inStock = stockQty === undefined || stockQty > 0;
  const maxQty = inStock && stockQty > 0 ? Math.min(stockQty, 50) : 1;

  const increase = () => setQuantity((q) => Math.min(q + 1, maxQty));
  const decrease = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = async () => {
    setAddError('');
    setAddSuccess(false);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart({ productId: product.productId, quantity });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2500);
    } catch (err) {
      setAddError(err.message || 'تعذرت الإضافة إلى السلة');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleOrderCreated = () => {
    setCheckoutOpen(false);
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-10">
        <div className="w-full h-[72vh] bg-neutral-100 rounded-b-[40px] animate-pulse"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl border border-neutral-100 p-6">
            <SkeletonBlock />
            <div className="space-y-4">
              <SkeletonBlock />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 animate-float">
          <AlertCircle size={36} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-black text-neutral-900 mb-2">تعذر عرض المنتج</h2>
        <p className="text-neutral-500 font-medium mb-6">{error || 'المنتج غير موجود'}</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-colors">
          <Home size={16} /> العودة للرئيسية
        </Link>
      </div>
    );
  }

  const brandSlug = product.brand?.slug || '';
  const brandName = product.brand?.name || '';
  const specs = [
    { icon: <BadgeCheck size={20} />, label: 'الماركة', value: brandName || '—' },
    { icon: <Package size={20} />, label: 'التصنيف', value: product.categories?.[0]?.name || '—' },
    { icon: <Star size={20} />, label: 'التقييم', value: Number(product.avgRate || 0).toFixed(1) },
    { icon: inStock ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />, label: 'التوفر', value: inStock ? 'متوفر في المخزون' : 'غير متوفر حالياً' },
    { icon: <Cpu size={20} />, label: 'كود المنتج', value: `#${product.productId}` },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen pb-20 font-sans">
      {/* ستايل حركة الطفو (Floating) */}
      <style>
        {`
          @keyframes float-hero {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-hero {
            animation: float-hero 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* 1. مسار التنقل (Breadcrumb) */}
      <div className="container mx-auto px-4 py-4 text-sm font-bold text-neutral-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-red-600 transition-colors flex items-center gap-1">
          <Home size={14} /> الرئيسية
        </Link>
        <ChevronRight size={14} />
        {brandSlug && (
          <>
            <Link to={`/brands/${brandSlug}`} className="hover:text-red-600 transition-colors">{brandName}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-black truncate max-w-[14rem]">{product.name}</span>
      </div>

      {/* 2. القسم العلوي: المنتج يطفو (Hero Image) */}
      <div
        className="w-full h-[72vh] relative flex justify-center items-center overflow-hidden transition-colors duration-700 rounded-b-[40px] shadow-2xl"
        style={{ backgroundColor: color.hex || '#171717' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute w-[40vw] h-[40vw] bg-white/10 blur-[100px] rounded-full"></div>

        {color.image ? (
          <img
            key={color.name || 'default'}
            src={color.image}
            alt={product.name}
            className="relative z-10 h-[82%] md:h-[88%] object-contain animate-float-hero drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] transition-opacity duration-500"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-white/60">
            <Package size={80} strokeWidth={1.2} />
            <span className="text-sm font-bold mt-2">لا توجد صورة</span>
          </div>
        )}
      </div>

      {/* 3. القسم السفلي: البيانات والمعلومات */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto border border-neutral-100">

          <div className="flex flex-col md:flex-row gap-10">

            {/* العمود الأيمن: العنوان والسعر والألوان */}
            <div className="flex-1 space-y-8">

              {/* العنوان والسعر */}
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {isOffer && (
                    <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
                      خصم {discount}%
                    </span>
                  )}
                  <span className="bg-neutral-100 text-neutral-600 text-xs font-black px-3 py-1 rounded-full">
                    ضمان الوكيل
                  </span>
                  {inStock && (
                    <span className="bg-green-50 text-green-700 border border-green-100 text-xs font-black px-3 py-1 rounded-full">
                      متوفر
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                {color.varianceName && color.varianceName !== product.name && (
                  <p className="text-xl text-neutral-500 font-bold mb-4">{color.varianceName}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-4xl font-black text-red-600 flex items-center gap-1" dir="ltr">
                    <span>{formatPrice(price)}</span>
                  </div>
                  {isOffer && (
                    <span className="text-xl text-neutral-400 line-through font-bold" dir="ltr">
                      {formatPrice(oldPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500 font-medium mt-1 inline-block">
                  شامل ضريبة القيمة المضافة
                </span>
              </div>

              {/* اختيار اللون */}
              {colors.length > 1 && (
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    اللون المختار: <span className="text-red-600">{color.name || '—'}</span>
                  </h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.name || c.hex}
                        onClick={() => { setSelectedColor(c); setQuantity(1); }}
                        className={`relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center
                          ${selectedColor?.name === c.name ? 'ring-2 ring-red-600 ring-offset-4 scale-110' : 'ring-1 ring-neutral-200 hover:scale-105'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name || c.hex}
                      >
                        {selectedColor?.name === c.name && (
                          <span className="w-3 h-3 bg-white rounded-full"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* الكمية وأزرار الشراء */}
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-neutral-700">الكمية:</span>
                  <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden">
                    <button onClick={increase} disabled={quantity >= maxQty} className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30">
                      <Plus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-neutral-900">{quantity}</span>
                    <button onClick={decrease} disabled={quantity <= 1} className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30">
                      <Minus size={18} />
                    </button>
                  </div>
                </div>

                {addError && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">
                    <AlertCircle size={14} className="shrink-0" /> {addError}
                  </div>
                )}
                {addSuccess && (
                  <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-2xl p-3">
                    <CheckCircle2 size={14} className="shrink-0" /> تمت الإضافة إلى السلة بنجاح
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || !inStock}
                    className="flex-1 bg-black text-white hover:bg-red-600 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {adding ? <Loader2 size={22} className="animate-spin" /> : <ShoppingCart size={22} />}
                    أضف إلى السلة
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded-xl font-black text-lg transition-colors active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    اشترِ الآن
                  </button>
                </div>
              </div>

            </div>

            {/* العمود الأيسر: المواصفات السريعة (Specs) */}
            <div className="w-full md:w-1/3 bg-neutral-50 rounded-2xl p-6 border border-neutral-100 h-fit">
              <h3 className="font-black text-lg text-neutral-900 mb-6 border-b border-neutral-200 pb-4">المواصفات الرئيسية</h3>

              <ul className="space-y-5">
                {specs.map((spec) => (
                  <li key={spec.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm shrink-0">
                      {spec.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs text-neutral-500 font-bold">{spec.label}</span>
                      <span className="block font-black text-neutral-900 text-sm truncate">{spec.value}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ميزات الثقة */}
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <ShieldCheck size={16} className="text-green-500" /> كفالة الوكيل لمدة عام
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <Truck size={16} className="text-blue-500" /> توصيل سريع لكافة المحافظات
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <RefreshCcw size={16} className="text-orange-500" /> إرجاع مجاني خلال 14 يوماً
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <CreditCard size={16} className="text-red-500" /> دفع آمن أو عند الاستلام
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* الوصف التفصيلي */}
      {product.description && (
        <Reveal delay={120}>
          <div className="container mx-auto px-4 mt-10 max-w-4xl">
            <section className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 flex items-center gap-3 mb-5">
                <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
                الوصف التفصيلي
              </h2>
              <div
                className="prose-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </section>
          </div>
        </Reveal>
      )}

      {/* منتجات مشابهة */}
      <Reveal delay={180}>
        <div className="container mx-auto px-4 mt-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
                منتجات مشابهة
              </h2>
              {product.categories?.[0]?.slug && (
                <Link
                  to={`/category/${product.categories[0].slug}`}
                  className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  عرض الكل <ChevronRight size={15} />
                </Link>
              )}
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => <RelatedSkeleton key={i} />)}
              </div>
            ) : related.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <div key={p.productId} className="animate-card-in" style={{ animationDelay: `${i * 45}ms` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-400 font-medium">
                لا توجد منتجات مشابهة حالياً
              </div>
            )}
          </section>
        </div>
      </Reveal>

      {/* نافذة إتمام الشراء (اشترِ الآن) */}
      <CheckoutModal
        open={checkoutOpen}
        items={[{
          productId: product.productId,
          quantity,
          name: color.name || product.name,
          price,
          image: color.image || product.media?.cover?.[0]?.preview || product.media?.gallery?.[0]?.preview || '',
          slug: product.slug,
        }]}
        onClose={() => setCheckoutOpen(false)}
        onCreated={handleOrderCreated}
      />
    </div>
  );
}
