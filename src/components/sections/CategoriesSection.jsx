import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

const categoriesData = [
  {
    id: '01',
    title: 'Accounts',
    slug: 'accounts',
    description: 'Choose the fully regulated accounts that work best for your digital platform.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=800',
    features: ['Regulated setup', 'Digital platform', 'User management']
  },
  {
    id: '02',
    title: 'Clearing',
    slug: 'clearing',
    description: 'Access real-time clearing infrastructure with automated compliance.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600&h=800',
    features: ['Real-time sync', 'Automated compliance', 'High-speed routing', 'Secure ledger']
  },
  {
    id: '03',
    title: 'Embedded Banking',
    slug: 'embedded-banking',
    description: 'Seamlessly embed financial services into your customer journey under your own custom brand.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=800',
    stat: '+50M',
    statDesc: 'API requests processed seamlessly under custom branding.'
  }
];

export default function CategoriesSection() {
  return (
    <section className="w-full bg-[#FAFAFA] text-neutral-900 py-20 px-6 md:px-12 lg:px-24 font-sans selection:bg-neutral-200">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Sleek Hero Header mimicking the reference image */}
        <div className="mb-16 relative">
          {/* Decorative minimalist star/sparkle (Optional SVG mimicking the background graphics) */}
          <svg className="absolute top-0 right-10 md:right-32 w-8 h-8 text-neutral-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929" />
          </svg>

          <p className="text-neutral-500 font-medium mb-4 text-sm md:text-base tracking-wide">
            Revolutionize Your
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-medium tracking-tight leading-[1.05] max-w-5xl">
            Financial Infrastructure with <br className="hidden md:block" />
            the Ultimate API-Powered <br className="hidden md:block" />
            <span className="font-semibold">Banking</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10">
            <Link 
              to="/get-started"
              className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-neutral-800 hover:scale-105 transition-all duration-300"
            >
              START INTEGRATING
            </Link>
            <p className="text-sm font-medium text-neutral-500 max-w-[200px] leading-snug">
              The Next generation Production for Fintechs
            </p>
          </div>
        </div>

        {/* Asymmetric Bento Grid (1/4, 1/4, 2/4 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[450px]">
          
          {/* Card 1: Accounts (Light/Minimalist style) */}
          <Link 
            to={`/category/${categoriesData[0].slug}`} 
            className="group relative col-span-1 bg-[#E8EAE9] rounded-2xl overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 opacity-40 mix-blend-multiply group-hover:scale-105 transition-transform duration-700">
              <img src={categoriesData[0].image} alt="Accounts" className="w-full h-full object-cover" />
            </div>
            
            {/* Top Badge */}
            <div className="relative z-10 w-8 h-8 rounded-full border border-neutral-300/50 flex items-center justify-center text-xs font-mono text-neutral-600 bg-white/30 backdrop-blur-md">
              {categoriesData[0].id}
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-auto">
              {/* Fake Avatars to match the "Learn from best mentors" vibe */}
              <div className="flex -space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#E8EAE9] bg-neutral-300"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#E8EAE9] bg-neutral-400"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#E8EAE9] bg-neutral-800"></div>
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-3">{categoriesData[0].title}</h3>
              <div className="inline-flex items-center justify-between px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-xs font-semibold text-neutral-900 w-fit gap-8 border border-white/40 group-hover:bg-white transition-colors">
                <span>Start building</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Card 2: Clearing (Vibrant Warm Gradient style) */}
          <Link 
            to={`/category/${categoriesData[1].slug}`} 
            className="group relative col-span-1 rounded-2xl overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-500"
          >
            {/* Background Image + Vibrant Gradient Overlay */}
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
              <img src={categoriesData[1].image} alt="Clearing" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 mix-blend-overlay opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 to-transparent"></div>
            
            <div className="relative z-10 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs font-mono text-white bg-white/10 backdrop-blur-md">
              {categoriesData[1].id}
            </div>

            <div className="relative z-10 mt-auto flex flex-col space-y-3">
              <h3 className="font-semibold text-2xl text-white mb-2">{categoriesData[1].title}</h3>
              {categoriesData[1].features.map((feature, i) => (
                <div key={i} className="flex items-center justify-between text-white/90 text-sm font-medium border-b border-white/20 pb-2 group-hover:text-white transition-colors">
                  <span>{feature}</span>
                  <ArrowUpRight size={16} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              ))}
            </div>
          </Link>

          {/* Card 3: Embedded Banking (Vibrant Cool Gradient / Big Stat style) */}
          <Link 
            to={`/category/${categoriesData[2].slug}`} 
            className="group relative col-span-1 md:col-span-2 rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-500"
          >
            {/* Background Image + Glass/Ribbed Gradient Overlay */}
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
              <img src={categoriesData[2].image} alt="Embedded Banking" className="w-full h-full object-cover grayscale opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-purple-500 to-blue-400 mix-blend-hard-light opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
            
            {/* Top row */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs font-mono text-white bg-white/10 backdrop-blur-md">
                {categoriesData[2].id}
              </div>
              <h3 className="font-semibold text-lg text-white/90">{categoriesData[2].title}</h3>
            </div>

            {/* Bottom Content (Big Typography) */}
            <div className="relative z-10 mt-auto flex flex-col md:flex-row items-end justify-between gap-6">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-sm">
                  {categoriesData[2].stat}
                </span>
                <p className="text-white/90 font-medium text-sm md:text-base max-w-[200px] leading-tight">
                  {categoriesData[2].statDesc}
                </p>
              </div>
              
              <div className="hidden md:flex flex-col gap-1 text-white/70 group-hover:text-white transition-colors animate-bounce">
                <ChevronDown size={24} />
                <ChevronDown size={24} className="-mt-4" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}