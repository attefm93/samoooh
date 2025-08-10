import React, { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { addStudentToFirebase } from '../utils/firebaseUtils';
import { Grade } from '../types';
import { savePendingStudent } from '../utils/localCache';

interface StudentRegistrationProps {
  onBack: () => void;
  onClose: () => void;
}

const grades: Grade[] = [
  'اولى ابتدائي',
  'تانية ابتدائي', 
  'تالتة ابتدائي',
  'رابعة ابتدائي',
  'خامسة ابتدائي',
  'سادسة ابتدائي',
  'اولى اعدادي',
  'تانية اعدادي',
  'تالتة اعدادي',
  'اولى ثانوي',
  'تانية ثانوي',
  'تالتة ثانوي'
];

const generateStudentCode = (): string => Math.random().toString(36).substr(2, 8).toUpperCase();

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onBack, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '' as Grade
  });
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.grade) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    try {
      setErrorMsg('');
      setLoading(true);
      const code = generateStudentCode();
      const student = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        code,
        scores: [],
        attendance: 0,
        isBanned: false,
        canComment: false,
        createdAt: new Date()
      } as any;
      try {
        await addStudentToFirebase(student);
      } catch (fbErr) {
        console.error('Firestore error, saving locally:', fbErr);
        savePendingStudent(student);
      }
      setStudentCode(code);
    } catch (e: any) {
      setErrorMsg(e?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (studentCode) {
      navigator.clipboard.writeText(studentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (studentCode) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-6">تم إنشاء الحساب بنجاح!</h2>
        
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-6">
          <p className="text-white mb-4">كود الطالب الخاص بك:</p>
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <code className="text-2xl font-bold text-green-400 bg-black/30 px-4 py-2 rounded">
              {studentCode}
            </code>
            <button
              onClick={copyCode}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            احتفظ بهذا الكود لأنه مطلوب لولي الأمر للدخول على حسابك
          </p>
        </div>

        <GlowingButton onClick={onClose} variant="primary">
          إغلاق
        </GlowingButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors ml-4"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">إنشاء حساب طالب</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
        )}
        <div>
          <label className="block text-white mb-2">الاسم</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors focus:shadow-lg"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <label className="block text-white mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors focus:shadow-lg"
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>

        <div>
          <label className="block text-white mb-2">كلمة المرور</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors focus:shadow-lg"
            placeholder="أدخل كلمة المرور"
          />
        </div>

        <div>
          <label className="block text-white mb-2">المرحلة الدراسية</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value as Grade })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors focus:shadow-lg"
          >
            <option value="">اختر المرحلة</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <GlowingButton type="submit" className="w-full" variant="primary">
          {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
        </GlowingButton>
      </form>
    </div>
  );
};