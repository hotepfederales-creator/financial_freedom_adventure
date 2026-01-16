import React, { useState } from 'react';
import { UserState, Transaction, BudgetAnalysis } from '../types';
import { Card } from './ui/Card';
import { Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { getBudgetAnalysis } from '../services/geminiService';

interface BudgetPlannerProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  addPoints: (amount: number) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ userState, onUpdateUser, addPoints }) => {
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseCategory || !newExpenseAmount) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      category: newExpenseCategory,
      amount: parseFloat(newExpenseAmount),
      type: 'expense',
      date: new Date().toISOString()
    };

    onUpdateUser({
      transactions: [...userState.transactions, newTransaction]
    });

    setNewExpenseCategory('');
    setNewExpenseAmount('');
    addPoints(10); // Reward for logging expense
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
  };

  const handleIncomeChange = (val: string) => {
     onUpdateUser({ monthlyIncome: parseFloat(val) || 0 });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Income & Expenses">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Net Income</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={userState.monthlyIncome || ''}
                      onChange={(e) => handleIncomeChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-medium text-slate-800 mb-4">Add Expense</h4>
                <form onSubmit={handleAddExpense} className="flex gap-3">
                  <input
                    type="text"
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    placeholder="Category (e.g. Rent, Food)"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </form>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-slate-800 mb-2">Current Expenses</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {userState.transactions.filter(t => t.type === 'expense').map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-slate-700">{t.category}</span>
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
                    <p className="text-slate-400 text-sm italic">No expenses added yet.</p>
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
               <button
                 onClick={handleAnalyze}
                 disabled={isAnalyzing || userState.monthlyIncome === 0}
                 className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all shadow-md
                   ${isAnalyzing || userState.monthlyIncome === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'}
                 `}
               >
                 {isAnalyzing ? 'Analyzing...' : 'Analyze My Budget'}
               </button>
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
