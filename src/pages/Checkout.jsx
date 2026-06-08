import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ChevronRight, CreditCard, Wallet, Smartphone, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [addressData, setAddressData] = useState({
    name: '', phone: '', email: '', pincode: '', address1: '', address2: '', landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const shipping = subtotal > 599 ? 0 : 99;
  const codFee = paymentMethod === 'COD' ? 40 : 0;
  const total = subtotal + shipping + codFee;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (addressData.name && addressData.phone.length >= 10 && addressData.pincode && addressData.address1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // If Cash on Delivery, bypass Razorpay online flow
    if (paymentMethod === 'COD') {
      setStep(3);
      clearCart();
      window.scrollTo(0, 0);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. BACKEND: Create Razorpay Order
      // Total amount converted to paise (e.g. ₹500 = 50000 paise)
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment gateway.');
      }

      const orderData = await response.json();

      // 2. FRONTEND: Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SzCOOODocx9Qw1',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'HRDYA Studio',
        description: 'Order Payment',
        order_id: orderData.order_id,
        handler: async function (razorpayResponse) {
          try {
            // 3. BACKEND: Verify Payment Signature
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              setStep(3);
              clearCart();
              window.scrollTo(0, 0);
            } else {
              alert(verifyResult.error || 'Payment signature verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Verification Request Error:', verifyError);
            alert('An error occurred while verifying your payment. Please do not re-pay.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: addressData.name,
          email: addressData.email,
          contact: addressData.phone
        },
        theme: {
          color: '#C59B7E' // Skin accent color matching design system
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log('Payment modal was closed by the user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (paymentFailedResponse) {
        setIsProcessing(false);
        console.error('Razorpay Payment Failed:', paymentFailedResponse.error);
        alert(`Payment failed: ${paymentFailedResponse.error.description || 'Transaction error.'}`);
      });

      rzp.open();
    } catch (paymentInitError) {
      setIsProcessing(false);
      console.error('Payment Initialization Error:', paymentInitError);
      alert(paymentInitError.message || 'Unable to start checkout. Please try again.');
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="pt-32 pb-20 text-center container mx-auto px-6 bg-obsidian">
        <h2 className="text-2xl font-heading mb-4 text-offwhite">Your Cart is Empty</h2>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 container mx-auto bg-obsidian min-h-screen">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 text-sm uppercase tracking-widest text-gray-500">
        <span className={step >= 1 ? 'text-champagne font-bold' : ''}>Address</span>
        <ChevronRight size={16} />
        <span className={step >= 2 ? 'text-champagne font-bold' : ''}>Payment</span>
        <ChevronRight size={16} />
        <span className={step >= 3 ? 'text-champagne font-bold' : ''}>Confirm</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Form Area */}
        <div className="flex-1 bg-cream text-[#1A1A1A] p-6 md:p-10 rounded-2xl shadow-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ADDRESS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-heading mb-6 tracking-wide uppercase text-[#1A1A1A]">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Full Name *</label>
                      <input 
                        required 
                        type="text" 
                        value={addressData.name}
                        onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Phone Number *</label>
                      <input 
                        required 
                        type="tel" 
                        pattern="[0-9]{10}"
                        value={addressData.phone}
                        onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Email Address *</label>
                    <input 
                      required 
                      type="email" 
                      value={addressData.email}
                      onChange={(e) => setAddressData({...addressData, email: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Pincode *</label>
                    <input 
                      required 
                      type="text" 
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Address Line 1 *</label>
                    <input 
                      required 
                      type="text" 
                      value={addressData.address1}
                      onChange={(e) => setAddressData({...addressData, address1: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Address Line 2 (Optional)</label>
                      <input 
                        type="text" 
                        value={addressData.address2}
                        onChange={(e) => setAddressData({...addressData, address2: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Landmark (Optional)</label>
                      <input 
                        type="text" 
                        value={addressData.landmark}
                        onChange={(e) => setAddressData({...addressData, landmark: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#1A1A1A] text-champagne py-4 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-black active:scale-95 transition-all shadow-lg mt-8">PROCEED TO PAYMENT</button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading tracking-wide uppercase text-[#1A1A1A]">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-coral underline font-medium">Edit Address</button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  
                  {/* UPI */}
                  <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${paymentMethod === 'UPI' ? 'border-[#1A1A1A] bg-white shadow-md' : 'border-gray-300 bg-white/50 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#1A1A1A]" />
                      <Smartphone size={20} className={paymentMethod === 'UPI' ? 'text-[#1A1A1A]' : 'text-gray-400'} />
                      <span className="font-bold tracking-wide">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div className="mt-4 pl-8">
                        <svg width="150" height="150" viewBox="0 0 29 29" fill="none" className="mb-4 bg-white p-2 border border-trim">
                          {/* Finder Patterns */}
                          {/* Top Left */}
                          <path d="M1 1h7v7H1V1zm1 1v5h5V2H2z" fill="#1A1A1A"/>
                          <rect x="3" y="3" width="3" height="3" fill="#1A1A1A"/>
                          
                          {/* Top Right */}
                          <path d="M21 1h7v7h-7V1zm1 1v5h5V2h-5z" fill="#1A1A1A"/>
                          <rect x="23" y="3" width="3" height="3" fill="#1A1A1A"/>
                          
                          {/* Bottom Left */}
                          <path d="M1 21h7v7H1v-7zm1 1v5h5v-5H2z" fill="#1A1A1A"/>
                          <rect x="3" y="23" width="3" height="3" fill="#1A1A1A"/>
                          
                          {/* Alignment Pattern */}
                          <path d="M19 19h5v5h-5v-5zm1 1v3h3v-3h-3z" fill="#1A1A1A"/>
                          <rect x="21" y="21" width="1" height="1" fill="#1A1A1A"/>

                          {/* Timing Patterns */}
                          <path d="M8 3h13v1H8V3z" fill="#1C1917" fillOpacity="0.4"/>
                          <path d="M3 8v13h1V8H3z" fill="#1C1917" fillOpacity="0.4"/>

                          {/* Random Data Blocks (Payload Mockup) */}
                          <rect x="10" y="5" width="2" height="1" fill="#1A1A1A"/>
                          <rect x="13" y="5" width="1" height="3" fill="#1A1A1A"/>
                          <rect x="16" y="5" width="2" height="2" fill="#1A1A1A"/>
                          <rect x="10" y="7" width="1" height="2" fill="#1A1A1A"/>
                          <rect x="12" y="9" width="3" height="1" fill="#1A1A1A"/>
                          <rect x="10" y="11" width="2" height="2" fill="#1A1A1A"/>
                          
                          <rect x="5" y="10" width="1" height="2" fill="#1A1A1A"/>
                          <rect x="5" y="13" width="3" height="1" fill="#1A1A1A"/>
                          
                          <rect x="11" y="15" width="2" height="1" fill="#1A1A1A"/>
                          <rect x="10" y="17" width="3" height="2" fill="#1A1A1A"/>
                          <rect x="14" y="14" width="2" height="3" fill="#1A1A1A"/>
                          
                          <rect x="17" y="10" width="2" height="2" fill="#1A1A1A"/>
                          <rect x="20" y="10" width="1" height="3" fill="#1A1A1A"/>
                          <rect x="17" y="13" width="3" height="1" fill="#1A1A1A"/>
                          
                          <rect x="25" y="10" width="2" height="2" fill="#1A1A1A"/>
                          <rect x="24" y="13" width="3" height="1" fill="#1A1A1A"/>
                          <rect x="26" y="15" width="1" height="3" fill="#1A1A1A"/>
                          
                          <rect x="15" y="19" width="3" height="1" fill="#1A1A1A"/>
                          <rect x="15" y="21" width="1" height="3" fill="#1A1A1A"/>
                          <rect x="17" y="23" width="2" height="2" fill="#1A1A1A"/>
                          
                          <rect x="20" y="26" width="3" height="1" fill="#1A1A1A"/>
                          <rect x="25" y="25" width="2" height="2" fill="#1A1A1A"/>
                          
                          <rect x="10" y="21" width="2" height="2" fill="#1A1A1A"/>
                          <rect x="11" y="24" width="3" height="1" fill="#1A1A1A"/>
                          <rect x="13" y="26" width="1" height="2" fill="#1A1A1A"/>
                        </svg>
                        <input type="text" placeholder="Enter UPI ID (e.g., 9876543210@ybl)" className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]" />
                      </div>
                    )}
                  </label>

                  {/* Card */}
                  <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${paymentMethod === 'Card' ? 'border-[#1A1A1A] bg-white shadow-md' : 'border-gray-300 bg-white/50 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#1A1A1A]" />
                      <CreditCard size={20} className={paymentMethod === 'Card' ? 'text-[#1A1A1A]' : 'text-gray-400'} />
                      <span className="font-bold tracking-wide">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'Card' && (
                      <div className="mt-4 pl-8 space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]" />
                        <div className="flex gap-4">
                          <input type="text" placeholder="MM/YY" className="w-1/2 bg-white border border-gray-300 rounded p-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]" />
                          <input type="text" placeholder="CVV" className="w-1/2 bg-white border border-gray-300 rounded p-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]" />
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Net Banking */}
                  <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${paymentMethod === 'NetBanking' ? 'border-[#1A1A1A] bg-white shadow-md' : 'border-gray-300 bg-white/50 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="NetBanking" checked={paymentMethod === 'NetBanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#1A1A1A]" />
                      <Wallet size={20} className={paymentMethod === 'NetBanking' ? 'text-[#1A1A1A]' : 'text-gray-400'} />
                      <span className="font-bold tracking-wide">Net Banking</span>
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${paymentMethod === 'COD' ? 'border-[#1A1A1A] bg-white shadow-md' : 'border-gray-300 bg-white/50 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#1A1A1A]" />
                      <Banknote size={20} className={paymentMethod === 'COD' ? 'text-[#1A1A1A]' : 'text-gray-400'} />
                      <span className="font-bold tracking-wide">Cash on Delivery</span>
                    </div>
                    {paymentMethod === 'COD' && (
                      <p className="pl-8 mt-2 text-xs text-coral font-bold">Note: ₹40 COD charge applicable.</p>
                    )}
                  </label>

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-[#1A1A1A] text-champagne py-4 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-black active:scale-95 transition-all shadow-lg mt-8 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing Payment...' : `PAY ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex justify-center mb-6">
                  <CheckCircle2 size={80} className="text-[#25D366]" />
                </div>
                <h2 className="text-3xl font-heading mb-4 tracking-wide uppercase text-[#1A1A1A]">Order Confirmed!</h2>
                <p className="text-gray-600 mb-2">Thank you for shopping with HRDYA.</p>
                <p className="text-sm font-bold mb-8">Order ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
                <div className="max-w-md mx-auto bg-cream p-6 rounded-lg border border-gray-200 text-left mb-8 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">We've received your order and are getting it ready. Your gorgeous new pieces will arrive in <span className="text-[#1A1A1A] font-bold">5–7 business days</span>.</p>
                </div>
                <Link to="/shop" className="bg-[#1A1A1A] text-champagne py-3 px-8 rounded-lg font-medium inline-block hover:bg-black transition-colors">CONTINUE SHOPPING</Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== 3 && (
          <div className="w-full lg:w-[400px]">
            <div className="bg-cream text-[#1A1A1A] rounded-2xl shadow-xl sticky top-24 border border-gray-200">
              <h3 className="p-6 border-b border-gray-200 font-heading text-lg tracking-widest uppercase text-center font-bold">Order Summary</h3>
              <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-20 object-cover bg-[#e8e4db] rounded-md shadow-sm" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-2 leading-tight">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                    </div>
                    <span className="text-sm font-bold">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200 bg-[#e8e4db] rounded-b-2xl space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-[#1A1A1A]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  {shipping === 0 ? <span className="text-coral font-bold">FREE</span> : <span className="font-bold text-[#1A1A1A]">₹{shipping}</span>}
                </div>
                {paymentMethod === 'COD' && (
                  <div className="flex justify-between text-coral">
                    <span className="font-medium">COD Fee</span>
                    <span className="font-bold">₹{codFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xl pt-4 border-t border-gray-300 text-[#1A1A1A]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
