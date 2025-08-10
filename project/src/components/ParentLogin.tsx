import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { getStudentByCodeFromFirebase } from '../utils/firebaseUtils';
import { StudentDashboard } from './StudentDashboard';
import { findPendingByCode } from '../utils/localCache';

interface ParentLoginProps {
  onBack: () => void;
  onClose: () => void;
}

export const ParentLogin: React.FC<ParentLoginProps> = ({ onBack, onClose }) => {
  const [code, setCode] = useState('');
  const [student, setStudent] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('يرجى إدخال كود الطالب');
      return;
    }

    setLoading(true);
    try {
      let foundStudent = await getStudentByCodeFromFirebase(code.trim().toUpperCase());
      if (!foundStudent) {
        const pending = findPendingByCode(code.trim().toUpperCase());
        if (pending) foundStudent = pending as any;
      }
      if (foundStudent) {
        setStudent(foundStudent);
        setError('');
      } else {
        setError('كود الطالب غير صحيح');
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
        <h2 className="text-2xl font-bold text-white">دخول ولي الأمر</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">كود الطالب</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors focus:shadow-lg text-center font-mono text-lg"
            placeholder="أدخل كود الطالب"
            style={{ textTransform: 'uppercase' }}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <GlowingButton type="submit" className="w-full" variant="secondary">
          {loading ? '... جارٍ التحقق' : 'دخول'}
        </GlowingButton>
      </form>
    </div>
  );
};