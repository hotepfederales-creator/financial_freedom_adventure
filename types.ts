export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface UserState {
  points: number;
  level: number;
  transactions: Transaction[];
  goals: BudgetGoal[];
  monthlyIncome: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  pointsReward: number;
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
