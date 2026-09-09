import { useState } from 'react';
import { PackageSearch, Truck, Search, PackageCheck } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Reveal from '../components/shared/Reveal';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans selection:bg-neutral-200 pb-24">
      <PageHeader
        eyebrow="Order Tracking"
        title="Where is"
        accent="My Order?"
        description="Enter your order number (sent to you by SMS and email) to see real-time shipping status."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-14">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.06)] p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                  <PackageSearch size={24} />
                </div>
                <h2 className="text-2xl font-black text-neutral-900">Track your order</h2>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order number — e.g. NS-2026-01234"
                  className="w-full bg-[#F7F7F8] border border-neutral-200 rounded-full py-4 pr-6 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-neutral-400 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-5 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300"
              >
                Track Order
              </button>
            </form>
          </Reveal>

          {searched && (
            <Reveal delay={120}>
              <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-10 mt-8">
                <h3 className="text-lg font-black text-neutral-900 mb-8">Order {orderId}</h3>
                <div className="space-y-0">
                  {[
                    { icon: PackageCheck, title: 'Order Confirmed', desc: 'We received your order', done: true },
                    { icon: PackageSearch, title: 'Preparing Shipment', desc: 'Being packed at our warehouse', done: true },
                    { icon: Truck, title: 'In Transit', desc: 'With the courier — arriving soon', done: false, active: true },
                    { icon: PackageCheck, title: 'Delivered', desc: 'Enjoy your new device', done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.done
                              ? 'bg-green-500 text-white'
                              : step.active
                              ? 'bg-blue-600 text-white shadow-[0_0_0_6px_rgba(37,99,235,0.15)]'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          <step.icon size={20} />
                        </div>
                        {i < 3 && <div className={`w-0.5 h-10 ${step.done ? 'bg-green-500' : 'bg-neutral-100'}`}></div>}
                      </div>
                      <div className="pb-6">
                        <h4 className={`font-black ${step.done || step.active ? 'text-neutral-900' : 'text-neutral-400'}`}>{step.title}</h4>
                        <p className="text-sm text-neutral-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}