import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Collections from './pages/Collections';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollToTop from './components/ScrollToTop';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-void text-offwhite flex flex-col font-body relative pb-16 md:pb-0">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
            <WhatsAppFloat />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
