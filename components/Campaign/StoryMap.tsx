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
    <div className="p-6 bg-slate-900 rounded-xl border-4 border-indigo-900">
      <h2 className="text-2xl font-pixel text-yellow-400 mb-6 text-center">WORLD MAP</h2>
      <div className="space-y-8 relative">
        {/* Connecting Line */}
        <div className="absolute left-8 top-4 bottom-4 w-1 bg-slate-700 -z-10"></div>
        
        {CAMPAIGN_LEVELS.map((level) => {
          const unlocked = currentNetWorth >= level.requiredNetWorth;
          return (
            <div key={level.id} className={`flex items-center gap-4 ${unlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-2xl z-10 
                ${unlocked ? 'bg-green-600 border-green-400' : 'bg-slate-700 border-slate-500'}`}>
                {unlocked ? '🏆' : '🔒'}
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 flex-1">
                <h3 className="text-lg font-bold text-white">{level.name}</h3>
                <p className="text-xs text-gray-400">{level.description}</p>
                {!unlocked && <p className="text-xs text-red-400 mt-1">Need ${level.requiredNetWorth} Net Worth</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};