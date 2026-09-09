import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import Reveal from '../components/shared/Reveal';
import { CartContext } from '../context/cartContext';
import { formatPrice } from '../lib/product';

export default function CartPage() {
  const { items, totalCount, totalPrice, updateQty, removeItem, clearCart } = useContext(CartContext);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      <div className="relative w-full pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-white overflow-hidden border-b border-neutral-100">
        <div className="absolute top-0 left-[15%] w-[8%] h-full bg-gradient-to-b from-blue-100 to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-0 left-[35%] w-[12%] h-full bg-gradient-to-b from-orange-100 via-pink-100 to-transparent opacity-50 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[40%] bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-80 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 font-mono block">
            Your Bag
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-neutral-900 tracking-tight leading-[1.1]">
            Shopping <br className="hidden md:block" />
            <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">
              Cart.
            </span>
          </h1>
          {items.length > 0 && (
            <p className="mt-6 text-neutral-500 font-medium text-sm">
              {totalCount} item{totalCount !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-12">
        {items.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-neutral-200 border-dashed">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={28} className="text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Your cart is empty</h3>
            <p className="text-neutral-500 mt-2 text-sm mb-8">Looks like you haven't added anything yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Items */}
            <Reveal className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[2rem] border border-neutral-100 p-5 flex items-center gap-5 hover:border-neutral-300 transition-colors"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#F7F7F8] flex items-center justify-center overflow-hidden flex-shrink-0"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-3 mix-blend-darken" />
                    ) : (
                      <span className="text-neutral-300 font-bold">NASHAMA</span>
                    )}
                  </Link>

                  <div className="flex-grow min-w-0">
                    <Link to={`/product/${item.slug}`} className="block text-sm md:text-base font-black text-neutral-900 truncate hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                    <span className="text-lg font-black text-neutral-900 mt-1 block">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center gap-3 bg-[#F7F7F8] rounded-full px-3 py-1.5">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center text-sm font-black text-neutral-900">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Clear cart
              </button>
            </Reveal>

            {/* Summary */}
            <Reveal delay={100}>
              <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.06)] p-8 sticky top-28">
                <h3 className="text-lg font-black text-neutral-900 mb-6">Order Summary</h3>

                <div className="space-y-3 border-b border-neutral-100 pb-6 mb-6">
                  <div className="flex justify-between text-sm font-medium text-neutral-600">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-bold text-neutral-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Total</span>
                  <span className="text-3xl font-black text-neutral-900">{formatPrice(totalPrice)}</span>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-neutral-900/10">
                  <Check size={18} /> Checkout
                </button>

                <p className="text-xs text-neutral-400 font-medium mt-4 text-center leading-relaxed">
                  Free shipping, official warranty & 14-day returns apply.
                </p>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}