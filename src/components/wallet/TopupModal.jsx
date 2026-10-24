import React, { useState } from 'react';
import { useLang } from '../../i18n';
import { NC_PER_JOD } from '../../lib/walletApi';

// بوب اب شحن المحفظة (NC): يختار العميل مبلغ الـ NC، يظهر له مقابل الدينار،
// ثم بيانات التحويل (زين كاش) ورفع صورة الإيصال.
const RECEIVER_FALLBACK = '0798500770';

const TopupModal = ({ open, onClose, rate = NC_PER_JOD, receiverNumber, onSubmitted }) => {
  const { t } = useLang();
  const [amountNC, setAmountNC] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const jod = rate > 0 ? Number(amountNC || 0) / rate : 0;
  const jodText = jod.toFixed(2);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError(t('wallet.topup.receiptInvalid'));
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    const amount = Math.floor(Number(amountNC));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(t('wallet.topup.amountInvalid'));
      return;
    }
    if (!file) {
      setError(t('wallet.topup.receiptRequired'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmitted({ amountNC: amount, receiptFile: file, senderNumber });
    } catch (err) {
      setError(err?.response?.data?.message || t('common.error'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
      <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0e13] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          <h3 className="text-xl font-black text-white">{t('wallet.topup.title')}</h3>
        <p className="text-sm text-gray-400 mt-1">{t('wallet.topup.subtitle')}</p>

        {/* إدخال مبلغ الـ NC + المقابل بالدينار */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-gray-400 mb-2">{t('wallet.topup.amountNC')}</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={amountNC}
              onChange={(e) => setAmountNC(e.target.value)}
              dir="ltr"
              placeholder="500"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b151a]/60"
            />
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-[#fca5a5]">NC</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {t('wallet.topup.equivalent')}: <span className="font-black text-white" dir="ltr">{jodText}</span> {t('wallet.topup.jod')}
          </p>
        </div>

        {/* بيانات التحويل */}
        <div className="mt-5 rounded-2xl border border-[#8b151a]/30 bg-[#8b151a]/10 p-5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-gray-300">{t('wallet.topup.amountToSend')}</span>
            <span className="text-lg font-black text-white" dir="ltr">{jodText} JOD</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-gray-300">{t('wallet.topup.zainNumber')}</span>
            <span dir="ltr" className="text-lg font-black tracking-widest text-[#fca5a5]">{receiverNumber || RECEIVER_FALLBACK}</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed border-t border-white/10 pt-3">{t('wallet.topup.instructions')}</p>
        </div>

        {/* رقم المرسل */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-gray-400 mb-2">{t('wallet.topup.senderNumber')}</label>
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
          <label className="block text-xs font-bold text-gray-400 mb-2">{t('wallet.topup.receipt')}</label>
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-6 cursor-pointer hover:border-[#8b151a]/60 transition-colors">
            {preview ? (
              <img src={preview} alt="receipt" className="max-h-40 rounded-lg object-contain" />
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs text-gray-400">{t('wallet.topup.receiptHint')}</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
        </div>

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
            disabled={loading}
            className="flex-1 rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? t('wallet.topup.submitting') : t('wallet.topup.submit')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TopupModal;
