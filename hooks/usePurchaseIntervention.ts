
import { useState } from 'react';
import { analyzePurchaseRisk } from '../services/geminiService';

export interface InterventionResult {
  riskLevel: 'SAFE' | 'CAUTION' | 'DANGER';
  message: string;
  opportunityCost: string; 
}

export const usePurchaseIntervention = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePurchase = async (itemName: string, price: number, monthlyBudget: number): Promise<InterventionResult> => {
    setIsAnalyzing(true);
    
    try {
      const result = await analyzePurchaseRisk(itemName, price, monthlyBudget);
      return result;
    } catch (e) {
       // Fallback mock logic if API fails
      const risk = price > (monthlyBudget * 0.2) ? 'DANGER' : 'SAFE';
      
      return {
        riskLevel: risk,
        message: risk === 'DANGER' 
          ? "Wait Trainer! That's a huge hit to your HP! (Offline Mode)" 
          : "It's safe! Your budget shield can handle this. (Offline Mode)",
        opportunityCost: `Approx. ${(price / 5).toFixed(0)} coffees.`
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzePurchase, isAnalyzing };
};
