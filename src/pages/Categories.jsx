import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/shared/Reveal';
import { categoryGroups } from '../data/categories';

export default function CategoriesPage() {
  return (
    <div className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        
        <Reveal>
          <div className="mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100/80 border border-neutral-200/60 text-xs font-bold uppercase tracking-wider text-neutral-800">
              Categories
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight mt-6">
              Shop by Category
            </h1>
            <p className="text-neutral-500 font-medium mt-4 max-w-lg leading-relaxed">
              Explore our full range of smartphones, wearables, audio gear, and every accessory in between.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 100}>
              <div className="bg-white rounded-3xl border border-neutral-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${group.color}`}>
                    <group.icon size={22} strokeWidth={1.5} />
                  </span>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{group.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/category/${item.slug}`}
                      className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-neutral-800 group-hover:text-[#4285F4] transition-colors">
                        {item.label}
                      </span>
                      <ArrowRight size={16} className="text-neutral-400 group-hover:text-[#4285F4] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </div>
  );
}