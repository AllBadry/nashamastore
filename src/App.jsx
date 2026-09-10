import { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { CartProvider } from './context/CartProvider';

const Home = lazy(() => import('./pages/Home'));
const Categories = lazy(() => import('./pages/Categories'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const TrendsPage = lazy(() => import('./pages/TrendsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const WarrantyPage = lazy(() => import('./pages/WarrantyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center py-40">
    <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />

          <main className="flex-grow w-full">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/trends" element={<TrendsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:slug" element={<BrandPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/warranty" element={<WarrantyPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;