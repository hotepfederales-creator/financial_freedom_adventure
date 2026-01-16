import React, { useState } from 'react';
import { saveMemory } from '../../services/memoryService';
import { MOCKED_ZONES } from '../../data/dangerZones';

// Props to allow manipulating parent state
interface DevPanelProps {
  triggerNudge: (zone: any) => void;
  triggerEvolution: (form: string) => void;
  damageBoss: (amount: number) => void;
}

export const DevControlPanel: React.FC<DevPanelProps> = ({ triggerNudge, triggerEvolution, damageBoss }) => {
  const [isOpen, setIsOpen] = useState(false);

  // In a real app, check process.env.NODE_ENV. For this demo, we always show it.
  // if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-900 text-white p-3 rounded-full border-2 border-green-400 shadow-lg font-mono hover:scale-110 transition-transform"
        data-testid="dev-toggle-btn"
        title="Open Developer Tools"
      >
        🐞
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 border-2 border-purple-500 p-4 rounded-lg w-64 shadow-2xl text-xs text-left animate-fade-in-up">
          <h3 className="text-green-400 font-bold mb-3 border-b border-gray-700 pb-1">GOD MODE CONTROLS</h3>
          
          {/* Memory Testing */}
          <div className="mb-3">
            <p className="text-gray-400 mb-1 font-bold">MEMORY SYSTEM</p>
            <button 
              className="w-full bg-blue-800 text-white p-1 mb-1 rounded hover:bg-blue-700 transition-colors"
              onClick={() => {
                saveMemory('GOAL', 'Buy a Tesla Model 3');
                alert('Injected Memory: Wants a Tesla');
              }}
              data-testid="btn-inject-memory"
            >
              Inject "Wants Tesla"
            </button>
            <button 
              className="w-full bg-red-900 text-white p-1 rounded hover:bg-red-800 transition-colors"
              onClick={() => {
                localStorage.removeItem('finmon_long_term_memory');
                alert('Memory Wiped');
              }}
            >
              Wipe Memory
            </button>
          </div>

          {/* Nudge Testing */}
          <div className="mb-3">
            <p className="text-gray-400 mb-1 font-bold">GEOLOCATION</p>
            <button 
              className="w-full bg-yellow-700 text-white p-1 rounded hover:bg-yellow-600 transition-colors"
              onClick={() => triggerNudge(MOCKED_ZONES[0])}
              data-testid="btn-trigger-nudge"
            >
              Simulate "Entering Mall"
            </button>
          </div>

          {/* Raid Testing */}
          <div>
            <p className="text-gray-400 mb-1 font-bold">RAID BATTLE</p>
            <button 
              className="w-full bg-red-600 text-white p-1 rounded hover:bg-red-500 transition-colors"
              onClick={() => damageBoss(5000)}
              data-testid="btn-damage-boss"
            >
              Dealt 5000 DMG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};