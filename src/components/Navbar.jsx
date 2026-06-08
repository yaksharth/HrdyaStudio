import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);



  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isScrolledHeader = isScrolled || !isHome;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolledHeader ? 'bg-white border-b border-trim/30' : 'bg-transparent border-b border-white/10'
      }`}>
        {/* Announcement Bar */}
        <div className={`transition-colors duration-300 text-[9px] uppercase tracking-[0.25em] py-2.5 text-center flex items-center justify-center gap-2 border-b w-full font-semibold ${
          isScrolledHeader ? 'bg-[#F2E7DC] text-[#6B4F3B] border-trim/10' : 'bg-[#09090b] text-[#C59B7E] border-white/5'
        }`}>
          <span>🚚 FREE SHIPPING ON ORDERS ABOVE ₹599 ✨</span>
        </div>

        {/* Main Navigation */}
        <nav className={`py-4 w-full transition-colors duration-300 ${isScrolledHeader ? 'bg-white' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Left group */}
          <div className="flex items-center gap-8 flex-1">
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              className={`lg:hidden transition-colors duration-200 ${
                isScrolledHeader ? 'text-[#1C1917]/75 hover:text-champagne' : 'text-white/75 hover:text-champagne'
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Desktop left links */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Shop */}
              <Link
                to="/shop"
                className={`relative text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 group ${
                  location.pathname === '/shop' && !location.state?.isNewDrop
                    ? 'text-champagne font-semibold'
                    : isScrolledHeader
                      ? 'text-[#1C1917]/85 hover:text-[#1C1917]'
                      : 'text-white/85 hover:text-white'
                }`}
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne/60 group-hover:w-full transition-all duration-400" />
              </Link>

              {/* Categories Hover Dropdown */}
              <div className="relative group/drop py-1">
                <button className={`relative text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
                  isScrolledHeader ? 'text-[#1C1917]/85 hover:text-[#1C1917]' : 'text-white/85 hover:text-white'
                }`}>
                  Categories
                  <ChevronDown size={11} className="transition-transform duration-200 group-hover/drop:rotate-180" />
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne/60 group-hover/drop:w-full transition-all duration-400" />
                </button>
                
                <div className="absolute left-0 top-full pt-3 w-48 opacity-0 pointer-events-none group-hover/drop:opacity-100 group-hover/drop:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover/drop:translate-y-0 z-50">
                  <div className="bg-white text-[#1C1917] border border-[#E7E3DB] shadow-lg py-2.5 px-1.5 flex flex-col gap-1 rounded-none">
                    {['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Jewellery Sets'].map(cat => (
                      <Link
                        key={cat}
                        to="/shop"
                        state={{ filterCategory: cat }}
                        className="text-[10px] uppercase tracking-[0.18em] px-4 py-2 hover:bg-[#FAF6F0] hover:text-[#C59B7E] transition-all duration-200 text-left font-body"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* New Drop */}
              <Link
                to="/shop"
                state={{ isNewDrop: true }}
                className={`relative text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 group ${
                  location.pathname === '/shop' && location.state?.isNewDrop
                    ? 'text-champagne font-semibold'
                    : isScrolledHeader
                      ? 'text-[#1C1917]/85 hover:text-[#1C1917]'
                      : 'text-white/85 hover:text-white'
                }`}
              >
                New Drop
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne/60 group-hover:w-full transition-all duration-400" />
              </Link>

              {/* About */}
              <Link
                to="/about"
                className={`relative text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 group ${
                  location.pathname === '/about'
                    ? 'text-champagne font-semibold'
                    : isScrolledHeader
                      ? 'text-[#1C1917]/85 hover:text-[#1C1917]'
                      : 'text-white/85 hover:text-white'
                }`}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne/60 group-hover:w-full transition-all duration-400" />
              </Link>
            </div>
          </div>

          {/* Center: Logo */}
          <Link
            to="/"
            id="nav-logo"
            className={`text-[22px] md:text-[26px] font-heading font-bold tracking-[0.3em] transition-colors duration-300 absolute left-1/2 -translate-x-1/2 ${
              isScrolledHeader ? 'text-[#1C1917] hover:text-champagne' : 'text-white hover:text-champagne'
            }`}
          >
            HRDYA
          </Link>

          {/* Right group */}
          <div className="flex items-center gap-5 flex-1 justify-end">
            {/* Desktop right links (Text + Icon style matching screenshot) */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Search */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 130, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      type="text"
                      placeholder="Search..."
                      className={`absolute right-20 bg-transparent border-b text-xs focus:outline-none px-2 py-1 placeholder-muted/60 transition-colors duration-200 ${
                        isScrolledHeader ? 'border-[#1C1917]/30 text-[#1C1917]' : 'border-white/30 text-white'
                      }`}
                      autoFocus
                    />
                  )}
                </AnimatePresence>
                <button
                  id="search-btn"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isScrolledHeader ? 'text-[#1C1917]/85 hover:text-champagne' : 'text-white/85 hover:text-white'
                  }`}
                >
                  Search
                </button>
              </div>

              {/* Wishlist */}
              <Link
                id="wishlist-btn"
                to="/shop"
                className={`text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 flex items-center gap-1.5 group ${
                  isScrolledHeader ? 'text-[#1C1917]/85 hover:text-champagne' : 'text-white/85 hover:text-white'
                }`}
              >
                Wishlist ({wishlist.length})
                <Heart size={13} className={`transition-colors ${
                  isScrolledHeader ? 'text-[#1C1917]/60 group-hover:text-champagne' : 'text-white/60 group-hover:text-white'
                }`} />
              </Link>

              {/* Cart */}
              <button
                id="cart-btn"
                onClick={() => setIsCartOpen(true)}
                className={`text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 flex items-center gap-1.5 group ${
                  isScrolledHeader ? 'text-[#1C1917]/85 hover:text-champagne' : 'text-white/85 hover:text-white'
                }`}
              >
                Cart ({cartCount})
                <ShoppingBag size={13} className={`transition-colors ${
                  isScrolledHeader ? 'text-[#1C1917]/60 group-hover:text-champagne' : 'text-white/60 group-hover:text-white'
                }`} />
              </button>
            </div>

            {/* Mobile Icons (simple fallback for mobile screens) */}
            <div className="flex lg:hidden items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative transition-colors ${
                  isScrolledHeader ? 'text-[#1C1917]/75 hover:text-champagne' : 'text-white/75 hover:text-champagne'
                }`}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-champagne text-void text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-void/95"
              style={{ backdropFilter: 'blur(12px)' }}
            />
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed inset-0 z-[61] flex flex-col p-8 bg-void"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="text-[22px] font-heading font-bold tracking-[0.3em] text-offwhite">HRDYA</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={22} className="text-offwhite/40 hover:text-champagne transition-colors" />
                </button>
              </div>

              <div className="flex flex-col gap-8 overflow-y-auto max-h-[70vh] custom-scrollbar pr-2">
                {/* Shop */}
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Link
                    to="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-5xl font-heading font-light text-offwhite/70 hover:text-champagne transition-colors duration-200 block"
                  >
                    Shop
                  </Link>
                </motion.div>

                {/* Collapsible Categories */}
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col">
                  <button 
                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                    className="text-5xl font-heading font-light text-offwhite/70 hover:text-champagne transition-colors duration-200 flex items-center justify-between w-full text-left"
                  >
                    <span>Categories</span>
                    <ChevronDown size={28} className={`transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180 text-champagne' : 'text-offwhite/40'}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileCategoriesOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pl-4 flex flex-col gap-4 mt-4 border-l border-trim"
                      >
                        {['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Jewellery Sets'].map(cat => (
                          <Link
                            key={cat}
                            to="/shop"
                            state={{ filterCategory: cat }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-heading font-light text-offwhite/60 hover:text-champagne transition-colors block"
                          >
                            {cat}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* New Drop */}
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Link
                    to="/shop"
                    state={{ isNewDrop: true }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-5xl font-heading font-light text-offwhite/70 hover:text-champagne transition-colors duration-200 block"
                  >
                    New Drop
                  </Link>
                </motion.div>

                {/* About */}
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-5xl font-heading font-light text-offwhite/70 hover:text-champagne transition-colors duration-200 block"
                  >
                    About
                  </Link>
                </motion.div>
              </div>

              <div className="mt-auto pt-8 border-t border-trim">
                <p className="text-[10px] text-muted tracking-[0.3em] uppercase font-body">
                  jewellery for girls who don't do basic.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
