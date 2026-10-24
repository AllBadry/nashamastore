import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n';
import { getMyTicket, getMyTickets, createTicket, replyTicket } from '../../lib/supportApi';

const formatTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
};

// صفحة الدعم: تعرض تيكت العميل المفتوح على شكل شات، أو تتيح فتح تيكت جديد.
const Support = () => {
  const { t } = useLang();
  const ref = useRef(null);
  const scrollRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const [current, list] = await Promise.all([getMyTicket(), getMyTickets()]);
    setTicket(current);
    setHistory(list.filter((x) => x._id !== current?._id));
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await load();
      } catch {
        /* معالج عام */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // تمرير تلقائي لآخر رسالة
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ticket?.messages?.length, loading]);

  const isOpen = ticket?.status === 'open';

  const send = async () => {
    const message = draft.trim();
    if (!message) return;
    setSending(true);
    setError('');
    try {
      const updated = isOpen ? await replyTicket({ message }) : await createTicket({ subject, message });
      setTicket(updated);
      setDraft('');
      if (!isOpen) {
        setSubject('');
        await load();
      }
    } catch (err) {
      setError(err?.response?.data?.message || t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) send();
    }
  };

  if (loading) {
    return <div className="dash-in card p-12 text-center text-gray-500">{t('common.loading')}</div>;
  }

  return (
    <div ref={ref} className="space-y-4">
      <div className="dash-in">
        <h2 className="font-black text-2xl text-white">{t('dashboard.support.title')}</h2>
        <p className="text-sm text-gray-400 mt-1">{t('dashboard.support.desc')}</p>
      </div>

      {/* الشات */}
      <div className="dash-in rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col h-[560px]">
        {/* رأس الشات */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-full grid place-items-center bg-gradient-to-l from-[#8b151a] to-[#ef4444] text-white shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0A9 9 0 0012 3a9 9 0 00-6.364 2.636m12.728 0L3.515 20.485M3.515 20.485h5.657" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{t('dashboard.support.team')}</p>
              {ticket ? (
                <p className="text-[11px] text-gray-500" dir="ltr">{ticket.ticketCode}</p>
              ) : (
                <p className="text-[11px] text-gray-500">{t('dashboard.support.noTicket')}</p>
              )}
            </div>
          </div>
          {ticket && (
            <span
              className={`text-[10px] font-bold rounded-full px-2.5 py-1 border ${
                isOpen
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-gray-500/30 bg-gray-500/10 text-gray-400'
              }`}
            >
              {isOpen ? t('dashboard.support.statusOpen') : t('dashboard.support.statusClosed')}
            </span>
          )}
        </div>

        {/* الرسائل */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-[#070810]">
          {!ticket && (
            <div className="h-full grid place-items-center text-center px-6">
              <div>
                <svg className="w-14 h-14 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <p className="text-sm font-bold text-white">{t('dashboard.support.emptyTitle')}</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">{t('dashboard.support.emptyDesc')}</p>
              </div>
            </div>
          )}

          {ticket?.messages?.map((m, i) => {
            const mine = m.sender === 'customer';
            return (
              <div key={i} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  mine
                    ? 'bg-gradient-to-l from-[#8b151a] to-[#ef4444] text-white rounded-bl-sm'
                    : 'bg-white/[0.06] text-gray-100 border border-white/10 rounded-br-sm'
                }`}>
                  {!mine && <p className="text-[10px] font-bold text-[#fca5a5] mb-1">{t('dashboard.support.team')}</p>}
                  {m.body}
                  <p className="text-[10px] opacity-60 mt-1.5" dir="ltr">{formatTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })}

          {ticket && !isOpen && (
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                {t('dashboard.support.closedHint')}
              </span>
            </div>
          )}
        </div>

        {/* الإدخال */}
        <div className="border-t border-white/10 p-4 bg-white/[0.02]">
          {error && (
            <p className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}

          {!ticket && (
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('dashboard.support.subjectPlaceholder')}
              className="w-full mb-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b151a]/60"
            />
          )}

          <div className="flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={isOpen || !ticket ? t('dashboard.support.inputPlaceholder') : t('dashboard.support.closedInput')}
              disabled={ticket && !isOpen}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8b151a]/60 disabled:opacity-50 max-h-32"
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !draft.trim() || (ticket && !isOpen)}
              className="shrink-0 rounded-xl bg-gradient-to-l from-[#8b151a] to-[#ef4444] px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {sending ? t('dashboard.support.sending') : ticket && !isOpen ? t('dashboard.support.closedBtn') : t('dashboard.support.send')}
            </button>
          </div>
        </div>
      </div>

      {/* سجل التیکتات السابقة */}
      {history.length > 0 && (
        <div className="dash-in rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-3">{t('dashboard.support.history')}</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate" dir="ltr">{h.ticketCode}</p>
                  <p className="text-[11px] text-gray-500 truncate">{h.subject || h.lastMessagePreview || '—'}</p>
                </div>
                <span className="text-[10px] font-bold rounded-full px-2.5 py-1 border border-gray-500/30 bg-gray-500/10 text-gray-400">
                  {h.status === 'open' ? t('dashboard.support.statusOpen') : t('dashboard.support.statusClosed')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
