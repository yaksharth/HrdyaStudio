import React from 'react';

export default function TermsOfService() {
  const sections = [
    {
      title: '1. Store Terms & Elegibility',
      content: 'By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our jewellery products for any illegal or unauthorized purpose, nor violate any laws in your jurisdiction (including copyright laws).'
    },
    {
      title: '2. Curated Products & Pricing',
      content: 'Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any product (including our weekly Friday Drops) without prior warning. Since our designs are curated in limited-edition batches, stock availability is not guaranteed.'
    },
    {
      title: '3. Orders & Billing accuracy',
      content: 'We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person or per order. In the event that we make a change to or cancel an order, we will notify you by contacting the email, billing address, or phone number provided at the time the order was made.'
    },
    {
      title: '4. Shipping & Delivery',
      content: 'Shipping, cash on delivery (COD) details, and delivery estimations are provided as guidelines. We are not liable for transit delays caused by extreme weather conditions, carrier sorting backlogs, or incorrect delivery addresses provided by the buyer.'
    },
    {
      title: '5. Return & Exchange Policy',
      content: 'Our return policy is valid for 7 days from product delivery. Jewellery must be returned unworn and undamaged in its original velvet pouch and cardboard boxing. Return requests can be raised via our Support Center on the website or via WhatsApp direct contact.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'In no case shall HRDYA Studio, our directors, employees, or suppliers be liable for any injury, loss, claim, or any direct, indirect, incidental, or consequential damages of any kind, arising from your use of any of our products or services.'
    }
  ];

  return (
    <div className="min-h-screen bg-void text-offwhite overflow-hidden pb-16">
      {/* Page Header */}
      <div className="pt-40 pb-14 px-6 text-center border-b border-trim/40 bg-gradient-to-b from-surface to-void">
        <span className="section-label">Legal</span>
        <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight">Terms of Service</h1>
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
