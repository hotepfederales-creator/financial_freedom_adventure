
import React from 'react';
import { CHANGELOG_HISTORY } from '../../data/changelog';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Get the latest update (first in the array)
  const latestUpdate = CHANGELOG_HISTORY[0];

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[200] backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-slate-900 border-2 border-yellow-500 rounded-2xl p-0 max-w-md w-full shadow-[0_0_40px_rgba(234,179,8,0.3)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 text-center relative overflow-hidden">
           {/* Pattern Overlay */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
           
           <h2 className="text-3xl font-black text-white uppercase tracking-widest relative z-10 drop-shadow-md">
            System Update
           </h2>
           <p className="text-yellow-100 font-mono text-sm relative z-10 font-bold opacity-80">Patch v{latestUpdate.version}</p>
        </div>

        <div className="p-6">
            {/* Content */}
            <div className="mb-6">
              <h3 className="text-xl text-yellow-400 font-bold mb-1 flex items-center gap-2">
                <Sparkles size={20} /> {latestUpdate.title}
              </h3>
              <p className="text-slate-500 text-xs mb-4 font-mono">{latestUpdate.date}</p>

              <ul className="space-y-3">
                {latestUpdate.changes.map((change, i) => (
                  <li key={i} className="flex items-start text-slate-300 text-sm leading-relaxed">
                    <ArrowRight size={16} className="mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <button 
              onClick={onClose}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg active:scale-95"
            >
              Resume Adventure
            </button>
        </div>
      </div>
    </div>
  );
};
