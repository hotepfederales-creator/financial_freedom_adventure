
import React, { useState } from 'react';

export type Difficulty = 'NOVICE' | 'VETERAN' | 'HARDCORE';

export const DifficultySelector: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('NOVICE');

  const settings = {
    NOVICE: { tolerance: '20%', xpMult: '1.0x', desc: 'Good for beginners. Relaxed budget limits.' },
    VETERAN: { tolerance: '10%', xpMult: '1.5x', desc: 'Standard play. Strict but fair.' },
    HARDCORE: { tolerance: '2%', xpMult: '3.0x', desc: 'For FIRE aspirants. Zero waste allowed.' }
  };

  return (
    <div className="p-6 bg-slate-800 rounded-xl border-2 border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span>⚙️</span> WORLD TIER (Difficulty)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(settings) as Difficulty[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setDifficulty(mode)}
            className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${difficulty === mode 
              ? 'border-yellow-400 bg-indigo-900 shadow-lg shadow-indigo-500/20' 
              : 'border-slate-600 bg-slate-700 hover:bg-slate-600'}`}
          >
            {difficulty === mode && <div className="absolute top-0 right-0 p-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold">ACTIVE</div>}
            
            <div className={`font-bold text-lg mb-1 ${difficulty === mode ? 'text-yellow-400' : 'text-slate-200'}`}>{mode}</div>
            <div className="text-xs text-slate-400 mb-3 min-h-[2.5em]">{settings[mode].desc}</div>
            
            <div className="flex justify-between text-[10px] font-mono uppercase font-bold border-t border-white/10 pt-2">
              <span className="text-red-300">Var: +/-{settings[mode].tolerance}</span>
              <span className="text-green-300">XP: {settings[mode].xpMult}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
