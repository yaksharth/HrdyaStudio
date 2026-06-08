import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-void border-t border-trim/60">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-12 md:gap-16">

          {/* Brand */}
          <div>
            <Link to="/" className="block text-[26px] font-heading font-bold tracking-[0.3em] text-offwhite mb-4 hover:text-champagne transition-colors duration-300">
              HRDYA
            </Link>
            <p className="text-[12px] text-muted leading-relaxed italic font-heading mb-6">
              jewellery for girls who don't do basic.
            </p>
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-muted font-body uppercase tracking-[0.2em]">Drops every Friday</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-body font-semibold uppercase tracking-[0.3em] text-offwhite/50 mb-6">Shop</h4>
            <ul className="space-y-3.5">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Jewellery Sets'].map(cat => (
                <li key={cat}>
                  <Link to="/shop" state={{ filterCategory: cat }} className="text-[12px] text-muted hover:text-champagne transition-colors duration-200 font-body">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] font-body font-semibold uppercase tracking-[0.3em] text-offwhite/50 mb-6">Help</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Track Order', tab: 'track' },
                { label: 'Shipping & Returns', tab: 'shipping' },
                { label: 'Jewellery Care', tab: 'care' },
                { label: 'Contact Us', tab: 'contact' },
                { label: 'Size Guide', tab: 'size' },
              ].map(link => (
                <li key={link.label}>
                  <Link to="/support" state={{ tab: link.tab }} className="text-[12px] text-muted hover:text-champagne transition-colors duration-200 font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-[10px] font-body font-semibold uppercase tracking-[0.3em] text-offwhite/50 mb-6">Stay in the Loop</h4>
            <p className="text-[12px] text-muted mb-5 font-body leading-relaxed">
              Get 10% off your first drop.<br />New arrivals, every Friday. 🖤
            </p>

            <form className="flex mb-8 border-b border-trim focus-within:border-champagne/40 transition-colors duration-300">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent flex-1 text-[12px] py-2.5 px-1 focus:outline-none text-offwhite placeholder-muted/50 font-body"
              />
              <button type="submit" className="text-champagne/60 hover:text-champagne transition-colors px-2">
                <Send size={15} />
              </button>
            </form>

            {/* Social icons */}
            <div className="flex gap-5">
              <a href="https://www.instagram.com/hrdyastudio?igsh=MW9oYWdzbnozMWp5dQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted hover:text-champagne transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-trim/40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-muted/60 font-body">
          <p>© 2025 HRDYA Studio. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-muted transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-muted transition-colors">Terms of Service</Link>
            <span className="hidden sm:inline">GST: 27AABCU9603R1ZX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
