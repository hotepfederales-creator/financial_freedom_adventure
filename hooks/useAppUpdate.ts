
import { useState, useEffect } from 'react';
import { APP_VERSION } from '../data/changelog';

export const useAppUpdate = () => {
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedVersion = localStorage.getItem('finmon_app_version');
    
    // If versions don't match, show modal and update local storage
    if (storedVersion !== APP_VERSION) {
      setShowChangelog(true);
    }
  }, []);

  const dismissChangelog = () => {
    localStorage.setItem('finmon_app_version', APP_VERSION);
    setShowChangelog(false);
  };

  return { showChangelog, dismissChangelog, currentVersion: APP_VERSION };
};
