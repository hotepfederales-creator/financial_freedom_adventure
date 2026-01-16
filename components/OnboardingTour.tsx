
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, LayoutDashboard, Wallet, MessageSquare, Award, Ghost, X, Heart, TrendingUp } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to FinQuest!",
    desc: "Your journey to financial mastery starts here. Raise your FinMon companion by making smart money moves.",
    icon: Ghost,
    color: "bg-indigo-600"
  },
  {
    title: "The Battle Zone",
    desc: "Your Dashboard is your command center. Monitor your HP (Savings) and Damage (Expenses). Keep your HP high to survive!",
    icon: LayoutDashboard,
    color: "bg-slate-800"
  },
  {
    title: "Mood Mechanics",
    desc: "Your FinMon reacts to your budget health. >50% Savings = Happy. <20% Savings = Sad. To cheer it up, log more Income or reduce Expenses!",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    title: "Evolution & Growth",
    desc: "Every smart decision earns XP. As you level up, your FinMon evolves from an Egg to a Legendary beast. Your financial habits shape its form!",
    icon: TrendingUp,
    color: "bg-purple-600"
  },
  {
    title: "Item Bag (Budget)",
    desc: "Log your income and expenses here. Every smart decision earns you XP. Use the AI Analyst to find hidden savings.",
    icon: Wallet,
    color: "bg-green-600"
  },
  {
    title: "Professor Ledger",
    desc: "Confused about taxes or debt? Chat with the Professor. He evolves from grumpy to helpful as you level up!",
    icon: MessageSquare,
    color: "bg-blue-600"
  },
  {
    title: "Trainer Card",
    desc: "Track your quests, achievements, and FinDex progress here. Complete daily tasks to grow your FinMon faster.",
    icon: Award,
    color: "bg-yellow-500"
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const StepIcon = STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200">
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
           <div 
             className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
             style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
           ></div>
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-0 flex flex-col items-center text-center">
           <div className={`w-20 h-20 rounded-2xl ${STEPS[currentStep].color} text-white flex items-center justify-center shadow-lg mb-6 transform transition-all duration-300 hover:scale-110 rotate-3`}>
             <StepIcon size={40} />
           </div>
           
           <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
             {STEPS[currentStep].title}
           </h2>
           <p className="text-slate-600 leading-relaxed text-lg">
             {STEPS[currentStep].desc}
           </p>
        </div>

        <div className="p-8 flex items-center justify-between mt-4">
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
