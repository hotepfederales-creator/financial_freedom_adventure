
import React from 'react';

interface Props {
  className?: string;
  emotion?: 'neutral' | 'shocked' | 'happy';
}

export const ProfLedgerAvatar: React.FC<Props> = ({ className = "w-10 h-10", emotion = 'neutral' }) => {
  return (
    <div className={`${className} relative drop-shadow-md transition-transform hover:scale-110 duration-200`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Legs */}
        <path d="M 35 85 L 35 100 L 25 100" stroke="#334155" strokeWidth="3" fill="none" />
        <path d="M 65 85 L 65 100 L 75 100" stroke="#334155" strokeWidth="3" fill="none" />

        {/* The Book Body */}
        <rect x="20" y="15" width="60" height="70" rx="4" fill="#4f46e5" stroke="#312e81" strokeWidth="3" />
        <rect x="25" y="15" width="5" height="70" fill="#3730a3" opacity="0.5" />
        
        {/* Pages (Top) */}
        <path d="M 20 15 Q 50 5 80 15" fill="#e0e7ff" stroke="#312e81" strokeWidth="2" />

        {/* Face */}
        {/* Glasses */}
        <circle cx="40" cy="45" r="10" fill="#ccfbf1" stroke="#334155" strokeWidth="2" />
        <circle cx="70" cy="45" r="10" fill="#ccfbf1" stroke="#334155" strokeWidth="2" />
        <line x1="50" y1="45" x2="60" y2="45" stroke="#334155" strokeWidth="2" />
        
        {/* Eyebrows (Expressive) */}
        {emotion === 'shocked' ? (
           <>
             <path d="M 35 30 L 45 25" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
             <path d="M 65 25 L 75 30" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
           </>
        ) : (
           <>
             <path d="M 35 32 Q 40 30 45 32" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
             <path d="M 65 32 Q 70 30 75 32" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
           </>
        )}

        {/* Mustache */}
        <path d="M 40 65 Q 55 55 70 65 Q 75 68 80 62" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 40 65 Q 55 55 70 65" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" className="drop-shadow-sm" />
        
        {/* Mouth */}
        {emotion === 'shocked' ? (
           <circle cx="55" cy="75" r="5" fill="#334155" />
        ) : emotion === 'happy' ? (
           <path d="M 45 75 Q 55 85 65 75" stroke="#334155" strokeWidth="2" fill="none" />
        ) : (
           <line x1="50" y1="75" x2="60" y2="75" stroke="#334155" strokeWidth="2" />
        )}

        {/* Arms */}
        <path d="M 20 50 Q 10 60 15 70" stroke="#334155" strokeWidth="3" fill="none" />
        <path d="M 80 50 Q 90 40 95 30" stroke="#334155" strokeWidth="3" fill="none" />
        
        {/* Quill Pen behind ear/side */}
        <path d="M 85 20 L 95 5" stroke="#fcd34d" strokeWidth="2" />
        <path d="M 95 5 Q 100 0 90 0 Q 85 5 95 5" fill="white" stroke="#cbd5e1" strokeWidth="1" />

      </svg>
    </div>
  );
};
