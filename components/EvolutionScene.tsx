import React, { useState, useEffect } from 'react';
import { FinMon } from './FinMon';
import { Sparkles } from 'lucide-react';

interface EvolutionSceneProps {
  fromStage: 1 | 2 | 3 | 4;
  toStage: 1 | 2 | 3 | 4;
  finMonName: string;
  onClose: () => void;
}

export const EvolutionScene: React.FC<EvolutionSceneProps> = ({ fromStage, toStage, finMonName, onClose }) => {
  const [phase, setPhase] = useState<'intro' | 'evolving' | 'flash' | 'reveal'>('intro');

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    // Sequence timing
    timeouts.push(setTimeout(() => setPhase('evolving'), 2000));
    timeouts.push(setTimeout(() => setPhase('flash'), 5000)); 
    timeouts.push(setTimeout(() => setPhase('reveal'), 5500));

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background Rays Animation */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <div className="w-[200vmax] h-[200vmax] bg-[conic-gradient(from_0deg,transparent_0_10deg,white_10deg_20deg,transparent_20deg_30deg,white_30deg_40deg,transparent_40deg_50deg,white_50deg_60deg,transparent_60deg_70deg,white_70deg_80deg,transparent_80deg_90deg,white_90deg_100deg,transparent_100deg_110deg,white_110deg_120deg,transparent_120deg_130deg,white_130deg_140deg,transparent_140deg_150deg,white_150deg_160deg,transparent_160deg_170deg,white_170deg_180deg,transparent_180deg_190deg,white_190deg_200deg,transparent_200deg_210deg,white_210deg_220deg,transparent_220deg_230deg,white_230deg_240deg,transparent_240deg_250deg,white_250deg_260deg,transparent_260deg_270deg,white_270deg_280deg,transparent_280deg_290deg,white_290deg_300deg,transparent_300deg_310deg,white_310deg_320deg,transparent_320deg_330deg,white_330deg_340deg,transparent_340deg_350deg,white_350deg_360deg)] animate-spin-slow origin-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md p-6 text-center">
            
            <div className="h-64 w-64 relative flex items-center justify-center">
                {/* The Monster Render */}
                <div className={`transition-all duration-300 ${
                    phase === 'intro' ? 'scale-100' :
                    phase === 'evolving' ? 'scale-110 brightness-[50] blur-[1px] shake-animation' : 
                    phase === 'flash' ? 'opacity-0 scale-150' : 
                    'scale-125 animate-bounce-gentle'
                }`}>
                    {phase === 'reveal' ? (
                        <div className="animate-fade-in-up">
                           <FinMon stage={toStage} mood="happy" />
                        </div>
                    ) : (
                        // During evolving, toggle brightness/color rapidly via CSS animation in production, or just simplistic filter here
                        <FinMon stage={fromStage} mood="neutral" className={phase === 'evolving' ? 'grayscale contrast-200' : ''} />
                    )}
                </div>

                {/* Flash Overlay */}
                {phase === 'flash' && (
                    <div className="absolute inset-0 bg-white scale-[10] animate-ping opacity-80"></div>
                )}
            </div>

            {/* Text Box */}
            <div className="bg-slate-800 border-4 border-slate-600 rounded-xl p-6 w-full shadow-2xl min-h-[140px] flex items-center justify-center relative">
                 <p className="text-xl md:text-2xl font-mono font-bold leading-relaxed">
                    {phase === 'intro' && "What? FinMon is evolving!"}
                    {phase === 'evolving' && "..."}
                    {phase === 'flash' && "..."}
                    {phase === 'reveal' && (
                        <span className="flex flex-col items-center gap-2 justify-center text-yellow-400 animate-fade-in">
                             <span className="flex gap-2 items-center">
                               <Sparkles className="animate-spin" /> Congratulations!
                             </span>
                             <span className="text-white text-lg">Your FinMon evolved into {finMonName}!</span>
                        </span>
                    )}
                 </p>
                 
                 {phase === 'reveal' && (
                     <div className="absolute -bottom-16 animate-bounce">
                         <button 
                            onClick={onClose}
                            className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:bg-slate-100 transition-all"
                         >
                            Continue
                         </button>
                     </div>
                 )}
            </div>
        </div>

        {/* CSS for custom animations */}
        <style>{`
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg) scale(1.1); filter: brightness(1); }
                10% { transform: translate(-1px, -2px) rotate(-1deg) scale(1.1); filter: brightness(2); }
                20% { transform: translate(-3px, 0px) rotate(1deg) scale(1.1); filter: brightness(0); }
                30% { transform: translate(3px, 2px) rotate(0deg) scale(1.1); filter: brightness(2); }
                40% { transform: translate(1px, -1px) rotate(1deg) scale(1.1); filter: brightness(0); }
                50% { transform: translate(-1px, 2px) rotate(-1deg) scale(1.1); filter: brightness(2); }
                60% { transform: translate(-3px, 1px) rotate(0deg) scale(1.1); filter: brightness(0); }
                70% { transform: translate(3px, 1px) rotate(-1deg) scale(1.1); filter: brightness(2); }
                80% { transform: translate(-1px, -1px) rotate(1deg) scale(1.1); filter: brightness(0); }
                90% { transform: translate(1px, 2px) rotate(0deg) scale(1.1); filter: brightness(2); }
                100% { transform: translate(1px, -2px) rotate(-1deg) scale(1.1); filter: brightness(1); }
            }
            .shake-animation {
                animation: shake 0.5s infinite;
            }
            .animate-spin-slow {
                animation: spin 20s linear infinite;
            }
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.5s ease-out forwards;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px) scale(0.8); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `}</style>
    </div>
  );
};