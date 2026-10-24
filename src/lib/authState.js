// ============================================================================
//  حالة الجلسة التفاعلية — نقطة موحدة لقراءة/تخزين/مسح الجلسة من localStorage
//  تُرسل حدثاً (nashama:auth) عند أي تغيير ليستمع إليه الناف بار وغيره.
// ============================================================================

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const EVENT = 'nashama:auth';

export const getAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return { token: localStorage.getItem(TOKEN_KEY), user };
  } catch {
    return { token: null, user: null };
  }
};

export const hasSession = () => Boolean(localStorage.getItem(TOKEN_KEY));

const emit = () => window.dispatchEvent(new CustomEvent(EVENT));

export const storeAuth = ({ accessToken, user }) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emit();
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emit();
};

export const onAuthChange = (callback) => {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
};