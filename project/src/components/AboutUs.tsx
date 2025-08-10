import React from 'react';
import { X, Facebook, Instagram, Phone, MessageCircle } from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socials = [
    { icon: Facebook, url: 'https://www.facebook.com/share/1AyHkwjhzx/', color: 'text-blue-400' },
    { icon: Facebook, url: 'https://www.facebook.com/share/16kTx6EXUa/', color: 'text-blue-500' },
    { icon: Instagram, url: 'https://www.instagram.com/sameh.mohamed.39982/', color: 'text-pink-400' },
    { icon: MessageCircle, url: 'https://wa.me/201069616550', color: 'text-green-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
      <div className="premium-card p-10 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto enhanced-glow">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 z-10">
          <X className="w-7 h-7" />
        </button>

        <div className="text-center fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-6">للتواصل</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="/images/200751736_4075686949145707_5525433579295463923_n.jpg" alt="الأستاذ سامح" className="w-56 h-56 object-cover rounded-xl mx-auto" />
            </div>
            <div className="space-y-6 text-right">
              <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                <span className="text-gray-300 text-lg">01069616550</span>
                <Phone className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                <a href="https://wa.me/201069616550" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors text-lg">واتساب مباشر</a>
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-6 rtl:space-x-reverse">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={`${s.color} hover:opacity-80`}>
                <s.icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};