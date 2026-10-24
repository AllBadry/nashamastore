// ============================================================================
//  أدوات "الرف": المفضلة والسلة — تُخزَّن في localStorage
//  كل تغيير يطلق حدثاً (nashama:shelf) ليتحدث الناف بار وعدّاد السلة فوراً
//  عناصر السلة: { id, qty } — مع توافق مع التنسيق القديم (سلاسل فقط)
// ============================================================================

const FAV_KEY = 'nashama-favorites';
const CART_KEY = 'nashama-cart';
const EVENT = 'nashama:shelf';

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage غير متاح */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

// تطبيع عناصر السلة: القديمة (سلاسل) تُعتبر كميّة 1
const readCart = () =>
  read(CART_KEY)
    .map((item) => {
      if (typeof item === 'string') return { id: item, qty: 1 };
      return { id: item?.id, qty: Math.max(1, Math.floor(Number(item?.qty) || 1)) };
    })
    .filter((item) => Boolean(item.id));

export const getFavorites = () => read(FAV_KEY);

export const isFavorite = (id) => getFavorites().includes(id);

export const toggleFavorite = (id) => {
  const list = getFavorites();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  write(FAV_KEY, next);
  return next;
};

export const getCart = () => readCart();

export const getCartCount = () => readCart().reduce((sum, item) => sum + item.qty, 0);

export const addToCart = (id) => {
  const list = readCart();
  const found = list.find((item) => item.id === id);
  if (found) found.qty += 1;
  else list.push({ id, qty: 1 });
  write(CART_KEY, list);
  return getCartCount();
};

export const setCartQty = (id, qty) => {
  const nextQty = Math.max(0, Math.floor(Number(qty) || 0));
  let list = readCart();
  if (nextQty <= 0) {
    list = list.filter((item) => item.id !== id);
  } else {
    const found = list.find((item) => item.id === id);
    if (found) found.qty = nextQty;
  }
  write(CART_KEY, list);
  return getCartCount();
};

export const removeFromCart = (id) => {
  write(CART_KEY, readCart().filter((item) => item.id !== id));
};

// إفراغ السلّة المحلية بالكامل (يُستخدم بعد مزامنتها مع السيرفر أو بعد الطلب)
export const clearCart = () => {
  write(CART_KEY, []);
};

export const onShelfChange = (callback) => {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
};