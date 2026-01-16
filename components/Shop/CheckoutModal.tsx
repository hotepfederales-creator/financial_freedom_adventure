
import React, { useState } from 'react';
import { usePurchaseIntervention, InterventionResult } from '../../hooks/usePurchaseIntervention';
import { X, ShoppingCart, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface Props {
  item: { name: string; price: number; image: string };
  budgetRemaining: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CheckoutModal: React.FC<Props> = ({ item, budgetRemaining, onClose, onConfirm }) => {
  const { analyzePurchase, isAnalyzing } = usePurchaseIntervention();
  const [intervention, setIntervention] = useState<InterventionResult | null>(null);

  const handleInitialClick = async () => {
    const result = await analyzePurchase(item.name, item.price, budgetRemaining);
    setIntervention(result);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-fade-in">
      <div className="bg-slate-800 border-4 border-indigo-500 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
            <X size={24} />
        </button>

        <div className="p-6">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="text-indigo-400" /> Confirm Purchase
            </h2>
            
            <div className="flex gap-4 mb-6 bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-4xl shadow-inner">
                    {item.image}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <p className="text-2xl text-yellow-400 font-mono font-bold">${item.price.toLocaleString()}</p>
                </div>
            </div>

            {/* AI Analysis Area */}
            {!intervention ? (
                <div className="space-y-3">
                    <p className="text-slate-400 text-sm italic">
                        "Trainer! Before you buy, let me analyze how this affects your budget..." 
                        <br/>- Prof. Ledger
                    </p>
                    <button 
                        onClick={handleInitialClick}
                        disabled={isAnalyzing}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                             <>
                               <Brain className="animate-pulse" /> Analyzing Risk...
                             </>
                        ) : (
                             'Analyze & Pay'
                        )}
                    </button>
                </div>
            ) : (
            <div className="animate-fade-in-up">
                {/* The Intervention Card */}
                <div className={`p-4 border-l-4 mb-6 rounded-r-lg ${
                    intervention.riskLevel === 'DANGER' ? 'border-red-500 bg-red-900/20' : 
                    intervention.riskLevel === 'CAUTION' ? 'border-yellow-500 bg-yellow-900/20' :
                    'border-green-500 bg-green-900/20'
                }`}>
                    <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${
                        intervention.riskLevel === 'DANGER' ? 'text-red-400' : 
                        intervention.riskLevel === 'CAUTION' ? 'text-yellow-400' :
                        'text-green-400'
                    }`}>
                        {intervention.riskLevel === 'DANGER' ? <><AlertTriangle size={20}/> CRITICAL WARNING</> : 
                         intervention.riskLevel === 'CAUTION' ? <><AlertTriangle size={20}/> CAUTION ADVISED</> :
                         <><CheckCircle size={20}/> SAFE MOVE</>}
                    </h3>
                    <p className="text-sm text-slate-300 italic mb-3">"{intervention.message}"</p>
                    
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Opportunity Cost</p>
                        <p className="text-xs font-mono text-yellow-200">{intervention.opportunityCost}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white font-bold transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:translate-y-0.5 ${
                            intervention.riskLevel === 'DANGER' ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                        }`}
                    >
                        {intervention.riskLevel === 'DANGER' ? 'Buy Anyway' : 'Confirm'}
                    </button>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};
