
import React from 'react';

interface FinMonProps {
  stage: 1 | 2 | 3 | 4;
  species?: string; // 'Coinlet' | 'Cashmander' | 'Wealthasaur' | 'Ledgerazard' | 'SQUIRREL' | 'HAWK' | 'TORTOISE' | 'PHOENIX'
  mood?: 'happy' | 'neutral' | 'sad';
  className?: string;
}

export const FinMon: React.FC<FinMonProps> = ({ stage, species = 'Coinlet', mood = 'happy', className = '' }) => {
  // Colors based on stage/species
  const getBaseColor = () => {
    if (['SQUIRREL'].includes(species)) return '#d97706'; // Amber
    if (['HAWK'].includes(species)) return '#f59e0b'; // Gold
    if (['TORTOISE'].includes(species)) return '#10b981'; // Emerald
    if (['PHOENIX'].includes(species)) return '#f43f5e'; // Rose
    
    // Default Line
    const colors = {
      1: '#fcd34d', // Egg (Yellow)
      2: '#34d399', // Baby (Green)
      3: '#60a5fa', // Teen (Blue)
      4: '#818cf8', // Master (Indigo)
    };
    return colors[stage];
  };

  const color = getBaseColor();
  
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

        {/* Stage 1: The Egg (Universal) */}
        {stage === 1 && (
          <g transform="translate(100, 100)">
            <ellipse cx="0" cy="10" rx="40" ry="50" fill={color} stroke="black" strokeWidth="3" />
            <path d="M -30 -10 L -10 0 L 10 -15 L 30 -5" stroke="black" fill="none" strokeWidth="2" opacity="0.5" />
            <circle cx="-15" cy="-20" r="5" fill="white" opacity="0.4" />
          </g>
        )}

        {/* Stage 2: The Baby Blob (Universal) */}
        {stage === 2 && (
          <g transform="translate(100, 110)">
            <path d="M -40 0 Q -40 -50 0 -50 Q 40 -50 40 0 Q 40 40 0 40 Q -40 40 -40 0" fill={color} stroke="black" strokeWidth="3" />
            <Eye x={-15} y={-10} />
            <Eye x={15} y={-10} />
            <path d="M -5 10 Q 0 15 5 10" stroke="black" fill="none" strokeWidth="2" />
            <ellipse cx="-20" cy="35" rx="10" ry="8" fill={color} stroke="black" strokeWidth="3" />
            <ellipse cx="20" cy="35" rx="10" ry="8" fill={color} stroke="black" strokeWidth="3" />
          </g>
        )}

        {/* Stage 3+: Branching Paths */}
        {(stage >= 3) && (
          <g transform="translate(100, 110)">
            
            {/* SQUIRREL FORM */}
            {species === 'SQUIRREL' && (
              <g>
                {/* Tail */}
                <path d="M -40 20 Q -80 0 -50 -40 Q -20 -80 0 -40" fill="#b45309" stroke="black" strokeWidth="3" />
                {/* Body */}
                <ellipse cx="0" cy="10" rx="40" ry="50" fill={color} stroke="black" strokeWidth="3" />
                {/* Ears */}
                <path d="M -20 -35 L -25 -55 L -10 -40 Z" fill={color} stroke="black" strokeWidth="3" />
                <path d="M 20 -35 L 25 -55 L 10 -40 Z" fill={color} stroke="black" strokeWidth="3" />
                <Eye x={-15} y={-10} />
                <Eye x={15} y={-10} />
                <path d="M -5 20 Q 0 25 5 20" stroke="black" fill="none" strokeWidth="2" />
                {/* Holding Nut */}
                <circle cx="0" cy="40" r="15" fill="#78350f" stroke="black" strokeWidth="2" />
              </g>
            )}

            {/* HAWK FORM */}
            {species === 'HAWK' && (
              <g>
                {/* Wings */}
                <path d="M -30 -10 L -90 -30 L -40 30 Z" fill={color} stroke="black" strokeWidth="3" />
                <path d="M 30 -10 L 90 -30 L 40 30 Z" fill={color} stroke="black" strokeWidth="3" />
                {/* Body */}
                <path d="M -30 -40 L 30 -40 L 0 60 Z" fill={color} stroke="black" strokeWidth="3" />
                {/* Head */}
                <circle cx="0" cy="-40" r="25" fill={color} stroke="black" strokeWidth="3" />
                <Eye x={-10} y={-45} />
                <Eye x={10} y={-45} />
                <path d="M -5 -35 L 0 -25 L 5 -35 Z" fill="#fcd34d" stroke="black" strokeWidth="1" />
              </g>
            )}

            {/* TORTOISE FORM */}
            {species === 'TORTOISE' && (
              <g>
                {/* Shell */}
                <path d="M -50 10 Q 0 -50 50 10 L 50 40 Q 0 60 -50 40 Z" fill="#065f46" stroke="black" strokeWidth="3" />
                {/* Head */}
                <circle cx="-50" cy="10" r="20" fill={color} stroke="black" strokeWidth="3" />
                <Eye x={-55} y={5} />
                {/* Legs */}
                <rect x="-40" y="40" width="20" height="20" rx="5" fill={color} stroke="black" strokeWidth="3" />
                <rect x="20" y="40" width="20" height="20" rx="5" fill={color} stroke="black" strokeWidth="3" />
              </g>
            )}

            {/* PHOENIX FORM */}
            {species === 'PHOENIX' && (
              <g>
                 {/* Aura */}
                <circle cx="0" cy="-10" r="60" fill="url(#glow)" opacity="0.4" className="animate-pulse" />
                {/* Wings */}
                <path d="M -20 0 Q -60 -40 -80 0 Q -60 40 -20 20" fill="#f43f5e" stroke="black" strokeWidth="3" />
                <path d="M 20 0 Q 60 -40 80 0 Q 60 40 20 20" fill="#f43f5e" stroke="black" strokeWidth="3" />
                {/* Body */}
                <ellipse cx="0" cy="0" rx="20" ry="40" fill={color} stroke="black" strokeWidth="3" />
                <Eye x={-8} y={-10} />
                <Eye x={8} y={-10} />
                {/* Crest */}
                <path d="M 0 -40 L -10 -60 L 0 -50 L 10 -60 Z" fill="#fbbf24" stroke="black" strokeWidth="2" />
              </g>
            )}

            {/* DEFAULT / WEALTHASAUR / LEDGERAZARD */}
            {['Coinlet', 'Cashmander', 'Wealthasaur', 'Ledgerazard'].includes(species) && (
              <g>
                 {stage === 3 ? (
                   // Wealthasaur
                   <g>
                    <path d="M -30 -40 L -50 -80 L -10 -50 Z" fill={color} stroke="black" strokeWidth="3" />
                    <path d="M 30 -40 L 50 -80 L 10 -50 Z" fill={color} stroke="black" strokeWidth="3" />
                    <circle cx="0" cy="0" r="50" fill={color} stroke="black" strokeWidth="3" />
                    <Eye x={-20} y={-10} />
                    <Eye x={20} y={-10} />
                    <path d="M -10 20 Q 0 30 10 20" stroke="black" fill="none" strokeWidth="3" />
                    <ellipse cx="-45" cy="10" rx="15" ry="10" fill={color} stroke="black" strokeWidth="3" />
                    <ellipse cx="45" cy="10" rx="15" ry="10" fill={color} stroke="black" strokeWidth="3" />
                    <circle cx="0" cy="50" r="15" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                    <text x="0" y="54" fontSize="16" textAnchor="middle" fill="#b45309" fontWeight="bold">$</text>
                   </g>
                 ) : (
                   // Ledgerazard (Master)
                   <g>
                    <circle cx="0" cy="0" r="70" fill={color} opacity="0.3" filter="url(#glow)" />
                    <path d="M -25 -55 L -15 -85 L 0 -65 L 15 -85 L 25 -55 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                    <path d="M -50 20 Q -60 -60 0 -60 Q 60 -60 50 20 Q 40 60 0 60 Q -40 60 -50 20" fill={color} stroke="black" strokeWidth="3" />
                    <Eye x={-20} y={-20} />
                    <Eye x={20} y={-20} />
                    <path d="M -20 20 Q 0 35 20 20" stroke="black" fill="white" strokeWidth="2" />
                    <path d="M -50 0 L -80 20 L -50 40" fill="#ef4444" stroke="black" strokeWidth="3" opacity="0.8" />
                    <path d="M 50 0 L 80 20 L 50 40" fill="#ef4444" stroke="black" strokeWidth="3" opacity="0.8" />
                   </g>
                 )}
              </g>
            )}

          </g>
        )}
      </svg>
    </div>
  );
};
