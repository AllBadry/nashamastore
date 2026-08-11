import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// استدعاء المكونات الثابتة (التخطيط)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// استدعاء الصفحات الرئيسية
import Home from './pages/Home';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Trends from './pages/Trends';

// استدعاء صفحات المنتجات والأقسام
import CategoryListing from './pages/CategoryListing';
import BrandListing from './pages/BrandListing';
import ProductDetails from './pages/ProductDetails';

// استدعاء صفحة المصادقة
import Login from './pages/Login';

// استدعاء صفحة البروفايل (المشتريات)
import Profile from './pages/Profile';

// استدعاء صفحة السلة
import Cart from './pages/Cart';

// استدعاء صفحة المفضلة
import Wishlist from './pages/Wishlist';

// استدعاء الصفحات الثابتة
import ReturnPolicy from './pages/static/ReturnPolicy';
import Terms from './pages/static/Terms';
import TrackOrder from './pages/static/TrackOrder';
import FAQ from './pages/static/FAQ';

// مكوّن يعيد تشغيل أنيميشن دخول الصفحة عند كل تنقّل (من خلال مفتاح المسار)
function PageTransition({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* الغلاف الرئيسي للموقع: نستخدم flex لضمان بقاء الفوتر في الأسفل */}
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900">
        
        {/* شريط التنقل (يظهر في جميع الصفحات) */}
        <Navbar />
        
        {/* التمرير لأعلى الصفحة عند كل تنقّل */}
        <ScrollToTop />
        
        {/* محتوى الصفحة المتغير */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <PageTransition>
            <Routes>
              {/* مسارات الصفحات الرئيسية */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/trends" element={<Trends />} />

              {/* مسارات الأقسام والماركات */}
              {/* استخدمنا :categorySlug ليكون متغير ديناميكي (مثل smartphones) */}
              <Route path="/category/:categorySlug" element={<CategoryListing />} />
              <Route path="/category/:categorySlug/:subCategory" element={<CategoryListing />} />
              <Route path="/brands/:brandSlug" element={<BrandListing />} />

              {/* مسار تفاصيل المنتج */}
              {/* استخدمنا :productSlug لجلب بيانات المنتج بدقة من الباك اند */}
              <Route path="/product/:productSlug" element={<ProductDetails />} />

              {/* مسار تسجيل الدخول / إنشاء حساب */}
              <Route path="/login" element={<Login />} />

              {/* مسار البروفايل (الملف الشخصي والمشتريات) */}
              <Route path="/profile" element={<Profile />} />

              {/* مسار السلة */}
              <Route path="/cart" element={<Cart />} />

              {/* مسار المفضلة */}
              <Route path="/wishlist" element={<Wishlist />} />

              {/* مسارات الصفحات الثابتة */}
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/service-usage" element={<Terms />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/faq" element={<FAQ />} />

              {/* صفحة 404 (في حال أخطأ المستخدم في الرابط) */}
              <Route path="*" element={
                <div className="text-center py-20">
                  <h2 className="text-4xl font-bold text-red-600 mb-4">404</h2>
                  <p className="text-xl">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
                </div>
              } />
            </Routes>
          </PageTransition>
        </main>

        {/* تذييل الموقع (يظهر في جميع الصفحات) */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;