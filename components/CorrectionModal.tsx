
import React, { useState } from 'react';
import { teachAgent } from '../services/learningService';
import { X, GraduationCap } from 'lucide-react';

interface CorrectionModalProps {
  transactionName: string;
  currentCategory: string;
  onClose: () => void;
  onCorrect: (newCategory: string) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({ transactionName, currentCategory, onClose, onCorrect }) => {
  const [newCategory, setNewCategory] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;

    teachAgent(transactionName, newCategory, reason);
    onCorrect(newCategory);
    onClose();
  };

  const categories = [
    "Food", "Housing", "Transport", "Entertainment", "Health", 
    "Shopping", "Utilities", "Savings", "Investments", "Debt"
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-4 border-indigo-100 overflow-hidden">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold">
            <GraduationCap size={24} />
            <h2>Teach Professor Ledger</h2>
          </div>
          <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-sm text-slate-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            I categorized <strong>"{transactionName}"</strong> as <em>{currentCategory}</em>.<br/>
            If I was wrong, please teach me the correct category!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase text-slate-500 tracking-wide">Correct Category</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              >
                <option value="">Select correct category...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase text-slate-500 tracking-wide">Why? (Optional Learning Context)</label>
              <textarea 
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none h-24"
                placeholder="e.g., 'This cafe is actually my workspace rent', or 'This bill is medical'"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:translate-y-0.5"
              >
                Teach Rule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
