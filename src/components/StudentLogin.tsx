import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { getStudentByEmailAndPasswordFromFirebase, getStudentByCodeAndPasswordFromFirebase } from '../utils/firebaseUtils';
import { StudentDashboard } from './StudentDashboard';

interface StudentLoginProps {
  onBack: () => void;
  onClose: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onBack, onClose }) => {
  const [loginData, setLoginData] = useState({
    emailOrCode: '',
    password: ''
  });
  const [student, setStudent] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrCode.trim() || !loginData.password.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);

    try {
      let foundStudent = await getStudentByEmailAndPasswordFromFirebase(loginData.emailOrCode.trim(), loginData.password.trim());
      if (!foundStudent) {
        foundStudent = await getStudentByCodeAndPasswordFromFirebase(loginData.emailOrCode.trim().toUpperCase(), loginData.password.trim());
      }

      if (foundStudent) {
        if (foundStudent.isBanned) {
          setError('تم منعك من الدخول للموقع');
        } else {
          setStudent(foundStudent);
          setError('');
        }
      } else {
        setError('البيانات غير صحيحة');
      }
    } finally {
      setLoading(false);
    }
  };

  if (student) {
    return (
      <StudentDashboard 
        student={student} 
        onBack={() => setStudent(null)}
        onClose={onClose}
      />
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
        <h2 className="text-2xl font-bold text-white">دخول الطالب</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">البريد الإلكتروني أو كود الطالب</label>
          <input
            type="text"
            value={loginData.emailOrCode}
            onChange={(e) => setLoginData({ ...loginData, emailOrCode: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors text-center"
            placeholder="أدخل البريد الإلكتروني أو كود الطالب"
          />
        </div>

        <div>
          <label className="block text-white mb-2">كلمة المرور</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
            placeholder="أدخل كلمة المرور"
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <GlowingButton type="submit" className="w-full" variant="primary">
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </GlowingButton>
      </form>
    </div>
  );
};