import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="w-full py-24 md:py-32 bg-[#F7F7F8]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <span className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-400 leading-none">
          404
        </span>
        <h1 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-6">
          Page not <span className="font-bold">found.</span>
        </h1>
        <p className="text-neutral-500 font-medium mt-4 max-w-md leading-relaxed text-sm">
          The page you're looking for doesn't exist, was moved, or is still being built.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300"
        >
          Back to Home <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}