import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/userProfile';

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeTutorial: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('finmon_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...(prev || {} as UserProfile), ...data };
      localStorage.setItem('finmon_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const completeTutorial = () => updateProfile({ hasCompletedTutorial: true });

  return (
    <UserContext.Provider value={{ profile, updateProfile, completeTutorial, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};