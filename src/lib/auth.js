// ============================================================================
//  طبقة المصادقة — نقطة واحدة لربط تسجيل الدخول لاحقاً
// ---------------------------------------------------------------------------
//  المصادقة غير مفعّلة حالياً (لا توجد مسارات auth في السيرفر).
//  كل الدوال هنا ترجع كائناً موحّداً حتى يسهل ربطها لاحقاً بدون تغيير الواجهة.
//
//  لتفعيلها:
//   1) أضف في السيرفر: POST /api/auth/login و POST /api/auth/google
//   2) في ملف .env للفرونت:  VITE_API_URL=...  و VITE_GOOGLE_CLIENT_ID=...
//   3) بدّل bodies الدالتين أدناه بطلب حقيقي + خزّن الجلسة (httpOnly cookie).
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// هل المصادقة مفعّلة؟ تحتاج مفاتيح ومفاتيح Google معاً.
export const isAuthReady = Boolean(import.meta.env.VITE_API_URL && GOOGLE_CLIENT_ID);

/** النتيجة الموحّدة لكل عمليات المصادقة. */
const ok = (user) => ({ ok: true, user });
const fail = (message) => ({ ok: false, message });

/**
 * تسجيل الدخول بالبريد وكلمة المرور.
 * @returns {Promise<{ok: boolean, user?: object, message?: string}>}
 */
export async function signIn({ email, password }) {
  if (!isAuthReady) {
    return fail('AUTH_NOT_READY');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return fail(data.message || 'فشل تسجيل الدخول، راجع بياناتك.');
    }

    return ok(data.user);
  } catch {
    return fail('تعذّر الاتصال بالسيرفر.');
  }
}

/**
 * تسجيل الدخول عبر Google.
 * عند التفعيل: افتح نافذة OAuth (أو استخدم Google Identity Services)
 * ثم أرسل الـ idToken إلى السيرفر للتحقق منه.
 */
export async function signInWithGoogle() {
  if (!isAuthReady) {
    return fail('AUTH_NOT_READY');
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ clientId: GOOGLE_CLIENT_ID }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return fail(data.message || 'فشل تسجيل الدخول عبر Google.');
    }

    return ok(data.user);
  } catch {
    return fail('تعذّر الاتصال بالسيرفر.');
  }
}
