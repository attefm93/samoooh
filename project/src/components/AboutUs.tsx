import React from 'react';
import { X, Facebook, Instagram, Phone, MessageCircle } from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socialLinks = [
    {
      icon: Facebook,
      url: 'https://www.facebook.com/share/1AyHkwjhzx/',
      color: 'text-blue-500',
      hoverColor: 'hover:text-blue-400'
    },
    {
      icon: Facebook,
      url: 'https://www.facebook.com/share/16kTx6EXUa/',
      color: 'text-blue-600',
      hoverColor: 'hover:text-blue-500'
    },
    {
      icon: Instagram,
      url: 'https://www.instagram.com/sameh.mohamed.39982/',
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-400'
    },
    {
      icon: MessageCircle,
      url: 'https://wa.me/201069616550',
      color: 'text-green-500',
      hoverColor: 'hover:text-green-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
      <div className="premium-card p-10 max-w-5xl w-full mx-4 relative max-h-[90vh] overflow-y-auto enhanced-glow">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 z-10"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="text-center fade-in-up">
          <div className="relative inline-block mb-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-pulse opacity-50"></div>
              <div className="absolute -inset-4 rounded-full border border-purple-200 animate-spin opacity-20" style={{ animationDuration: '8s' }}></div>
              
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-400 shadow-2xl relative teacher-image-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-600 animate-pulse"></div>
                <img
                  src="/images/200751736_4075686949145707_5525433579295463923_n.jpg"
                  alt="المدرس سامح عبد الخالق الفايدي"
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-5xl font-bold bg-gradient-to-br from-purple-500 to-indigo-600 floating-text">س</div>';
                    }
                  }}
                />
              </div>
              
              <div className="absolute inset-0">
                {socialLinks.map((social, index) => {
                  const angle = (index * (360 / socialLinks.length)) - 90;
                  const radius = 90;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute w-12 h-12 ${social.color} ${social.hoverColor} transition-all duration-300 hover:scale-125 social-icon`}
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                        animationDelay: `${index * 0.5}s`
                      }}
                    >
                      <social.icon className="w-full h-full" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent slide-in-right">
            الأستاذ سامح عبد الخالق الفايدي
          </h2>
          
          <h3 className="text-3xl font-bold text-yellow-400 mb-12 font-['Amiri'] shimmer-effect">صانع الأوائل</h3>

          <div className="grid md:grid-cols-2 gap-10 text-right">
            <div className="premium-card p-8 hover:scale-105 transition-all duration-500 slide-in-right">
              <h4 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">للتواصل</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                  <span className="text-gray-300 text-lg">01069616550</span>
                  <Phone className="w-6 h-6 text-green-400 animate-bounce" />
                </div>
                
                <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                  <a 
                    href="https://wa.me/201069616550" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors text-lg"
                  >
                    واتساب مباشر
                  </a>
                  <MessageCircle className="w-6 h-6 text-green-500 animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
                    <span className="text-gray-300 text-lg">صفحات الفيسبوك</span>
                    <Facebook className="w-6 h-6 text-blue-500 animate-bounce" />
                  </div>
                  <div className="space-y-2 text-base">
                    <a 
                      href="https://www.facebook.com/share/1AyHkwjhzx/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105"
                    >
                      الصفحة الأولى
                    </a>
                    <a 
                      href="https://www.facebook.com/share/16kTx6EXUa/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105"
                    >
                      الصفحة الثانية
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
                  <a 
                    href="https://www.instagram.com/sameh.mohamed.39982/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 transition-all duration-300 hover:scale-105 text-lg"
                  >
                    Instagram
                  </a>
                  <Instagram className="w-6 h-6 text-pink-500 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="premium-card p-8 hover:scale-105 transition-all duration-500 slide-in-left">
              <h4 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">نبذة قصيرة</h4>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>• خبرة 20 عاماً في تدريس اللغة العربية</p>
                <p>• متخصص في جميع المراحل التعليمية من الابتدائية حتى الثانوية</p>
                <p>• مئات الطلاب حققوا أعلى الدرجات والمراكز الأولى</p>
                <p>• استخدام أحدث الوسائل التعليمية والتكنولوجيا</p>
                <p>• مدرس معتمد ومؤهل تربوياً</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};