import React from 'react';
import { ArrowRight, User, BookOpen, Calendar, Trophy } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { Student } from '../types';

interface StudentDashboardProps {
  student: Student;
  onBack: () => void;
  onClose: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onBack, onClose }) => {
  const averagePercent = student.scores.length > 0 
    ? (student.scores.reduce((acc, s) => acc + (s.score / (s.maxScore || 100)) * 100, 0) / student.scores.length)
    : 0;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors ml-4"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">لوحة الطالب</h2>
      </div>

      <div className="space-y-6">
        {/* Student Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-blue-400 ml-3" />
            <h3 className="text-xl font-bold text-white">معلومات الطالب</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">الاسم:</span>
              <p className="text-white font-semibold">{student.name}</p>
            </div>
            <div>
              <span className="text-gray-400">المرحلة:</span>
              <p className="text-white font-semibold">{student.grade}</p>
            </div>
            <div>
              <span className="text-gray-400">كود الطالب:</span>
              <p className="text-white font-semibold font-mono">{student.code}</p>
            </div>
            <div>
              <span className="text-gray-400">تاريخ التسجيل:</span>
              <p className="text-white font-semibold">
                {new Date(student.createdAt).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-green-400 ml-3" />
            <h3 className="text-xl font-bold text-white">الحضور</h3>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{student.attendance}</div>
            <p className="text-gray-300">عدد مرات الحضور</p>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <Trophy className="w-6 h-6 text-yellow-400 ml-3" />
            <h3 className="text-xl font-bold text-white">الدرجات</h3>
          </div>
          
          {student.scores.length > 0 ? (
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {averagePercent.toFixed(1)}%
                </div>
                <p className="text-gray-300">المتوسط العام</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold mb-2">جميع الدرجات:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {student.scores.map((s, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-white">{s.score} / {s.maxScore}</div>
                        <div className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('ar-EG')}</div>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">{s.examName || `اختبار ${index + 1}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد درجات مسجلة بعد</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <GlowingButton onClick={onClose} variant="primary">
          إغلاق
        </GlowingButton>
      </div>
    </div>
  );
};