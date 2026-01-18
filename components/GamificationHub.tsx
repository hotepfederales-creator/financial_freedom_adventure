
import React, { useState } from 'react';
import { UserState, Achievement } from '../types';
import { Card } from './ui/Card';
import { Trophy, Star, Target, ShieldCheck, User, BookOpen, X, ArrowRight, CheckCircle, Lock, Wallet, Zap, Brain, PiggyBank, Swords, TrendingUp, Database, MessageSquare, Map, Settings } from 'lucide-react';
import { FinMon } from './FinMon';
import { StoryMap } from './Campaign/StoryMap';
import { DifficultySelector } from './Settings/DifficultySelector';
import { AITrainingDojo } from './AI/AITrainingDojo';
import { JuicyButton } from './ui/JuicyButton';

interface GamificationHubProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  addPoints: (amount: number) => void;
}

const FIN_DEX = [
  {
    stage: 1,
    name: 'Coinlet',
    title: 'The Savings Seed',
    desc: "A fragile egg made of spare change. It requires steady deposits and warmth to incubate. Vulnerable to 'Impulse Buy' attacks.",
    minLevel: 1
  },
  {
    stage: 2,
    name: 'Cashmander',
    title: 'The Budget Buddy',
    desc: "A curious hatchling that feeds on small deposits. It's eager to grow but needs a strict diet of low expenses to evolve.",
    minLevel: 2
  },
  {
    stage: 3,
    name: 'Wealthasaur',
    title: 'The Fiscal Guardian',
    desc: "Robust and disciplined. It wields a coin-shield to deflect debt and has mastered the move 'Compound Interest'.",
    minLevel: 5
  },
  {
    stage: 4,
    name: 'Ledgerazard',
    title: 'The Portfolio King',
    desc: "A legendary financial entity. Its golden aura represents perfect credit and vast savings. Commands respect from all banks.",
    minLevel: 10
  }
];

