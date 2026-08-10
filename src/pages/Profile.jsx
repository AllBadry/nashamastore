import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Phone, ShoppingBag, MapPin, Package, X, LogIn,
  CalendarDays, PackageOpen, ShoppingCart, ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrdersStore } from '../store/ordersStore';
import { formatPrice } from '../utils/product';
import { statusMeta, formatOrderDate, PAYMENT_METHOD_LABELS } from '../utils/order';

function OrderCard({ order, onCancel, cancelling }) {
  const status = statusMeta(order.status);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* ترويسة الطلب */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <Package size={16} />
          </span>
          <div>
            <p className="text-sm font-black text-neutral-900" dir="ltr">{order.orderNumber}</p>
            <p className="text-[11px] text-neutral-400 font-medium">{formatOrderDate(order.createdAt)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-black rounded-full border px-3 py-1.5 ${status.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
          {status.label}
        </span>
      </div>

      {/* المنتجات */}
      <div className="px-5 py-4 space-y-3">
        {order.items.map((item) => (
          <div key={item._id || item.productId} className="flex items-center gap-3">
            <Link
              to={`/product/${item.slug}`}
              className="w-14 h-14 shrink-0 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={20} className="text-neutral-300" />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="block text-sm font-bold text-neutral-800 hover:text-red-600 transition-colors truncate">
                {item.name}
              </Link>
              <p className="text-[11px] text-neutral-400 font-medium">
                الكمية: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <span className="text-sm font-black text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* التذييل */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-neutral-400" /> {order.shippingAddress?.governorate}</span>
          <span className="flex items-center gap-1.5"><Mail size={13} className="text-neutral-400" /> {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</span>
        </div>
        <div className="flex items-center gap-4">
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={cancelling}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              <X size={14} /> {cancelling ? 'جارٍ الإلغاء...' : 'إلغاء الطلب'}
            </button>
          )}
          <div className="text-left">
            <span className="block text-[10px] text-neutral-400 font-medium">الإجمالي</span>
            <span className="block text-lg font-black text-neutral-900">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonOrder() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="h-4 w-32 bg-neutral-100 rounded-full"></div>
        <div className="h-6 w-24 bg-neutral-100 rounded-full"></div>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-14 h-14 bg-neutral-100 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-neutral-100 rounded-full"></div>
          <div className="h-3 w-1/2 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
      <div className="h-10 bg-neutral-100 rounded-xl"></div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, cartCount, cartTotal } = useAuthStore();
  const { orders, loading: ordersLoading, fetchOrders, cancelOrder } = useOrdersStore();

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn, fetchOrders]);

  const stats = useMemo(() => {
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    return {
      total: orders.length,
      active: orders.filter((o) => o.status !== 'cancelled').length,
      cancelled,
    };
  }, [orders]);

  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelOrder(id);
    } catch {
      // الخطأ يظهر عبر تحديث الحالة في التطبيق
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5 py-6">
        <div className="h-32 bg-white rounded-3xl border border-neutral-100 animate-pulse"></div>
        <div className="grid gap-4">
          {[1, 2].map((i) => <SkeletonOrder key={i} />)}
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-5 bg-red-50 text-red-600 rounded-full flex items-center justify-center animate-float">
          <LogIn size={34} />
        </div>
        <h1 className="text-2xl font-black text-neutral-900 mb-2">سجّل دخولك</h1>
        <p className="text-neutral-500 font-medium mb-7">يجب تسجيل الدخول لعرض ملفك الشخصي ومشترياتك</p>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
        >
          <LogIn size={18} /> تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-fade-up">
      {/* بطاقة المستخدم */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-red-600/25 shrink-0">
          {user?.name?.charAt(0) || 'م'}
        </div>
        <div className="flex-1 text-center sm:text-right">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mb-1">{user?.name}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 text-sm text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5"><Mail size={14} className="text-neutral-400" /> <span dir="ltr">{user?.email}</span></span>
            {user?.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-neutral-400" /> <span dir="ltr">{user.phone}</span></span>}
            <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-neutral-400" /> عضو منذ {user?.createdAt ? formatOrderDate(user.createdAt) : ''}</span>
          </div>
        </div>
        <Link
          to="/offers"
          className="shrink-0 inline-flex items-center gap-2 text-sm font-black text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-full transition-colors"
        >
          <ShoppingBag size={15} /> تسوّق الآن
        </Link>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'إجمالي الطلبات', value: stats.total, icon: <Package size={18} /> },
          { label: 'طلبات نشطة', value: stats.active, icon: <PackageOpen size={18} /> },
          { label: 'طلبات ملغاة', value: stats.cancelled, icon: <X size={18} /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 p-4 text-center">
            <span className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              {stat.icon}
            </span>
            <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ملخص السلة */}
      <Link
        to="/cart"
        className="block bg-gradient-to-l from-red-600 to-red-500 text-white rounded-2xl shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/25 hover:-translate-y-0.5 transition-all"
      >
        <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
            <div>
              <p className="font-black text-sm md:text-base">سلة التسوق</p>
              <p className="text-xs text-white/80 font-medium">
                {cartCount > 0 ? `${cartCount} منتج بقيمة ${formatPrice(cartTotal)}` : 'سلتك فارغة'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-black bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-colors">
            عرض السلة <ArrowLeft size={15} />
          </span>
        </div>
      </Link>

      {/* مشترياتي */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-neutral-900 flex items-center gap-3">
            <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
            مشترياتي
          </h2>
          {orders.length > 0 && (
            <button
              onClick={() => fetchOrders(true)}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              تحديث
            </button>
          )}
        </div>

        {ordersLoading && orders.length === 0 ? (
          <div className="grid gap-4">
            {[1, 2].map((i) => <SkeletonOrder key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-100 text-center py-14 px-6">
            <div className="w-20 h-20 mx-auto mb-5 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center animate-float">
              <Package size={34} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-neutral-800 mb-2">لا توجد مشتريات بعد</h3>
            <p className="text-sm text-neutral-500 font-medium mb-6">
              عندما تشتري أي منتج، ستظهر طلباتك هنا لمتابعة حالتها
            </p>
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-7 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <ShoppingBag size={17} /> ابدأ التسوق
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancel}
                cancelling={cancellingId === order._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
