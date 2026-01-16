
import { useState } from 'react';
import { Transaction, EvolutionForm, EvolutionAnalysisResult } from '../types';
import { getEvolutionAnalysis } from '../services/geminiService';

export const useEvolutionLogic = () => {
  const [currentForm, setCurrentForm] = useState<EvolutionForm>('EGG');
  const [isEvolving, setIsEvolving] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<EvolutionAnalysisResult | null>(null);

  const checkEvolution = async (transactions: Transaction[], savingsRate: number) => {
    setIsEvolving(true);
    try {
      const analysis = await getEvolutionAnalysis(transactions, savingsRate);
      setLastAnalysis(analysis);
      
      if (analysis.evolutionTriggered && analysis.suggestedForm !== currentForm) {
        console.log(`Evolution Triggered: ${analysis.reasoning}`);
        setCurrentForm(analysis.suggestedForm);
        return analysis;
      }
    } catch (error) {
      console.error("Evolution check failed", error);
    } finally {
      setIsEvolving(false);
    }
    return null;
  };

  return { currentForm, checkEvolution, isEvolving, lastAnalysis };
};