export const GamificationHub: React.FC<GamificationHubProps> = ({ userState, onUpdateUser, addPoints }) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'MAP' | 'DOJO' | 'SETTINGS'>('CARD');
  const [isDexOpen, setIsDexOpen] = useState(false);
  
  const nextLevel = (Math.floor(userState.points / 100) + 1) * 100;
  const progress = (userState.points % 100) / 100 * 100;
  
  // Calculate Net Worth for Story Map (Simple: Income * Level approx)
  // In real app, calculate from transaction history total
  const netWorth = (userState.transactions.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0) - 
                   userState.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0)) + (userState.monthlyIncome);

  // --- Daily Quests Configuration ---
  const dailyQuests = [
    {
      id: 'daily_expense',
      title: 'Expense Tracker',
      desc: 'Log 3 expenses today',
      target: 3,
      current: userState.dailyStats.expensesLogged,
      reward: 30,
      icon: Zap
    },
    {
      id: 'daily_chat',
      title: 'Seek Wisdom',
      desc: 'Chat with Prof. Ledger',
      target: 1,
      current: userState.dailyStats.chatMessagesSent,
      reward: 20,
      icon: Brain
    },
    {
      id: 'daily_analyze',
      title: 'Health Check',
      desc: 'Run a Budget Analysis',
      target: 1,
      current: userState.dailyStats.budgetAnalyzed,
      reward: 50,
      icon: Target
    }
  ];

  const handleClaimDaily = (questId: string, reward: number) => {
    addPoints(reward);
    onUpdateUser({
      dailyStats: {
        ...userState.dailyStats,
        claimedQuests: [...userState.dailyStats.claimedQuests, questId]
      }
    });
  };

  // --- Achievements Configuration ---
  const achievements: Achievement[] = [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Log your first transaction',
      icon: Star,
      reward: 50,
      condition: (s) => s.transactions.length > 0
    },
    {
      id: 'saver_novice',
      title: 'Savings Seed',
      description: 'Accumulate $100 in savings (Income - Expense)',
      icon: PiggyBank,
      reward: 100,
      condition: (s) => {
        const exp = s.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
        return (s.monthlyIncome - exp) >= 100;
      }
    },
    {
      id: 'saver_pro',
      title: 'Treasure Hunter',
      description: 'Accumulate $1,000 in savings',
      icon: Wallet,
      reward: 500,
      condition: (s) => {
        const exp = s.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
        return (s.monthlyIncome - exp) >= 1000;
      }
    },
    {
      id: 'budget_master',
      title: 'Analysis Ace',
      description: 'Complete 5 Budget Analyses (Lifetime)',
      icon: Target,
      reward: 200,
      condition: (s) => (s.points >= 250) // Approximation since we don't track lifetime analysis count strictly in this version, using points as proxy
    },
    {
      id: 'low_spender',
      title: 'Iron Defense',
      description: 'Keep expenses under 50% of income',
      icon: ShieldCheck,
      reward: 150,
      condition: (s) => {
         if (s.monthlyIncome === 0) return false;
         const exp = s.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
         return exp < (s.monthlyIncome * 0.5) && exp > 0;
      }
    },
    {
      id: 'debt_slayer',
      title: 'Debt Slayer',
      description: 'Log a payment towards "Debt"',
      icon: Swords,
      reward: 75,
      condition: (s) => s.transactions.some(t => t.category === 'Debt' && t.type === 'expense')
    },
    {
      id: 'investor_initiate',
      title: 'Future Tycoon',
      description: 'Log an "Investments" contribution',
      icon: TrendingUp,
      reward: 150,
      condition: (s) => s.transactions.some(t => t.category === 'Investments')
    },
    {
      id: 'data_hoarder',
      title: 'Data Collector',
      description: 'Log 20 total transactions',
      icon: Database,
      reward: 100,
      condition: (s) => s.transactions.length >= 20
    },
    {
      id: 'curious_mind',
      title: 'Curious Mind',
      description: 'Send 10 messages to Prof. Ledger',
      icon: MessageSquare,
      reward: 50,
      condition: (s) => (s.ledgerChatHistory?.filter(m => m.role === 'user').length || 0) >= 10
    }
  ];

  const handleClaimAchievement = (id: string, reward: number) => {
    addPoints(reward);
    onUpdateUser({
      achievements: [...(userState.achievements || []), id]
    });
  };

  const badges = [
    { id: 1, name: 'Rookie', color: 'bg-slate-400' },
    { id: 2, name: 'Saver', color: 'bg-green-400' },
    { id: 3, name: 'Investor', color: 'bg-purple-400' },
    { id: 4, name: 'Tycoon', color: 'bg-yellow-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex justify-center gap-2 p-1 bg-slate-800 rounded-xl w-fit mx-auto mb-4">
          <button 
            onClick={() => setActiveTab('CARD')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'CARD' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <User size={16} /> CARD
          </button>
          <button 
            onClick={() => setActiveTab('MAP')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'MAP' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Map size={16} /> WORLD
          </button>
          <button 
            onClick={() => setActiveTab('DOJO')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'DOJO' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Brain size={16} /> AI DOJO
          </button>
           <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'SETTINGS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Settings size={16} />
          </button>
      </div>

      {activeTab === 'MAP' && (
          <div className="animate-fade-in-up">
              <StoryMap currentNetWorth={netWorth} />
          </div>
      )}

      {activeTab === 'SETTINGS' && (
          <div className="animate-fade-in-up">
              <DifficultySelector />
          </div>
      )}

      {activeTab === 'DOJO' && (
          <div className="animate-fade-in-up">
              <AITrainingDojo onClose={() => setActiveTab('CARD')} addPoints={addPoints} />
          </div>
      )}

      {activeTab === 'CARD' && (
      <div className="space-y-8 animate-fade-in">
        {/* Trainer Card */}
        <div className="bg-slate-800 rounded-xl p-1 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <div className="bg-gradient-to-br from-slate-100 to-slate-300 rounded-lg p-6 border-4 border-slate-700 relative overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                {/* Trainer Info */}
                <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white border-2 border-slate-400">
                    <User size={32} />
                    </div>
                    <div>
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">Trainer Card</h2>
                    <p className="text-slate-600 font-mono">ID: {userState.level.toString().padStart(5, '0')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                    <p className="text-slate-500 uppercase text-xs">Name</p>
                    <p className="font-bold text-slate-800">Player One</p>
                    </div>
                    <div>
                    <p className="text-slate-500 uppercase text-xs">Money (Pts)</p>
                    <p className="font-bold text-slate-800">${userState.points}</p>
                    </div>
                    <div>
                    <p className="text-slate-500 uppercase text-xs">FinMon</p>
                    <p className="font-bold text-slate-800">{userState.finMon.name}</p>
                    </div>
                    <div>
                    <p className="text-slate-500 uppercase text-xs">Net Worth</p>
                    <p className="font-bold text-slate-800">${netWorth.toLocaleString()}</p>
                    </div>
                </div>

                {/* Badges Strip */}
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-2 rounded-lg inline-flex gap-2">
                    {badges.map((b) => (
                        <div key={b.id} className={`w-8 h-8 rounded-full border-2 border-white/20 ${userState.level >= b.id ? b.color : 'bg-slate-700'}`} title={b.name}></div>
                    ))}
                    </div>
                    <button 
                    onClick={() => setIsDexOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border-2 border-red-800 shadow-md transition-all active:translate-y-0.5"
                    >
                    <BookOpen size={16} /> FinDex
                    </button>
                </div>
                </div>

                {/* Companion Visual on Card */}
                <div className="w-40 h-40 bg-slate-900/5 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                <div className="w-32 h-32">
                    <FinMon stage={userState.finMon.stage} />
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Daily Quests Section */}
            <Card title="Daily Training (Quests)">
            <div className="space-y-4">
                {dailyQuests.map((quest) => {
                const isDone = quest.current >= quest.target;
                const isClaimed = userState.dailyStats.claimedQuests.includes(quest.id);
                const percent = Math.min(100, (quest.current / quest.target) * 100);

                return (
                    <div key={quest.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isDone ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <quest.icon size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{quest.title}</h4>
                            <p className="text-xs text-slate-500">{quest.desc}</p>
                        </div>
                        </div>
                        {isDone && !isClaimed ? (
                        <button 
                            onClick={() => handleClaimDaily(quest.id, quest.reward)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm animate-pulse"
                        >
                            Claim {quest.reward} XP
                        </button>
                        ) : isClaimed ? (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Done
                        </span>
                        ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {quest.current}/{quest.target}
                        </span>
                        )}
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                        className={`h-full transition-all ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                    </div>
                );
                })}
            </div>
            </Card>

            {/* Level Progress */}
            <Card title="Level Progress">
            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="mb-4 text-center">
                <p className="text-sm text-slate-500">Level {userState.level}</p>
                <h3 className="text-3xl font-black text-indigo-600">{userState.points} XP</h3>
                <p className="text-xs text-slate-400">Next Level: {nextLevel} XP</p>
                </div>
                
                <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden border border-slate-300 relative">
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold z-10">
                    {progress.toFixed(0)}%
                </div>
                <div style={{ width: `${progress}%` }} className="h-full bg-indigo-500 relative z-0 stripe-pattern"></div>
                </div>
            </div>
            </Card>
        </div>

        {/* Lifetime Achievements */}
        <Card title="Lifetime Achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => {
                const isUnlocked = ach.condition(userState);
                const isClaimed = (userState.achievements || []).includes(ach.id);

                return (
                <div 
                    key={ach.id} 
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    isClaimed 
                        ? 'bg-green-50 border-green-200' 
                        : isUnlocked 
                        ? 'bg-white border-yellow-400 shadow-md ring-2 ring-yellow-100'
                        : 'bg-slate-50 border-slate-200 opacity-70 grayscale'
                    }`}
                >
                    <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${isClaimed ? 'bg-green-200 text-green-700' : isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                        {isUnlocked || isClaimed ? <ach.icon size={20} /> : <Lock size={20} />}
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isClaimed ? 'text-green-800' : 'text-slate-800'}`}>{ach.title}</h4>
                        <p className="text-xs text-slate-500">{ach.description}</p>
                    </div>
                    </div>

                    {isUnlocked && !isClaimed && (
                    <button 
                        onClick={() => handleClaimAchievement(ach.id, ach.reward)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-2 rounded-lg shadow-sm animate-bounce"
                    >
                        Claim {ach.reward} XP
                    </button>
                    )}
                    {isClaimed && (
                    <CheckCircle size={20} className="text-green-500" />
                    )}
                </div>
                );
            })}
            </div>
        </Card>
      </div>
      )}

      {/* FinDex Modal (Preserved) */}
      {isDexOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative border-4 border-slate-200">
            <button 
              onClick={() => setIsDexOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="text-red-600" /> FinDex
              </h2>
              <p className="text-sm text-slate-500">Encyclopedia of Financial Monsters</p>
            </div>

            <div className="p-6 space-y-6">
              {FIN_DEX.map((entry, index) => {
                const isUnlocked = userState.level >= entry.minLevel;
                const isCurrent = userState.finMon.stage === entry.stage;

                return (
                  <div key={entry.stage} className={`flex gap-4 p-4 rounded-xl border-2 transition-all ${
                    isCurrent ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' : 
                    isUnlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                  }`}>
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2">
                      {isUnlocked ? (
                         <div className="w-20 h-20">
                           <FinMon stage={entry.stage as 1|2|3|4} />
                         </div>
                      ) : (
                         <div className="text-4xl">?</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            {isUnlocked ? entry.name : '??????'}
                            {isCurrent && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">Current Partner</span>}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 uppercase">{entry.title}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-400">No. 00{entry.stage}</span>
                      </div>
                      
                      <p className="text-sm text-slate-600 italic leading-relaxed">
                        {isUnlocked ? entry.desc : 'Reach a higher level to discover data on this FinMon species.'}
                      </p>
                      
                      {!isUnlocked && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-500">
                          <ArrowRight size={12} />
                          Unlocks at Trainer Level {entry.minLevel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
