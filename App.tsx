
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Wallet, Calculator, MessageSquare, Award, Menu, X, Ghost, LogOut, Swords, AlertTriangle, Footprints, ShoppingBag } from 'lucide-react';
import { UserState, DailyStats } from './types';
import { Dashboard } from './components/Dashboard';
import { BudgetPlanner } from './components/BudgetPlanner';
import { TaxEstimator } from './components/TaxEstimator';
import { FinancialChat } from './components/FinancialChat';
import { GamificationHub } from './components/GamificationHub';
import { EvolutionScene } from './components/EvolutionScene';
import { OnboardingTour } from './components/OnboardingTour';
import { SocialRaids } from './components/SocialRaids';
import { Marketplace } from './components/Marketplace';
import { useWildNudge } from './hooks/useWildNudge';
import { DevControlPanel } from './components/DevTools/DevControlPanel';
import { RaidBoss } from './types/raidTypes';

const getToday = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: UserState = {
  points: 0,
  level: 1,
  trainerName: 'Rookie',
  transactions: [],
  monthlyIncome: 0,
  achievements: [],
  finMon: {
    name: 'Coinlet',
    species: 'Coinlet',
    stage: 1,
    mood: 'neutral'
  },
  dailyStats: {
    date: getToday(),
    expensesLogged: 0,
    chatMessagesSent: 0,
    budgetAnalyzed: 0,
    claimedQuests: []
  },
  finMonChatHistory: [],
  ledgerChatHistory: [
    {
      id: 'init-story',
      role: 'model',
      text: "Welcome to the Region of Econo! I am Professor Ledger. I study the strange creatures known as 'FinMons'—spirits that are powered by financial habits. Look! A wild 'Debt-to-Income Ratio' is attacking your starter egg! Quick, we need to defend it! Do you have a budget?",
      timestamp: Date.now()
    }
  ],
  storyFlags: {
    introSeen: true,
    incomeSetSeen: false,
    expenseLoggedSeen: false
  }
};

