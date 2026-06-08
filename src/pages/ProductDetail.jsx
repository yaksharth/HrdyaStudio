import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, Minus, Plus, Truck, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct]           = useState(null);
  const [activeImage, setActiveImage]   = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab]       = useState('Description');

  useEffect(() => {
    const found = productsData.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedSize(found.sizes?.[0] ?? null);
      setQuantity(1);
      setActiveImage(0);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <p className="text-muted font-heading text-2xl">Product not found.</p>
      </div>
    );
  }

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wishlisted = isInWishlist(product.id);
  const tabs = ['Description', 'Care Instructions', 'Shipping & Returns'];

  return (
    <div className="min-h-screen bg-void">

      {/* ── BACK NAV ── */}
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[9px] text-muted hover:text-champagne transition-colors duration-200 uppercase tracking-[0.25em] font-body mb-10 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
      </div>

      {/* ── MAIN PRODUCT AREA ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        <div className="bg-cream rounded-none grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

          {/* Image Gallery */}
          <div className="flex flex-col md:flex-row gap-3 p-5 md:p-6 bg-[#EDE8DF]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2.5 order-2 md:order-1 overflow-x-auto md:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 flex-shrink-0 border-2 transition-all duration-200 overflow-hidden ${
                    activeImage === idx
                      ? 'border-[#1A1A1A] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover bg-[#E0DBD2]" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 order-1 md:order-2 aspect-[3/4] relative overflow-hidden">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover bg-[#E0DBD2]"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-void/90 text-champagne text-[9px] uppercase tracking-[0.22em] px-3 py-1 font-body">
                  {product.badge}
                </span>
              )}
              {product.category === 'Jewellery Sets' && (
                <span className="absolute top-4 right-4 bg-[#1A1A1A] text-[#EDE8DF] text-[9px] uppercase tracking-[0.22em] px-3 py-1 font-body">
                  Combo
                </span>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="p-7 md:p-10 bg-cream text-[#1A1A1A] flex flex-col">
            {/* Category breadcrumb */}
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#8A7A6A] mb-4 font-body">{product.category}</p>

            <h1 className="text-3xl md:text-4xl font-heading font-medium leading-tight text-[#1A1A1A] mb-5">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <Star key={i} size={13} className="fill-current" />
                ))}
                {product.rating % 1 !== 0 && <Star size={13} className="fill-current opacity-40" />}
              </div>
              <span className="text-[11px] text-[#8A7A6A] font-body border-b border-[#C8B8A0] pb-0.5 cursor-pointer hover:text-[#1A1A1A] transition-colors">
                {product.reviewCount} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-7 pb-7 border-b border-[#D8D0C4]">
              {product.category === 'Jewellery Sets' ? (
                <div>
                  <p className="text-[11px] text-[#9A9090] line-through mb-1 font-body">Buying Separately: ₹{product.mrp}</p>
                  <span className="text-3xl text-coral font-bold font-heading">Combo ₹{product.price}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl text-[#1A1A1A] font-bold font-heading">₹{product.price}</span>
                  <span className="text-lg text-[#9A9090] line-through font-heading">₹{product.mrp}</span>
                  {discount > 0 && (
                    <span className="text-[10px] font-body font-semibold text-coral border border-coral px-2 py-0.5 bg-coral/8">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description short */}
            <p className="text-[13px] text-[#5A5055] font-body leading-relaxed mb-7">{product.description}</p>

            {/* Details */}
            <div className="space-y-5 mb-8">
              <div className="flex gap-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8A7A6A] font-body w-24 flex-shrink-0 pt-0.5">Made With</p>
                <p className="text-[13px] font-body text-[#1A1A1A] font-medium">{product.material}</p>
              </div>

              {product.includes && (
                <div className="flex gap-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#8A7A6A] font-body w-24 flex-shrink-0 pt-0.5">Includes</p>
                  <ul className="space-y-1">
                    {product.includes.map((item, idx) => (
                      <li key={idx} className="text-[13px] font-body text-[#1A1A1A] flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#C8A45A] flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Size */}
            {product.sizes && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#8A7A6A] font-body font-semibold">Select Size</p>
                  <button className="text-[10px] text-coral underline font-body">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-[12px] font-body border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-cream font-medium'
                          : 'border-[#C8C0B8] hover:border-[#1A1A1A] text-[#5A5055]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#8A7A6A] font-body font-semibold mb-3">Quantity</p>
              <div className="flex items-center border border-[#C8C0B8] w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:text-coral transition-colors text-[#5A5055]"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 font-body font-semibold text-[#1A1A1A] text-sm min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:text-coral transition-colors text-[#5A5055]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                id="add-to-cart-btn"
                onClick={() => addToCart(product, quantity, selectedSize)}
                className="flex-1 bg-[#1A1A1A] text-champagne py-4 font-body font-semibold text-[10px]
                           uppercase tracking-[0.22em] hover:bg-void active:scale-[0.98] transition-all text-center"
              >
                Add to Cart
              </button>
              <button
                id="buy-now-btn"
                onClick={() => { addToCart(product, quantity, selectedSize); navigate('/checkout'); }}
                className="flex-1 bg-coral text-white py-4 font-body font-semibold text-[10px]
                           uppercase tracking-[0.22em] hover:bg-[#c0506e] active:scale-[0.98] transition-all text-center
                           shadow-[0_8px_24px_rgba(207,96,128,0.3)]"
              >
                Buy It Now
              </button>
              <button
                id="wishlist-detail-btn"
                onClick={() => toggleWishlist(product)}
                className={`border p-4 flex items-center justify-center transition-all duration-200 ${
                  wishlisted ? 'border-coral bg-coral/8' : 'border-[#C8C0B8] hover:border-[#1A1A1A] bg-white'
                }`}
              >
                <Heart size={20} className={wishlisted ? 'fill-coral text-coral' : 'text-[#1A1A1A]'} />
              </button>
            </div>

            {/* Delivery badge */}
            <div className="bg-[#EDE8DF] p-4 flex items-center gap-3 text-[12px] text-[#1A1A1A] font-body">
              <Truck size={18} className="text-[#6B5B42] flex-shrink-0" />
              <p>Free delivery on orders above ₹599 · <span className="font-semibold">COD Available</span></p>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="mt-16 mb-20">
          <div className="flex gap-8 border-b border-trim overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-[10px] uppercase tracking-[0.25em] font-body whitespace-nowrap transition-colors duration-200 relative ${
                  activeTab === tab ? 'text-champagne' : 'text-muted hover:text-offwhite'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-champagne"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 text-[#B0A8B0] text-[13px] leading-relaxed max-w-3xl font-body">
            {activeTab === 'Description' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>Handcrafted with precision, this piece is designed to be a staple in your collection. Whether you're dressing up for a special occasion or adding flair to your daily outfit, it delivers unmatched elegance.</p>
              </div>
            )}
            {activeTab === 'Care Instructions' && (
              <p>Keep away from water, perfume, and sweat. Wipe with a soft dry cloth after use. Store in the pouch provided.</p>
            )}
            {activeTab === 'Shipping & Returns' && (
              <p>Free shipping on orders above ₹599. COD available pan-India. Returns accepted within 7 days of delivery — no questions asked.</p>
            )}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <span className="section-label">Similar Vibes</span>
              <h2 className="text-3xl md:text-4xl font-heading font-light">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
