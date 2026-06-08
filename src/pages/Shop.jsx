import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

export default function Shop() {
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: 499,
    occasion: 'All',
    isNewDrop: false,
  });
  const [sortBy, setSortBy] = useState('Newest First');

  const categories = ['All', 'Bracelets', 'Rings', 'Necklaces', 'Jewellery Sets', 'Earrings'];
  const occasions  = ['All', 'Daily Wear', 'College', 'Party', 'Gifting', 'Date Night'];

  useEffect(() => {
    if (location.state) {
      setFilters(prev => ({
        ...prev,
        category: location.state.filterCategory || 'All',
        isNewDrop: location.state.isNewDrop !== undefined ? location.state.isNewDrop : false,
        occasion: location.state.filterOccasion || 'All',
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        category: 'All',
        priceRange: 499,
        occasion: 'All',
        isNewDrop: false,
      }));
    }
  }, [location.state]);

  const filteredProducts = useMemo(() => {
    let result = [...productsData];
    if (location.state?.productIds) {
      result = result.filter(p => location.state.productIds.includes(p.id));
    } else {
      if (filters.category !== 'All') result = result.filter(p => p.category === filters.category);
      if (filters.occasion !== 'All') result = result.filter(p => p.occasion === filters.occasion);
      if (filters.isNewDrop) result = result.filter(p => p.badge === 'New Drop');
      result = result.filter(p => p.price <= filters.priceRange);
      if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
      else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
      else if (sortBy === 'Bestselling') result.sort((a, b) => b.reviewCount - a.reviewCount);
      else if (sortBy === 'New Drops') result.sort((a, b) => (b.badge === 'New Drop' ? 1 : 0) - (a.badge === 'New Drop' ? 1 : 0));
    }
    return result;
  }, [filters, sortBy, location.state]);

  const clearFilters = () => {
    setFilters({ category: 'All', priceRange: 499, occasion: 'All', isNewDrop: false });
    setSortBy('Newest First');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* New Drop Toggle */}
      <button
        id="new-drop-toggle"
        onClick={() => setFilters({ ...filters, isNewDrop: !filters.isNewDrop })}
        className={`w-full py-3 px-4 text-[9px] font-body font-semibold tracking-[0.25em] uppercase border transition-all duration-200 ${
          filters.isNewDrop
            ? 'bg-champagne text-void border-champagne'
            : 'bg-transparent text-offwhite border-trim hover:border-champagne/35'
        }`}
      >
        {filters.isNewDrop ? '✦ Showing New Drops' : '✦ Show New Drops Only'}
      </button>

      {/* Category */}
      <div>
        <h3 className="text-[9px] font-body font-semibold uppercase tracking-[0.3em] mb-5 text-offwhite/35 border-b border-trim pb-3">Category</h3>
        <ul className="space-y-3">
          {categories.map(cat => (
            <li key={cat}>
              <button
                id={`sidebar-cat-${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`text-[12px] font-body tracking-wide flex items-center gap-2.5 transition-colors duration-200 ${
                  filters.category === cat ? 'text-champagne' : 'text-muted hover:text-offwhite'
                }`}
              >
                <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200 ${
                  filters.category === cat ? 'bg-champagne scale-150' : 'bg-trim'
                }`} />
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-[9px] font-body font-semibold uppercase tracking-[0.3em] mb-5 text-offwhite/35 border-b border-trim pb-3">Price</h3>
        <input
          type="range" min="99" max="499"
          value={filters.priceRange}
          onChange={e => setFilters({ ...filters, priceRange: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-body mt-2.5">
          <span className="text-muted">₹99</span>
          <span className="text-champagne font-semibold">Up to ₹{filters.priceRange}</span>
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h3 className="text-[9px] font-body font-semibold uppercase tracking-[0.3em] mb-5 text-offwhite/35 border-b border-trim pb-3">Occasion</h3>
        <ul className="space-y-3">
          {occasions.map(occ => (
            <li key={occ}>
              <button
                onClick={() => setFilters({ ...filters, occasion: occ })}
                className={`text-[12px] font-body tracking-wide flex items-center gap-2.5 transition-colors duration-200 ${
                  filters.occasion === occ ? 'text-champagne' : 'text-muted hover:text-offwhite'
                }`}
              >
                <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200 ${
                  filters.occasion === occ ? 'bg-champagne scale-150' : 'bg-trim'
                }`} />
                {occ}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={clearFilters}
        id="clear-filters"
        className="text-[9px] uppercase tracking-[0.25em] text-muted/60 hover:text-coral transition-colors font-body"
      >
        ✕ Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-void">

      {/* Page Header */}
      <div className="pt-32 pb-14 px-6 text-center border-b border-trim/40">
        <span className="section-label">HRDYA Studio</span>
        <h1 className="text-6xl md:text-8xl font-heading font-light tracking-tight">All Drops</h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-12">

          {/* ── Mobile filter toggle & sort ── */}
          <div className="md:hidden flex justify-between items-center mb-2">
            <button
              id="mobile-filter-btn"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] border border-trim px-4 py-2.5
                         text-muted hover:border-champagne/40 hover:text-offwhite transition-all font-body"
            >
              <SlidersHorizontal size={13} /> Filters
              {(filters.category !== 'All' || filters.occasion !== 'All' || filters.isNewDrop) && (
                <span className="ml-1 bg-champagne text-void text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {[filters.category !== 'All', filters.occasion !== 'All', filters.isNewDrop].filter(Boolean).length}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-surface border border-trim px-4 py-2.5 pr-8
                           text-[9px] uppercase tracking-[0.18em] outline-none focus:border-champagne
                           text-offwhite cursor-pointer font-body"
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Bestselling</option>
                <option>New Drops</option>
              </select>
              <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
            </div>
          </div>

          {/* ── Mobile filter drawer ── */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 bg-black/60 z-40 md:hidden"
                  style={{ backdropFilter: 'blur(4px)' }}
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed inset-y-0 left-0 z-50 bg-void w-[300px] p-7 overflow-y-auto border-r border-trim md:hidden"
                >
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="font-heading text-xl tracking-[0.15em]">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <X size={18} className="text-muted hover:text-offwhite transition-colors" />
                    </button>
                  </div>
                  <FilterContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:block w-[220px] flex-shrink-0">
            <h2 className="text-[9px] font-body font-semibold uppercase tracking-[0.3em] text-offwhite/35 mb-8">Filters</h2>
            <FilterContent />
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1">
            {/* Desktop sort bar */}
            <div className="hidden md:flex justify-between items-center mb-8 pb-5 border-b border-trim/40">
              <p className="text-[10px] text-muted tracking-[0.2em] uppercase font-body">
                {filteredProducts.length} Products
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted/60 font-body">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-surface border border-trim px-4 py-2 pr-8
                               text-[9px] uppercase tracking-[0.18em] outline-none focus:border-champagne
                               text-offwhite cursor-pointer font-body"
                  >
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Bestselling</option>
                    <option>New Drops</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-28 border border-trim">
                <p className="font-heading text-2xl text-muted/60 mb-2">No products found.</p>
                <p className="text-[11px] text-muted/40 mb-8 font-body">Try adjusting or clearing your filters.</p>
                <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
