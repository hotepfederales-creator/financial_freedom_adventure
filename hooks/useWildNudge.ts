import { useState, useEffect } from 'react';
import { DangerZone, MOCKED_ZONES } from '../data/dangerZones';

export const useWildNudge = () => {
  const [activeNudge, setActiveNudge] = useState<DangerZone | null>(null);

  useEffect(() => {
    // Simulate location watch polling
    const interval = setInterval(() => {
      // In a real app, we would check navigator.geolocation.getCurrentPosition
      // and calculate distance to MOCKED_ZONES.
      
      // Simulation: 5% chance every 20 seconds to trigger a random zone if none is active
      if (!activeNudge && Math.random() > 0.95) {
        const randomZone = MOCKED_ZONES[Math.floor(Math.random() * MOCKED_ZONES.length)];
        setActiveNudge(randomZone);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [activeNudge]);

  const dismissNudge = () => setActiveNudge(null);
  
  // Developer Tool Trigger
  const triggerNudge = (zone: DangerZone) => setActiveNudge(zone);

  return { activeNudge, dismissNudge, triggerNudge };
};