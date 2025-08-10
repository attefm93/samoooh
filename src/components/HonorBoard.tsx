import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { getStudentsFromFirebase } from '../utils/firebaseUtils';
import { Student, Grade } from '../types';

interface HonorBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const grades: Grade[] = [
  'اولى ابتدائي', 'تانية ابتدائي', 'تالتة ابتدائي', 'رابعة ابتدائي', 'خامسة ابتدائي', 'سادسة ابتدائي',
  'اولى اعدادي', 'تانية اعدادي', 'تالتة اعدادي',
  'اولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'
];

export const HonorBoard: React.FC<HonorBoardProps> = ({ isOpen, onClose }) => {
  const [topStudents, setTopStudents] = useState<{ [key: string]: Student[] }>({});

  useEffect(() => {
    if (isOpen) {
      loadHonorBoard();
    }
  }, [isOpen]);

  const calcAveragePercent = (student: Student): number => {
    if (!student.scores || student.scores.length === 0) return 0;
    const total = student.scores.reduce((acc, s) => acc + (s.score / (s.maxScore || 100)) * 100, 0);
    return total / student.scores.length;
  };

  const loadHonorBoard = async () => {
    try {
      const students = await getStudentsFromFirebase();
      const gradeGroups: { [key: string]: Student[] } = {};

      grades.forEach(grade => {
        const gradeStudents = students
          .filter(student => student.grade === grade && (student.scores?.length || 0) > 0)
          .map(student => ({
            ...student,
            average: calcAveragePercent(student) as any
          }) as any)
          .sort((a: any, b: any) => b.average - a.average)
          .slice(0, 3);
        
        if (gradeStudents.length > 0) {
          gradeGroups[grade] = gradeStudents as any;
        }
      });

      setTopStudents(gradeGroups);
    } catch (error) {
      console.error('Error loading honor board:', error);
    }
  };

  if (!isOpen) return null;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="trophy-container">
            <div className="trophy-glow gold-glow"></div>
            <Trophy className="w-12 h-12 text-yellow-400 relative z-10" />
            <Crown className="w-6 h-6 text-yellow-300 absolute -top-2 left-1/2 transform -translate-x-1/2" />
          </div>
        );
      case 1:
        return (
          <div className="trophy-container">
            <div className="trophy-glow silver-glow"></div>
            <Medal className="w-10 h-10 text-gray-300 relative z-10" />
          </div>
        );
      case 2:
        return (
          <div className="trophy-container">
            <div className="trophy-glow bronze-glow"></div>
            <Award className="w-10 h-10 text-amber-600 relative z-10" />
          </div>
        );
      default:
        return null;
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-400/30 via-yellow-500/20 to-yellow-600/30 border-2 border-yellow-400/60 gold-trophy";
      case 1:
        return "bg-gradient-to-br from-gray-300/30 via-gray-400/20 to-gray-500/30 border-2 border-gray-300/60 silver-trophy";
      case 2:
        return "bg-gradient-to-br from-amber-600/30 via-amber-700/20 to-amber-800/30 border-2 border-amber-600/60 bronze-trophy";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
      <div className="premium-card p-10 max-w-7xl w-full mx-4 relative max-h-[90vh] overflow-y-auto enhanced-glow">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 z-10"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="text-center mb-12 fade-in-up">
          <div className="relative inline-block mb-6">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-30 blur-xl animate-pulse"></div>
            {[...Array(6)].map((_, i) => (
              <Star
                key={i}
                className="absolute w-4 h-4 text-yellow-300 animate-ping"
                style={{
                  left: `${50 + 30 * Math.cos((i * Math.PI * 2) / 6)}%`,
                  top: `${50 + 30 * Math.sin((i * Math.PI * 2) / 6)}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">لوحة الشرف</h2>
          <p className="text-gray-300 text-xl">أفضل الطلاب في كل مرحلة</p>
        </div>

        {Object.keys(topStudents).length === 0 ? (
          <div className="text-center py-16 fade-in-up">
            <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6 opacity-50" />
            <p className="text-gray-400 text-xl">لا توجد درجات مسجلة بعد</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(topStudents).map(([grade, students]) => (
              <div key={grade} className="premium-card p-8 fade-in-up">
                <h3 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{grade}</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {students.map((student, index) => (
                    <div
                      key={student.id}
                      className={`p-8 rounded-2xl ${getRankStyle(index)} transition-all duration-500 hover:scale-110 relative overflow-hidden`}
                    >
                      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="text-center relative">
                        <div className="mb-6">
                          {getRankIcon(index)}
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                          <h4 className="text-xl font-bold text-white">{(student as any).name}</h4>
                        </div>
                        
                        <div className="text-3xl font-bold text-yellow-400 mb-2 animate-pulse">
                          {(calcAveragePercent(student)).toFixed(1)}%
                        </div>
                        <p className="text-gray-300 text-lg font-semibold">المتوسط العام</p>
                        <div className="mt-4 text-sm text-gray-400">
                          {student.scores.length} اختبارات
                        </div>
                      </div>
                      
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};