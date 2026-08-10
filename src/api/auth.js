// الـ API الخاص بالمصادقة في نشامى ستور
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nashamastore.com/api';

const TOKEN_KEY = 'nashamastore_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function authRequest(path, { method = 'GET', body, withToken = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (withToken) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.message || `فشل الطلب (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return json;
}

// ==========================================
// دوال المصادقة
// ==========================================

export async function signup({ name, email, phone, password, passwordConfirm }) {
  const json = await authRequest('/v1/auth/signup', {
    method: 'POST',
    body: { name, email, phone, password, passwordConfirm },
    withToken: false,
  });
  setToken(json.accessToken);
  return json.data.user;
}

export async function login({ email, password }) {
  const json = await authRequest('/v1/auth/login', {
    method: 'POST',
    body: { email, password },
    withToken: false,
  });
  setToken(json.accessToken);
  return json.data.user;
}

export async function logout() {
  try {
    await authRequest('/v1/auth/logout', { method: 'GET' });
  } finally {
    setToken(null);
  }
}

export async function getMe() {
  const json = await authRequest('/v1/auth/me', { method: 'GET' });
  return json.data.user;
}

export async function updatePassword({ currentPassword, newPassword, newPasswordConfirm }) {
  const json = await authRequest('/v1/auth/update-password', {
    method: 'PATCH',
    body: { currentPassword, newPassword, newPasswordConfirm },
  });
  setToken(json.accessToken);
  return json.data.user;
}

// ==========================================
// دوال الطلبات (مشترياتي)
// ==========================================

export async function getMyOrders() {
  const json = await authRequest('/v1/orders/mine', { method: 'GET' });
  return json.data.orders;
}

export async function createOrder({ items, fromCart, address, paymentMethod, notes }) {
  const json = await authRequest('/v1/orders', {
    method: 'POST',
    body: { items, fromCart, address, paymentMethod, notes },
  });
  return json.data.order;
}

export async function getOrder(orderId) {
  const json = await authRequest(`/v1/orders/${orderId}`, { method: 'GET' });
  return json.data.order;
}

export async function cancelOrder(orderId) {
  const json = await authRequest(`/v1/orders/${orderId}/cancel`, { method: 'PATCH' });
  return json.data.order;
}

// ==========================================
// دوال المستخدم (الملف، السلة، المفضلة)
// ==========================================

export async function getCart() {
  const json = await authRequest('/v1/users/cart', { method: 'GET' });
  return json.data.cart;
}

export async function addToCart({ productId, quantity = 1 }) {
  const json = await authRequest('/v1/users/cart', {
    method: 'POST',
    body: { productId, quantity },
  });
  return json.data.cart;
}

export async function updateCartItem(productId, quantity) {
  const json = await authRequest(`/v1/users/cart/${productId}`, {
    method: 'PATCH',
    body: { quantity },
  });
  return json.data.cart;
}

export async function removeFromCart(productId) {
  const json = await authRequest(`/v1/users/cart/${productId}`, {
    method: 'DELETE',
  });
  return json.data.cart;
}

export async function clearCart() {
  const json = await authRequest('/v1/users/cart', { method: 'DELETE' });
  return json.data.cart;
}

export async function getWishlist() {
  const json = await authRequest('/v1/users/wishlist', { method: 'GET' });
  return json.data.wishlist;
}

export async function toggleWishlist(productId) {
  const json = await authRequest('/v1/users/wishlist/toggle', {
    method: 'POST',
    body: { productId },
  });
  return json.data.wishlist;
}

export async function getAddresses() {
  const json = await authRequest('/v1/users/addresses', { method: 'GET' });
  return json.data.addresses;
}

export async function addAddress(address) {
  const json = await authRequest('/v1/users/addresses', {
    method: 'POST',
    body: address,
  });
  return json.data.addresses;
}

export { getToken, setToken };
