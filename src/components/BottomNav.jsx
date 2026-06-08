import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function BottomNav() {
  const location = useLocation();
  const { cartItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-3 pb-safe border-t border-trim/60"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="flex justify-between items-center">
        <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/' ? 'text-champagne' : 'text-muted hover:text-offwhite'}`}>
          <Home size={22} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-body">Home</span>
        </Link>

        <Link to="/shop" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/shop' ? 'text-champagne' : 'text-muted hover:text-offwhite'}`}>
          <ShoppingBag size={22} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-body">Shop</span>
        </Link>

        <Link to="/shop" className="flex flex-col items-center gap-1 text-muted hover:text-offwhite transition-colors relative">
          <Heart size={22} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-body">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-1 bg-coral text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
              {wishlist.length}
            </span>
          )}
        </Link>

        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-muted hover:text-offwhite transition-colors relative">
          <ShoppingCart size={22} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-body">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-0 bg-champagne text-void text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
