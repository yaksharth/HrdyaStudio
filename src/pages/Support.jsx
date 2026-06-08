import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Truck, Heart, Ruler, Mail, Send, ChevronRight, MessageCircle } from 'lucide-react';

export default function Support() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('care');
  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const tabs = [
    { id: 'track', label: 'Track Order', icon: <Truck size={15} /> },
    { id: 'shipping', label: 'Shipping & Returns', icon: <HelpCircle size={15} /> },
    { id: 'care', label: 'Jewellery Care', icon: <Heart size={15} /> },
    { id: 'size', label: 'Size Guide', icon: <Ruler size={15} /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail size={15} /> },
  ];

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    // Mock tracking check
    const id = orderId.toUpperCase().trim();
    if (id.startsWith('HRDYA-') && id.length >= 10) {
      setTrackingResult({
        status: 'In Transit',
        carrier: 'Delhivery',
        eta: '3 Days',
        location: 'Mumbai Sorting Facility',
        steps: [
          { title: 'Order Confirmed', date: 'June 06, 2026', done: true },
          { title: 'Dispatched from Warehouse', date: 'June 07, 2026', done: true },
          { title: 'In Transit (Mumbai Hub)', date: 'June 08, 2026', done: true },
          { title: 'Out for Delivery', date: 'Pending', done: false },
        ]
      });
    } else {
      setTrackingResult({
        error: 'Order ID not found. Use a valid tracking format like HRDYA-12345.'
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-void text-offwhite overflow-hidden pb-10">
      {/* Page Header */}
      <div className="pt-40 pb-14 px-6 text-center border-b border-trim/40 bg-gradient-to-b from-surface to-void">
        <span className="section-label">Help Center</span>
        <h1 className="text-5xl md:text-7xl font-heading font-light tracking-tight">Support & Care</h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Tabs Sidebar */}
          <aside className="w-full lg:w-[260px] flex-shrink-0">
            <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 border-trim/40 pb-4 lg:pb-0 scrollbar-none">
              {tabs.map((tab) => (
                <li key={tab.id} className="flex-shrink-0 lg:flex-shrink">
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setTrackingResult(null);
                    }}
                    className={`w-full text-left py-3.5 px-5 text-[11px] font-body tracking-[0.18em] uppercase border flex items-center gap-3 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-champagne text-void border-champagne font-semibold'
                        : 'bg-transparent text-muted border-trim/70 hover:border-champagne/20 hover:text-offwhite'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Active Tab Panel */}
          <div className="flex-1 bg-surface border border-trim/60 p-6 md:p-10 min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* ── TRACK ORDER PANEL ── */}
                {activeTab === 'track' && (
                  <div>
                    <h2 className="font-heading text-2xl mb-3 font-light text-offwhite">Track Your Order</h2>
                    <p className="text-xs text-muted mb-8 font-body">
                      Enter your order identifier sent via email or SMS to track its real-time shipping status.
                    </p>

                    <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 max-w-md mb-10">
                      <input
                        type="text"
                        placeholder="e.g. HRDYA-12345"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="bg-void border border-trim text-offwhite text-[12px] py-3.5 px-5 focus:outline-none focus:border-champagne/60 flex-grow font-body uppercase"
                      />
                      <button type="submit" className="btn-primary py-3.5">
                        Track Delivery
                      </button>
                    </form>

                    {trackingResult && (
                      <div className="border border-trim bg-void/50 p-6 md:p-8">
                        {trackingResult.error ? (
                          <p className="text-coral text-xs font-body">{trackingResult.error}</p>
                        ) : (
                          <div>
                            <div className="grid grid-cols-2 gap-4 mb-8 text-xs font-body pb-6 border-b border-trim">
                              <div>
                                <span className="text-muted block mb-1">Status</span>
                                <span className="text-champagne font-semibold uppercase tracking-wider">{trackingResult.status}</span>
                              </div>
                              <div>
                                <span className="text-muted block mb-1">Estimated Arrival</span>
                                <span className="text-offwhite font-semibold">{trackingResult.eta}</span>
                              </div>
                              <div>
                                <span className="text-muted block mb-1">Shipping Partner</span>
                                <span className="text-offwhite">{trackingResult.carrier}</span>
                              </div>
                              <div>
                                <span className="text-muted block mb-1">Current Location</span>
                                <span className="text-offwhite">{trackingResult.location}</span>
                              </div>
                            </div>

                            {/* Steps */}
                            <div className="relative pl-6 space-y-8">
                              <div className="absolute left-[3px] top-1.5 bottom-1.5 w-px bg-trim" />
                              {trackingResult.steps.map((step, idx) => (
                                <div key={idx} className="relative flex justify-between items-start gap-4">
                                  {/* Dot */}
                                  <div className={`absolute left-[-26px] top-1 w-2.5 h-2.5 rounded-full border ${
                                    step.done
                                      ? 'bg-champagne border-champagne scale-110'
                                      : 'bg-void border-trim'
                                  }`} />
                                  
                                  <div>
                                    <h4 className={`text-xs font-semibold font-body ${step.done ? 'text-offwhite' : 'text-muted'}`}>
                                      {step.title}
                                    </h4>
                                    <span className="text-[10px] text-muted font-body mt-0.5 block">{step.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── SHIPPING & RETURNS PANEL ── */}
                {activeTab === 'shipping' && (
                  <div>
                    <h2 className="font-heading text-2xl mb-6 font-light text-offwhite">Shipping & Return Policies</h2>
                    
                    <div className="space-y-8 text-xs font-body text-muted leading-relaxed">
                      <div>
                        <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-3">Shipping Rates & Timing</h3>
                        <ul className="space-y-2 list-disc pl-5">
                          <li><strong>Free Shipping</strong>: On all orders above ₹599.</li>
                          <li><strong>Standard Shipping</strong>: Flat ₹50 shipping fee for orders under ₹599.</li>
                          <li><strong>COD (Cash on Delivery)</strong>: Available at no extra charge.</li>
                          <li><strong>Delivery Timings</strong>: 3 to 5 business days for major metro cities. 5 to 7 days for regional districts.</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-trim">
                        <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-3">Hassle-Free Returns</h3>
                        <p className="mb-3">
                          We want you to love your stack! If you are not completely satisfied with your purchase, we accept return requests within <strong>7 days of delivery</strong>.
                        </p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Jewellery must be unworn, undamaged, and returned in its original velvet pouch and box packaging.</li>
                          <li>To request a return or exchange, drop us a message on WhatsApp or email us at support@hrdyastudio.com.</li>
                          <li>Once approved, a reverse pickup will be scheduled at our expense.</li>
                          <li>Refunds are processed to the original payment mode or bank transfer (for COD orders) within 5 working days of warehouse receipt.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── JEWELLERY CARE PANEL ── */}
                {activeTab === 'care' && (
                  <div>
                    <h2 className="font-heading text-2xl mb-3 font-light text-offwhite">Jewellery Care Guide</h2>
                    <p className="text-xs text-muted mb-8 font-body">
                      Keep your HRDYA Studio pieces shining bright with these simple care tips.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-body text-muted leading-relaxed">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Avoid Moisture</h3>
                          <p>
                            Even though our stainless steel base is highly tarnish-resistant, exposing it to water, soap, pool chemicals, and salt water can eventually dull its golden shine. Always remove your pieces before bathing, swimming, or washing dishes.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Put It On Last</h3>
                          <p>
                            Apply lotions, perfumes, and hairsprays before putting on your jewellery. The chemical formulations in beauty products can react with the plating and cause build-up.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Clean with Love</h3>
                          <p>
                            Wipe your jewellery down with a soft, clean microfibre cloth after each wear to remove skin oils, sweat, and environmental dust. Do not use chemical jewellery cleaners or abrasive cloths.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Storage is Key</h3>
                          <p>
                            Store each jewellery item individually in the soft velvet pouch provided with your order. This prevents scratching against other metals and limits exposure to open air.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SIZE GUIDE PANEL ── */}
                {activeTab === 'size' && (
                  <div>
                    <h2 className="font-heading text-2xl mb-6 font-light text-offwhite">Size Guides</h2>
                    
                    <div className="space-y-10">
                      {/* Rings */}
                      <div>
                        <h3 className="font-heading text-[16px] text-offwhite mb-4">Rings Sizes</h3>
                        <p className="text-xs text-muted mb-5 font-body leading-relaxed">
                          Note: Many of our rings are fully adjustable (open-band structure) and fit all fingers. For fixed-size bands, reference the table below.
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body text-left border-collapse border border-trim">
                            <thead>
                              <tr className="bg-void border-b border-trim">
                                <th className="p-3 border-r border-trim font-semibold">US Size</th>
                                <th className="p-3 border-r border-trim font-semibold">Indian Size</th>
                                <th className="p-3 font-semibold">Inner Circumference (mm)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-trim">
                              <tr>
                                <td className="p-3 border-r border-trim">Size 6</td>
                                <td className="p-3 border-r border-trim">Size 11-12</td>
                                <td className="p-3">51.9 mm</td>
                              </tr>
                              <tr className="bg-void/10">
                                <td className="p-3 border-r border-trim">Size 7</td>
                                <td className="p-3 border-r border-trim">Size 13-14</td>
                                <td className="p-3">54.4 mm</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-trim">Size 8</td>
                                <td className="p-3 border-r border-trim">Size 15-16</td>
                                <td className="p-3">57.0 mm</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Necklaces */}
                      <div className="pt-8 border-t border-trim">
                        <h3 className="font-heading text-[16px] text-offwhite mb-4">Necklace Lengths</h3>
                        <div className="space-y-4 text-xs font-body text-muted leading-relaxed">
                          <p>
                            We design our necklaces with adjustable extender chains (typically 5 cm / 2 inches extra) to let you customise where the pendant rests.
                          </p>
                          <ul className="space-y-2 list-disc pl-5">
                            <li><strong>Choker (35 - 40 cm / 14 - 16 in)</strong>: Rests tight against the throat or base of the neck.</li>
                            <li><strong>Princess (45 cm / 18 in)</strong>: The most popular length. Rests gracefully on the collarbone.</li>
                            <li><strong>Matinee (50 - 55 cm / 20 - 22 in)</strong>: Falls slightly below the collarbone, excellent for low necklines or layered stacks.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CONTACT US PANEL ── */}
                {activeTab === 'contact' && (
                  <div>
                    <h2 className="font-heading text-2xl mb-3 font-light text-offwhite">Contact Us</h2>
                    <p className="text-xs text-muted mb-8 font-body">
                      Have a query about sizing, styling, shipping or returns? Connect with our customer support crew.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Form */}
                      <div>
                        {contactSubmitted ? (
                          <div className="border border-champagne/20 bg-champagne/5 p-8 text-center">
                            <span className="text-3xl text-champagne mb-3 block">✦</span>
                            <h3 className="font-heading text-lg text-offwhite mb-2">Message Received</h3>
                            <p className="text-xs text-muted font-body leading-relaxed">
                              Thank you for reaching out! We'll reply to your inquiry within 24 hours.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-5">
                            <div>
                              <label className="text-[9px] uppercase tracking-widest text-muted block mb-1.5 font-body">Name</label>
                              <input
                                type="text" required
                                className="w-full bg-void border border-trim text-offwhite text-[12px] py-3 px-4 focus:outline-none focus:border-champagne/50 font-body"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-widest text-muted block mb-1.5 font-body">Email Address</label>
                              <input
                                type="email" required
                                className="w-full bg-void border border-trim text-offwhite text-[12px] py-3 px-4 focus:outline-none focus:border-champagne/50 font-body"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-widest text-muted block mb-1.5 font-body">Message</label>
                              <textarea
                                rows="4" required
                                className="w-full bg-void border border-trim text-offwhite text-[12px] py-3 px-4 focus:outline-none focus:border-champagne/50 font-body resize-none"
                              />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3.5">
                              Send Message
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-8 text-xs font-body text-muted">
                        <div>
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-3">Reach Us Directly</h3>
                          <p className="mb-4 leading-relaxed">
                            For the fastest assistance regarding order changes, cancellations, or exchanges, chat with us on WhatsApp:
                          </p>
                          <a
                            href="https://wa.me/917852897575"
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-widest font-semibold border border-trim px-5 py-3 hover:border-champagne hover:text-champagne transition-all duration-300"
                          >
                            <MessageCircle size={15} /> WhatsApp Support
                          </a>
                        </div>

                        <div className="pt-6 border-t border-trim">
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Email Inquiries</h3>
                          <p className="mb-1 leading-relaxed">General Support: <strong>support@hrdyastudio.com</strong></p>
                          <p className="leading-relaxed">PR & Collaborations: <strong>collabs@hrdyastudio.com</strong></p>
                        </div>

                        <div className="pt-6 border-t border-trim">
                          <h3 className="font-heading text-[15px] font-semibold text-offwhite mb-2">Operating Hours</h3>
                          <p className="leading-relaxed">Monday - Saturday: <strong>10:00 AM - 7:00 PM IST</strong></p>
                          <p className="leading-relaxed">Sunday: <strong>Closed</strong> (We rest and drop new designs on Friday!)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
