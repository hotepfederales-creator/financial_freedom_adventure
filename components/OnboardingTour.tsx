
import React, { useState } from 'react';
import { ChevronRight, LayoutDashboard, Wallet, MessageSquare, Award, Ghost, X, Heart, TrendingUp, Minus, Plus, ArrowUpCircle } from 'lucide-react';
import { FinMon } from './FinMon';
import posthog from 'posthog-js';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    id: 'welcome',
    title: "Welcome to FinQuest!",
    desc: "Your journey to financial mastery starts here. Raise your FinMon companion by making smart money moves.",
    icon: Ghost,
    color: "bg-indigo-600"
  },
  {
    id: 'battle',
    title: "The Battle Zone",
    desc: "Your Dashboard is your command center. Monitor your HP (Savings) and Damage (Expenses). Keep your HP high to survive!",
    icon: LayoutDashboard,
    color: "bg-slate-800"
  },
  {
    id: 'mood',
    title: "Mood Mechanics",
    desc: "Your FinMon reacts to your budget health. >50% Savings = Happy. <20% Savings = Sad. To cheer it up, log more Income or reduce Expenses!",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    id: 'evo',
    title: "Evolution & Growth",
    desc: "Every smart decision earns XP. As you level up, your FinMon evolves from an Egg to a Legendary beast. Your financial habits shape its form!",
    icon: TrendingUp,
    color: "bg-purple-600"
  },
  {
    id: 'budget',
    title: "Item Bag (Budget)",
    desc: "Log your income and expenses here. Every smart decision earns you XP. Use the AI Analyst to find hidden savings.",
    icon: Wallet,
    color: "bg-green-600"
  },
  {
    id: 'chat',
    title: "Professor Ledger",
    desc: "Confused about taxes or debt? Chat with the Professor. He evolves from grumpy to helpful as you level up!",
    icon: MessageSquare,
    color: "bg-blue-600"
  },
  {
    id: 'card',
    title: "Trainer Card",
    desc: "Track your quests, achievements, and FinDex progress here. Complete daily tasks to grow your FinMon faster.",
    icon: Award,
    color: "bg-yellow-500"
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // --- Interactive Demo States ---
  const [demoHp, setDemoHp] = useState(80);
  const [demoSavings, setDemoSavings] = useState(60);
  const [demoStage, setDemoStage] = useState<1|2|3|4>(1);

  if (!isOpen) return null;

  const handleNext = () => {
    // Analytics: Track Step Completion
    posthog.capture('Tutorial Step Completed', {
      step_index: currentStep,
      step_id: STEPS[currentStep].id,
      step_title: STEPS[currentStep].title
    });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Analytics: Track Full Completion
      posthog.capture('Tutorial Completed', {
        total_steps: STEPS.length
      });
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Analytics: Track Skip/Drop-off
    posthog.capture('Tutorial Skipped', {
      step_index: currentStep,
      step_id: STEPS[currentStep].id
    });
    onComplete();
  };

  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  // Render Interactive Content based on current step
  const renderInteractiveDemo = () => {
    switch (currentStepData.id) {
        case 'battle':
            return (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full mt-4 animate-fade-in-up">
                    <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-1">
                        <span>HP (Budget)</span>
                        <span>{demoHp}%</span>
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-4 border border-slate-300">
                        <div 
                            className={`h-full transition-all duration-300 ${demoHp > 50 ? 'bg-green-500' : demoHp > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{width: `${demoHp}%`}}
                        ></div>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => setDemoHp(Math.max(0, demoHp - 20))} 
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1 active:scale-95"
                        >
                           <Minus size={14} /> Spend
                        </button>
                        <button 
                            onClick={() => setDemoHp(Math.min(100, demoHp + 20))} 
                            className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors flex items-center gap-1 active:scale-95"
                        >
                           <Plus size={14} /> Save
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2 italic">Try the buttons!</p>
                </div>
            );

        case 'mood':
            const mood = demoSavings > 50 ? 'happy' : demoSavings > 20 ? 'neutral' : 'sad';
            return (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full mt-4 flex items-center gap-6 animate-fade-in-up">
                     <div className="w-20 h-20 flex-shrink-0 bg-white rounded-full p-2 shadow-sm border border-slate-100">
                        <FinMon stage={2} mood={mood} />
                     </div>
                     <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex justify-between mb-2">
                            Savings Rate <span>{demoSavings}%</span>
                        </label>
                        <input 
                            type="range" min="0" max="100" value={demoSavings} 
                            onChange={(e) => setDemoSavings(Number(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                        <p className="text-xs text-center mt-2 font-bold transition-colors duration-300" style={{color: mood === 'happy' ? '#22c55e' : mood === 'neutral' ? '#eab308' : '#ef4444'}}>
                            FinMon is {mood.toUpperCase()}!
                        </p>
                     </div>
                </div>
            );

        case 'evo':
             return (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full mt-4 flex items-center justify-between animate-fade-in-up px-6">
                     <div className="w-24 h-24 transition-all duration-500">
                        <FinMon stage={demoStage} mood="happy" />
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stage {demoStage}</div>
                        <button 
                            onClick={() => setDemoStage(prev => prev < 4 ? prev + 1 as any : 1)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                        >
                            <ArrowUpCircle size={16} />
                            {demoStage === 4 ? 'Rebirth' : 'Level Up'}
                        </button>
                     </div>
                </div>
            );
        
        default:
            return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full flex-shrink-0">
           <div 
             className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
             style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
           ></div>
        </div>

        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-4 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
           <div className={`w-20 h-20 rounded-2xl ${currentStepData.color} text-white flex items-center justify-center shadow-lg mb-6 transform transition-all duration-300 hover:scale-110 rotate-3 flex-shrink-0`}>
             <StepIcon size={40} />
           </div>
           
           <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
             {currentStepData.title}
           </h2>
           <p className="text-slate-600 leading-relaxed text-lg">
             {currentStepData.desc}
           </p>

           {/* Interactive Demo Section */}
           {renderInteractiveDemo()}
        </div>

        <div className="p-8 pt-4 flex items-center justify-between mt-auto bg-white border-t border-slate-50 flex-shrink-0">
           <div className="flex gap-1">
             {STEPS.map((_, idx) => (
               <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-indigo-600' : 'bg-slate-300'}`} />
             ))}
           </div>

           <div className="flex gap-3">
             {currentStep > 0 && (
               <button 
                 onClick={handlePrev}
                 className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
               >
                 Back
               </button>
             )}
             <button 
               onClick={handleNext}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
             >
               {currentStep === STEPS.length - 1 ? "Start Journey" : "Next"}
               {currentStep !== STEPS.length - 1 && <ChevronRight size={18} />}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};
