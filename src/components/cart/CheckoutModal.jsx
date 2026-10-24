import React, { useState } from 'react';
import { useLang } from '../../i18n';

// بوب اب الدفع: يخيّر العميل بين:
//   • الدفع بعملة المتجر (NC) من رصيد المحفظة — دفع كامل فوري وآمن.
//   • الدفع اليدوي بتحويل زين كاش + رفع صورة الإيصال (يتطلب تحقق الأدمن).
const CheckoutModal = ({
  open,
  onClose,
  total,
  totalNC = 0,
  balance = 0,
  onSubmitted,
  onSubmittedNC,
  receiverNumber,
}) => {
  const { t } = useLang();
  const money = `$${Number(total || 0).toFixed(2)}`;

  const canPayNC = Number(totalNC) > 0;
  const enoughNC = Number(balance) >= Number(totalNC);
  const [method, setMethod] = useState('manual'); // 'nc' | 'manual'

  const [senderNumber, setSenderNumber] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError(t('checkout.receiptInvalid'));
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submitManual = async () => {
    if (!file) {
      setError(t('checkout.receiptRequired'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmitted({ receiptFile: file, senderNumber });
    } catch (err) {
      setError(err?.response?.data?.message || t('common.error'));
      setLoading(false);
    }
  };

  const submitNC = async () => {
    if (!enoughNC) {
      setError(t('checkout.insufficientNC'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmittedNC();
    } catch (err) {
      setError(err?.response?.data?.message || t('common.error'));
      setLoading(false);
    }
  };

  const submit = () => (method === 'nc' ? submitNC() : submitManual());

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
      <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0e13] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          <h3 className="text-xl font-black text-white">{t('checkout.title')}</h3>
          <p className="text-sm text-gray-400 mt-1">{t('checkout.subtitle')}</p>

        {/* اختيار طريقة الدفع */}
        {canPayNC && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setMethod('nc'); setError(''); }}
              className={`rounded-2xl border p-4 text-start transition-colors ${
                method === 'nc'
                  ? 'border-amber-400/60 bg-amber-500/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <span className="block text-sm font-black text-white">{t('checkout.payNC')}</span>
              <span className="mt-1 block text-[11px] text-gray-400">{t('checkout.payNCHint')}</span>
              <span className="mt-2 inline-block text-lg font-black text-amber-300" dir="ltr">{totalNC} NC</span>
            </button>
            <button
              type="button"
              onClick={() => { setMethod('manual'); setError(''); }}
              className={`rounded-2xl border p-4 text-start transition-colors ${
                method === 'manual'
                  ? 'border-[#8b151a]/60 bg-[#8b151a]/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <span className="block text-sm font-black text-white">{t('checkout.payManual')}</span>
              <span className="mt-1 block text-[11px] text-gray-400">{t('checkout.payManualHint')}</span>
              <span className="mt-2 inline-block text-lg font-black text-white" dir="ltr">{money}</span>
            </button>
          </div>
        )}

        {method === 'nc' ? (
          <>
            {/* لوحة الدفع بالـ NC */}
            <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-300">{t('checkout.requiredNC')}</span>
                <span className="text-lg font-black text-amber-300" dir="ltr">{totalNC} NC</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-300">{t('checkout.yourBalance')}</span>
                <span className="text-lg font-black text-white" dir="ltr">{Number(balance) || 0} NC</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <span className="text-xs font-bold text-gray-300">{t('checkout.afterPayment')}</span>
                <span
                  className={`text-lg font-black ${enoughNC ? 'text-emerald-300' : 'text-red-300'}`}
                  dir="ltr"
                >
                  {enoughNC ? `${(Number(balance) || 0) - Number(totalNC)} NC` : t('checkout.insufficientShort')}
                </span>
              </div>
            </div>

            {!enoughNC && (
              <p className="mt-4 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">
                {t('checkout.insufficientNC')}
              </p>
            )}
          </>
        ) : (
          <>
            {/* تعليمات الدفع اليدوي */}
            <div className="mt-5 rounded-2xl border border-[#8b151a]/30 bg-[#8b151a]/10 p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-300">{t('checkout.amountToSend')}</span>
                <span className="text-lg font-black text-white">{money}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-300">{t('checkout.zainNumber')}</span>
                <span dir="ltr" className="text-lg font-black tracking-widest text-[#fca5a5]">{receiverNumber || '0798500770'}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed border-t border-white/10 pt-3">{t('checkout.instructions')}</p>
            </div>

            {/* رقم المرسل */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-gray-400 mb-2">{t('checkout.senderNumber')}</label>
              <input
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                dir="ltr"
                placeholder="07XXXXXXXXX"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b151a]/60"
              />
            </div>

            {/* رفع صورة الإيصال */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-gray-400 mb-2">{t('checkout.receipt')}</label>
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-6 cursor-pointer hover:border-[#8b151a]/60 transition-colors">
                {preview ? (
                  <img src={preview} alt="receipt" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-xs text-gray-400">{t('checkout.receiptHint')}</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">{error}</p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors disabled:opacity-60"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading || (method === 'nc' && !enoughNC)}
            className={`flex-1 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50 ${
              method === 'nc'
                ? 'bg-gradient-to-l from-amber-600 to-amber-400'
                : 'bg-gradient-to-l from-[#8b151a] to-[#ef4444]'
            }`}
          >
            {loading ? t('checkout.submitting') : method === 'nc' ? t('checkout.payNowNC') : t('checkout.submit')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
