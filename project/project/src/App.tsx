import React from 'react';
import { Navbar } from './components/Navbar';
import { TeacherProfile } from './components/TeacherProfile';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-20">
          <TeacherProfile />
        </main>
      </div>
    </div>
  );
}

export default App;