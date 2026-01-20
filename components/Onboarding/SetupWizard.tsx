import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { AVATAR_OPTIONS } from '../../types/userProfile';
import { User, Target, CheckCircle } from 'lucide-react';

export const SetupWizard: React.FC = () => {
  const { updateProfile } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', goal: '', avatar: AVATAR_OPTIONS[0].id });

  const handleNext = () => {
    if (step === 3) {
      // Save and Start Game
      updateProfile({
        name: formData.name,
        financialGoal: formData.goal,
        trainerAvatar: formData.avatar,
        hasCompletedTutorial: false, // Triggers tutorial mode
        monthlyIncome: 0,
        starterColor: 'BLUE' // Default
      });
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-[200]">
       {/* Background Animation */}
       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black animate-pulse"></div>
       
      <div className="bg-slate-800 border-4 border-indigo-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative z-10 animate-bounce-in">
        <h1 className="text-3xl font-pixel text-yellow-400 mb-6 tracking-widest">TRAINER REGISTRATION</h1>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all ${step === i ? 'w-8 bg-yellow-400' : 'w-2 bg-slate-600'}`}></div>
            ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-400">
                <User size={32} className="text-indigo-200"/>
            </div>
            <label className="block text-indigo-200 mb-2 font-bold font-pixel text-xl">Identify Yourself</label>
            <input 
              className="w-full bg-slate-900 border-2 border-slate-600 p-4 rounded-xl text-white mb-4 focus:border-yellow-400 outline-none text-center font-bold text-lg"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Enter Name..."
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <label className="block text-indigo-200 mb-6 font-bold font-pixel text-xl">Select Avatar</label>
            <div className="flex justify-center gap-4 mb-6">
              {AVATAR_OPTIONS.map(avi => (
                <button 
                  key={avi.id}
                  onClick={() => setFormData({...formData, avatar: avi.id})}
                  className={`p-2 rounded-xl border-4 transition-all transform hover:scale-105 ${formData.avatar === avi.id ? 'border-yellow-400 bg-indigo-900 scale-110 shadow-lg shadow-yellow-400/20' : 'border-transparent bg-slate-700 opacity-70'}`}
                >
                  <img src={avi.src} alt={avi.label} className="w-16 h-16 rounded-full bg-white" />
                  <p className={`text-xs mt-2 font-bold ${formData.avatar === avi.id ? 'text-yellow-400' : 'text-slate-400'}`}>{avi.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-400">
                <Target size={32} className="text-emerald-200"/>
            </div>
            <label className="block text-indigo-200 mb-2 font-bold font-pixel text-xl">Mission Objective</label>
            <p className="text-slate-400 text-xs mb-4">What is your primary financial goal?</p>
            <textarea 
              className="w-full bg-slate-900 border-2 border-slate-600 p-4 rounded-xl text-white mb-4 h-32 focus:border-emerald-400 outline-none resize-none"
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
              placeholder="e.g., Pay off Student Loans, Buy a House, Save $10k..."
            />
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={step === 1 && !formData.name || step === 3 && !formData.goal}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:translate-y-1 flex items-center justify-center gap-2"
        >
          {step === 3 ? <><CheckCircle size={20}/> PRINT LICENSE & START</> : 'NEXT >'}
        </button>
      </div>
    </div>
  );
};