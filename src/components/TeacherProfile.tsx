import React from 'react';
import { Star, Award, BookOpen } from 'lucide-react';

export const TeacherProfile: React.FC = () => {
  return (
    <div className="text-center py-20 relative">
      <div className="relative inline-block mb-8">
        <div className="relative">
          <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-blue-500/60 shadow-2xl relative teacher-image-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-sky-500/40 to-indigo-600/40"></div>
            <img
              src="/images/200751736_4075686949145707_5525433579295463923_n.jpg"
              alt="المدرس سامح عبد الخالق الفايدي"
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-7xl font-bold bg-gradient-to-br from-blue-600 to-indigo-700">س</div>';
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent fade-in-up">
          الأستاذ سامح عبد الخالق الفايدي
        </h1>
        
        <div className="flex items-center justify-center mb-8 fade-in-up">
          <Award className="w-8 h-8 text-blue-400 mr-3" />
          <h2 className="text-3xl font-bold text-blue-300">صانع الأوائل</h2>
          <Award className="w-8 h-8 text-blue-400 ml-3" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="premium-card p-8 transition-all duration-500 fade-in-up">
            <div className="relative">
              <BookOpen className="w-14 h-14 text-blue-400 mx-auto mb-6" />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">خبرة 20 عام</h3>
            <p className="text-gray-300 leading-relaxed">في تدريس اللغة العربية لجميع المراحل التعليمية</p>
          </div>

          <div className="premium-card p-8 transition-all duration-500 fade-in-up">
            <div className="relative">
              <Star className="w-14 h-14 text-sky-300 mx-auto mb-6" />
              <div className="absolute inset-0 bg-sky-300 rounded-full opacity-10 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">نتائج متميزة</h3>
            <p className="text-gray-300 leading-relaxed">مئات الطلاب حققوا أعلى الدرجات والمراكز الأولى</p>
          </div>

          <div className="premium-card p-8 transition-all duration-500 fade-in-up">
            <div className="relative">
              <Award className="w-14 h-14 text-indigo-300 mx-auto mb-6" />
              <div className="absolute inset-0 bg-indigo-300 rounded-full opacity-10 blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">منهج شامل</h3>
            <p className="text-gray-300 leading-relaxed">من الابتدائية حتى الثانوية العامة بأحدث الطرق</p>
          </div>
        </div>
      </div>
    </div>
  );
};