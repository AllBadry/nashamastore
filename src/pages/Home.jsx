import { useCallback } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductCarousel from '../components/home/ProductCarousel';
import BannersSection from '../components/home/BannersSection';
import BrandsSection from '../components/home/BrandsSection';
import { getLatestProducts, getOffers, getProducts } from '../api/products';
import InfiniteMarquee from '../components/home/InfiniteMarquee';

const toData = (r) => r.data;

export default function Home() {
  // دوال جلب مستقرة لكل سلايدر
  const fetchOffers = useCallback((limit) => getOffers(limit), []);
  const fetchEarbuds = useCallback(
    (limit) => getProducts({ category: 'earbuds', limit }).then(toData),
    []
  );
  const fetchSmartWatches = useCallback(
    (limit) => getProducts({ category: 'smart-watch', limit }).then(toData),
    []
  );
  const fetchChargers = useCallback(
    (limit) =>
      getProducts({
        categories: ['mobile-and-tablet-chargers', 'wireless-charger', 'type-c-chargers', 'power-banks', 'car-charger'],
        limit,
      }).then(toData),
    []
  );

  return (
    <div className="space-y-12 pb-10 mt-4">
      <InfiniteMarquee/>
      {/* قسم الهيرو */}
      <HeroSection />

      {/* تسوق حسب القسم */}
      <FeaturedCategories />

      {/* أحدث الواصل */}
      <ProductCarousel
        title="أحدث الهواتف"
        subtitle="أحدث الواصل لدينا من الهواتف الذكية والإكسسوارات"
        fetcher={getLatestProducts}
        viewAll="/offers"
      />

      {/* البانرات الترويجية */}
      <BannersSection />

      {/* عروض وتخفيضات */}
      <ProductCarousel
        title="عروض وتخفيضات"
        subtitle="عروض حصرية بأسعار مخفضة لفترة محدودة"
        fetcher={fetchOffers}
        viewAll="/offers"
      />

      {/* تسوق حسب الماركة */}
      <BrandsSection />

      {/* سلايدر: سماعات ايربود */}
      <ProductCarousel
        title="سماعات ايربود"
        subtitle="سماعات لاسلكية أصلية بتجربة صوتية غامرة"
        fetcher={fetchEarbuds}
        viewAll="/category/wearables/earbuds"
      />

      {/* سلايدر: ساعات ذكية */}
      <ProductCarousel
        title="ساعات ذكية"
        subtitle="أحدث الساعات الذكية لتتبع صحتك ولياقتك"
        fetcher={fetchSmartWatches}
        viewAll="/category/wearables/smart-watch"
      />

      {/* سلايدر: شواحن وباور بانك */}
      <ProductCarousel
        title="شواحن وباور بانك"
        subtitle="شحن سريع وآمن لهاتفك أينما كنت"
        fetcher={fetchChargers}
        viewAll="/category/accessories/chargers"
      />
    </div>
  );
}
