import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, ShieldCheck, Sparkles, Truck, ArrowRight, Star, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const bestsellerRowRef = useRef(null);
  const reviewsRowRef = useRef(null);

  // Collections mapping to category grid in the second screenshot
  const collections = [
    {
      name: 'Necklaces',
      image: '/bow-choker-1.png',
    },
    {
      name: 'Rings',
      image: '/wave-ring-1.png',
    },
    {
      name: 'Earrings',
      image: '/flower-pearl-stud-earrings-1.png',
    },
    {
      name: 'Bracelets',
      image: '/bamboo-cuff-bracelet-1.png',
    },
  ];

  // Load the first 5 products from products.json to display in Bestsellers
  const bestsellers = productsData.slice(0, 6);

  // Reviews list matching screenshot exactly
  const reviews = [
    {
      text: 'The quality is insane! I wear it everyday and it still looks brand new.',
      author: 'Ananya, Mumbai',
    },
    {
      text: 'Minimal, classy and so versatile. I love how I can layer it with everything.',
      author: 'Rhea, Delhi',
    },
    {
      text: "Finally found jewellery that doesn't tarnish! My everyday go-to.",
      author: 'Ishita, Bangalore',
    },
    {
      text: 'Super lightweight and comfortable. Literally my everyday pieces!',
      author: 'Mehak, Jaipur',
    },
    {
      text: 'Packaging is so cute. Perfect for gifting too!',
      author: 'Simran, Pune',
    },
  ];

  // Helper for category navigation
  const handleCategoryClick = (category) => {
    navigate('/shop', { state: { filterCategory: category } });
  };

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-void text-offwhite pt-0">
      
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative h-[85vh] md:h-screen w-full flex items-center justify-start overflow-hidden bg-void">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-model.jpg" 
            alt="HRDYA Hero" 
            className="w-full h-full object-cover object-[center_60%]" 
          />
          {/* Dark Overlay gradient on the left/bottom to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full flex flex-col items-start justify-center text-white pt-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-semibold text-champagne">EST. 2025</span>
            <div className="w-10 h-px bg-champagne/60" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light leading-none mb-6 max-w-2xl text-white">
            Jewellery <br className="hidden md:inline" />
            that feels <br />
            <span className="italic font-light text-champagne font-heading">like you.</span>
          </h1>

          <p className="text-xs md:text-sm text-[#F0EBE1]/85 font-body tracking-wider leading-relaxed mb-10 max-w-md">
            Curated essentials. Made to layer. Made to last.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
            <Link 
              to="/shop" 
              className="bg-white text-offwhite hover:bg-champagne hover:text-white py-3.5 px-8 text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 text-center"
            >
              Shop New Drop →
            </Link>
            <Link 
              to="/shop" 
              className="border border-white/60 text-white hover:border-champagne hover:text-champagne py-3.5 px-8 text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 text-center"
            >
              Build Your Stack
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 right-10 z-10 hidden md:flex flex-col items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/65">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/50 writing-mode-vertical text-center font-semibold">Scroll to Explore</span>
        </div>
      </section>

      {/* ══════════════ HIGHLIGHTS BAR ══════════════ */}
      <section className="bg-[#FCFAF8] text-[#1C1917] py-6 px-6 border-b border-[#E7E3DB]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E7E3DB]/80">
          
          {/* Waterproof */}
          <div className="flex gap-4 items-start pt-4 lg:pt-0 lg:pl-6 first:pt-0 first:pl-0">
            <Droplet size={20} className="text-[#C59B7E] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-body font-bold text-[11px] uppercase tracking-wider mb-1">Waterproof</h5>
              <p className="text-[10px] text-[#7E756C] leading-relaxed">Wear in water. Shower. Sweat. Repeat.</p>
            </div>
          </div>

          {/* Tarnish Free */}
          <div className="flex gap-4 items-start pt-4 lg:pt-0 lg:pl-6">
            <ShieldCheck size={20} className="text-[#C59B7E] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-body font-bold text-[11px] uppercase tracking-wider mb-1">Tarnish Free</h5>
              <p className="text-[10px] text-[#7E756C] leading-relaxed">Built to last. Always gold, always you.</p>
            </div>
          </div>

          {/* Hypoallergenic */}
          <div className="flex gap-4 items-start pt-4 lg:pt-0 lg:pl-6">
            <Sparkles size={20} className="text-[#C59B7E] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-body font-bold text-[11px] uppercase tracking-wider mb-1">Hypoallergenic</h5>
              <p className="text-[10px] text-[#7E756C] leading-relaxed">Skin-friendly jewellery for everyday wear.</p>
            </div>
          </div>

          {/* Free Shipping */}
          <div className="flex gap-4 items-start pt-4 lg:pt-0 lg:pl-6">
            <Truck size={20} className="text-[#C59B7E] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-body font-bold text-[11px] uppercase tracking-wider mb-1">Free Shipping</h5>
              <p className="text-[10px] text-[#7E756C] leading-relaxed">On all orders above ₹599</p>
            </div>
          </div>

        </div>
      </section>
      
      {/* ══════════════ CATEGORIES SECTION ══════════════ */}
      <section className="py-12 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 border-b border-trim/30 pb-4">
            <h2 className="font-heading text-xl md:text-2xl font-light tracking-[0.25em] text-offwhite uppercase">
              Shop By Category
            </h2>
            <Link
              to="/shop"
              className="text-[9px] uppercase tracking-[0.22em] font-semibold text-offwhite hover:text-champagne transition-colors duration-300 flex items-center gap-1"
            >
              Shop All Products <ArrowRight size={10} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((col, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(col.name)}
                className="group relative h-[280px] md:h-[340px] overflow-hidden cursor-pointer shadow-sm"
              >
                {/* Image */}
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Text overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-offwhite">
                  <h3 className="font-heading text-base md:text-lg font-light tracking-widest uppercase mb-1">
                    {col.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[8px] uppercase tracking-[0.25em] text-champagne/80 font-body group-hover:text-champagne transition-colors duration-300">
                    <span>Shop now</span>
                    <ArrowRight size={8} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MARQUEE SCROLL BANNER ══════════════ */}
      <div className="w-full bg-[#1C1917] py-4 overflow-hidden whitespace-nowrap select-none relative z-10 flex border-y border-trim/10">
        <div className="animate-marquee flex text-[10px] md:text-[11px] font-body font-medium uppercase tracking-[0.3em] text-[#FAF7F0]/90">
          <div className="flex shrink-0 gap-8 items-center px-4">
            <span>Not Basic</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Made To Layer</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Designed in India</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Not Basic</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Made To Layer</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Designed in India</span> <span className="text-champagne text-[14px]">✦</span>
          </div>
          <div className="flex shrink-0 gap-8 items-center px-4">
            <span>Not Basic</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Made To Layer</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Designed in India</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Not Basic</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Made To Layer</span> <span className="text-champagne text-[14px]">✦</span>
            <span>Designed in India</span> <span className="text-champagne text-[14px]">✦</span>
          </div>
        </div>
      </div>

      {/* ══════════════ BESTSELLERS SECTION ══════════════ */}
      <section className="py-12 px-6 md:px-12 lg:px-16 bg-obsidian">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 border-b border-trim/30 pb-4">
            <h2 className="font-heading text-xl md:text-2xl font-light tracking-[0.25em] text-offwhite uppercase">
              Bestsellers
            </h2>
            <Link
              to="/shop"
              className="text-[9px] uppercase tracking-[0.22em] font-semibold text-offwhite hover:text-champagne transition-colors duration-300 flex items-center gap-1"
            >
              View All <ArrowRight size={10} />
            </Link>
          </div>

          {/* Horizontal scroll wrapper */}
          <div className="relative">
            <div
              ref={bestsellerRowRef}
              className="flex overflow-x-auto gap-4 pb-6 scrollbar-none snap-x snap-mandatory"
            >
              {bestsellers.map((product) => (
                <div key={product.id} className="min-w-[200px] md:min-w-[240px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Slider control arrow */}
            <button
              onClick={() => scrollRight(bestsellerRowRef)}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ BUILD YOUR STACK ══════════════ */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-[#e9e8e5] border-y border-[#dcdad5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_3fr] gap-12 items-center">
          
          {/* Copy */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-light leading-tight mb-5 uppercase tracking-wide">
              Build Your Stack
            </h2>
            <p className="text-xs text-[#07070a]/70 font-body leading-relaxed tracking-wide mb-8 max-w-sm">
              Mix, match and layer your favourites to create a look that's so you.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-void text-offwhite hover:bg-champagne hover:text-void px-6 py-3.5 text-[9px] uppercase tracking-[0.25em] font-body font-semibold transition-all duration-350"
            >
              Start Building →
            </Link>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.2fr] gap-2 md:gap-4 items-center">
            
            {/* Step 1 */}
            <div className="text-center">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-[#07070a]/50 block mb-2 font-body font-semibold">
                1 Choose Your<br />Necklace
              </span>
              <div className="bg-[#f0efec] border border-neutral-200 p-1 md:p-2 shadow-sm">
                <img src="/hollow-heart-necklace-1.png" alt="" className="w-full object-cover" />
              </div>
            </div>

            {/* Plus */}
            <span className="text-lg md:text-xl font-light text-[#07070a]/40 mt-6">+</span>

            {/* Step 2 */}
            <div className="text-center">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-[#07070a]/50 block mb-2 font-body font-semibold">
                2 Add Another<br />Necklace
              </span>
              <div className="bg-[#f0efec] border border-neutral-200 p-1 md:p-2 shadow-sm">
                <img src="/heart-beaded-chain-1.png" alt="" className="w-full object-cover" />
              </div>
            </div>

            {/* Plus */}
            <span className="text-lg md:text-xl font-light text-[#07070a]/40 mt-6">+</span>

            {/* Step 3 */}
            <div className="text-center">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-[#07070a]/50 block mb-2 font-body font-semibold">
                3 Add A<br />Pendant
              </span>
              <div className="bg-[#f0efec] border border-neutral-200 p-1 md:p-2 shadow-sm">
                <img src="/rose-gold-pendant-1.png" alt="" className="w-full object-cover" />
              </div>
            </div>

            {/* Equals */}
            <span className="text-lg md:text-xl font-light text-[#07070a]/40 mt-6">=</span>

            {/* Result */}
            <div className="text-center">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-[#07070a]/50 block mb-2 font-body font-semibold text-champagne/80 font-bold">
                Your Stack
              </span>
              <div className="bg-[#f0efec] border border-neutral-300 p-1.5 md:p-2.5 shadow-md">
                <img src="/double-layered-choker-1.png" alt="" className="w-full object-cover" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════ REVIEWS ROW (LOVED BY 10,000+ GIRLS) ══════════════ */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-void">
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-10 border-b border-trim/30 pb-4">
            <h2 className="font-heading text-xl md:text-2xl font-light tracking-[0.25em] text-offwhite uppercase">
              Loved by 10,000+ Girls
            </h2>
          </div>

          {/* Cards container */}
          <div className="relative">
            <div
              ref={reviewsRowRef}
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory"
            >
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="min-w-[240px] md:min-w-[280px] bg-white border border-neutral-200/60 p-6 md:p-8 flex flex-col justify-between shadow-sm snap-start"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex text-[#c8a45a] mb-4 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                    </div>
                    <p className="font-body text-[12px] text-offwhite/85 leading-relaxed italic mb-6">
                      "{rev.text}"
                    </p>
                  </div>
                  <span className="text-[10px] text-muted font-body font-semibold">
                    - {rev.author}
                  </span>
                </div>
              ))}
            </div>

            {/* Arrow control */}
            <button
              onClick={() => scrollRight(reviewsRowRef)}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ JOIN THE CLUB / FOOTER (Curated beige section) ══════════════ */}
      <section className="bg-[#decbba] text-offwhite py-16 px-6 md:px-12 lg:px-16 border-t border-[#cbb3a0]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-center">
          
          {/* Polaroid image card on the left */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white p-2.5 shadow-lg border border-neutral-300/40 w-full max-w-[220px]">
              <img src="/vintage-heart-set-1.jpg" alt="" className="w-full object-cover" />
            </div>
          </div>

          {/* Email Newsletter on the right */}
          <div className="text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <h3 className="font-heading text-2xl md:text-3xl font-light uppercase tracking-widest mb-3">
              Join the HRDYA Club
            </h3>
            <p className="text-xs text-offwhite/75 font-body leading-relaxed mb-8">
              Early access to new drops, exclusive offers and special perks just for you.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex border border-neutral-400 focus-within:border-offwhite transition-colors bg-void">
              <input
                type="email" required
                placeholder="Enter your email"
                className="bg-transparent flex-grow text-xs py-3 px-4 outline-none text-offwhite placeholder-muted font-body"
              />
              <button
                type="submit"
                className="bg-offwhite text-void hover:bg-champagne hover:text-void px-6 text-[10px] uppercase tracking-widest font-semibold transition-colors duration-300 font-body"
              >
                Join Now
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
