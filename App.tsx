import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Wallet, Calculator, MessageSquare, Award, Menu, X, Ghost, LogOut, Swords, AlertTriangle, Footprints, ShoppingBag, Terminal, Book, Map, BrainCircuit, Settings } from 'lucide-react';
import { UserState, DailyStats, Difficulty } from './types';
import { Dashboard } from './components/Dashboard';
import { BudgetPlanner } from './components/BudgetPlanner';
import { TaxEstimator } from './components/TaxEstimator';
import { FinancialChat } from './components/FinancialChat';
import { GamificationHub } from './components/GamificationHub';
import { EvolutionScene } from './components/EvolutionScene';
import { OnboardingTour } from './components/OnboardingTour';
import { SocialRaids } from './components/SocialRaids';
import { Marketplace } from './components/Marketplace';
import { StoryMap } from './components/Campaign/StoryMap';
import { AITrainingDojo } from './components/AI/AITrainingDojo';
import { DifficultySelector } from './components/Settings/DifficultySelector';
import { FeedbackWidget } from './components/FeedbackWidget';
import { useWildNudge } from './hooks/useWildNudge';
import { useEvolutionLogic } from './hooks/useEvolutionLogic';
import { DevControlPanel } from './components/DevTools/DevControlPanel';
import { RaidBoss } from './types/raidTypes';
import { useAppUpdate } from './hooks/useAppUpdate';
import { ChangelogModal } from './components/Updates/ChangelogModal';
import { TrainerHandbookModal } from './components/TrainerHandbookModal';
import { DamageFeedback } from './components/Visuals/DamageFeedback';
import { APP_VERSION } from './data/changelog';
import posthog from 'posthog-js';
import { useUser } from './context/UserContext';
import { SetupWizard } from './components/Onboarding/SetupWizard';
import { TutorialLevel } from './components/Onboarding/TutorialLevel';
import { AVATAR_OPTIONS } from './types/userProfile';

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
      text: "Hmph. I see you've arrived. I am Professor Ledger. I suppose you want to learn about FinMons? Well, don't just stand there gawking at my mustache! We have work to do. First things first: I need to know how much 'Power' (Income) we are working with to feed your egg. Go to your Item Bag and set it up!",
      timestamp: Date.now()
    }
  ],
  storyFlags: {
    introSeen: true,
    incomeSetSeen: false,
    expenseLoggedSeen: false
  },
  difficulty: 'NOVICE'
};

type View = 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification' | 'raids' | 'market' | 'campaign' | 'dojo' | 'settings';

// Prop interface for App to accept tutorial actions
interface AppProps {
    onTutorialAction?: (action: string) => void;
}

