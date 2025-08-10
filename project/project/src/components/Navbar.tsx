import React, { useState } from 'react';
import { GlowingButton } from './GlowingButton';
import { LoginModal } from './LoginModal';
import { AdminModal } from './AdminModal';
import { HonorBoard } from './HonorBoard';
import { AboutUs } from './AboutUs';
import { QuestionsSection } from './QuestionsSection';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showHonorBoard, setShowHonorBoard] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">أكاديمية الأستاذ سامح</h1>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <GlowingButton
                onClick={() => setShowHonorBoard(true)}
                variant="primary"
              >
                لوحة الشرف
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setShowAboutUs(true)}
                variant="primary"
              >
                About Us
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setShowQuestions(true)}
                variant="primary"
              >
                أسأل ؟
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setShowLoginModal(true)}
                variant="primary"
              >
                تسجيل الدخول
              </GlowingButton>
              
              <GlowingButton
                onClick={() => setShowAdminModal(true)}
                variant="secondary"
              >
                Admin
              </GlowingButton>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <AdminModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
      
      <HonorBoard 
        isOpen={showHonorBoard} 
        onClose={() => setShowHonorBoard(false)} 
      />
      
      <AboutUs 
        isOpen={showAboutUs} 
        onClose={() => setShowAboutUs(false)} 
      />
      
      <QuestionsSection 
        isOpen={showQuestions} 
        onClose={() => setShowQuestions(false)} 
      />
    </>
  );
};