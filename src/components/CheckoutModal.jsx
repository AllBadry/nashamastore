import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MapPin, Phone, User, Banknote, CreditCard, CalendarClock,
  Loader2, ShoppingBag, CheckCircle2, AlertCircle, Truck, Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useOrdersStore } from '../store/ordersStore';
import { PAYMENT_METHOD_LABELS } from '../utils/order';
import { formatPrice } from '../utils/product';

const GOVERNORATES = [
  'عمان', 'إربد', 'الزرقاء', 'البلقاء', 'مادبا', 'عجلون',
  'جرش', 'المفرق', 'الطفيلة', 'الكرك', 'معان', 'العقبة',
];

const PAYMENT_METHODS = [
  { id: 'cash', icon: <Banknote size={18} />, title: 'الدفع عند الاستلام', desc: 'ادفع نقداً عند وصول الطلب' },
  { id: 'card', icon: <CreditCard size={18} />, title: 'بطاقة ائتمان', desc: 'Visa / Mastercard عبر بوابة دفع آمنة' },
  { id: 'installments', icon: <CalendarClock size={18} />, title: 'تقسيط', desc: 'قسّط دفعاتك على دفعات مريحة' },
];

const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 3;

export default function CheckoutModal({ open, items = [], fromCart = false, onClose, onCreated }) {
  const { user, cart } = useAuthStore();
  const { createOrder } = useOrdersStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    governorate: '',
    city: '',
    street: '',
    building: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.name || '',
        phone: user?.phone || '',
        governorate: user?.addresses?.find((a) => a.isDefault)?.governorate || '',
        city: user?.addresses?.find((a) => a.isDefault)?.city || '',
        street: user?.addresses?.find((a) => a.isDefault)?.street || '',
        building: '',
        notes: '',
      });
      setPaymentMethod('cash');
      setError('');
      setPlacedOrder(null);
    }
  }, [open, user]);

  // ملخص الطلب: من السلة أو من المنتجات المختارة
  const summaryItems = useMemo(() => {
    if (fromCart) {
      return (cart || []).map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        image: item.image,
      }));
    }
    return (items || []).map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name || 'منتج',
      price: Number(item.price) || 0,
      quantity: item.quantity || 1,
      image: item.image,
    }));
  }, [fromCart, cart, items]);

  const { subtotal, shippingFee, total } = useMemo(() => {
    const sub = summaryItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = sub >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    return { subtotal: Number(sub.toFixed(2)), shippingFee: shipping, total: Number((sub + shipping).toFixed(2)) };
  }, [summaryItems]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.phone || !form.governorate) {
      setError('يرجى تعبئة الاسم ورقم الهاتف والمحافظة');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        items,
        fromCart,
        address: {
          name: form.name,
          phone: form.phone,
          governorate: form.governorate,
          city: form.city,
          street: form.street,
          building: form.building,
          notes: form.notes,
        },
        paymentMethod,
      });
      setPlacedOrder(order);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تأكيد الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    const order = placedOrder;
    setPlacedOrder(null);
    onCreated?.(order);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={placedOrder ? undefined : onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col animate-scale-in">
        {/* الترويسة */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              {placedOrder ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
            </span>
            <div>
              <h2 className="text-lg font-black text-neutral-900">
                {placedOrder ? 'تم تأكيد الطلب' : 'إتمام الطلب'}
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                {placedOrder ? 'شكراً لثقتك بنشامى ستور' : 'أكمل بيانات الشحن لتأكيد شرائك'}
              </p>
            </div>
          </div>
          {!placedOrder && (
            <button
              onClick={onClose}
              className="p-2 bg-neutral-50 text-neutral-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {placedOrder ? (
          /* ======== شاشة النجاح ======== */
          <div className="flex-1 overflow-y-auto p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center animate-scale-in">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 mb-2">شكراً لك! تم استلام طلبك</h3>
            <p className="text-neutral-500 font-medium mb-1">
              رقم الطلب <span className="font-black text-neutral-900" dir="ltr">{placedOrder.orderNumber}</span>
            </p>
            <p className="text-neutral-500 font-medium mb-6">
              إجمالي المبلغ <span className="font-black text-red-600">{formatPrice(placedOrder.total)}</span>
            </p>

            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-right space-y-2 mb-6">
              <p className="text-sm font-black text-neutral-800 flex items-center gap-2">
                <Truck size={16} className="text-red-500" /> تفاصيل التوصيل
              </p>
              <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                {placedOrder.shippingAddress.governorate}
                {placedOrder.shippingAddress.city ? ` - ${placedOrder.shippingAddress.city}` : ''}
                {placedOrder.shippingAddress.street ? ` - ${placedOrder.shippingAddress.street}` : ''}
              </p>
              <p className="text-xs text-neutral-500 font-medium">
                الدفع: {PAYMENT_METHOD_LABELS[placedOrder.paymentMethod] || placedOrder.paymentMethod}
              </p>
              <p className="text-xs text-neutral-400 font-medium">سنتواصل معك على رقم {placedOrder.shippingAddress.phone} لتأكيد الطلب</p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <ShoppingBag size={18} /> عرض مشترياتي
            </button>
          </div>
        ) : (
          <>
            {/* ======== المحتوى ======== */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-2xl p-3.5">
                  <AlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}

              {/* ملخص الطلب */}
              {summaryItems.length > 0 && (
                <section>
                  <h3 className="text-sm font-black text-neutral-800 mb-3 flex items-center gap-2">
                    <ShoppingBag size={15} className="text-red-500" /> ملخص الطلب
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-3 space-y-2.5">
                    {summaryItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <span className="w-10 h-10 shrink-0 rounded-lg bg-white border border-neutral-100 overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="text-neutral-300" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          {item.slug ? (
                            <Link to={`/product/${item.slug}`} className="block text-xs font-bold text-neutral-800 hover:text-red-600 transition-colors truncate">
                              {item.name}
                            </Link>
                          ) : (
                            <p className="text-xs font-bold text-neutral-800 truncate">{item.name}</p>
                          )}
                          <p className="text-[11px] text-neutral-400 font-medium">{item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className="text-xs font-black text-neutral-900 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-neutral-200 pt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                        <span>المجموع الفرعي</span>
                        <span className="font-black text-neutral-900">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                        <span>الشحن</span>
                        {shippingFee === 0 ? (
                          <span className="font-black text-green-600">مجاني</span>
                        ) : (
                          <span className="font-black text-neutral-900">{formatPrice(shippingFee)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm font-black text-neutral-900">
                        <span>الإجمالي</span>
                        <span className="text-red-600">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* بيانات التواصل */}
              <section>
                <h3 className="text-sm font-black text-neutral-800 mb-3 flex items-center gap-2">
                  <MapPin size={15} className="text-red-500" /> عنوان التوصيل
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block col-span-2">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">الاسم الكامل</span>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"><User size={16} /></span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="مثال: أحمد محمد"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-3 pr-10 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                      />
                    </div>
                  </label>
                  <label className="block col-span-2">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">رقم الهاتف</span>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"><Phone size={16} /></span>
                      <input
                        type="tel"
                        dir="ltr"
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="079xxxxxxxx"
                        className="w-full text-left bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-3 pr-10 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">المحافظة *</span>
                    <select
                      value={form.governorate}
                      onChange={set('governorate')}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                    >
                      <option value="">اختر المحافظة</option>
                      {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">المدينة</span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={set('city')}
                      placeholder="مثال: وسط البلد"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">الشارع</span>
                    <input
                      type="text"
                      value={form.street}
                      onChange={set('street')}
                      placeholder="اسم الشارع"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-neutral-500 mb-1 block">رقم المبنى</span>
                    <input
                      type="text"
                      value={form.building}
                      onChange={set('building')}
                      placeholder="مثال: 25"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                    />
                  </label>
                </div>
              </section>

              {/* طريقة الدفع */}
              <section>
                <h3 className="text-sm font-black text-neutral-800 mb-3 flex items-center gap-2">
                  <CreditCard size={15} className="text-red-500" /> طريقة الدفع
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-right ${
                        paymentMethod === method.id
                          ? 'border-red-600 bg-red-50/50'
                          : 'border-neutral-100 hover:border-neutral-200'
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        paymentMethod === method.id ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {method.icon}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-black text-neutral-900">{method.title}</span>
                        <span className="block text-[11px] text-neutral-400 font-medium">{method.desc}</span>
                      </span>
                      {paymentMethod === method.id && <CheckCircle2 size={18} className="text-red-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* ملاحظات */}
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 mb-1 block">ملاحظات (اختياري)</span>
                <textarea
                  value={form.notes}
                  onChange={set('notes')}
                  rows="2"
                  placeholder="أي ملاحظات حول الطلب أو التوصيل"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none"
                />
              </label>
            </form>

            {/* التذييل */}
            <div className="p-5 border-t border-neutral-100 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-neutral-500 flex items-center gap-1.5">
                  <Truck size={15} className="text-red-500" /> توصيل سريع
                </span>
                <span className="text-sm font-black text-red-600">{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || summaryItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                {submitting ? 'جارٍ تأكيد الطلب...' : `تأكيد الطلب (${PAYMENT_METHOD_LABELS[paymentMethod]})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
