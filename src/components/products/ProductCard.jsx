import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProductCard({ product }) {
  const { name, slug, brand, variance, media, image, price: mappedPrice } = product;
  const navigate = useNavigate();
  const { isLoggedIn, addToCart, wishlistIds, toggleWishlist } = useAuthStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState('');
  const [wishAdding, setWishAdding] = useState(false);
  const isWishlisted = wishlistIds.includes(product?.id);
  // يدعم الشكلين: المنتج الخام (media/variance) أو المحوَّل بـ mapProduct (image/price)
  const coverImage = media?.cover?.[0]?.preview || media?.gallery?.[0]?.preview || image || 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=No+Image';
  const price = variance?.stock?.price?.value ?? mappedPrice ?? 0;
  const currency = variance?.stock?.price?.symbol || 'JOD';
  const brandName = brand?.name || brand || '';

  const handleAddToCart = async () => {
    if (!product?.id) return;
    setAddError('');
    setAdded(false);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setAddError(err.message || 'تعذرت الإضافة إلى السلة');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product?.id) return;
    setAddError('');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setWishAdding(true);
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      setAddError(err.message || 'تعذر تحديث المفضلة');
    } finally {
      setWishAdding(false);
    }
  };

  // خوارزمية الـ 3D Hover Tilt واللمعان
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // حساب موقع الماوس داخل الكرت
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // حساب درجة الدوران بناءً على بعد الماوس عن المركز
    const rotateX = ((y - centerY) / centerY) * -12; // أقصى ميلان 12 درجة
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotate({ x: rotateX, y: rotateY });
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    // إعادة الكرت لوضعه الطبيعي عند خروج الماوس
    setRotate({ x: 0, y: 0 });
    setGlow({ ...glow, opacity: 0 });
  };

  return (
    // المنظور (Perspective) يعطي العمق الثلاثي الأبعاد
    <div className="group perspective-[1200px] h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white rounded-3xl border border-neutral-100 flex flex-col h-full shadow-sm transition-all duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${glow.opacity ? 1.02 : 1}, ${glow.opacity ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d', // السماح للعناصر الداخلية بالطفو
        }}
      >
        {/* تأثير اللمعان الزجاجي المتحرك (Glow) */}
        <div 
          className="absolute inset-0 z-50 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
            opacity: glow.opacity,
            mixBlendMode: 'overlay'
          }}
        ></div>

        {/* شارة الماركة (تطفو للأمام بفضل translateZ) */}
        {brandName && (
          <div className="absolute top-4 right-4 z-20" style={{ transform: 'translateZ(30px)' }}>
            <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              {brandName}
            </span>
          </div>
        )}

        {/* الصورة مع تأثير التكبير */}
        <div className="relative aspect-square p-6 overflow-hidden bg-gradient-to-b from-neutral-50 to-white rounded-t-3xl flex items-center justify-center">
          <img 
            src={coverImage} 
            alt={name}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=No+Image';
            }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ transform: 'translateZ(40px)' }} // الصورة تطفو خارج الكرت
          />

          {/* أزرار الإجراءات السريعة (تنزلق من الأسفل عند التمرير) */}
          <div 
            className="absolute bottom-4 inset-x-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-30"
            style={{ transform: 'translateZ(50px)' }}
          >
            <button type="button" onClick={() => navigate(`/product/${slug}`)} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-110 active:scale-95" title="نظرة سريعة">
              <Eye size={18} />
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={wishAdding}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-110 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${isWishlisted ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-red-600 hover:text-white'}`}
              title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              {wishAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>
        </div>

        {/* تفاصيل المنتج بالأسفل */}
        <div className="p-5 flex flex-col flex-grow justify-between relative z-10 bg-white rounded-b-3xl">
          <Link to={`/product/${slug}`} className="mb-4 block" style={{ transform: 'translateZ(20px)' }}>
            <h3 className="font-bold text-neutral-800 text-sm md:text-base line-clamp-2 group-hover:text-red-600 transition-colors leading-relaxed">
              {name}
            </h3>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-auto pt-4 border-t border-neutral-100" style={{ transform: 'translateZ(25px)' }}>
            <div className="min-w-0">
              <span className="text-xs text-neutral-400 font-bold block mb-1">السعر</span>
              <span className="text-xl font-black text-neutral-900" dir="ltr">
                {price} <span className="text-sm text-red-600">{currency}</span>
              </span>
            </div>

            {/* زر السلة التفاعلي */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="group/btn relative overflow-hidden bg-black text-white hover:bg-red-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {adding ? (
                <Loader2 size={16} className="relative z-10 animate-spin" />
              ) : added ? (
                <Check size={16} className="relative z-10" />
              ) : (
                <ShoppingCart size={16} className="relative z-10" />
              )}
              <span className="relative z-10">{added ? 'تمت الإضافة' : 'أضف للسلة'}</span>
            </button>
          </div>
          {addError && <p className="mt-2 text-[11px] text-red-600 font-semibold">{addError}</p>}
        </div>

      </div>
    </div>
  );
}