import React, { useState } from 'react';
import { teachAgent } from '../../services/learningService';
import { BrainCircuit, Check, X } from 'lucide-react';
import posthog from 'posthog-js';

const MOCK_AMBIGUOUS_DATA = [
  { id: 1, name: 'AMZN MKTP US', probable: 'Shopping' },
  { id: 2, name: 'SQ *COFFEE ROAST', probable: 'Food' },
  { id: 3, name: 'UBER TRIP', probable: 'Transport' },
  { id: 4, name: 'STEAM GAMES', probable: 'Entertainment' },
  { id: 5, name: 'CVS PHARMACY', probable: 'Health' }
];

export const AITrainingDojo: React.FC = () => {
  const [queue, setQueue] = useState(MOCK_AMBIGUOUS_DATA);
  const [aiLevel, setAiLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  const handleTrain = (item: any, isCorrect: boolean) => {
    if (isCorrect) {
      teachAgent(item.name, item.probable, 'Confirmed by User in Dojo');
      setStreak(s => s + 1);
    } else {
        setStreak(0);
    }
    
    // Track if session is complete (this was the last item)
    if (queue.length === 1) {
        posthog.capture('AI Training Session Completed', {
            final_ai_level: aiLevel + 1,
            final_streak: isCorrect ? streak + 1 : 0
        });
    }

    // If wrong, we would open a correction modal (simplified here)
    
    setQueue(prev => prev.slice(1));
    setAiLevel(prev => prev + 1);
  };

  if (queue.length === 0) return (
    <div className="text-center p-12 bg-slate-800 rounded-xl border-4 border-green-500 animate-fade-in">
      <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
        <BrainCircuit size={48} className="text-green-400" />
      </div>
      <h2 className="text-3xl font-black text-green-400 mb-2 font-pixel">TRAINING COMPLETE!</h2>
      <p className="text-white text-lg">Professor Ledger's IQ increased!</p>
      <button 
        onClick={() => { setQueue(MOCK_AMBIGUOUS_DATA); setAiLevel(1); }}
        className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold"
      >
        Run Another Batch
      </button>
    </div>
  );

  const current = queue[0];

  return (
    <div className="max-w-md mx-auto bg-slate-900 border-4 border-indigo-500 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="bg-indigo-600 p-3 text-center text-white font-bold flex justify-between items-center px-6">
          <span>AI DOJO</span>
          <span className="font-mono text-indigo-200">LVL {aiLevel}</span>
      </div>
      
      <div className="p-8 text-center">
        <div className="mb-8 relative">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Analyzing Transaction</div>
            <div className="bg-black/30 p-4 rounded-xl border border-slate-700">
                 <h2 className="text-2xl font-mono text-white tracking-tight">{current.name}</h2>
            </div>
        </div>
        
        <div className="mb-8">
          <p className="text-sm text-indigo-300 mb-2 font-bold">Is this category correct?</p>
          <div className="text-4xl font-black text-white animate-pulse bg-indigo-900/30 py-4 rounded-xl border border-indigo-500/50">
            {current.probable}?
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => handleTrain(current, false)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <X size={24} /> NO
          </button>
          <button 
            onClick={() => handleTrain(current, true)}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Check size={24} /> YES
          </button>
        </div>
        
        <div className="mt-6 text-xs text-slate-500 font-mono">
            Streak: {streak} 🔥
        </div>
      </div>
    </div>
  );
};