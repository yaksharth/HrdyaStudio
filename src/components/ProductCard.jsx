import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-cream overflow-hidden h-full"
    >
      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden bg-[#EDE8DF] aspect-[3/4] flex-shrink-0">
        <Link to={`/product/${product.id}`} tabIndex={-1}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
        </Link>

        {/* Badges */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-void/90 text-champagne text-[8px] uppercase tracking-[0.22em] px-2.5 py-1 font-body z-10 backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {discount >= 20 && (
          <span className="absolute top-3 right-10 bg-coral text-white text-[8px] font-semibold px-2 py-1 z-10">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          id={`wishlist-${product.id}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center transition-all duration-200 ${
            wishlisted ? 'text-coral scale-110' : 'text-[#1A1A1A]/40 hover:text-coral hover:scale-110'
          }`}
        >
          <Heart size={15} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Quick Add slide-up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out z-20 p-2.5">
          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => { e.preventDefault(); addToCart(product, 1, product.sizes?.[0] || null); }}
            className="w-full bg-void/95 text-champagne py-2.5 text-[9px] uppercase tracking-[0.22em] font-medium
                       hover:bg-void transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <ShoppingBag size={11} />
            Quick Add
          </button>
        </div>
      </div>

      {/* ── INFO ── */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-4 bg-cream">
        {product.category === 'Jewellery Sets' && (
          <span className="text-[8px] uppercase tracking-[0.28em] text-[#8A7A6A] font-medium mb-1">Combo Set</span>
        )}
        <Link
          to={`/product/${product.id}`}
          className="block font-heading text-[#1A1A1A] text-[13px] md:text-[15px] leading-tight mb-2
                     hover:text-[#6B5B42] transition-colors duration-200 line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-[#1A1A1A] font-semibold text-[13px] md:text-[15px]">₹{product.price}</span>
          <span className="text-[#9A9090] line-through text-[11px] md:text-[12px]">₹{product.mrp}</span>
        </div>
      </div>
    </motion.div>
  );
}
