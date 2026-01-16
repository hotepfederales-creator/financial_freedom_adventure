import React from 'react';
import { UserState } from '../types';
import { Card } from './ui/Card';
import { Trophy, Star, Target, ShieldCheck } from 'lucide-react';

interface GamificationHubProps {
  userState: UserState;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ userState }) => {
  const nextLevel = (Math.floor(userState.points / 100) + 1) * 100;
  const progress = (userState.points % 100) / 100 * 100;

  const challenges = [
    { title: 'Budget Master', desc: 'Create a budget and analyze it', reward: 50, done: userState.monthlyIncome > 0 },
    { title: 'Saver', desc: 'Log an expense', reward: 10, done: userState.transactions.length > 0 },
    { title: 'Tax Wizard', desc: 'Estimate your taxes', reward: 25, done: false }, // Logic could be more complex
  ];

  return (
    <div className="space-y-6">
      {/* Level Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy size={32} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-indigo-100 font-medium">Current Level</p>
              <h2 className="text-3xl font-bold">Level {userState.level}</h2>
            </div>
          </div>
          <div className="text-right">
             <p className="text-3xl font-bold text-yellow-300">{userState.points}</p>
             <p className="text-xs text-indigo-100 uppercase tracking-wider">Total Points</p>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block text-indigo-100">
              Progress to Level {userState.level + 1}
            </span>
            <span className="text-xs font-semibold inline-block text-indigo-100">
              {userState.points} / {nextLevel}
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-900/30">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Active Challenges">
          <div className="space-y-4">
            {challenges.map((c, idx) => (
              <div key={idx} className={`p-4 rounded-lg border flex justify-between items-center ${c.done ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${c.done ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${c.done ? 'text-green-800' : 'text-slate-800'}`}>{c.title}</h4>
                    <p className="text-xs text-slate-500">{c.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600">+{c.reward} pts</span>
                  {c.done && <div className="text-xs text-green-600 font-medium">Completed</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Achievements">
          <div className="grid grid-cols-3 gap-4">
             {/* Mock Badges */}
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex flex-col items-center text-center p-2">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${i === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-300'}`}>
                    <ShieldCheck size={32} />
                 </div>
                 <p className={`text-xs font-semibold ${i === 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                   {i === 1 ? 'Early Adopter' : 'Locked'}
                 </p>
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
