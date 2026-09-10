import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, Plus, Check } from 'lucide-react';
import { CartContext } from '../../context/cartContext';
import {
  extractImage,
  getProductPrice,
  getOldPrice,
  formatPrice,
  isProductOnSale,
} from '../../lib/product';

export default function ProductCard({ product, wide = false, index = 0 }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const imageUrl = extractImage(product);
  const currentPrice = getProductPrice(product);
  const oldPrice = getOldPrice(product);
  const onSale = isProductOnSale(product) || (oldPrice && Number(oldPrice) > Number(currentPrice));

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const theme = index % 4;
  const imageBgs = [
    'bg-gradient-to-tr from-blue-50/60 to-transparent',
    'bg-gradient-to-tr from-rose-50/60 to-transparent',
    'bg-gradient-to-tr from-amber-50/60 to-transparent',
    'bg-gradient-to-tr from-emerald-50/60 to-transparent',
  ];

  const colSpan = wide ? 'sm:col-span-2' : 'col-span-1';

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group relative bg-white rounded-[2rem] p-5 flex overflow-hidden border border-neutral-100 hover:border-neutral-300 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 ${colSpan} ${
        wide ? 'flex-col sm:flex-row items-center gap-6' : 'flex-col justify-between'
      }`}
    >
      <div
        className={`relative rounded-3xl overflow-hidden bg-[#F7F7F8] flex items-center justify-center flex-shrink-0 ${
          wide ? 'w-full sm:w-[45%] h-48 sm:h-full' : 'w-full h-48 mb-4'
        }`}
      >
        <div className={`absolute inset-0 ${imageBgs[theme]} mix-blend-multiply opacity-60`}></div>

        {onSale && (
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

      <div
        className={`flex flex-col justify-between h-full relative z-20 ${
          wide ? 'w-full sm:w-[55%] py-4' : 'w-full flex-grow'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              {product.brand?.name || 'Edition'}
            </span>
          </div>

          <h3
            className={`font-black text-neutral-900 leading-tight tracking-tight transition-colors group-hover:text-blue-600 line-clamp-2 ${
              wide ? 'text-2xl md:text-3xl mb-3' : 'text-lg'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>

          {wide && product.description && (
            <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 font-medium">
              {product.description.replace(/<[^>]+>/g, '')}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
              Price
            </span>
            <div className="flex items-baseline gap-2">
              {oldPrice && Number(oldPrice) > Number(currentPrice) && (
                <span className="text-xs text-neutral-400 line-through font-medium">
                  {formatPrice(oldPrice)}
                </span>
              )}
              <span className={`font-black text-neutral-900 ${wide ? 'text-2xl' : 'text-xl'}`}>
                {formatPrice(currentPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              title="Add to cart"
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-neutral-100 text-neutral-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
              }`}
            >
              {added ? <Check size={18} /> : <Plus size={18} />}
            </button>
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-neutral-100 text-neutral-500 group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all duration-300">
              <ArrowUpLeft size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}