
import React, { useState } from 'react';
import { UserState, Transaction, BudgetAnalysis, DailyStats } from '../types';
import { Card } from './ui/Card';
import { Plus, Trash2, Sparkles, AlertCircle, ArrowLeft, PenTool, GraduationCap, ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { getBudgetAnalysis } from '../services/geminiService';
import { predictCategory } from '../services/learningService';
import { CorrectionModal } from './CorrectionModal';
import { JuicyButton } from './ui/JuicyButton';
import { damageBus } from './Visuals/DamageFeedback';
import { generateUUID } from '../utils/helpers';

interface BudgetPlannerProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  addPoints: (amount: number) => void;
  incrementDailyStat: (key: keyof Omit<DailyStats, 'date' | 'claimedQuests'>) => void;
  onNavigate: (view: 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification' | 'raids') => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ userState, onUpdateUser, addPoints, incrementDailyStat, onNavigate }) => {
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  
  // Correction State
  const [editingTransId, setEditingTransId] = useState<string | null>(null);

  const handleDescriptionChange = (desc: string) => {
    setNewExpenseDesc(desc);
    // Smart Prediction: Check if we learned this before
    if (desc.length > 2) {
      const predicted = predictCategory(desc);
      if (predicted) {
        setNewExpenseCategory(predicted);
      }
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseCategory || !newExpenseAmount) return;
    
    const amount = parseFloat(newExpenseAmount);

    const newTransaction: Transaction = {
      id: generateUUID(),
      description: newExpenseDesc || newExpenseCategory,
      category: newExpenseCategory,
      amount: amount,
      type: 'expense',
      date: new Date().toISOString()
    };

    onUpdateUser({
      transactions: [...userState.transactions, newTransaction]
    });

    // Trigger Visual Feedback
    damageBus.emit(amount);

    setNewExpenseDesc('');
    setNewExpenseCategory('');
    setNewExpenseAmount('');
    addPoints(10); // Reward for logging expense
    incrementDailyStat('expensesLogged');
  };

  const handleRemoveTransaction = (id: string) => {
    onUpdateUser({
      transactions: userState.transactions.filter(t => t.id !== id)
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getBudgetAnalysis(userState.monthlyIncome, userState.transactions);
    setAnalysis(result);
    setIsAnalyzing(false);
    addPoints(50); // Reward for using AI
    incrementDailyStat('budgetAnalyzed');
  };

  const handleIncomeChange = (val: string) => {
     onUpdateUser({ monthlyIncome: parseFloat(val) || 0 });
  };

  // Special handler to move to chat
  const handleLockInIncome = () => {
    // Navigate to Chat to trigger the Professor's specific dialogue
    onNavigate('chat');
  };

  // Correction Handler
  const handleCorrection = (id: string, newCategory: string) => {
    const updated = userState.transactions.map(t => 
      t.id === id ? { ...t, category: newCategory } : t
    );
    onUpdateUser({ transactions: updated });
    addPoints(20); // Bonus for teaching the AI
  };

  const categories = [
    "Food", "Housing", "Transport", "Entertainment", "Health", 
    "Shopping", "Utilities", "Savings", "Investments", "Debt", "Other"
  ];

  return (
    <div className="space-y-6">
      {editingTransId && (
        <CorrectionModal 
          transactionName={userState.transactions.find(t => t.id === editingTransId)?.description || 'Unknown'}
          currentCategory={userState.transactions.find(t => t.id === editingTransId)?.category || 'Unknown'}
          onClose={() => setEditingTransId(null)}
          onCorrect={(newCat) => handleCorrection(editingTransId, newCat)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Income & Expenses">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                    Monthly Net Income
                    {userState.monthlyIncome === 0 && (
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            Step 1: Start here!
                        </span>
                    )}
                </label>
                <div className="flex gap-3">
                    <div className="relative group flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                        type="number"
                        value={userState.monthlyIncome || ''}
                        onChange={(e) => handleIncomeChange(e.target.value)}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            userState.monthlyIncome === 0 ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-300'
                        }`}
                        placeholder="0.00"
                        />
                        {userState.monthlyIncome === 0 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none hidden md:block">
                            <ArrowLeft size={16} className="inline mr-1"/> Enter amount
                        </div>
                        )}
                    </div>
                    
                    {/* Interactivity Booster: Quick Navigate Button */}
                    {userState.monthlyIncome > 0 && (
                        <JuicyButton 
                            onClick={handleLockInIncome}
                            variant="primary"
                            size="sm"
                            className="text-xs"
                        >
                            <MessageSquare size={16} /> Meet Professor
                        </JuicyButton>
                    )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-800 mb-4 flex justify-between">
                    Add Expense
                    {userState.monthlyIncome > 0 && userState.transactions.length === 0 && (
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            Step 2: Log something!
                        </span>
                    )}
                </h4>
                <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                     <input
                        type="text"
                        value={newExpenseDesc}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        placeholder="Description (e.g. Starbucks)"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                     />
                  </div>
                  <div className="w-full md:w-40">
                     <input 
                        list="categories" 
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                        placeholder="Category"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                     />
                     <datalist id="categories">
                        {categories.map(c => <option key={c} value={c} />)}
                     </datalist>
                  </div>
                  <div className="relative w-full md:w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <JuicyButton
                    type="submit"
                    variant="danger"
                    size="md"
                    className="w-full md:w-auto"
                  >
                    <Plus size={24} />
                  </JuicyButton>
                </form>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-slate-800 mb-2">Current Expenses</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {userState.transactions.filter(t => t.type === 'expense').map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 group hover:border-indigo-200 transition-colors">
                      <div>
                          <p className="font-bold text-slate-700">{t.description || t.category}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{t.category}</span>
                             <button 
                                onClick={() => setEditingTransId(t.id)}
                                className="text-xs text-indigo-400 hover:text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Teach AI correct category"
                             >
                                <GraduationCap size={12} /> Teach
                             </button>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">${t.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveTransaction(t.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {userState.transactions.filter(t => t.type === 'expense').length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <p className="text-slate-400 text-sm italic">No expenses added yet.</p>
                        <p className="text-xs text-indigo-400 mt-1">Your list is empty.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Analysis Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
            <div className="text-center p-4">
               <div className="bg-indigo-100 p-4 rounded-full inline-block mb-4">
                 <Sparkles className="text-indigo-600" size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">AI Budget Analyst</h3>
               <p className="text-slate-600 mb-6 text-sm">
                 Get personalized insights and actionable tips to optimize your budget.
               </p>
               <JuicyButton
                 onClick={handleAnalyze}
                 disabled={isAnalyzing || userState.monthlyIncome === 0}
                 variant="primary"
                 className="w-full"
               >
                 {isAnalyzing ? 'Analyzing...' : 'Analyze My Budget'}
               </JuicyButton>
            </div>

            {analysis && (
              <div className="mt-6 border-t border-indigo-100 pt-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-700">Health Score</span>
                  <span className={`text-xl font-bold ${
                    analysis.healthScore >= 80 ? 'text-green-600' :
                    analysis.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{analysis.healthScore}/100</span>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 bg-white p-3 rounded border border-slate-100">
                  {analysis.summary}
                </p>

                <h4 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
                  <AlertCircle size={16} className="text-indigo-500" /> Recommendations
                </h4>
                <ul className="space-y-2 mb-4">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                      <span className="text-indigo-400">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>

                <div className="bg-green-50 p-3 rounded border border-green-100 text-center">
                  <p className="text-xs text-green-700 uppercase font-semibold">Potential Monthly Savings</p>
                  <p className="text-lg font-bold text-green-700">${analysis.savingsPotential}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
