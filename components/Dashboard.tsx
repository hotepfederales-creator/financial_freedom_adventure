import React, { useState } from 'react';
import { UserState } from '../types';
import { FinMon } from './FinMon';
import { JuicyButton } from './ui/JuicyButton';
import { Zap, Shield, MessageSquare, Wallet, Swords } from 'lucide-react';
import { FinMonChatModal } from './FinMonChatModal';

interface DashboardProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  onNavigate: (view: 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification' | 'raids') => void;
  onTutorialAction?: (action: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, onUpdateUser, onNavigate, onTutorialAction }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const totalIncome = userState.monthlyIncome;
  const totalExpenses = userState.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  const hpPercent = totalIncome > 0 ? Math.min(100, Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;
  
  // Game logic for mood
  const mood = hpPercent > 50 ? 'happy' : hpPercent > 20 ? 'neutral' : 'sad';

  // Recent Battle Log
  const recentTransactions = userState.transactions.slice(-5).reverse();

  const handleFinMonClick = () => {
    setIsChatOpen(true);
    if (onTutorialAction) onTutorialAction('CLICK_EGG');
  };

  return (
    <div className="min-h-full pb-8">
      <FinMonChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userState={userState}
        onUpdateUser={onUpdateUser}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto">
      
        {/* 1. HEADER STATS (Full Width) */}
        <div className="col-span-1 md:col-span-12 bg-slate-800 rounded-2xl p-6 border-b-8 border-slate-900 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/50 stripe-pattern opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-slate-400 text-sm md:text-lg font-pixel tracking-widest">Current Balance</h2>
            <p className={`text-5xl md:text-6xl font-mono font-bold ${balance < 0 ? 'text-red-500' : 'text-white'}`}>
              ${balance.toLocaleString()}
            </p>
          </div>

          <div className="text-center md:text-right w-full md:w-auto relative z-10">
            <div className="bg-slate-900 rounded-full h-6 w-full md:w-96 border-4 border-slate-700 overflow-hidden relative shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ${
                    hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${hpPercent}%` }}
              ></div> 
            </div>
            <div className="flex justify-between mt-2 font-pixel text-xl">
               <span className="text-slate-500">HP (Budget)</span>
               <span className={hpPercent > 50 ? 'text-green-400' : 'text-red-400'}>{hpPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* 2. THE STAGE (Center Focus) */}
        <div className="col-span-1 md:col-span-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border-4 border-slate-700 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group">
          {/* Background Decorative Grid */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Platform */}
          <div className="absolute bottom-16 w-64 h-12 bg-black/40 blur-xl rounded-[100%]"></div>

          <div id="finmon-display" className="relative z-10 transform transition-transform duration-500 hover:scale-105 cursor-pointer" onClick={handleFinMonClick}>
            <div className="w-64 h-64 md:w-80 md:h-80">
                 <FinMon stage={userState.finMon.stage} mood={mood} species={userState.finMon.species as any} />
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl text-center border border-slate-700">
            <p className="text-xl md:text-2xl text-yellow-400 font-pixel">
              "{mood === 'happy' ? 'We are getting rich!' : mood === 'sad' ? 'I need financial healing...' : 'Ready for orders, Trainer.'}"
            </p>
          </div>

          <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded text-xs font-mono text-slate-400 border border-slate-700">
             Lvl {userState.level} {userState.finMon.species}
          </div>
        </div>

        {/* 3. CONTROL DECK (Right Side) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-800 p-5 rounded-2xl flex-1 border-b-4 border-slate-900 shadow-lg">
            <h3 className="text-2xl text-white mb-6 border-b border-slate-600 pb-2 flex items-center gap-2">
                <Swords size={20} className="text-red-500" /> COMMANDS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <JuicyButton variant="danger" size="md" onClick={() => onNavigate('budget')}>
                 <Zap size={18} /> SPEND
              </JuicyButton>
              <JuicyButton variant="success" size="md" onClick={() => onNavigate('budget')}>
                 <Wallet size={18} /> SAVE
              </JuicyButton>
              <JuicyButton variant="primary" className="col-span-2" onClick={() => onNavigate('chat')}>
                 <MessageSquare size={18} /> CONSULT PROFESSOR
              </JuicyButton>
            </div>
          </div>

          {/* Recent Loot (History) */}
          <div className="bg-slate-800 p-5 rounded-2xl h-80 overflow-y-auto border-b-4 border-slate-900 shadow-lg custom-scrollbar">
            <h3 className="text-xl text-slate-400 mb-4 font-pixel">BATTLE LOG</h3>
            <div className="space-y-3">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-md text-slate-200 font-bold">{t.description || t.category}</span>
                    <span className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-mono text-lg ${t.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                    {t.type === 'expense' ? '-' : '+'}${t.amount}
                  </span>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-slate-500 text-center italic mt-10">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};