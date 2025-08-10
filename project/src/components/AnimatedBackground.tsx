import React from 'react';

const ARABIC_LETTERS = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(60)].map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const size = 12 + Math.random() * 18;
        const letter = ARABIC_LETTERS[i % ARABIC_LETTERS.length];
        const driftX = (Math.random() * 8 - 4).toFixed(2);
        const driftY = (Math.random() * 8 - 4).toFixed(2);
        return (
          <span
            key={i}
            className="absolute text-sky-300/30 select-none"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${size}px`,
              textShadow: '0 0 12px rgba(56,189,248,0.35)',
              animation: `letterPulse 6s ease-in-out ${delay}s infinite, drift${i} 12s ease-in-out ${delay}s infinite alternate`
            }}
          >
            {letter}
            <style>{`@keyframes drift${i}{0%{transform: translate(0px,0px);}50%{transform: translate(${driftX}px, ${driftY}px);}100%{transform: translate(0px,0px);}}`}</style>
          </span>
        );
      })}

      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(2,132,199,0.08), transparent 45%)',
        animation: 'pulse 8s ease-in-out infinite'
      }} />
    </div>
  );
};