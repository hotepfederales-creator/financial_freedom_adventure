import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { ProfLedgerAvatar } from '../ProfLedgerAvatar';

const TUTORIAL_STEPS = [
  {
    id: 'intro',
    message: "Welcome, Rookie! Before we begin, we must calibrate your FinMon's shield. Go to your Item Bag and enter your Monthly Income.",
    targetId: 'budget-input', // ID in BudgetPlanner
    actionRequired: 'SET_INCOME'
  },
  {
    id: 'hatch',
    message: "Look! The energy from your income is hatching the egg! Go to the Cockpit and CLICK IT to meet your partner.",
    targetId: 'finmon-display', // ID in Dashboard
    actionRequired: 'CLICK_EGG'
  },
  {
    id: 'battle',
    message: "A wild Expense appeared! Quick, go to Item Bag and log a small purchase (like Coffee) to see how it affects HP.",
    targetId: 'add-transaction-btn', // ID in BudgetPlanner
    actionRequired: 'ADD_EXPENSE'
  }
];

export const TutorialLevel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, completeTutorial } = useUser();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // If no profile or tutorial already done, render normal children
  if (!profile || profile.hasCompletedTutorial) return <>{children}</>;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const advanceStep = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTutorial();
    }
  };

  // This function is passed down to children so they can trigger the next step
  const handleAction = (action: string) => {
    if (action === currentStep.actionRequired) {
      advanceStep();
    }
  };

  return (
    <div className="relative h-full">
      {/* Render the actual app behind the tutorial layer.
          We use React.cloneElement to inject the handler into the main App component 
          if it's a direct child, OR we rely on the App to pass it down. 
          Since `children` here is the entire App structure, we just assume the child (App) 
          will accept `onTutorialAction` prop if we clone it, 
          OR we use a Context approach. 
          
          For this specific implementation, we will clone the child.
      */}
      {React.isValidElement(children) 
        ? React.cloneElement(children as React.ReactElement<any>, { onTutorialAction: handleAction })
        : children
      }

      {/* Tutorial Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-slate-900/95 border-t-4 border-yellow-400 z-[9999] flex items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-800 flex items-center justify-center shadow-lg relative -top-8">
           <ProfLedgerAvatar className="w-16 h-16 md:w-20 md:h-20" emotion="happy" />
        </div>
        <div className="flex-1 pb-2">
          <p className="font-pixel text-yellow-400 text-lg mb-1 tracking-widest">PROFESSOR LEDGER</p>
          <p className="text-white font-data text-sm md:text-base leading-relaxed">{currentStep.message}</p>
        </div>
        <div className="flex flex-col gap-2">
            <button 
                onClick={advanceStep} 
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold text-xs uppercase shadow-md"
            >
                Skip Step
            </button>
        </div>
      </div>
      
      {/* Spotlight Effect Style */}
      <style>{`
        #${currentStep.targetId} {
          position: relative;
          z-index: 50;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85);
          border: 2px solid #fbbf24;
          animation: pulse-border 2s infinite;
        }
        @keyframes pulse-border {
            0% { border-color: #fbbf24; }
            50% { border-color: #f59e0b; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85), 0 0 20px #fbbf24; }
            100% { border-color: #fbbf24; }
        }
      `}</style>
    </div>
  );
};