import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import apiClient from '../api/client';

const Contact = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: t('contact.subjects')[0],
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    document.title = `${t('contact.title')} — Nashama`;
    const ctx = gsap.context(() => {
      gsap.from('.contact-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
      gsap.from('.contact-glow', { opacity: 0, duration: 1.2, ease: 'power2.out' });
    }, ref);
    return () => ctx.revert();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await apiClient.post('/contact', form);
      if (res.status === 200 || res.status === 201) {
        setNotice({ type: 'success', text: t('contact.sent') });
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: t('contact.subjects')[0],
          message: '',
        });
      } else {
        setNotice({ type: 'error', text: t('contact.error') });
      }
    } catch (err) {
      setNotice({
        type: 'error',
        text: err.response?.data?.message || t('contact.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} dir="rtl" className="relative bg-[#05060a] min-h-screen pt-28 pb-24 overflow-hidden font-sans">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,21,26,0.12),transparent_65%)]"></div>
      <div className="contact-glow pointer-events-none absolute -bottom-40 right-1/2 translate-x-1/2 w-[800px] h-[400px] bg-[#8b151a]/12 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="contact-in mb-10 text-center">
          <span className="text-[10px] tracking-[0.35em] text-[#8b151a] uppercase font-bold">NASHAMA</span>
          <h1 className="font-['Bebas_Neue',_sans-serif] text-4xl md:text-6xl text-white tracking-wide mt-2">
            {t('contact.title')}
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          <aside className="contact-in space-y-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#8b151a]/25 to-transparent p-6">
              <h2 className="font-black text-white text-lg mb-2">{t('contact.infoTitle')}</h2>
              <p className="text-gray-400 text-sm mb-5">{t('contact.infoDesc')}</p>

              <div className="space-y-4">
                <a
                  href={`mailto:${t('contact.contactEmail')}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#fca5a5]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">{t('contact.emailLabel')}</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#fca5a5] transition-colors">{t('contact.contactEmail')}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${t('contact.whatsapp').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22c55e]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">{t('contact.phoneLabel')}</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#22c55e] transition-colors">{t('contact.whatsapp')}</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">{t('contact.addressLabel')}</p>
                    <p className="text-sm font-bold text-white">{t('contact.address')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">{t('contact.hoursLabel')}</p>
                    <p className="text-sm font-bold text-white">{t('contact.hours')}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="contact-in rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.name')}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.placeholder.name')}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b151a]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.email')}</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.placeholder.email')}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b151a]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.phone')}</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t('contact.placeholder.phone')}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b151a]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.subject')}</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b151a]/60 transition-colors"
                >
                  {t('contact.subjects').map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.message')}</label>
              <textarea
                name="message"
                rows={7}
                value={form.message}
                onChange={handleChange}
                required
                placeholder={t('contact.placeholder.message')}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b151a]/60 transition-colors"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t('contact.sending') : t('contact.submit')}
              </button>

              {notice.text && (
                <p
                  className={`text-sm ${
                    notice.type === 'success'
                      ? 'text-emerald-400'
                      : 'text-amber-400/90'
                  }`}
                >
                  {notice.text}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;