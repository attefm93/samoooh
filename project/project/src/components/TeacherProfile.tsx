import React from 'react';
import { Star, Award, BookOpen } from 'lucide-react';

export const TeacherProfile: React.FC = () => {
  return (
    <div className="text-center py-20 relative">
      <div className="relative inline-block mb-8">
        {/* Glowing circle for teacher image */}
        <div className="relative">
          {/* Multiple glowing rings */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-pulse opacity-50"></div>
          <div className="absolute -inset-4 rounded-full border border-purple-200 animate-spin opacity-20" style={{ animationDuration: '8s' }}></div>
          
          <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-purple-400 shadow-2xl relative teacher-image-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-600 animate-pulse"></div>
            <img
              src="/images/200751736_4075686949145707_5525433579295463923_n.jpg"
              alt="المدرس سامح عبد الخالق الفايدي"
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                // Fallback if image doesn't load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-7xl font-bold bg-gradient-to-br from-purple-500 to-indigo-600 floating-text">س</div>';
                }
              }}
            />
          </div>
          
          {/* Floating particles around image */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-60"
              style={{
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animation: `float ${2 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent slide-in-right">
          الأستاذ سامح عبد الخالق الفايدي
        </h1>
        
        <div className="flex items-center justify-center mb-8 slide-in-left">
          <Award className="w-10 h-10 text-yellow-400 mr-4 animate-bounce" />
          <h2 className="text-4xl font-bold text-yellow-400 font-['Amiri'] shimmer-effect">صانع الأوائل</h2>
          <Award className="w-10 h-10 text-yellow-400 ml-4 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="premium-card p-8 hover:scale-105 transition-all duration-500 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-pulse" />
              <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 floating-text">خبرة 20 عام</h3>
            <p className="text-gray-300 leading-relaxed">في تدريس اللغة العربية لجميع المراحل التعليمية</p>
          </div>

          <div className="premium-card p-8 hover:scale-105 transition-all duration-500 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 floating-text">نتائج متميزة</h3>
            <p className="text-gray-300 leading-relaxed">مئات الطلاب حققوا أعلى الدرجات والمراكز الأولى</p>
          </div>

          <div className="premium-card p-8 hover:scale-105 transition-all duration-500 fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative">
              <Award className="w-16 h-16 text-green-400 mx-auto mb-6 animate-bounce" />
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 floating-text">منهج شامل</h3>
            <p className="text-gray-300 leading-relaxed">من الابتدائية حتى الثانوية العامة بأحدث الطرق</p>
          </div>
        </div>
      </div>
    </div>
  );
};