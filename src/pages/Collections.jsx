import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gift, Heart, Calendar } from 'lucide-react';
import productsData from '../data/products.json';

export default function Collections() {
  const navigate = useNavigate();

  // Curated collections
  const collections = [
    {
      id: 'new-drops',
      name: 'The Friday Drops',
      tag: 'Limited Edition',
      desc: 'Our latest releases, updated every Friday. These pieces are in limited quantity and do not restock often.',
      count: productsData.filter(p => p.badge === 'New Drop').length,
      icon: <Calendar className="text-champagne" size={20} />,
      gradient: 'linear-gradient(135deg, #0f0c1b, #07070a)',
      action: () => navigate('/shop', { state: { isNewDrop: true } }),
    },
    {
      id: 'gift-sets',
      name: 'Curated Gift Sets',
      tag: 'Bundles & Sets',
      desc: 'Elegant coordinated jewellery sets featuring necklaces with matching earrings or complete 4-piece styling sets.',
      count: productsData.filter(p => p.category === 'Jewellery Sets').length,
      icon: <Gift className="text-champagne" size={20} />,
      gradient: 'linear-gradient(135deg, #0d1216, #07070a)',
      action: () => navigate('/shop', { state: { filterCategory: 'Jewellery Sets' } }),
    },
    {
      id: 'daily-essentials',
      name: 'Anti-Tarnish Essentials',
      tag: 'Everyday Comfort',
      desc: 'Sleek, lightweight rings, bracelets, and chains engineered with sweat-proof materials for uninterrupted daily wear.',
      count: productsData.filter(p => p.occasion === 'Daily Wear').length,
      icon: <Sparkles className="text-champagne" size={20} />,
      gradient: 'linear-gradient(135deg, #100f12, #07070a)',
      action: () => navigate('/shop', { state: { filterOccasion: 'Daily Wear' } }),
    },
    {
      id: 'party-statements',
      name: 'Party Statements',
      tag: 'Glamour & Shine',
      desc: 'Bold stones, emerald baguettes, and sparkling American Diamonds designed to command attention at any celebration.',
      count: productsData.filter(p => p.occasion === 'Party').length,
      icon: <Heart className="text-champagne" size={20} />,
      gradient: 'linear-gradient(135deg, #120e0e, #07070a)',
      action: () => navigate('/shop', { state: { filterOccasion: 'Party' } }),
    },
  ];

  return (
    <div className="min-h-screen bg-void text-offwhite overflow-hidden pb-10">
      {/* Page Header */}
      <div className="pt-40 pb-16 px-6 text-center border-b border-trim/40 bg-gradient-to-b from-surface to-void">
        <span className="section-label">Curated Styling</span>
        <h1 className="text-5xl md:text-7xl font-heading font-light tracking-tight">Our Collections</h1>
        <p className="text-muted font-heading italic mt-4 text-base md:text-lg">
          Thematic stacks and coordinated releases to complete your aesthetic.
        </p>
      </div>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={col.action}
              className="group relative overflow-hidden border border-trim hover:border-champagne/30 p-8 md:p-10 transition-all duration-350 cursor-pointer flex flex-col justify-between min-h-[300px] md:min-h-[350px]"
              style={{ background: col.gradient }}
            >
              {/* Top Details */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 border border-champagne/10 bg-champagne/5">
                      {col.icon}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-champagne">{col.tag}</span>
                  </div>
                  <span className="text-[10px] text-muted tracking-wider font-body">{col.count} Items</span>
                </div>

                <h2 className="font-heading text-3xl md:text-4xl font-light text-offwhite mb-4 group-hover:text-champagne transition-colors duration-300">
                  {col.name}
                </h2>
                <p className="text-xs text-muted leading-relaxed font-body max-w-md">
                  {col.desc}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center gap-2 mt-8 pt-4 border-t border-trim/30 group-hover:border-champagne/15 transition-colors duration-300">
                <span className="text-[10px] uppercase tracking-[0.22em] text-offwhite font-body group-hover:text-champagne transition-colors duration-300">
                  Explore Collection
                </span>
                <ArrowRight size={11} className="text-muted group-hover:text-champagne group-hover:translate-x-1 transition-all duration-300" />
              </div>

              {/* Large Star Watermark */}
              <div className="absolute right-5 bottom-8 text-8xl font-heading text-champagne/[0.02] group-hover:text-champagne/[0.04] transition-colors duration-500 pointer-events-none select-none">
                ✦
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
