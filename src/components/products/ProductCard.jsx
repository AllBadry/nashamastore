import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '../../utils/product';

export default function ProductCard({ product }) {
  const discount = product.isOffer && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)] hover:border-red-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full"
    >
      {/* صورة المنتج */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm font-medium">
            لا توجد صورة
          </div>
        )}

        {/* شارة التخفيض */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            خصم {discount}%
          </span>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        <span className="text-[11px] font-bold text-red-500 tracking-wide">{product.brand}</span>
        <h3 className="font-bold text-sm text-neutral-900 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* التقييم */}
        {product.avgRate > 0 && (
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold">{Number(product.avgRate).toFixed(1)}</span>
          </div>
        )}

        {/* السعر */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.isOffer && product.oldPrice > 0 && (
              <span className="text-xs text-neutral-400 line-through font-medium">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-black text-neutral-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-50 text-neutral-700 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
            <ShoppingCart size={16} strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
