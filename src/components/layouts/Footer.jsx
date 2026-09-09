import { Link } from 'react-router-dom';
import { 
  Send, 
  ShieldCheck, 
  CreditCard, 
  Headset, 
  MapPin 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-white/90 text-neutral-900 overflow-hidden mt-auto pt-24">
      
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -right-[10%] -bottom-[30%] w-[50%] h-[80%] rounded-[100%] origin-bottom-right transform -rotate-[20deg] shadow-[0_0_40px_rgba(0,0,0,0.05)] opacity-80"
          style={{ background: 'linear-gradient(135deg, #fbc531 0%, #ff4757 100%)' }}
        ></div>
        
        <div 
          className="absolute -left-[10%] -bottom-[40%] w-[60%] h-[100%] rounded-[100%] origin-bottom-left transform rotate-[15deg] shadow-[0_0_40px_rgba(0,0,0,0.05)] opacity-80"
          style={{ background: 'linear-gradient(145deg, #4285F4 0%, #34A853 100%)' }}
        ></div>
      </div>

      {/* Glassmorphism overlay */}
      <div className="relative z-10 bg-white/60 backdrop-blur-3xl border-t border-white/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12 pt-16">
          
          {/* Newsletter and Trust Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-neutral-200/60 pb-16 mb-16">
            
            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                Be the first to know about <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#34A853]">
                  the latest releases and deals.
                </span>
              </h3>
              <p className="text-sm font-medium text-neutral-600 max-w-md leading-relaxed">
                Join our mailing list for exclusive updates on new devices, major discounts, and tech tips.
              </p>
              <form className="relative max-w-md flex items-center">
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="w-full bg-white border border-neutral-200 rounded-full px-6 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#4285F4] focus:ring-4 focus:ring-[#4285F4]/10 transition-all duration-300 shadow-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute left-2 w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-[#EA4335] transition-colors duration-300 shadow-md"
                >
                  <Send size={18} className="-ml-1" />
                </button>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:pl-12">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#4285F4] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-bold mb-1">Official Agent Warranty</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">100% authentic products covered by authorized dealer warranties.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-green-50 text-[#34A853] flex items-center justify-center flex-shrink-0">
                  <Headset size={24} />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-bold mb-1">Continuous Tech Support</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Our team is available to help you with any inquiries or technical issues.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Info */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="flex items-center gap-1.5 group">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#ff7eb3] to-[#fbc531]"></div>
                <span className="text-2xl tracking-tight text-neutral-900">
                  <span className="font-medium">Nashama</span>
                  <span className="font-bold">Store</span>
                </span>
              </Link>
              <p className="text-sm font-medium text-neutral-600 leading-relaxed max-w-sm">
                Your first destination for the latest smart devices and innovative accessories. We combine cutting-edge technology with competitive prices.
              </p>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              <div className="space-y-6">
                <h4 className="text-neutral-900 font-black tracking-wide uppercase text-sm">Shop</h4>
                <ul className="space-y-3">
                  <li><Link to="/category/smartphones" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Smartphones</Link></li>
                  <li><Link to="/category/wearables" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Smartwatches</Link></li>
                  <li><Link to="/category/audio" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Audio</Link></li>
                  <li><Link to="/offers" className="text-sm text-neutral-600 hover:text-[#EA4335] font-bold transition-colors">Special Offers</Link></li>
                  <li><Link to="/brands" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Brands</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-neutral-900 font-black tracking-wide uppercase text-sm">Customer Service</h4>
                <ul className="space-y-3">
                  <li><Link to="/track-order" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Track Order</Link></li>
                  <li><Link to="/shipping" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Shipping Policy</Link></li>
                  <li><Link to="/returns" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Returns & Exchanges</Link></li>
                  <li><Link to="/warranty" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">Warranty & Maintenance</Link></li>
                  <li><Link to="/faq" className="text-sm text-neutral-600 hover:text-[#4285F4] font-medium transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-neutral-900 font-black tracking-wide uppercase text-sm">Contact Us</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-600 font-medium leading-relaxed">Hashemite Kingdom of Jordan<br />Amman, Mecca Street</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Headset size={18} className="text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-600 font-mono font-bold dir-ltr">+962 7X XXX XXXX</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Copyright and Payment */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-200/60 gap-6">
            <p className="text-xs font-bold text-neutral-500">
              © {new Date().getFullYear()} Nashama Store. All rights reserved.
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mr-2">Secure Payments</span>
              <div className="w-10 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center">
                <CreditCard size={14} className="text-neutral-600" />
              </div>
              <div className="w-10 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center text-[10px] font-black text-neutral-600">
                VISA
              </div>
              <div className="w-10 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center text-[10px] font-black text-neutral-600">
                CASH
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
