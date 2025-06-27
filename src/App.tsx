import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import WishlistSidebar from './components/WishlistSidebar';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { sqliteDb } from './database/SQLiteDatabase';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ReturnsPage from './pages/ReturnsPage';
import SearchPage from './pages/SearchPage';
import ShippingPage from './pages/ShippingPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await sqliteDb.initialize();
        setDbInitialized(true);
        console.log('SQLite database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbInitialized(true); // Continue anyway
      }
    };

    initializeDatabase();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen until database is ready
  if (!dbInitialized || showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 font-inter">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
              </Routes>
            </main>
            <Footer />
            <CartSidebar />
            <WishlistSidebar />
            <AuthModal />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;