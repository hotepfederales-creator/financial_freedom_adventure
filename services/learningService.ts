
import { Transaction } from '../types';

export interface LearningRule {
  id: string;
  keyword: string;
  correctCategory: string;
  userNote: string;
  timestamp: number;
}

const RULES_STORAGE_KEY = 'finmon_learning_rules';

// 1. TEACH: User corrects the AI
export const teachAgent = (transactionName: string, correctCategory: string, note: string) => {
  if (typeof window === 'undefined') return;
  const existingRules: LearningRule[] = JSON.parse(localStorage.getItem(RULES_STORAGE_KEY) || '[]');
  
  // Basic duplicate check
  if (existingRules.some(r => r.keyword === transactionName.toLowerCase() && r.correctCategory === correctCategory)) {
    return;
  }

  const newRule: LearningRule = {
    id: crypto.randomUUID(),
    keyword: transactionName.toLowerCase(),
    correctCategory,
    userNote: note,
    timestamp: Date.now()
  };

  // Save to 'Long Term Memory'
  localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify([...existingRules, newRule]));
  return newRule;
};

// 2. RECALL: AI checks if it has been taught this before
export const recallRule = (transactionName: string): LearningRule | undefined => {
  if (typeof window === 'undefined') return undefined;
  const rules: LearningRule[] = JSON.parse(localStorage.getItem(RULES_STORAGE_KEY) || '[]');
  
  // Simple keyword matching
  return rules.find(r => transactionName.toLowerCase().includes(r.keyword));
};

// 3. APPLY: The 'Brain' that decides category based on history
export const predictCategory = (description: string): string | null => {
  const learnedRule = recallRule(description);
  if (learnedRule) {
    return learnedRule.correctCategory; // Override with learned knowledge
  }
  return null;
};

// 4. CONTEXT: Get all rules to feed to LLM
export const getAllRules = (): LearningRule[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(RULES_STORAGE_KEY) || '[]');
};

export const clearRules = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RULES_STORAGE_KEY);
  console.log("Learned rules wiped.");
};
