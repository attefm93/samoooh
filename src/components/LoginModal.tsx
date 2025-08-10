import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { StudentRegistration } from './StudentRegistration';
import { StudentLogin } from './StudentLogin';
import { ParentLogin } from './ParentLogin';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'select' | 'register' | 'login' | 'parent'>('select');

  if (!isOpen) return null;

  const handleClose = () => {
    setMode('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
      <div className="premium-card p-10 max-w-lg w-full mx-4 relative enhanced-glow">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <X className="w-7 h-7" />
        </button>

        {mode === 'select' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">اختر نوع الحساب</h2>
            
            <div className="space-y-6">
              <GlowingButton
                onClick={() => setMode('register')}
                className="w-full"
                variant="primary"
                size="lg"
              >
                إنشاء حساب طالب
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setMode('login')}
                className="w-full"
                variant="primary"
                size="lg"
              >
                دخول طالب
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setMode('parent')}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                دخول ولي الأمر
              </GlowingButton>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <StudentRegistration onBack={() => setMode('select')} onClose={handleClose} />
        )}

        {mode === 'login' && (
          <StudentLogin onBack={() => setMode('select')} onClose={handleClose} />
        )}

        {mode === 'parent' && (
          <ParentLogin onBack={() => setMode('select')} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};