const App: React.FC<AppProps> = ({ onTutorialAction }) => {
  const { profile, isLoading: isUserLoading } = useUser();

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
        if (!parsed.difficulty) parsed.difficulty = 'NOVICE';
        return parsed;
      }
    }
    return INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  
  // Wild Nudge Hook
  const { activeNudge, dismissNudge, triggerNudge } = useWildNudge();
  
  // Update Checker Hook
  const { showChangelog, dismissChangelog } = useAppUpdate();

  // Evolution Logic Hook
  const { checkEvolution } = useEvolutionLogic();

  // Evolution Animation State
  const [evolutionData, setEvolutionData] = useState<{from: 1|2|3|4, to: 1|2|3|4, species?: string} | null>(null);
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

  // Sync Profile Name to UserState
  useEffect(() => {
    if (profile && profile.name !== userState.trainerName) {
        setUserState(prev => ({ ...prev, trainerName: profile.name }));
    }
  }, [profile]);

  // Analytics: Track View Changes
  useEffect(() => {
    posthog.capture('$pageview', {
      '$current_url': `${window.location.origin}/${currentView}`
    });
  }, [currentView]);

  // Check for first time visit (Old Onboarding logic kept for robustness, but TutorialLevel supercedes)
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('finmon_has_onboarded');
    if (!hasOnboarded && profile?.hasCompletedTutorial) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('finmon_has_onboarded', 'true');
    setShowOnboarding(false);
    setIsHandbookOpen(true); // Open handbook after onboarding
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

  // Base Linear Evolution Logic (Stage 1->3)
  useEffect(() => {
    setUserState(prev => {
      // Don't downgrade or override special species if already set
      if (['SQUIRREL', 'HAWK', 'TORTOISE', 'PHOENIX'].includes(prev.finMon.species)) {
        return prev;
      }

      let newStage: 1 | 2 | 3 | 4 = prev.finMon.stage;
      let newName = prev.finMon.name;
      
      // Standard Line
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

  // Trigger Evolution Animation when stage changes
  useEffect(() => {
    if (userState.finMon.stage > prevStageRef.current) {
        setEvolutionData({
            from: prevStageRef.current,
            to: userState.finMon.stage,
            species: userState.finMon.species
        });
    }
    prevStageRef.current = userState.finMon.stage;
  }, [userState.finMon.stage, userState.finMon.species]);

  const updateUser = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const addPoints = (amount: number) => {
    setUserState(prev => {
      // Apply Difficulty Multiplier
      let multiplier = 1.0;
      if (prev.difficulty === 'VETERAN') multiplier = 1.5;
      if (prev.difficulty === 'HARDCORE') multiplier = 3.0;

      const adjustedAmount = Math.floor(amount * multiplier);
      const newPoints = prev.points + adjustedAmount;
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

  const handleTriggerEvolution = async (form: string) => {
     // If manual string passed (e.g. from DevTools), force it
     if (form && form !== 'AUTO') {
        const nextStage = 4;
        setUserState(prev => ({
            ...prev,
            finMon: { ...prev.finMon, stage: nextStage, species: form as any, name: `Master ${form}` }
        }));
        return;
     }

     // Auto Logic
     const savingsRate = userState.monthlyIncome > 0 
        ? (userState.monthlyIncome - userState.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)) / userState.monthlyIncome 
        : 0;

     const result = await checkEvolution(userState.transactions, savingsRate);
     
     if (result && result.evolutionTriggered && result.suggestedForm !== 'EGG') {
         setUserState(prev => ({
             ...prev,
             finMon: { 
                 ...prev.finMon, 
                 stage: 4, 
                 species: result.suggestedForm as any,
                 name: result.suggestedForm === 'SQUIRREL' ? 'Saver Squirrel' : 
                       result.suggestedForm === 'HAWK' ? 'Investor Hawk' : 
                       result.suggestedForm === 'TORTOISE' ? 'Budget Tortoise' : 'Debt Phoenix'
             }
         }));
     } else {
         alert("No special evolution triggered yet! Keep training.");
     }
  };

  const SidebarLink = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left font-semibold text-lg tracking-wide group font-data ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
        <span>{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    // Basic calculation for Campaign Progression
    const currentBalance = userState.monthlyIncome > 0 
        ? userState.monthlyIncome - userState.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        : 0;

    switch (currentView) {
      case 'dashboard': return <Dashboard userState={userState} onUpdateUser={updateUser} onNavigate={setCurrentView} onTutorialAction={onTutorialAction} />;
      case 'budget': return <BudgetPlanner userState={userState} onUpdateUser={updateUser} addPoints={addPoints} incrementDailyStat={incrementDailyStat} onNavigate={setCurrentView} onTutorialAction={onTutorialAction} />;
      case 'tax': return <TaxEstimator userState={userState} addPoints={addPoints} />;
      case 'chat': return <FinancialChat userState={userState} onUpdateUser={updateUser} addPoints={addPoints} incrementDailyStat={incrementDailyStat} />;
      case 'gamification': return <GamificationHub userState={userState} onUpdateUser={updateUser} addPoints={addPoints} />;
      case 'raids': return <SocialRaids externalRaidData={raidBoss} />;
      case 'market': return <Marketplace userState={userState} addPoints={addPoints} />;
      case 'campaign': return <StoryMap currentNetWorth={currentBalance} />;
      case 'dojo': return <AITrainingDojo />;
      case 'settings': return <DifficultySelector currentDifficulty={userState.difficulty} onSelect={(diff) => updateUser({ difficulty: diff })} />;
      default: return <Dashboard userState={userState} onUpdateUser={updateUser} onNavigate={setCurrentView} onTutorialAction={onTutorialAction} />;
    }
  };

  // --- Loading / Setup States ---
  if (isUserLoading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading FinMon...</div>;
  if (!profile) return <SetupWizard />;

  // Wrapped App Content with Tutorial Level
  return (
    <TutorialLevel>
        <div className="flex min-h-screen bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white text-slate-100">
        
        <DamageFeedback />
        <FeedbackWidget />
        <OnboardingTour isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
        <ChangelogModal isOpen={showChangelog} onClose={dismissChangelog} />
        <TrainerHandbookModal isOpen={isHandbookOpen} onClose={() => setIsHandbookOpen(false)} />
        
        <DevControlPanel 
            triggerNudge={triggerNudge}
            triggerEvolution={handleTriggerEvolution}
            damageBoss={handleGodModeDamage}
        />

        {/* Wild Nudge Modal */}
        {activeNudge && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-red-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500 animate-bounce-gentle">
                <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                    <span className="font-black uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={20}/> Wild Nudge!</span>
                    <button onClick={dismissNudge}><X size={20}/></button>
                </div>
                <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🚨</div>
                    <h3 className="text-xl font-bold text-white mb-2 font-pixel">{activeNudge.name} Detected</h3>
                    <p className="text-slate-300 mb-6">{activeNudge.message}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={dismissNudge}
                            className="py-3 rounded-xl border-2 border-slate-600 font-bold text-slate-400 hover:bg-slate-700 hover:text-white"
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
            species={userState.finMon.species}
            />
        )}

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md text-white z-50 px-4 flex items-center justify-between border-b border-slate-700">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-red-500 font-pixel">
                <Ghost size={24} /> FinMon
            </h1>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col shadow-2xl lg:shadow-none
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-8">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                <div className="bg-red-600 text-white p-2 rounded-lg shadow-lg shadow-red-500/30">
                    <Ghost size={24} />
                </div>
                <h1 className="text-3xl font-black tracking-widest italic font-pixel text-white">FINMON</h1>
                </div>
                <p className="text-xs font-semibold text-slate-500 pl-1 tracking-widest uppercase">Gotta Save 'Em All</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 pb-2 text-xs font-bold text-slate-600 uppercase tracking-wider font-pixel">Main Menu</div>
                <SidebarLink view="dashboard" icon={LayoutDashboard} label="Cockpit" />
                <SidebarLink view="budget" icon={Wallet} label="Item Bag" />
                <SidebarLink view="campaign" icon={Map} label="Story Map" />
                <SidebarLink view="market" icon={ShoppingBag} label="EconoMart" />
                
                <div className="my-4 border-t border-slate-800"></div>
                <div className="px-4 pb-2 text-xs font-bold text-slate-600 uppercase tracking-wider font-pixel">Social & Rank</div>
                <SidebarLink view="chat" icon={MessageSquare} label="Prof. Ledger" />
                <SidebarLink view="raids" icon={Swords} label="Raid Battles" />
                <SidebarLink view="dojo" icon={BrainCircuit} label="AI Dojo" />
                <SidebarLink view="gamification" icon={Award} label="Trainer Card" />

                <div className="my-4 border-t border-slate-800"></div>
                <SidebarLink view="settings" icon={Settings} label="System Settings" />
                <SidebarLink view="tax" icon={Calculator} label="Tax Gym" />
                
                {/* Handbook Button */}
                <button
                onClick={() => {
                    setIsHandbookOpen(true);
                    setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left font-semibold text-lg tracking-wide text-indigo-400 hover:bg-slate-800 hover:text-white mt-2 font-data"
                >
                <Book size={20} className="text-indigo-500" />
                <span>Handbook</span>
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-sm flex items-center gap-4 hover:border-indigo-500 transition-colors cursor-pointer group" onClick={() => setCurrentView('gamification')}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-600 shadow-md flex items-center justify-center overflow-hidden bg-indigo-900">
                        {/* Profile Avatar */}
                        {profile?.trainerAvatar && (
                            <img 
                                src={AVATAR_OPTIONS.find(a => a.id === profile.trainerAvatar)?.src} 
                                alt="avatar" 
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{profile?.name || 'Trainer'}</p>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors font-mono">{userState.points} XP</p>
                </div>
                </div>
                
                {/* Version Marker */}
                <div className="mt-3 text-center flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <Terminal size={10} className="text-slate-500" />
                <p className="text-[10px] font-mono text-slate-500 cursor-default select-none tracking-widest">
                    SYSTEM v{APP_VERSION}
                </p>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto bg-slate-900 relative">
            {/* Background Grid */}
            <div className="fixed inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-20 lg:pt-8 relative z-10 pb-24 md:pb-8">
            <header className="mb-8 flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                <h2 className="text-3xl font-bold text-white tracking-widest font-pixel uppercase">
                    {currentView === 'dashboard' && 'COCKPIT'}
                    {currentView === 'budget' && 'ITEM BAG'}
                    {currentView === 'tax' && 'TAX GYM'}
                    {currentView === 'chat' && 'COMM-LINK'}
                    {currentView === 'raids' && 'RAID SECTOR'}
                    {currentView === 'market' && 'ECONO-MART'}
                    {currentView === 'gamification' && 'TRAINER ID'}
                    {currentView === 'campaign' && 'WORLD MAP'}
                    {currentView === 'dojo' && 'AI TRAINING'}
                    {currentView === 'settings' && 'SYSTEM CONFIG'}
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-mono">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            />
        )}
        </div>
    </TutorialLevel>
  );
};

export default App;