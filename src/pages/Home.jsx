import BrandsSection from '../components/sections/BrandsSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import HeroSection from '../components/sections/HeroSection';
import OffersProducts from '../components/sections/productsandoffers';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <CategoriesSection />
      <OffersProducts />
      <BrandsSection />
    </div>
  );
}