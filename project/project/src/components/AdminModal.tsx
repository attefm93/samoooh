import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { AdminDashboard } from './AdminDashboard';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '00025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleClose = () => {
    setPassword('');
    setIsAuthenticated(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mx-4 border border-white/20 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {!isAuthenticated ? (
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">دخول الإدارة</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors text-center font-mono"
                  placeholder="أدخل كلمة المرور"
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              <GlowingButton type="submit" className="w-full" variant="secondary">
                دخول
              </GlowingButton>
            </form>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
};