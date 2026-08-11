// الـ API الخاص بنشامى ستور
// أثناء التطوير (dev) نستخدم الـ Vite proxy: /api/v1 -> سيرفر محلي، باقي /api -> الـ API البعيد
// في الإنتاج نستخدم VITE_API_URL أو الـ API البعيد افتراضياً
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://api.nashamastore.com/api');

// المفتاح السري للـ API (اختياري: يُرسل فقط إن تم ضبطه)
const API_KEY = import.meta.env.VITE_STORE_SECRET_KEY || '';

async function request(path) {
  const headers = {};
  if (API_KEY) headers['x-api-key'] = API_KEY;

  const res = await fetch(`${API_URL}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`فشل الطلب (${res.status})`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'حدث خطأ في جلب البيانات');
  }
  return json;
}

export function getLatestProducts(limit = 10) {
  return request(`/products/latest?limit=${limit}`).then((r) => r.data);
}

export function getOffers(limit = 10) {
  return request(`/products/offers?limit=${limit}`).then((r) => r.data);
}

export function getBrands() {
  return request('/brands').then((r) => r.data);
}

// category: تصنيف واحد، categories: مصفوفة تصنيفات (تُرسل مفصولة بفاصلة)
export function getProducts({ category, categories, brand, q, offer, limit = 20, skip = 0 } = {}) {
  const params = new URLSearchParams({ limit, skip });
  if (category) params.set('category', category);
  if (categories && categories.length) params.set('category', categories.join(','));
  if (brand) params.set('brand', brand);
  if (q) params.set('q', q);
  if (offer) params.set('offer', 'true');
  return request(`/products?${params.toString()}`);
}

export function getProductBySlug(slug) {
  return request(`/products/${slug}`).then((r) => r.data);
}

// جلب منتجات محددة حسب معرّفاتها (لصفحة المفضلة)
export function getProductsByIds(ids) {
  if (!ids || !ids.length) return Promise.resolve([]);
  return request(`/products/ids?ids=${ids.join(',')}`).then((r) => r.data);
}
