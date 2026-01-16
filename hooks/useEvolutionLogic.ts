import { useState } from 'react';
import { Transaction, EvolutionForm, EvolutionAnalysisResult } from '../types';

async function fetchEvolutionAnalysis(data: { transactions: Transaction[], savingsRate: number }): Promise<EvolutionAnalysisResult> {
  const response = await fetch('/api/finmon-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      type: 'analyze_evolution', 
      data 
    }),
  });
  if (!response.ok) throw new Error('Evolution analysis failed');
  return response.json();
}

export const useEvolutionLogic = () => {
  const [currentForm, setCurrentForm] = useState<EvolutionForm>('EGG');
  const [isEvolving, setIsEvolving] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<EvolutionAnalysisResult | null>(null);

  const checkEvolution = async (transactions: Transaction[], savingsRate: number) => {
    setIsEvolving(true);
    try {
      const analysis = await fetchEvolutionAnalysis({ transactions, savingsRate });
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