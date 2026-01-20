export interface UserProfile {
  name: string;
  trainerAvatar: string; // URL or ID of the selected sprite
  financialGoal: string;
  monthlyIncome: number;
  hasCompletedTutorial: boolean;
  starterColor: 'RED' | 'BLUE' | 'GREEN';
}

export const AVATAR_OPTIONS = [
  { id: '1', label: 'Tactician', src: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&clothing=blazerAndShirt' },
  { id: '2', label: 'Explorer', src: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&clothing=hoodie' },
  { id: '3', label: 'Tycoon', src: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jude&clothing=collarAndSweater' }
];