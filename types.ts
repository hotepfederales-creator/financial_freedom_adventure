
export interface Transaction {
  id: string;
  description?: string; // e.g., "Starbucks", "Uber"
  category: string;     // e.g., "Food", "Transport"
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface FinMonState {
  name: string;
  species: 'Coinlet' | 'Cashmander' | 'Wealthasaur' | 'Ledgerazard' | 'SQUIRREL' | 'HAWK' | 'TORTOISE' | 'PHOENIX';
  stage: 1 | 2 | 3 | 4; // 1=Egg, 2=Baby, 3=Teen, 4=Master
  mood: 'happy' | 'neutral' | 'sad';
}

export interface DailyStats {
  date: string;
  expensesLogged: number;
  chatMessagesSent: number;
  budgetAnalyzed: number;
  claimedQuests: string[];
}

export interface StoryFlags {
  introSeen: boolean;
  incomeSetSeen: boolean;
  expenseLoggedSeen: boolean;
}

export type Difficulty = 'NOVICE' | 'VETERAN' | 'HARDCORE';

export interface UserState {
  points: number;
  level: number;
  trainerName: string;
  finMon: FinMonState;
  transactions: Transaction[];
  monthlyIncome: number;
  achievements: string[]; // IDs of claimed achievements
  dailyStats: DailyStats;
  finMonChatHistory: ChatMessage[]; // Chat history with the pet
  ledgerChatHistory: ChatMessage[]; // Chat history with Professor Ledger
  storyFlags: StoryFlags;
  difficulty: Difficulty;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  reward: number;
  condition: (state: UserState) => boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface BudgetAnalysis {
  healthScore: number;
  summary: string;
  recommendations: string[];
  savingsPotential: number;
}

export interface TaxEstimate {
  estimatedTax: number;
  effectiveRate: number;
  takeHomePay: number;
  bracket: string;
  tips: string[];
}

// --- Dynamic Evolution Engine Types ---

export type EvolutionForm = 'EGG' | 'SQUIRREL' | 'HAWK' | 'TORTOISE' | 'PHOENIX';

export interface EvolutionAnalysisResult {
  suggestedForm: EvolutionForm;
  confidence: number;
  reasoning: string;
  evolutionTriggered: boolean;
}

export const EVOLUTION_RULES = {
  SQUIRREL: "Frequent small savings transactions (>5 per month).",
  HAWK: "High investment activity or aggressive debt repayment (>15% of income).",
  TORTOISE: "Consistent spending within 5% of budget for 3 months.",
  PHOENIX: "Recovered from a negative balance or cleared a major debt."
};