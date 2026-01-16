export interface RaidBoss {
  id: string;
  name: string;
  totalHp: number; // Total Debt Amount (e.g., $50,000)
  currentHp: number;
  image: string; // Emoji or URL
  deadline: string;
  description: string;
  difficulty: 'Normal' | 'Hard' | 'Extreme';
}

export interface RaidParticipant {
  id: string;
  username: string;
  damageDealt: number; // Amount paid off
  avatar: string; // Emoji
  lastActive: string;
}