type View = 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification' | 'raids' | 'market';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => {
    // Only access localStorage on client mount (handled by effect in Next.js, but standard check for React)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finmon_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.dailyStats) parsed.dailyStats = INITIAL_STATE.dailyStats;
        if (!parsed.finMonChatHistory) parsed.finMonChatHistory = [];
        // Migration for new story features
        if (!parsed.ledgerChatHistory) parsed.ledgerChatHistory = INITIAL_STATE.ledgerChatHistory;
        if (!parsed.storyFlags) parsed.storyFlags = INITIAL_STATE.storyFlags;
        return parsed;
      }
    }
    return INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Wild Nudge Hook
  const { activeNudge, dismissNudge, triggerNudge } = useWildNudge();
  
  // Evolution Animation State
  const [evolutionData, setEvolutionData] = useState<{from: 1|2|3|4, to: 1|2|3|4} | null>(null);
  const prevStageRef = useRef<1|2|3|4>(userState.finMon.stage);

  // God Mode Raid State
  const [raidBoss, setRaidBoss] = useState<RaidBoss>({
    id: 'raid_1',
    name: 'The Student Loan Serpent',
    description: 'A massive snake made of promissory notes. It grows if left unchecked!',
    totalHp: 50000,
    currentHp: 32450,
    image: '🐍',
    deadline: '7 Days',
    difficulty: 'Hard'
  });

  useEffect(() => {
    localStorage.setItem('finmon_state', JSON.stringify(userState));
  }, [userState]);

  // Check for first time visit
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('finmon_has_onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('finmon_has_onboarded', 'true');
    setShowOnboarding(false);
  };

  // Daily Reset Logic
  useEffect(() => {
    const today = getToday();
    if (userState.dailyStats.date !== today) {
      setUserState(prev => ({
        ...prev,
        dailyStats: {
          date: today,
          expensesLogged: 0,
          chatMessagesSent: 0,
          budgetAnalyzed: 0,
          claimedQuests: []
        }
      }));
    }
  }, [userState.dailyStats.date]);

  // Evolution Logic
  useEffect(() => {
    setUserState(prev => {
      let newStage: 1 | 2 | 3 | 4 = prev.finMon.stage;
      let newName = prev.finMon.name;
      
      if (prev.level >= 10) { newStage = 4; newName = 'Ledgerazard'; }
      else if (prev.level >= 5) { newStage = 3; newName = 'Wealthasaur'; }
      else if (prev.level >= 2) { newStage = 2; newName = 'Cashmander'; }
      else { newStage = 1; newName = 'Coinlet'; }

      if (newStage !== prev.finMon.stage) {
        return {
          ...prev,
          finMon: { ...prev.finMon, stage: newStage, name: newName }
        };
      }
      return prev;
    });
  }, [userState.level]);

  useEffect(() => {
    if (userState.finMon.stage > prevStageRef.current) {
        setEvolutionData({
            from: prevStageRef.current,
            to: userState.finMon.stage
        });
    }
    prevStageRef.current = userState.finMon.stage;
  }, [userState.finMon.stage]);

  const updateUser = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const addPoints = (amount: number) => {
    setUserState(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  const incrementDailyStat = (key: keyof Omit<DailyStats, 'date' | 'claimedQuests'>) => {
    setUserState(prev => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        [key]: prev.dailyStats[key] + 1
      }
    }));
  };

  const handleWalkAway = () => {
    addPoints(50);
    dismissNudge();
  };

  // Dev Tools Handlers
  const handleGodModeDamage = (amount: number) => {
    setRaidBoss(prev => ({
      ...prev,
      currentHp: Math.max(0, prev.currentHp - amount)
    }));
  };

  const handleTriggerEvolution = (form: string) => {
     // Force an evolution animation for testing
     const next = userState.finMon.stage === 4 ? 1 : userState.finMon.stage + 1 as any;
     setEvolutionData({ from: userState.finMon.stage, to: next });
  };

  const SidebarLink = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left font-semibold text-sm tracking-wide group ${
          isActive 
            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span>{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard userState={userState} onUpdateUser={updateUser} onNavigate={setCurrentView} />;
      case 'budget': return <BudgetPlanner userState={userState} onUpdateUser={updateUser} addPoints={addPoints} incrementDailyStat={incrementDailyStat} />;
      case 'tax': return <TaxEstimator userState={userState} addPoints={addPoints} />;
      case 'chat': return <FinancialChat userState={userState} onUpdateUser={updateUser} addPoints={addPoints} incrementDailyStat={incrementDailyStat} />;
      case 'gamification': return <GamificationHub userState={userState} onUpdateUser={updateUser} addPoints={addPoints} />;
      case 'raids': return <SocialRaids externalRaidData={raidBoss} />;
      case 'market': return <Marketplace userState={userState} addPoints={addPoints} />;
      default: return <Dashboard userState={userState} onUpdateUser={updateUser} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <OnboardingTour isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      
      <DevControlPanel 
         triggerNudge={triggerNudge}
         triggerEvolution={handleTriggerEvolution}
         damageBoss={handleGodModeDamage}
      />

      {/* Wild Nudge Modal */}
      {activeNudge && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-red-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500 animate-bounce-gentle">
              <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={20}/> Wild Nudge!</span>
                  <button onClick={dismissNudge}><X size={20}/></button>
              </div>
              <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🚨</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{activeNudge.name} Detected</h3>
                  <p className="text-slate-600 mb-6">{activeNudge.message}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={dismissNudge}
                        className="py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-50"
                      >
                         Spend it...
                      </button>
                      <button 
                        onClick={handleWalkAway}
                        className="py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
                      >
                         <Footprints size={18} /> Walk Away (+50 XP)
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {evolutionData && (
        <EvolutionScene 
          fromStage={evolutionData.from}
          toStage={evolutionData.to}
          finMonName={userState.finMon.name}
          onClose={() => setEvolutionData(null)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md text-slate-900 z-50 px-4 flex items-center justify-between border-b border-slate-200">
         <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-red-600">
            <Ghost size={24} /> FinMon
         </h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <div className="bg-red-600 text-white p-2 rounded-lg shadow-lg shadow-red-500/30">
                <Ghost size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter italic">FINMON</h1>
            </div>
            <p className="text-xs font-semibold text-slate-400 pl-1 tracking-widest uppercase">Gotta Save 'Em All</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</div>
            <SidebarLink view="dashboard" icon={LayoutDashboard} label="Battle Zone" />
            <SidebarLink view="budget" icon={Wallet} label="Item Bag" />
            <SidebarLink view="tax" icon={Calculator} label="Tax Gym" />
            <SidebarLink view="market" icon={ShoppingBag} label="EconoMart" />
            <div className="my-4 border-t border-slate-100"></div>
            <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Social</div>
            <SidebarLink view="chat" icon={MessageSquare} label="Prof. Ledger" />
            <SidebarLink view="raids" icon={Swords} label="Raid Battles" />
            <SidebarLink view="gamification" icon={Award} label="Trainer Card" />
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setCurrentView('gamification')}>
               <div className="relative">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-white shadow-md flex items-center justify-center text-yellow-900 font-black text-lg group-hover:scale-110 transition-transform">
                    {userState.level}
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white font-bold">
                   Lvl
                 </div>
               </div>
               <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trainer</p>
                 <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{userState.points} XP</p>
               </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50/50">
        <div className="max-w-7xl mx-auto p-4 lg:p-10 pt-20 lg:pt-10">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'budget' && 'Budget & Expenses'}
                {currentView === 'tax' && 'Tax Estimator'}
                {currentView === 'chat' && 'Professor Ledger'}
                {currentView === 'raids' && 'Co-op Raid Battles'}
                {currentView === 'market' && 'EconoMart'}
                {currentView === 'gamification' && 'Trainer Profile'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </header>
          
          <div className="animate-fade-in-up">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
