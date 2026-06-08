import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const message = encodeURIComponent("Hi! I'd love to know more about HRDYA jewellery 💛");
  const waUrl = `https://wa.me/917852897575?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-110 transition-transform duration-300 animate-pulse-soft"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite;
        }
      `}} />
    </a>
  );
}
