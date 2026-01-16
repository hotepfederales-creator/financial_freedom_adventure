import React, { useState } from 'react';
import { UserState } from '../types';
import { Card } from './ui/Card';
import { FinMon } from './FinMon';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Zap, Shield, Skull, MessageCircle, Map, Check, ChevronRight } from 'lucide-react';
import { FinMonChatModal } from './FinMonChatModal';

interface DashboardProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  onNavigate: (view: 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification' | 'raids') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, onUpdateUser, onNavigate }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const totalIncome = userState.monthlyIncome;
  const totalExpenses = userState.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  const hpPercent = totalIncome > 0 ? Math.min(100, Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;
  
  // Game logic for mood
  const mood = hpPercent > 50 ? 'happy' : hpPercent > 20 ? 'neutral' : 'sad';

  const barData = [
    { name: 'Power (Income)', amount: totalIncome, color: '#22c55e' },
    { name: 'Dmg (Exp)', amount: totalExpenses, color: '#ef4444' },
  ];

  // Beginner Checklist Logic
  const checklist = [
    { 
        id: 1, 
        label: "Set Monthly Income", 
        desc: "Power up your FinMon",
        done: userState.monthlyIncome > 0, 
        action: () => onNavigate('budget') 
    },
    { 
        id: 2, 
        label: "Log First Expense", 
        desc: "Track damage taken",
        done: userState.transactions.length > 0, 
        action: () => onNavigate('budget') 
    },
    { 
        id: 3, 
        label: "Consult Prof. Ledger", 
        desc: "Get expert advice",
        done: userState.dailyStats.chatMessagesSent > 0, 
        action: () => onNavigate('chat') 
    }
  ];

  const completedSteps = checklist.filter(s => s.done).length;
  const showGuide = completedSteps < checklist.length;

  return (
    <div className="space-y-6">
      {/* Chat Modal */}
      <FinMonChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userState={userState}
        onUpdateUser={onUpdateUser}
      />

      {/* Beginner Guide Card */}
      {showGuide && (
         <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2.5 rounded-full text-indigo-600 shadow-sm border border-indigo-200">
                    <Map size={24}/>
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 text-lg">Training Checklist</h3>
                    <p className="text-sm text-indigo-700">Complete these steps to become a real Trainer!</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                     <span className="text-xs font-bold uppercase text-indigo-400">Progress</span>
                     <div className="font-black text-indigo-600 text-xl">{completedSteps}/{checklist.length}</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {checklist.map(step => (
                    <button 
                        key={step.id} 
                        onClick={step.action} 
                        disabled={step.done} 
                        className={`
                           flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left relative overflow-hidden group
                           ${step.done 
                             ? 'bg-green-50 border-green-200 text-green-700' 
                             : 'bg-white border-indigo-100 hover:border-indigo-400 hover:shadow-md text-slate-700'}
                        `}
                    >
                        <div className="flex items-center gap-3 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${step.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 bg-slate-50 text-transparent'}`}>
                                <Check size={14} strokeWidth={3} />
                            </div>
                            <div>
                                <span className={`block font-bold ${step.done ? 'line-through opacity-70' : ''}`}>{step.label}</span>
                                <span className="text-xs opacity-70 block">{step.desc}</span>
                            </div>
                        </div>
                        {!step.done && <ChevronRight size={18} className="text-indigo-300 group-hover:translate-x-1 transition-transform"/>}
                    </button>
                ))}
            </div>
         </div>
      )}

      {/* Battle Scene Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border-4 border-slate-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-black"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Stats Box (Left) */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-yellow-400 text-lg">{userState.finMon.name}</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Lvl {userState.level}</span>
              </div>
              
              {/* HP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                  <span>HP (Savings)</span>
                  <span>{hpPercent.toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${hpPercent}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-slate-400">${balance.toLocaleString()} / ${totalIncome.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-900/40 p-3 rounded-lg border border-red-500/30 flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-full text-red-400"><Skull size={20} /></div>
                <div>
                  <p className="text-xs text-red-300 uppercase">Damage Taken</p>
                  <p className="font-bold text-white">${totalExpenses.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-green-900/40 p-3 rounded-lg border border-green-500/30 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full text-green-400"><Shield size={20} /></div>
                <div>
                  <p className="text-xs text-green-300 uppercase">Defense</p>
                  <p className="font-bold text-white">{(totalIncome > 0 ? (100 - (totalExpenses/totalIncome)*100).toFixed(0) : 0)} Def</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monster Visualization (Center/Right) */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 group">
             {/* Platform */}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/30 rounded-[100%] blur-sm"></div>
             
             {/* The Monster */}
             <div className="transition-transform duration-300 transform group-hover:-translate-y-2 cursor-pointer" onClick={() => setIsChatOpen(true)}>
               <FinMon stage={userState.finMon.stage} mood={mood} />
             </div>
             
             {/* Talk Button - Appears on Hover/Default */}
             <button 
                onClick={() => setIsChatOpen(true)}
                className="absolute top-0 right-0 bg-white text-indigo-600 p-2 md:px-4 md:py-2 rounded-full font-bold shadow-lg border-2 border-indigo-100 flex items-center gap-2 transform transition-all hover:scale-110 active:scale-95 animate-bounce"
             >
                <MessageCircle size={18} fill="currentColor" className="text-indigo-400" />
                <span className="hidden md:inline">Talk!</span>
             </button>

             {/* Interaction bubbles */}
             {mood === 'happy' && (
               <div className="absolute top-10 right-10 animate-bounce text-2xl delay-75">❤️</div>
             )}
             {mood === 'sad' && (
               <div className="absolute top-10 right-10 animate-pulse text-2xl delay-75">💧</div>
             )}
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Battles (Transactions)">
          <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
            {userState.transactions.slice(-5).reverse().map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${t.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {t.type === 'expense' ? <Zap size={16} /> : <Zap size={16} className="text-green-600"/>}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{t.category}</p>
                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {t.type === 'expense' ? '-' : '+'}${t.amount}
                </span>
              </div>
            ))}
             {userState.transactions.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-slate-400 italic mb-2">No battles recorded yet.</p>
                  <button onClick={() => onNavigate('budget')} className="text-xs text-indigo-600 font-bold hover:underline">
                      Go to Item Bag to add data
                  </button>
                </div>
              )}
          </div>
        </Card>

        <Card title="Power vs Damage">
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};