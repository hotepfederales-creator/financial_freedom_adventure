import React, { useState, useEffect } from 'react';

interface Hit {
  id: number;
  amount: number;
  x: number;
  y: number;
}

// Singleton event bus for triggering hits from anywhere
export const damageBus = {
  emit: (amount: number) => {},
};

export const DamageFeedback: React.FC = () => {
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    damageBus.emit = (amount: number) => {
      const id = Date.now() + Math.random();
      // Randomize position slightly around center or cursor
      // Default to center-ish if we can't track mouse easily without context
      const x = window.innerWidth / 2 + (Math.random() * 200 - 100);
      const y = window.innerHeight / 2 - 100 + (Math.random() * 50 - 25);
      
      setHits(prev => [...prev, { id, amount, x, y }]);
      
      // Cleanup DOM after animation
      setTimeout(() => {
        setHits(prev => prev.filter(h => h.id !== id));
      }, 1000);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {hits.map(hit => (
        <div 
          key={hit.id}
          className="floating-damage"
          style={{ left: hit.x, top: hit.y }}
        >
          -${hit.amount.toLocaleString()}
        </div>
      ))}
    </div>
  );
};