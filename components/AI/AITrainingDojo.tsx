
import React, { useState } from 'react';
import { teachAgent } from '../../services/learningService';
import { Brain, Check, X, Sparkles } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';

const MOCK_AMBIGUOUS_DATA = [
  { id: 1, name: 'AMZN MKTP US', probable: 'Shopping' },
  { id: 2, name: 'SQ *COFFEE ROAST', probable: 'Food' },
  { id: 3, name: 'UBER TRIP', probable: 'Transport' },
  { id: 4, name: 'APL* ITUNES', probable: 'Entertainment' },
  { id: 5, name: 'CVS PHARMACY', probable: 'Health' }
];

interface Props {
  onClose: () => void;
  addPoints: (amount: number) => void;
}

export const AITrainingDojo: React.FC<Props> = ({ onClose, addPoints }) => {
  const [queue, setQueue] = useState(MOCK_AMBIGUOUS_DATA);
  const [aiLevel, setAiLevel] = useState(1);
  const [combo, setCombo] = useState(0);

  const handleTrain = (item: any, isCorrect: boolean) => {
    if (isCorrect) {
      teachAgent(item.name, item.probable, 'Confirmed by User in Dojo');
      addPoints(10);
      setCombo(c => c + 1);
    } else {
        // Reset combo on skip/no
        setCombo(0);
    }
    
    setQueue(prev => prev.slice(1));
    setAiLevel(prev => prev + 1);
  };

  if (queue.length === 0) return (
    <div className="text-center p-12 bg-slate-800 rounded-xl flex flex-col items-center animate-fade-in">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
          <Brain size={48} className="text-white animate-bounce" />
      </div>
      <h2 className="text-3xl font-pixel text-green-400 mb-2">TRAINING COMPLETE!</h2>
      <p className="text-white mb-6">Professor Ledger's neural pathways have expanded.</p>
      <JuicyButton onClick={onClose} variant="success" size="lg">Return to Hub</JuicyButton>
    </div>
  );

  const current = queue[0];

  return (
    <div className="max-w-md mx-auto bg-slate-900 border-4 border-indigo-500 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="bg-indigo-600 p-3 text-center text-white font-bold flex justify-between items-center px-6">
          <span className="font-pixel text-lg">AI DOJO</span>
          <span className="bg-indigo-800 px-2 py-0.5 rounded text-xs">LVL {aiLevel}</span>
      </div>
      
      <div className="p-8 text-center relative">
        {combo > 1 && (
            <div className="absolute top-4 right-4 text-yellow-400 font-black text-xl animate-bounce">
                {combo}x COMBO!
            </div>
        )}

        <div className="mb-8">
            <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-2">Unidentified Transaction</p>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h2 className="text-2xl font-mono text-white tracking-tight">{current.name}</h2>
            </div>
        </div>
        
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full"></div>
          <p className="text-xs text-slate-400 mb-2 relative z-10">AI Hypothesis</p>
          <div className="text-4xl font-bold text-indigo-400 animate-pulse relative z-10 font-pixel">
            {current.probable}?
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => handleTrain(current, false)}
            className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border-2 border-red-500 px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <X size={24} /> NO
          </button>
          <button 
            onClick={() => handleTrain(current, true)}
            className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 flex items-center gap-2 border-b-4 border-green-700"
          >
            <Check size={24} /> CORRECT
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 italic">Verify the transaction category to earn XP.</p>
      </div>
    </div>
  );
};
