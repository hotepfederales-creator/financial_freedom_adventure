
import React from 'react';
import { UserState, UserSettings } from '../../types';
import { Eye, Type, Sun, Monitor, ALargeSmall } from 'lucide-react';
import { Card } from '../ui/Card';

interface Props {
  settings: UserSettings;
  onUpdate: (newSettings: Partial<UserSettings>) => void;
}

export const AccessibilitySettings: React.FC<Props> = ({ settings, onUpdate }) => {
  
  const ToggleButton = ({ 
    active, 
    onClick, 
    label, 
    icon: Icon 
  }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left ${
        active 
          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
      }`}
    >
      <Icon size={24} className={active ? 'text-white' : 'text-slate-500'} />
      <span className="font-bold">{label}</span>
      {active && <div className="ml-auto w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>}
    </button>
  );

  return (
    <div className="space-y-6">
      <Card title="Display & Accessibility">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Font Mode */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Type size={16} /> Font Style
            </h4>
            <div className="space-y-2">
              <ToggleButton 
                active={settings.fontMode === 'IMMERSIVE'} 
                onClick={() => onUpdate({ fontMode: 'IMMERSIVE' })}
                label="Immersive (Sci-Fi)" 
                icon={Monitor}
              />
              <ToggleButton 
                active={settings.fontMode === 'READABLE'} 
                onClick={() => onUpdate({ fontMode: 'READABLE' })}
                label="Readable (Standard)" 
                icon={Type}
              />
            </div>
            <p className="text-xs text-slate-500 italic px-1">
              "Readable" replaces the pixel fonts with a clean sans-serif font for better legibility.
            </p>
          </div>

          {/* Contrast & Size */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Eye size={16} /> Visibility
            </h4>
            <div className="space-y-2">
              <ToggleButton 
                active={settings.contrastMode === 'HIGH_CONTRAST'} 
                onClick={() => onUpdate({ contrastMode: settings.contrastMode === 'HIGH_CONTRAST' ? 'STANDARD' : 'HIGH_CONTRAST' })}
                label="High Contrast Mode" 
                icon={Sun}
              />
              <ToggleButton 
                active={settings.fontSize === 'LARGE'} 
                onClick={() => onUpdate({ fontSize: settings.fontSize === 'LARGE' ? 'NORMAL' : 'LARGE' })}
                label="Large Text Size" 
                icon={ALargeSmall}
              />
            </div>
             <p className="text-xs text-slate-500 italic px-1">
              High Contrast mode brightens gray text and darkens backgrounds.
            </p>
          </div>

        </div>
      </Card>

      {/* Preview Box */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
         <h3 className="font-pixel text-2xl text-white mb-2">Preview Text</h3>
         <p className="text-slate-400 leading-relaxed">
            This is how your financial data and Professor Ledger's advice will appear. 
            Check if this is comfortable for your eyes.
            <br/>
            <span className="text-indigo-400 font-bold">$1,250.00</span> • <span className="text-red-400 font-bold">- $45.00</span>
         </p>
      </div>
    </div>
  );
};
