import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../lib/notificationsApi';

const formatTime = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
};

const kindColor = (kind) => {
  if (kind.includes('rejected') || kind.includes('closed')) return { bg: 'bg-red-500/20', text: 'text-red-400' };
  if (kind.includes('approved') || kind.includes('delivered') || kind.includes('accepted')) return {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
  };
  if (kind.includes('created')) return { bg: 'bg-amber-500/20', text: 'text-amber-400' };
  return { bg: 'bg-gray-500/20', text: 'text-gray-400' };
};

// جرس التنبيهات مع عدّاد غير المقروء وقائمة منسدلة — يُستخدم في العميل ولوحة التحكم.
const NotificationBell = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { notifications: list, unread: count } = await getNotifications();
      setNotifications(list);
      setUnread(count);
    } catch {
      /* معالج عام */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const init = setTimeout(() => {
      if (active) load();
    }, 0);
    const timer = setInterval(async () => {
      if (!active) return;
      try {
        const count = await getUnreadCount();
        if (count !== unread) setUnread(count);
      } catch {
        /* تجاهل أخطاء الاستقصاء */
      }
    }, 25000);
    return () => {
      active = false;
      clearTimeout(init);
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickNotif = (notif) => {
    // تعليم كمقروء عند الضغط (best-effort)
    markNotificationRead(notif._id).catch(() => {});
    setOpen(false);
    if (notif.link) navigate(notif.link, { replace: true });
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setNotifications((list) => list.map((n) => ({ ...n, read: true })));
      setOpen(false);
    } catch {
      /* معالج عام */
    }
  };

  const toggle = () => {
    setOpen((prev) => {
      if (!prev) load();
      return !prev;
    });
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        aria-label={t('common.notifications')}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.184 23.184 0 01-5.717 0M3.398 16.317a23.216 23.216 0 014.244-4.243M9.878 9.878a23.216 23.216 0 014.244-4.243M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[10px] font-bold px-1 py-0.5 rounded-full border border-black border-opacity-50">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#0d0e13] shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{t('common.notifications')}</h3>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="text-[10px] font-bold text-[#8b151a] hover:text-[#ef4444] underline"
              >
                {t('common.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-xs">{t('common.loading')}</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                {t('notif.empty')}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => {
                  const title = t(`notif.title.${n.kind}`);
                  const body = t(`notif.body.${n.kind}`, n.params);
                  const color = kindColor(n.kind);
                  return (
                    <button
                      key={n._id}
                      type="button"
                      onClick={() => handleClickNotif(n)}
                      className="w-full text-left p-3 hover:bg-white/[0.04] transition-colors focus:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
                          {!n.read ? '●' : '○'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white leading-tight">{title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed line-clamp-2 whitespace-pre-wrap">
                            {body}
                          </p>
                          <p className="text-[9px] text-gray-600 mt-1">{formatTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-3 text-center">
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/dashboard?tab=orders', { replace: true }); }}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              {t('common.viewAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
