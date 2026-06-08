import React, { useEffect, useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shippingThreshold = 599;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - subtotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50"
            style={{ backdropFilter: 'blur(6px)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed z-50 bg-cream text-[#1A1A1A] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.6)]
              ${isMobile
                ? 'inset-x-0 bottom-0 h-[90vh] rounded-t-2xl'
                : 'top-0 right-0 h-full w-[420px]'
              }`}
          >

            {/* Header */}
            <div className="px-6 py-5 border-b border-[#D8D0C4] flex justify-between items-center bg-cream">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={17} className="text-[#6B5B42]" />
                <h2 className="font-heading text-[17px] tracking-[0.08em]">Your Cart</h2>
                {cartItems.length > 0 && (
                  <span className="bg-champagne text-void text-[9px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="text-[#8A7A6A] hover:text-[#1A1A1A] transition-colors hover:rotate-90 duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Shipping progress */}
            {cartItems.length > 0 && (
              <div className="px-6 py-3.5 bg-[#EDE8DF] border-b border-[#D8D0C4]">
                <p className="text-[11px] font-body text-[#5A5055] mb-2 text-center">
                  {subtotal >= shippingThreshold
                    ? "✨ You've unlocked FREE Shipping!"
                    : `Add ₹${remaining} more for FREE Shipping`}
                </p>
                <div className="w-full bg-[#C8C0B8]/40 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-[#C8A45A] to-[#EED880] h-full rounded-full"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar bg-cream">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-[#C8C0B8]" />
                  <p className="font-heading text-xl text-[#6B5B42] font-light">Your cart is empty</p>
                  <p className="text-[12px] text-[#9A9090] font-body">Discover pieces you'll love.</p>
                  <button
                    id="start-shopping-btn"
                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                    className="mt-4 bg-[#1A1A1A] text-champagne py-3 px-8 text-[10px] uppercase tracking-[0.2em] font-body font-semibold hover:bg-void transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {cartItems.map((item, idx) => (
                      <motion.div
                        key={`${item.product.id}-${item.size}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 pb-5 border-b border-[#D8D0C4] last:border-0"
                      >
                        <div className="w-[72px] h-[90px] flex-shrink-0 bg-[#EDE8DF] overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-heading text-[14px] leading-tight text-[#1A1A1A] line-clamp-2 mb-1">
                                {item.product.name}
                              </h3>
                              {item.size && (
                                <p className="text-[10px] text-[#8A7A6A] font-body">Size: {item.size}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-[#C8C0B8] hover:text-coral transition-colors flex-shrink-0 mt-0.5"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="flex items-center border border-[#C8C0B8] bg-white">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="px-2.5 py-1.5 text-[#8A7A6A] hover:text-coral transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-[12px] font-body font-semibold text-[#1A1A1A] w-7 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="px-2.5 py-1.5 text-[#8A7A6A] hover:text-coral transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <span className="font-heading font-medium text-[#1A1A1A] text-[15px]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-[#D8D0C4] bg-[#EDE8DF]">
                <div className="flex justify-between mb-1 text-[#1A1A1A]">
                  <span className="text-[12px] font-body text-[#5A5055]">Subtotal</span>
                  <span className="font-heading font-medium text-[16px]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-[#9A9090] mb-5 font-body">Shipping & taxes calculated at checkout</p>
                <button
                  id="checkout-btn"
                  onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                  className="w-full bg-[#1A1A1A] text-champagne py-4 font-body font-semibold text-[10px]
                             uppercase tracking-[0.22em] hover:bg-void active:scale-[0.98] transition-all
                             flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  Checkout
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
