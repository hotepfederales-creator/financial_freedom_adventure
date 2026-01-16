import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, Calculator, MessageSquare, Award, Menu, X } from 'lucide-react';
import { UserState } from './types';
import { Dashboard } from './components/Dashboard';
import { BudgetPlanner } from './components/BudgetPlanner';
import { TaxEstimator } from './components/TaxEstimator';
import { FinancialChat } from './components/FinancialChat';
import { GamificationHub } from './components/GamificationHub';

const INITIAL_STATE: UserState = {
  points: 0,
  level: 1,
  transactions: [],
  goals: [],
  monthlyIncome: 0,
  achievements: []
};

type View = 'dashboard' | 'budget' | 'tax' | 'chat' | 'gamification';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('finquest_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('finquest_state', JSON.stringify(userState));
  }, [userState]);

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

  const SidebarLink = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userState={userState} />;
      case 'budget':
        return <BudgetPlanner userState={userState} onUpdateUser={updateUser} addPoints={addPoints} />;
      case 'tax':
        return <TaxEstimator addPoints={addPoints} />;
      case 'chat':
        return <FinancialChat addPoints={addPoints} />;
      case 'gamification':
        return <GamificationHub userState={userState} />;
      default:
        return <Dashboard userState={userState} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between">
         <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Financial Tracker</h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-8 px-2 hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              FinQuest AI
            </h1>
          </div>

          <div className="space-y-2 flex-1">
            <SidebarLink view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink view="budget" icon={Wallet} label="Budget Planner" />
            <SidebarLink view="tax" icon={Calculator} label="Tax Estimator" />
            <SidebarLink view="chat" icon={MessageSquare} label="AI Advisor" />
            <SidebarLink view="gamification" icon={Award} label="My Progress" />
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {userState.level}
               </div>
               <div>
                 <p className="text-xs text-slate-500">Current Level</p>
                 <p className="text-sm font-bold text-slate-800">{userState.points} pts</p>
               </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
