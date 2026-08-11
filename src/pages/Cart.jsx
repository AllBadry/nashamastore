import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, Trash2, Minus, Plus, LogIn, Truck,
  ShieldCheck, Loader2, AlertCircle, ShoppingBag, CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../utils/product';
import CheckoutModal from '../components/CheckoutModal';

const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 3;

function CartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 bg-neutral-100 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-neutral-100 rounded-full"></div>
          <div className="h-4 w-1/3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const {
    user, isLoggedIn, loading,
    cart, cartTotal, fetchCart,
    updateCartItem, removeFromCart, clearCart,
  } = useAuthStore();

  const [updating, setUpdating] = useState(null); // productId قيد التحديث
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart().finally(() => setCartReady(true));
    }
  }, [isLoggedIn, fetchCart]);

  const changeQuantity = async (item, quantity) => {
    if (quantity < 1 || quantity > 50) return;
    setUpdating(item.productId);
    try {
      await updateCartItem(item.productId, quantity);
    } catch {
      // لا شيء
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId) => {
    setUpdating(productId);
    try {
      await removeFromCart(productId);
    } finally {
      setUpdating(null);
    }
  };

  const handleClear = async () => {
    await clearCart();
  };

  const handleOrderCreated = async () => {
    setCheckoutOpen(false);
    await clearCart();
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 py-6">
        {[1, 2, 3].map((i) => <CartSkeleton key={i} />)}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-5 bg-red-50 text-red-600 rounded-full flex items-center justify-center animate-float">
          <LogIn size={34} />
        </div>
        <h1 className="text-2xl font-black text-neutral-900 mb-2">سجّل دخولك لعرض السلة</h1>
        <p className="text-neutral-500 font-medium mb-7">سلة التسوق خاصة بحسابك، سجّل الدخول أولاً</p>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
        >
          <LogIn size={18} /> تسجيل الدخول
        </button>
      </div>
    );
  }

  if (!cartReady) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 py-6">
        {[1, 2].map((i) => <CartSkeleton key={i} />)}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
          <div className="w-20 h-20 mx-auto mb-5 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center animate-float">
            <ShoppingCart size={34} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 mb-2">سلتك فارغة</h1>
          <p className="text-neutral-500 font-medium mb-7">لم تضف أي منتجات بعد، ابدأ التسوق الآن</p>
          <Link
            to="/offers"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
          >
            <ShoppingBag size={18} /> تسوّق الآن
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const remainingForFree = FREE_SHIPPING_MIN - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-900 flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-full inline-block"></span>
          سلة التسوق
        </h1>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} /> إفراغ السلة
        </button>
      </div>

      {/* شريط التوصيل المجاني */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2">
          <Truck size={16} className="text-red-500" />
          {remainingForFree > 0 ? (
            <span>أضف <span className="text-red-600">{formatPrice(remainingForFree)}</span> لتحصل على توصيل مجاني</span>
          ) : (
            <span className="text-green-600">ممتاز! حصلت على توصيل مجاني</span>
          )}
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* عناصر السلة */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link
                  to={`/product/${item.slug}`}
                  className="w-20 h-20 shrink-0 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="text-neutral-300" />
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.slug}`}
                    className="block text-sm font-bold text-neutral-900 hover:text-red-600 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <span className="text-[11px] font-bold text-red-500">{item.brand}</span>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {item.isOffer && item.oldPrice > 0 && (
                      <span className="text-xs text-neutral-400 line-through font-medium">
                        {formatPrice(item.oldPrice)}
                      </span>
                    )}
                    <span className="text-base font-black text-neutral-900">{formatPrice(item.price)}</span>
                    {!item.available && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                        غير متوفر
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* التحكم بالكمية والإجمالي */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
                <div className="flex flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => changeQuantity(item, item.quantity - 1)}
                      disabled={updating === item.productId || item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-neutral-900 text-sm">
                      {updating === item.productId ? <Loader2 size={14} className="animate-spin mx-auto" /> : item.quantity}
                    </span>
                    <button
                      onClick={() => changeQuantity(item, item.quantity + 1)}
                      disabled={updating === item.productId || item.quantity >= 50}
                      className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={updating === item.productId}
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} /> إزالة
                  </button>
                </div>

                <div className="shrink-0 text-left">
                  <span className="block text-[10px] text-neutral-400 font-medium">الإجمالي</span>
                  <span className="block text-lg font-black text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/offers"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <ShoppingBag size={16} /> متابعة التسوق
          </Link>
        </div>

        {/* الملخص */}
        <div className="h-fit">
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-neutral-900 mb-5 flex items-center gap-2">
              <CreditCard size={17} className="text-red-500" /> ملخص الطلب
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between font-medium text-neutral-600">
                <span>المجموع الفرعي</span>
                <span className="font-black text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between font-medium text-neutral-600">
                <span>الشحن</span>
                {shippingFee === 0 ? (
                  <span className="font-black text-green-600">مجاني</span>
                ) : (
                  <span className="font-black text-neutral-900">{formatPrice(shippingFee)}</span>
                )}
              </div>
              <div className="border-t border-dashed border-neutral-200 pt-3 flex items-center justify-between">
                <span className="font-black text-neutral-900">الإجمالي</span>
                <span className="text-xl font-black text-red-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <ShoppingBag size={18} /> إتمام الطلب
            </button>

            <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                <Truck size={15} className="text-blue-500" /> توصيل سريع لكافة المحافظات
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                <ShieldCheck size={15} className="text-green-500" /> كفالة الوكيل لمدة عام
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        fromCart
        onClose={() => setCheckoutOpen(false)}
        onCreated={handleOrderCreated}
      />
    </div>
  );
}
