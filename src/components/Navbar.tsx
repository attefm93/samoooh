import React, { useState, useEffect } from 'react';
import { GlowingButton } from './GlowingButton';
import { LoginModal } from './LoginModal';
import { AdminModal } from './AdminModal';
import { HonorBoard } from './HonorBoard';
import { AboutUs } from './AboutUs';
import { QuestionsSection } from './QuestionsSection';
import { BookOpen, Moon, Sun, Menu, X as Close } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showHonorBoard, setShowHonorBoard] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  const closeAll = () => setMobileOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-blue-400" />
              <h1 className="text-xl md:text-2xl font-bold text-white">أكاديمية الأستاذ سامح</h1>
            </div>
            
            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={toggleTheme} className="mr-2 text-white/80 hover:text-white transition-colors">
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <GlowingButton onClick={() => setShowHonorBoard(true)} variant="primary">لوحة الشرف</GlowingButton>
              <GlowingButton onClick={() => setShowAboutUs(true)} variant="primary">للتواصل</GlowingButton>
              <GlowingButton onClick={() => setShowQuestions(true)} variant="primary">أسأل ؟</GlowingButton>
              <GlowingButton onClick={() => setShowLoginModal(true)} variant="primary">تسجيل الدخول</GlowingButton>
              <GlowingButton onClick={() => setShowAdminModal(true)} variant="secondary">Admin</GlowingButton>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(o => !o)} className="md:hidden text-white/90 focus:outline-none">
              {mobileOpen ? <Close className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/90">القائمة</span>
                <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors">
                  {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <GlowingButton onClick={() => { setShowHonorBoard(true); closeAll(); }} variant="primary" className="w-full">لوحة الشرف</GlowingButton>
              <GlowingButton onClick={() => { setShowAboutUs(true); closeAll(); }} variant="primary" className="w-full">للتواصل</GlowingButton>
              <GlowingButton onClick={() => { setShowQuestions(true); closeAll(); }} variant="primary" className="w-full">أسأل ؟</GlowingButton>
              <GlowingButton onClick={() => { setShowLoginModal(true); closeAll(); }} variant="primary" className="w-full">تسجيل الدخول</GlowingButton>
              <GlowingButton onClick={() => { setShowAdminModal(true); closeAll(); }} variant="secondary" className="w-full">Admin</GlowingButton>
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
      <HonorBoard isOpen={showHonorBoard} onClose={() => setShowHonorBoard(false)} />
      <AboutUs isOpen={showAboutUs} onClose={() => setShowAboutUs(false)} />
      <QuestionsSection isOpen={showQuestions} onClose={() => setShowQuestions(false)} />
    </>
  );
};