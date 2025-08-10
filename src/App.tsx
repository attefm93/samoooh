import React from 'react';
import { Navbar } from './components/Navbar';
import { TeacherProfile } from './components/TeacherProfile';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-app-light dark:bg-app-dark">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-20">
          <TeacherProfile />
        </main>

        <a
          href="https://wa.me/201069616550"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500/90 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="WhatsApp"
          title="تواصل عبر واتساب"
        >
          <img src="/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
}

export default App;