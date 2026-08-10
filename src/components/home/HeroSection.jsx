import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { getOffers } from '../../api/products';
import { mapProduct, formatPrice } from '../../utils/product';

// إزالة وسوم HTML من الوصف وجعله نصاً نظيفاً
const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const BG_COLORS = ['bg-slate-50', 'bg-white', 'bg-red-50', 'bg-amber-50', 'bg-emerald-50', 'bg-blue-50'];

// الشرائح الأساسية: تظهر فوراً دائماً مع صور وأنيميشن القلب
const STATIC_SLIDES = [
  {
    id: 's1',
    badge: 'عرض اليوم',
    title: 'Apple AirPods Max',
    highlight: 'خصم 45%',
    description: 'تجربة صوت فاخرة مع عزل ضوضاء نشط وجودة صوتية عالية.',
    buttonText: 'اشترِ الآن',
    link: '/products',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp',
    price: 349,
    oldPrice: 549,
    discount: 36,
    bgColor: 'bg-slate-100',
  },
  {
    id: 's2',
    badge: 'عرض محدود',
    title: 'Apple Watch Series 4',
    highlight: 'خصم 30%',
    description: 'ساعة ذكية أنيقة بتتبع اللياقة والنوم وشاشة ريتينا رائعة.',
    buttonText: 'اشترِ الآن',
    link: '/products',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp',
    price: 245,
    oldPrice: 349,
    discount: 30,
    bgColor: 'bg-amber-50',
  },
  {
    id: 's3',
    badge: 'خيار المميزين',
    title: 'Apple AirPower',
    highlight: 'خصم 25%',
    description: 'شاحن لاسلكي يشحن أجهزتك بسهولة تامة دون أسلاك.',
    buttonText: 'اشترِ الآن',
    link: '/products',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/1.webp',
    price: 59,
    oldPrice: 79,
    discount: 25,
    bgColor: 'bg-red-50',
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState(STATIC_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgError, setImgError] = useState(false);

  // إعادة تعيين حالة خطأ الصورة عند تغيير الشريحة
  useEffect(() => {
    setImgError(false);
  }, [currentIndex, slides]);

  // محاولة جلب عروض حقيقية، مع الإبقاء على الشرائح الأساسية إن فشل الطلب
  useEffect(() => {
    let cancelled = false;
    getOffers(8)
      .then((res) => {
        if (cancelled) return;
        const list = (res || [])
          .map((p, i) => {
            const m = mapProduct(p);
            const discount =
              m.isOffer && m.oldPrice > m.price
                ? Math.round(((m.oldPrice - m.price) / m.oldPrice) * 100)
                : 0;
            return {
              id: m.id,
              badge: m.brand || 'عرض حصري',
              title: m.name,
              highlight: discount > 0 ? `خصم ${discount}%` : 'عرض لفترة محدودة',
              description: stripHtml(m.description).slice(0, 130),
              buttonText: 'اشترِ الآن',
              link: `/product/${m.slug}`,
              image: m.image,
              price: m.price,
              oldPrice: m.oldPrice,
              discount,
              bgColor: BG_COLORS[i % BG_COLORS.length],
            };
          })
          .filter((s) => s.image);

        // الحفاظ على شرائح متعددة حتى يستمر أنيميشن القلب دائماً
        if (list.length) {
          const combined = list.length >= 2 ? list : [...list, ...STATIC_SLIDES];
          setSlides(combined.slice(0, 6));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // خوارزمية التبديل التلقائي المتزامنة مع الـ CSS
  const changeSlide = (newIndex) => {
    if (isAnimating || slides.length < 2) return;

    setIsAnimating(true);

    // تغيير المحتوى خلف الكتل المغلقة
    setTimeout(() => {
      setCurrentIndex(newIndex);
    }, 600);

    // إنهاء الأنيميشن بعد اكتمال انسحاب الكتل
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  // إعادة ضبط المؤشر إذا تغيّر عدد الشرائح
  useEffect(() => {
    if (currentIndex >= slides.length) setCurrentIndex(0);
  }, [slides.length, currentIndex]);

  // التبديل التلقائي كل 6 ثوانٍ
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      changeSlide((currentIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAnimating, slides.length]);

  const slide = useMemo(
    () => slides[Math.min(currentIndex, slides.length - 1)] || STATIC_SLIDES[0],
    [slides, currentIndex]
  );

  const hasImage = Boolean(slide.image) && !imgError;

  return (
    <div className="relative w-full min-h-[58vh] md:min-h-[62vh] bg-neutral-950 text-white rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center mt-6 border border-neutral-800">

      {/* ستايلات الأنيميشن الخارقة (Wipe & Reveal) */}
      <style>
        {`
          /* حركة مسح النصوص: تنطلق من اليمين لليسار ثم تنسحب */
          @keyframes text-wipe {
            0% { transform: scaleX(0); transform-origin: right; }
            45% { transform: scaleX(1); transform-origin: right; }
            55% { transform: scaleX(1); transform-origin: left; }
            100% { transform: scaleX(0); transform-origin: left; }
          }

          /* حركة مسح الصورة: تنطلق من الأعلى للأسفل ثم تنسحب */
          @keyframes image-wipe {
            0% { transform: scaleY(0); transform-origin: top; }
            45% { transform: scaleY(1); transform-origin: top; }
            55% { transform: scaleY(1); transform-origin: bottom; }
            100% { transform: scaleY(0); transform-origin: bottom; }
          }

          /* الكتل الكاشفة (Revealers) */
          .revealer-text {
            position: absolute;
            inset: 0;
            background-color: #dc2626;
            z-index: 50;
            transform: scaleX(0);
          }
          .revealer-image {
            position: absolute;
            inset: 0;
            background-color: #0a0a0a;
            z-index: 50;
            transform: scaleY(0);
          }

          .animate-wipe-text { animation: text-wipe 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
          .animate-wipe-image { animation: image-wipe 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; }

          /* إخفاء المحتوى بلمحة سريعة أثناء التبديل لمنع التشوه البصري */
          @keyframes content-fade {
            0%, 40% { opacity: 1; }
            41%, 59% { opacity: 0; }
            60%, 100% { opacity: 1; }
          }
          .animate-content { animation: content-fade 1.2s forwards; }
        `}
      </style>

      <div className="container mx-auto px-6 md:px-16 py-8 md:py-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">

        {/* القسم الأيمن (النصوص) */}
        <div className="flex-1 w-full relative">

          {/* كتلة المسح الحمراء التي تغطي النص وتكشفه */}
          <div className={`revealer-text rounded-2xl ${isAnimating ? 'animate-wipe-text' : ''}`}></div>

          {/* المحتوى النصي */}
          <div className={`space-y-4 md:space-y-5 ${isAnimating ? 'animate-content' : ''}`}>

            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-neutral-300 px-4 py-1.5 rounded-md text-xs md:text-sm font-bold">
              <Sparkles size={15} className="text-red-500" />
              {slide.badge}
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.15] tracking-tight line-clamp-2">
                {slide.title}
              </h1>
              <span className="block text-red-500 text-base md:text-xl font-black mt-2">
                {slide.highlight}
              </span>
            </div>

            {slide.description && (
              <p className="text-neutral-400 text-sm md:text-base font-medium max-w-lg leading-relaxed line-clamp-2">
                {slide.description}
              </p>
            )}

            {/* السعر والخصم */}
            {slide.price > 0 && (
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  {slide.oldPrice > 0 && (
                    <span className="block text-neutral-500 text-sm font-bold line-through mb-1">
                      {formatPrice(slide.oldPrice)}
                    </span>
                  )}
                  <span className="block text-3xl md:text-4xl font-black text-white" dir="ltr">
                    {formatPrice(slide.price)}
                  </span>
                </div>
                {slide.discount > 0 && (
                  <span className="bg-red-600 text-white font-black px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    <ArrowLeft size={16} className="rotate-45" /> {slide.discount}%
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={slide.link}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3.5 md:px-8 md:py-4 rounded-xl flex items-center gap-2 transition-all hover:-translate-x-2"
              >
                <ShoppingBag size={18} /> {slide.buttonText}
              </Link>
              <Link
                to="/offers"
                className="bg-transparent border border-neutral-700 hover:border-neutral-400 text-white font-bold px-6 py-3.5 md:px-8 md:py-4 rounded-xl flex items-center gap-2 transition-colors"
              >
                استكشف العروض <ArrowLeft size={18} />
              </Link>
            </div>

          </div>
        </div>

        {/* القسم الأيسر (صورة المنتج) */}
        <div className="flex-1 w-full lg:w-1/2 flex justify-center relative h-[36vh] md:h-[42vh]">

          {/* الحاوية ذات الحواف الدائرية التي تحتوي الصورة */}
          <div className={`relative w-full max-w-lg h-full rounded-[1.75rem] overflow-hidden flex items-center justify-center p-6 md:p-8 transition-colors duration-500 ${hasImage ? slide.bgColor : 'bg-neutral-900'}`}>

            {/* كتلة المسح السوداء التي تنزل من فوق الصورة */}
            <div className={`revealer-image ${isAnimating ? 'animate-wipe-image' : ''}`}></div>

            {hasImage ? (
              <img
                src={slide.image}
                alt={slide.title}
                onError={() => setImgError(true)}
                className={`w-full h-full object-contain relative z-10 drop-shadow-2xl mix-blend-multiply ${isAnimating ? 'animate-content' : ''}`}
              />
            ) : (
              <div className={`relative z-10 flex flex-col items-center gap-3 text-red-500 ${isAnimating ? 'animate-content' : ''}`}>
                <Sparkles size={72} strokeWidth={1.2} />
                <span className="text-neutral-400 text-sm font-bold">أفضل الصفقات بانتظارك</span>
              </div>
            )}

            {/* تفاصيل صغيرة أسفل الصورة */}
            <div className={`absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 ${isAnimating ? 'animate-content' : ''}`}>
              <Zap size={14} className="text-red-600" /> متوفر في المخزون
            </div>
          </div>

        </div>

      </div>

      {/* أزرار التحكم ومؤشرات التقدم */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 bg-neutral-900/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-neutral-800">

          <button
            onClick={() => changeSlide((currentIndex - 1 + slides.length) % slides.length)}
            className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={isAnimating}
          >
            <ChevronRight size={22} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => changeSlide(index)}
                className="h-1.5 rounded-full bg-neutral-700 cursor-pointer overflow-hidden transition-all duration-300"
                style={{ width: currentIndex === index ? '40px' : '16px' }}
              >
                <div
                  className={`h-full bg-red-600 w-full transition-transform duration-[6000ms] ease-linear origin-left ${currentIndex === index && !isAnimating ? 'scale-x-100' : 'scale-x-0'}`}
                ></div>
              </div>
            ))}
          </div>

          <button
            onClick={() => changeSlide((currentIndex + 1) % slides.length)}
            className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={isAnimating}
          >
            <ChevronLeft size={22} />
          </button>
        </div>
      )}

    </div>
  );
}
