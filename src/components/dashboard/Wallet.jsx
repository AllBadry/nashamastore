import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { useLang } from '../../i18n';
import { getWallet, getMyTopups, createTopup, receiptUrl, NC_PER_JOD } from '../../lib/walletApi';
import TopupModal from '../wallet/TopupModal';

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const STATUS_STYLES = {
  pending_verification: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const Wallet = () => {
  const { t } = useLang();
  const ref = useRef(null);

  const [wallet, setWallet] = useState({ balance: 0, lifetimeTopup: 0, rate: NC_PER_JOD, receiverNumber: '' });
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [w, list] = await Promise.all([getWallet(), getMyTopups()]);
        if (active) {
          setWallet(w);
          setTopups(list);
        }
      } catch {
        /* معالج عام */
      } finally {
        if (active) setLoading(false);
      }
    })();
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
    }, ref);
    return () => {
      active = false;
      ctx.revert();
    };
  }, []);

  const handleSubmitted = async ({ amountNC, receiptFile, senderNumber }) => {
    const topup = await createTopup({ amountNC, receiptFile, senderNumber });
    setModalOpen(false);
    setTopups((list) => [topup, ...list]);
    // تحديث الرصيد من السيرفر (يبقى كما هو حتى الاعتماد)
    getWallet().then(setWallet).catch(() => {});
  };

  const jod = (nc) => (Number(nc || 0) / (wallet.rate || NC_PER_JOD)).toFixed(2);

  return (
    <div ref={ref} className="space-y-4">
      <div className="dash-in flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-black text-2xl text-white">{t('dashboard.wallet.title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('dashboard.wallet.desc')}</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          {t('dashboard.wallet.topupBtn')}
        </button>
      </div>

      {/* بطاقة الرصيد */}
      <div className="dash-in grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-l from-[#8b151a]/20 to-white/[0.03] p-6">
          <p className="text-xs font-bold text-gray-400">{t('dashboard.wallet.balance')}</p>
          <p className="mt-2 text-3xl font-black text-white" dir="ltr">
            {wallet.balance} <span className="text-lg text-[#fca5a5]">NC</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-bold text-gray-400">{t('dashboard.wallet.equivalent')}</p>
          <p className="mt-2 text-3xl font-black text-white" dir="ltr">
            {jod(wallet.balance)} <span className="text-lg text-gray-500">JOD</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-bold text-gray-400">{t('dashboard.wallet.rate')}</p>
          <p className="mt-2 text-3xl font-black text-white" dir="ltr">
            1 <span className="text-lg text-gray-500">JOD</span> = {wallet.rate} <span className="text-lg text-[#fca5a5]">NC</span>
          </p>
        </div>
      </div>

      {/* سجل طلبات الشحن */}
      <div className="dash-in">
        <h3 className="font-bold text-lg text-white mb-3">{t('dashboard.wallet.history')}</h3>
        {loading ? (
          <div className="card p-10 text-center text-gray-500">{t('common.loading')}</div>
        ) : topups.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <svg className="w-14 h-14 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <p className="font-bold text-white">{t('dashboard.wallet.empty')}</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">{t('dashboard.wallet.emptyDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topups.map((topup) => (
              <div key={topup._id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                {topup.payment?.receiptImage && (
                  <a href={receiptUrl(topup.payment.receiptImage)} target="_blank" rel="noreferrer">
                    <img src={receiptUrl(topup.payment.receiptImage)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  </a>
                )}
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm font-bold text-white" dir="ltr">{topup.topupCode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {topup.amountNC} NC · {formatDate(topup.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-white" dir="ltr">{topup.amountJOD} JOD</span>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[topup.status] || 'border-white/15 bg-white/5 text-gray-300'}`}>
                    {t(`wallet.status.${topup.status}`)}
                  </span>
                </div>
                {topup.status === 'rejected' && topup.rejectReason && (
                  <p className="w-full text-xs text-red-300/80">{t('wallet.rejectReasonLabel')}: {topup.rejectReason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <TopupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rate={wallet.rate}
        receiverNumber={wallet.receiverNumber}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
};

export default Wallet;
