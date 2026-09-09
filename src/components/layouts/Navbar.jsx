import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ShoppingBag, User, Menu, X,
  ChevronDown, ShieldCheck, Truck, BadgePercent
} from 'lucide-react';
import { categoryGroups } from '../../data/categories';
import { CartContext } from '../../context/cartContext';

const promotionItems = [
  { icon: BadgePercent, label: 'Special Offers', to: '/offers', color: 'text-[#EA4335]' },
  { icon: ShieldCheck, label: 'Official Warranty', to: '/warranty', color: 'text-[#4285F4]' },
  { icon: Truck, label: 'Fast Delivery', to: '/shipping', color: 'text-[#34A853]' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { totalCount } = useContext(CartContext);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 transition-all">
      <div className="max-w-7xl mx-auto px-10 md:px-24 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#ff7eb3] to-[#fbc531]"></div>
          <span className="text-2xl tracking-tight text-neutral-900">
            <span className="font-medium">Nashama</span>
            <span className="font-bold">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-[15px] font-medium text-neutral-900 hover:text-[#EA4335] transition-colors">
            Home
          </Link>

          {/* Products Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              to="/products"
              className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors ${
                productsOpen ? 'text-[#EA4335]' : 'text-neutral-600 hover:text-[#EA4335]'
              }`}
            >
              Products
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`}
              />
            </Link>

            {/* Desktop Mega Menu (fixed full-width overlay, keeps open on hover) */}
            <div
              className={`hidden md:block fixed top-20 inset-x-0 z-50 transition-opacity duration-300 ${
                productsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="max-w-7xl mx-auto px-10 md:px-24">
                <div
                  className={`bg-white rounded-3xl border border-neutral-100 shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-out origin-top ${
                    productsOpen ? 'translate-y-2 opacity-100' : '-translate-y-4 opacity-0'
                  }`}
                >
                  
                  {/* Panel header strip */}
                  <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 tracking-tight">Browse Categories</h3>
                      <p className="text-xs text-neutral-500 font-medium">Everything tech, organized for you</p>
                    </div>
                    <Link
                      to="/categories"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-[#EA4335] transition-colors"
                    >
                      View all
                    </Link>
                  </div>

                  {/* Panel body */}
                  <div className="grid grid-cols-4 gap-2 px-6 py-6">
                    {categoryGroups.map((group) => (
                      <div key={group.title} className="px-2">
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${group.color}`}>
                            <group.icon size={18} strokeWidth={1.5} />
                          </span>
                          <span className="text-sm font-black text-neutral-900 uppercase tracking-wide">{group.title}</span>
                        </div>
                        <ul className="space-y-2.5">
                          {group.items.map((item) => (
                            <li key={item.slug}>
                              <Link
                                to={`/category/${item.slug}`}
                                className="text-[13px] text-neutral-600 font-medium hover:text-[#4285F4] transition-colors inline-flex items-center gap-1.5 group"
                              >
                                <span className="w-1 h-1 rounded-full bg-neutral-300 group-hover:bg-[#4285F4] transition-colors"></span>
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Panel footer promotions */}
                  <div className="flex items-center justify-around px-8 py-4 bg-neutral-50 border-t border-neutral-100">
                    {promotionItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:opacity-70 transition-opacity"
                      >
                        <item.icon size={16} className={item.color} />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

          <Link to="/offers" className="text-[15px] font-medium text-neutral-600 hover:text-[#EA4335] transition-colors">
            Offers
          </Link>
          <Link to="/trends" className="text-[15px] font-medium text-neutral-600 hover:text-[#EA4335] transition-colors">
            Trending
          </Link>
        </div>

        {/* Icons and Account Button */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/search" className="text-neutral-600 hover:text-black transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="text-neutral-600 hover:text-black transition-colors relative">
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              {totalCount}
            </span>
          </Link>
          
          <div className="w-px h-5 bg-neutral-200 mx-1"></div>
          
          <Link to="/login" className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 hover:opacity-70 transition-opacity">
            <User size={20} strokeWidth={1.5} />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-neutral-100 shadow-2xl flex flex-col px-10 py-6 gap-6 max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-900">Home</Link>
          <Link to="/categories" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-600">Products</Link>
          
          {/* Mobile categories */}
          <div className="flex flex-col gap-4 pl-2">
            {categoryGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">{group.title}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/category/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-px w-full bg-neutral-100 my-2"></div>
          
          <Link to="/offers" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-600">Offers</Link>
          <Link to="/trends" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-600">Trending</Link>
          
          <div className="h-px w-full bg-neutral-100 my-2"></div>
          
          <div className="flex items-center justify-between">
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-bold text-neutral-900">
              <User size={22} /> My Account
            </Link>
            <div className="flex gap-6">
              <Link to="/search" onClick={() => setIsOpen(false)} className="text-neutral-600">
                <Search size={24} />
              </Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="text-neutral-600 relative">
                <ShoppingBag size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center rounded-full">{totalCount}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}