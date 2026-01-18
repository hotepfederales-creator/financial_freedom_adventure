
import React from 'react';

interface LevelNode {
  id: string;
  name: string;
  requiredNetWorth: number;
  isUnlocked: boolean;
  description: string;
}

const CAMPAIGN_LEVELS: LevelNode[] = [
  { id: '1', name: 'Starter Village', requiredNetWorth: 0, isUnlocked: true, description: 'Learn the basics of survival.' },
  { id: '2', name: 'The Debt Dungeon', requiredNetWorth: 500, isUnlocked: false, description: 'Defeat the Interest Rate Goblins.' },
  { id: '3', name: 'Investment Peaks', requiredNetWorth: 5000, isUnlocked: false, description: 'Climb the mountain of Compound Growth.' },
  { id: '4', name: 'Freedom Citadel', requiredNetWorth: 25000, isUnlocked: false, description: 'The home of the Financially Independent.' }
];

export const StoryMap: React.FC<{ currentNetWorth: number }> = ({ currentNetWorth }) => {
  return (
    <div className="p-6 bg-slate-900 rounded-xl border-4 border-indigo-900 relative overflow-hidden">
      {/* Background decorative grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <h2 className="text-2xl font-pixel text-yellow-400 mb-6 text-center relative z-10">WORLD MAP</h2>
      
      <div className="space-y-8 relative z-10 pl-4">
        {/* Connecting Line */}
        <div className="absolute left-12 top-8 bottom-8 w-1 bg-slate-700 -z-10"></div>
        
        {CAMPAIGN_LEVELS.map((level) => {
          const unlocked = currentNetWorth >= level.requiredNetWorth;
          return (
            <div key={level.id} className={`flex items-center gap-6 ${unlocked ? 'opacity-100' : 'opacity-60 grayscale'}`}>
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-2xl z-10 shadow-lg transform transition-transform hover:scale-110
                ${unlocked ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                {unlocked ? '🏆' : '🔒'}
              </div>
              <div className={`bg-slate-800 p-4 rounded-xl border-2 flex-1 shadow-md transition-all
                  ${unlocked ? 'border-indigo-500' : 'border-slate-700'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white tracking-wide">{level.name}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${unlocked ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {unlocked ? 'EXPLORED' : 'LOCKED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{level.description}</p>
                {!unlocked && (
                  <div className="mt-2 w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${Math.min(100, (currentNetWorth / level.requiredNetWorth) * 100)}%` }}
                    ></div>
                  </div>
                )}
                {!unlocked && <p className="text-xs text-red-400 mt-1 font-mono">Need ${level.requiredNetWorth.toLocaleString()} Net Worth</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
