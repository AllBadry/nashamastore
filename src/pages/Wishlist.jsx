import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getProductsByIds } from '../api/products';
import ProductCard from '../components/products/ProductCard';

function WishlistSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 p-6 animate-pulse">
      <div className="h-44 bg-neutral-100 rounded-2xl"></div>
      <div className="mt-4 h-4 w-2/3 bg-neutral-100 rounded-full"></div>
      <div className="mt-2 h-4 w-1/3 bg-neutral-100 rounded-full"></div>
    </div>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();
  const { isLoggedIn, loading, wishlistIds, fetchWishlist } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setFetching(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const items = await getProductsByIds(wishlistIds);
        if (active) setProducts(items);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setFetching(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isLoggedIn, wishlistIds]);

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
  }, [isLoggedIn, fetchWishlist]);

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login', { replace: true });
  }, [loading, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6">
        {[1, 2, 3, 4].map((i) => <WishlistSkeleton key={i} />)}
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <Heart size={18} />
          </span>
          <div>
            <h1 className="text-xl font-black text-neutral-900">قائمة المفضلة</h1>
            <p className="text-xs text-neutral-400 font-medium">
              {wishlistIds.length > 0 ? `${wishlistIds.length} منتج في مفضلتك` : 'لا توجد منتجات بعد'}
            </p>
          </div>
        </div>
        <Link to="/offers" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
          استكشف العروض ←
        </Link>
      </div>

      {fetching ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => <WishlistSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-100 text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Heart size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-black text-neutral-900 mb-2">مفضلتك فارغة</h2>
          <p className="text-sm text-neutral-400 font-medium mb-6">
            اضغط على أيقونة القلب على أي منتج لإضافته إلى قائمة مفضلتك
          </p>
          <Link
            to="/offers"
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-red-600 px-6 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <ShoppingBag size={16} />
            تسوّق الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
