import React from 'react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Introduction',
      content: 'Welcome to HRDYA Studio ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy describes how we collect, use, store, and share your personal information when you visit or make a purchase from our e-commerce store.'
    },
    {
      title: '2. Information We Collect',
      content: 'When you interact with our studio, we collect personal details necessary to fulfill your request. This includes: order details (name, billing/shipping address, email, phone number), payment information (processed securely through encrypted payment gateways), and device information (IP address, web browser, cookies) to improve your shopping experience.'
    },
    {
      title: '3. How We Use Your Information',
      content: 'We use the collected information to process and ship your orders, confirm checkout details, coordinate courier deliveries, provide invoice receipts, communicate with you directly via email or WhatsApp regarding Friday Drops, and prevent potential security risks or fraudulent activities.'
    },
    {
      title: '4. Data Sharing & Third Parties',
      content: 'We only share your information with trusted third-party service providers essential for store operations. For example, we share delivery addresses with logistics companies (e.g., Delhivery, Blue Dart) to dispatch your packages and use secure payment processors to complete financial transactions.'
    },
    {
      title: '5. Cookies & Tracking',
      content: 'We use cookies to analyze web traffic, remember items in your shopping cart, and personalize content. You can choose to disable cookies through your browser settings, though doing so might affect certain features of the e-commerce store.'
    },
    {
      title: '6. Your Rights & Contact Information',
      content: 'If you reside in India, you have the right to access, update, or request the deletion of the personal information we hold about you. For any privacy queries or data removal requests, please email our support desk at support@hrdyastudio.com.'
    }
  ];

  return (
    <div className="min-h-screen bg-void text-offwhite overflow-hidden pb-16">
      {/* Page Header */}
      <div className="pt-40 pb-14 px-6 text-center border-b border-trim/40 bg-gradient-to-b from-surface to-void">
        <span className="section-label">Legal</span>
        <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight">Privacy Policy</h1>
        <p className="text-muted font-body text-xs mt-3">Last Updated: June 08, 2026</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <div className="space-y-10">
          {sections.map((s, idx) => (
            <div key={idx} className="border-b border-trim/30 pb-8 last:border-b-0 last:pb-0">
              <h2 className="font-heading text-lg text-offwhite mb-4 tracking-wide">{s.title}</h2>
              <p className="text-xs text-muted leading-relaxed font-body whitespace-pre-wrap">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
