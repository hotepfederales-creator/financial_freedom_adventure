import React from 'react';

interface FinMonProps {
  stage: 1 | 2 | 3 | 4;
  mood?: 'happy' | 'neutral' | 'sad';
  className?: string;
}

export const FinMon: React.FC<FinMonProps> = ({ stage, mood = 'happy', className = '' }) => {
  // Colors based on stage
  const baseColors = {
    1: '#fcd34d', // Egg (Yellow)
    2: '#34d399', // Baby (Green)
    3: '#60a5fa', // Teen (Blue)
    4: '#818cf8', // Master (Indigo)
  };

  const color = baseColors[stage];
  
  // Dynamic eyes based on mood
  const Eye = ({ x, y }: { x: number; y: number }) => (
    <g>
      <circle cx={x} cy={y} r="6" fill="white" />
      {mood === 'happy' && <circle cx={x} cy={y} r="3" fill="black" />}
      {mood === 'neutral' && <rect x={x - 3} y={y - 1} width="6" height="2" fill="black" />}
      {mood === 'sad' && (
        <path d={`M ${x-3} ${y+2} Q ${x} ${y-2} ${x+3} ${y+2}`} stroke="black" fill="transparent" strokeWidth="2" />
      )}
    </g>
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Stage 1: The Egg */}
        {stage === 1 && (
          <g transform="translate(100, 100)">
            <ellipse cx="0" cy="10" rx="40" ry="50" fill={color} stroke="black" strokeWidth="3" />
            <path d="M -30 -10 L -10 0 L 10 -15 L 30 -5" stroke="black" fill="none" strokeWidth="2" opacity="0.5" />
            <circle cx="-15" cy="-20" r="5" fill="white" opacity="0.4" />
          </g>
        )}

        {/* Stage 2: The Baby Blob */}
        {stage === 2 && (
          <g transform="translate(100, 110)">
            <path d="M -40 0 Q -40 -50 0 -50 Q 40 -50 40 0 Q 40 40 0 40 Q -40 40 -40 0" fill={color} stroke="black" strokeWidth="3" />
            <Eye x={-15} y={-10} />
            <Eye x={15} y={-10} />
            <path d="M -5 10 Q 0 15 5 10" stroke="black" fill="none" strokeWidth="2" />
            {/* Little feet */}
            <ellipse cx="-20" cy="35" rx="10" ry="8" fill={color} stroke="black" strokeWidth="3" />
            <ellipse cx="20" cy="35" rx="10" ry="8" fill={color} stroke="black" strokeWidth="3" />
          </g>
        )}

        {/* Stage 3: The Teen (Ears + Arms) */}
        {stage === 3 && (
          <g transform="translate(100, 110)">
            {/* Ears */}
            <path d="M -30 -40 L -50 -80 L -10 -50 Z" fill={color} stroke="black" strokeWidth="3" />
            <path d="M 30 -40 L 50 -80 L 10 -50 Z" fill={color} stroke="black" strokeWidth="3" />
            
            {/* Body */}
            <circle cx="0" cy="0" r="50" fill={color} stroke="black" strokeWidth="3" />
            
            <Eye x={-20} y={-10} />
            <Eye x={20} y={-10} />
            <path d="M -10 20 Q 0 30 10 20" stroke="black" fill="none" strokeWidth="3" />

            {/* Arms holding a coin */}
            <ellipse cx="-45" cy="10" rx="15" ry="10" fill={color} stroke="black" strokeWidth="3" />
            <ellipse cx="45" cy="10" rx="15" ry="10" fill={color} stroke="black" strokeWidth="3" />
            <circle cx="0" cy="50" r="15" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <text x="0" y="54" fontSize="16" textAnchor="middle" fill="#b45309" fontWeight="bold">$</text>
          </g>
        )}

        {/* Stage 4: The Master (Crown + Aura) */}
        {stage === 4 && (
          <g transform="translate(100, 110)">
            {/* Aura */}
            <circle cx="0" cy="0" r="70" fill={color} opacity="0.3" filter="url(#glow)" />
            
            {/* Crown */}
            <path d="M -25 -55 L -15 -85 L 0 -65 L 15 -85 L 25 -55 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />

            {/* Body */}
            <path d="M -50 20 Q -60 -60 0 -60 Q 60 -60 50 20 Q 40 60 0 60 Q -40 60 -50 20" fill={color} stroke="black" strokeWidth="3" />
            
            {/* Face */}
            <Eye x={-20} y={-20} />
            <Eye x={20} y={-20} />
            <path d="M -20 20 Q 0 35 20 20" stroke="black" fill="white" strokeWidth="2" />

            {/* Cape/Wings */}
            <path d="M -50 0 L -80 20 L -50 40" fill="#ef4444" stroke="black" strokeWidth="3" opacity="0.8" />
            <path d="M 50 0 L 80 20 L 50 40" fill="#ef4444" stroke="black" strokeWidth="3" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
};
