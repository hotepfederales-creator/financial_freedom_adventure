import React, { useState } from 'react';
import { UserState } from '../types';
import { Card } from './ui/Card';
import { CheckoutModal } from './Shop/CheckoutModal';
import { CheckoutDebugger } from './DevTools/CheckoutDebugger';
import { ShoppingBag, Star, Zap, Bike, Coffee, Ticket } from 'lucide-react';
import { damageBus } from './Visuals/DamageFeedback';
import { JuicyButton } from './ui/JuicyButton';

interface MarketplaceProps {
  userState: UserState;
  addPoints: (amount: number) => void;
}

const ITEMS = [
    { id: '1', name: 'Potion (Coffee)', price: 5, image: '☕', desc: 'Restores 5 Energy', icon: Coffee },
    { id: '2', name: 'Movie Ticket', price: 20, image: '🎟️', desc: 'Boosts Mood', icon: Ticket },
    { id: '3', name: 'Ultra Sneakers', price: 150, image: '👟', desc: 'Walk faster', icon: Zap },
    { id: '4', name: 'Golden Bicycle', price: 1000, image: '🚲', desc: 'Key Item', icon: Bike },
    { id: '5', name: 'Luxury Villa', price: 500000, image: '🏰', desc: 'End Game Content', icon: Star },
];

export const Marketplace: React.FC<MarketplaceProps> = ({ userState, addPoints }) => {
  const [selectedItem, setSelectedItem] = useState<typeof ITEMS[0] | null>(null);
  
  // Simulation State
  const [mockBudget, setMockBudget] = useState<number>(userState.monthlyIncome);

  const handleConfirm = () => {
    if (selectedItem) {
      // Trigger Visual Damage Feedback
      damageBus.emit(selectedItem.price);
      addPoints(10); 
      setSelectedItem(null);
      // In a real app we'd deduct money here
    }
  };

  return (
    <div className="space-y-6 relative">
      <CheckoutDebugger setMockBudget={setMockBudget} currentMockBudget={mockBudget} />

      {selectedItem && (
        <CheckoutModal 
            item={selectedItem}
            budgetRemaining={mockBudget}
            onClose={() => setSelectedItem(null)}
            onConfirm={handleConfirm}
        />
      )}

      <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-none shadow-xl">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-500/20 p-4 rounded-full">
                <ShoppingBag size={32} className="text-emerald-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold font-pixel">EconoMart</h2>
                <p className="text-emerald-200">Spend your hard-earned budget! (But be careful...)</p>
             </div>
             <div className="ml-auto bg-black/30 px-4 py-2 rounded-lg text-right">
                 <p className="text-xs text-emerald-300 uppercase font-bold">Simulated Budget</p>
                 <p className="text-xl font-mono font-bold text-white">${mockBudget.toLocaleString()}</p>
             </div>
          </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {ITEMS.map((item) => (
             <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 rounded-bl-xl font-mono font-bold text-slate-600">
                     ${item.price.toLocaleString()}
                 </div>
                 
                 <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                     {item.image}
                 </div>

                 <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                 <p className="text-slate-500 text-sm mb-6">{item.desc}</p>

                 <JuicyButton 
                    onClick={() => setSelectedItem(item)}
                    variant="neutral"
                    className="w-full"
                 >
                    <ShoppingBag size={18} /> Buy Now
                 </JuicyButton>
             </div>
         ))}
      </div>
    </div>
  );
};