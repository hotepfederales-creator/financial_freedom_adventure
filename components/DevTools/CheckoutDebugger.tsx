
import React from 'react';

interface Props {
  setMockBudget: (amount: number) => void;
  currentMockBudget: number;
}

export const CheckoutDebugger: React.FC<Props> = ({ setMockBudget, currentMockBudget }) => {
  return (
    <div className="fixed top-24 right-4 bg-slate-900 border-2 border-yellow-500 p-4 rounded-lg shadow-xl w-48 z-40 animate-fade-in opacity-90 hover:opacity-100 transition-opacity">
      <h3 className="text-yellow-400 font-bold mb-3 border-b border-slate-700 pb-2 text-xs tracking-widest flex items-center gap-2">
         🛒 CHECKOUT SIM
      </h3>
      
      <div className="space-y-2">
        <button 
          onClick={() => setMockBudget(5000)} 
          className={`w-full text-xs font-bold p-2 rounded transition-colors ${currentMockBudget === 5000 ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Set: Wealthy ($5k)
        </button>
        <button 
          onClick={() => setMockBudget(500)} 
          className={`w-full text-xs font-bold p-2 rounded transition-colors ${currentMockBudget === 500 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Set: Average ($500)
        </button>
        <button 
          onClick={() => setMockBudget(50)} 
          className={`w-full text-xs font-bold p-2 rounded transition-colors ${currentMockBudget === 50 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Set: Broke ($50)
        </button>
      </div>
      <p className="mt-3 text-[10px] text-slate-500 italic leading-tight">
          Forces the "Budget Remaining" variable to verify AI warnings.
      </p>
    </div>
  );
};
