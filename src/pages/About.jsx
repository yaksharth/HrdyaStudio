import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Feather, CalendarClock, Heart, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '100%', label: 'Anti-Tarnish' },
    { value: 'Weekly', label: 'Fresh Drops' },
  ];

  const values = [
    {
      icon: <ShieldCheck className="text-champagne" size={24} />,
      title: 'Hypoallergenic Metals',
      desc: 'All our jewellery is made with skin-safe stainless steel and premium copper/brass alloys. Free from nickel, lead, and cadmium, ensuring zero irritation.',
    },
    {
      icon: <Sparkles className="text-champagne" size={24} />,
      title: 'Double Anti-Tarnish Coating',
      desc: 'We use advanced PVD plating and anti-tarnish protective sealing so your favourite pieces keep their luminous shine for years without fading.',
    },
    {
      icon: <Feather className="text-champagne" size={24} />,
      title: 'Featherlight Comfort',
      desc: 'Our designs are meticulously weighted to be as light as a feather. Wear them from morning meetings to late-night dinners without even noticing they are on.',
    },
    {
      icon: <CalendarClock className="text-champagne" size={24} />,
      title: 'Every Friday Drops',
      desc: 'We do not believe in massive, slow seasonal releases. We bring you fresh, curated trends every single Friday in limited-edition drops.',
    },
  ];

  return (
    <div className="min-h-screen bg-void text-offwhite overflow-hidden">
      {/* Parallax Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center border-b border-trim/40 bg-gradient-to-b from-surface to-void">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="section-label">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-heading font-light tracking-tight mb-8">
            For Girls Who <br />
            <span className="font-light italic text-champagne">Don't Do Basic</span>
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-heading italic max-w-2xl mx-auto">
            "HRDYA Studio was born out of a simple frustration: why does premium aesthetic jewellery either cost a fortune or tarnish in three days?"
          </p>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,164,90,0.04) 0%, transparent 80%)' }}
        />
      </section>

      {/* Brand Mission & Story */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light mb-8">
              A Studio Crafting Modern Essentials
            </h2>
            <div className="space-y-6 text-muted font-body text-[14px] leading-relaxed">
              <p>
                HRDYA means 'Heart' in Sanskrit, reflecting the passion and love we infuse into every design we bring to life. Located in Mumbai, we cater to fashion-forward women across India looking for high-quality, minimalist, and statement jewellery that stands the test of time.
              </p>
              <p>
                We curate and design anti-tarnish, water-resistant pieces meant to be layered, mixed, and stacked. From everyday sleek snake chains to statement American Diamond sets, we believe your accessories should speak louder than your words.
              </p>
              <p>
                Every piece undergoes a multi-step quality control process. We check plating thickness, stone settings, and clasp strength so that you can wear HRDYA with absolute confidence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-trim">
              {stats.map((s, idx) => (
                <div key={idx}>
                  <p className="text-2xl md:text-3xl font-heading font-semibold text-champagne">{s.value}</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Collage */}
          <div className="relative h-[450px] md:h-[550px] flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute w-[80%] h-[80%] border border-trim/40 -rotate-3 transition-transform duration-500 hover:rotate-0" />
            <div className="absolute w-[80%] h-[80%] border border-champagne/10 rotate-3 transition-transform duration-500 hover:rotate-0" />

            <div className="absolute z-10 text-center p-8 bg-elevated/70 border border-trim max-w-sm backdrop-blur-md">
              <span className="text-4xl text-champagne mb-4 block">✦</span>
              <h3 className="font-heading text-xl mb-3 tracking-wide">Anti-Tarnish Plating</h3>
              <p className="text-xs text-muted font-body leading-relaxed">
                All gold pieces are plated using PVD technology to ensure a uniform, gorgeous 18k gold tone that resists sweat, lotions, and daily wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">Our Standards</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light">
              Crafted Without Compromise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((v, idx) => (
              <div key={idx} className="flex gap-5 items-start p-6 bg-void border border-trim hover:border-champagne/20 transition-all duration-300">
                <div className="p-3 border border-champagne/10 bg-champagne/5 rounded-none flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg text-offwhite mb-2 tracking-wide">{v.title}</h3>
                  <p className="text-xs text-muted leading-relaxed font-body">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-28 px-6 text-center relative bg-void">
        <div className="max-w-xl mx-auto relative z-10">
          <span className="section-label">Join the Vibe</span>
          <h2 className="text-4xl font-heading font-light mb-6">Ready to Stack?</h2>
          <p className="text-muted font-body text-sm mb-10 leading-relaxed">
            Discover our collection of anti-tarnish rings, necklaces, bracelets, and earrings. Designed to highlight your unique personality.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/shop" className="btn-primary">Shop All Drops</Link>
            <Link to="/support" className="btn-outline">Jewellery Care</Link>
          </div>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200,164,90,0.03) 0%, transparent 70%)' }}
        />
      </section>
    </div>
  );
}
