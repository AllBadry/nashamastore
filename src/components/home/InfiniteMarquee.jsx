import { Zap, ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';

export default function InfiniteMarquee() {
  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden flex whitespace-nowrap border-y border-red-700 relative">
      <style>
        {`
          /* حركة الشريط من اليمين لليسار باستمرار */
          @keyframes marquee-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); } 
          }
          .animate-marquee {
            display: flex;
            width: 200%;
            animation: marquee-rtl 20s linear infinite;
          }
          /* إيقاف الحركة عند وقوف الماوس عليها ليتمكن من القراءة */
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .marquee-content {
            display: flex;
            justify-content: space-around;
            width: 50%;
          }
        `}
      </style>

      <div className="animate-marquee cursor-default">
        {/* نكرر المحتوى مرتين لعمل حلقة لا نهائية سلسة */}
        {[1, 2].map((i) => (
          <div key={i} className="marquee-content items-center gap-8 px-4">
            <span className="flex items-center gap-2 font-black text-sm tracking-wide">
              <Truck size={18} className="text-red-200" /> توصيل مجاني للطلبات فوق 50 د.أ
            </span>
            <span className="flex items-center gap-2 font-black text-sm tracking-wide">
              <ShieldCheck size={18} className="text-red-200" /> كفالة الوكيل الرسمي 100%
            </span>
            <span className="flex items-center gap-2 font-black text-sm tracking-wide">
              <Zap size={18} className="text-red-200" /> عروض حصرية لفترة محدودة
            </span>
            <span className="flex items-center gap-2 font-black text-sm tracking-wide">
              <HeadphonesIcon size={18} className="text-red-200" /> دعم فني متواصل 24/7
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}