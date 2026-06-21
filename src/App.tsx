import { useState, useEffect, useCallback } from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import Features from './components/Features';
import Newsletter from './components/Newsletter';
import Marquee from './components/Marquee';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/admin/AdminPage';

export default function App() {
  const { theme, language } = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [productCategory, setProductCategory] = useState<string | undefined>();
  // key to force remount ProductsPage when category changes
  const [productsKey, setProductsKey] = useState(0);

  // Initialize theme and language direction
  useEffect(() => {
    document.body.className = theme;
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.body.setAttribute('dir', dir);
  }, [theme, language]);

  const handleNavigate = useCallback((page: string, category?: string) => {
    if (page === 'products' && category) {
      setProductCategory(category);
      setProductsKey((k) => k + 1); // force remount
    } else if (page === 'products' && !category) {
      // keep current category if just navigating to products
    } else {
      setProductCategory(undefined);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminPage onExit={() => handleNavigate('home')} />;
      case 'products':
        return <ProductsPage key={productsKey} initialCategory={productCategory} />;
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return <AccountPage onNavigate={handleNavigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage />;
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <Marquee />
            <Features />
            <Categories onNavigate={handleNavigate} />
            <FeaturedProducts onNavigate={handleNavigate} />
            <Testimonials />
            <Newsletter />
          </>
        );
    }
  };

  // Admin page has its own layout
  if (currentPage === 'admin') {
    return renderPage();
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-primary'}`}>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
