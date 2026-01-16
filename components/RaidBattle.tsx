import React from 'react';
import { RaidBoss, RaidParticipant } from '../types/raidTypes';
import { Users, Clock, ShieldAlert } from 'lucide-react';

interface RaidProps {
  boss: RaidBoss;
  squad: RaidParticipant[];
  onJoin?: () => void;
  isParticipating?: boolean;
}

export const RaidBattle: React.FC<RaidProps> = ({ boss, squad, onJoin, isParticipating }) => {
  const percentage = (boss.currentHp / boss.totalHp) * 100;
  
  // Sort squad by damage
  const sortedSquad = [...squad].sort((a, b) => b.damageDealt - a.damageDealt);

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border-4 border-red-900/50 shadow-2xl relative">
      {/* Boss Header */}
      <div className="bg-red-900/80 p-4 flex justify-between items-start backdrop-blur-sm relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="bg-red-600 text-xs font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">{boss.difficulty} Raid</span>
             <span className="flex items-center gap-1 text-xs text-red-200"><Clock size={12}/> Ends {boss.deadline}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase shadow-sm">{boss.name}</h2>
          <p className="text-red-200 text-xs">{boss.description}</p>
        </div>
        <div className="bg-black/40 px-3 py-1 rounded text-xs font-mono">
            ID: {boss.id}
        </div>
      </div>

      {/* Visual Arena */}
      <div className="relative h-48 bg-slate-800 flex items-center justify-center overflow-hidden">
         {/* Background pulse */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-slate-900 to-black animate-pulse"></div>
         
         {/* The Boss */}
         <div className="text-[80px] md:text-[100px] filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce-gentle transform hover:scale-110 transition-transform cursor-pointer">
            {boss.image}
         </div>

         {/* Stats Overlay */}
         <div className="absolute bottom-4 left-0 right-0 px-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1 text-red-300">
                <span>Boss HP (Debt)</span>
                <span>{((boss.currentHp / boss.totalHp) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 h-6 rounded-full overflow-hidden border-2 border-slate-600 box-content">
                <div 
                  className="bg-gradient-to-r from-red-600 to-orange-600 h-full transition-all duration-1000 relative"
                  style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
                </div>
            </div>
            <div className="flex justify-between mt-1">
               <p className="text-sm font-mono font-bold text-white">${boss.currentHp.toLocaleString()}</p>
               <p className="text-xs text-slate-400">Total: ${boss.totalHp.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* Squad List */}
      <div className="p-4 bg-slate-800">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                <Users size={18} /> Raid Squad
            </h3>
            {!isParticipating && onJoin && (
                <button onClick={onJoin} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded font-bold transition-colors">
                    Join Raid
                </button>
            )}
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar-dark">
            {sortedSquad.map((member, i) => (
            <div key={member.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded border border-slate-600">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-4">#{i + 1}</span>
                    <span className="text-lg">{member.avatar}</span>
                    <div>
                        <p className="text-sm font-bold text-slate-200 leading-none">{member.username}</p>
                        <p className="text-[10px] text-slate-400">{member.lastActive}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-green-400 font-mono font-bold text-sm block">-${member.damageDealt.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Damage</span>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      <style>{`
        @keyframes progress-bar-stripes {
            0% { background-position: 1rem 0; }
            100% { background-position: 0 0; }
        }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: #1e293b; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
      `}</style>
    </div>
  );
};