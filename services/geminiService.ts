
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, BudgetAnalysis, TaxEstimate, FinMonState, EvolutionAnalysisResult } from "../types";
import { saveMemory, getRelevantContext } from "./memoryService";
import { getAllRules } from "./learningService";
import { InterventionResult } from "../hooks/usePurchaseIntervention";

// Base URL handling for Mobile vs Web
// In Vercel (Web), this can be empty string '' to use relative paths.
// In Capacitor (Mobile), this MUST be the full HTTPS URL of your deployed Vercel app.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// --- Helper to call the Next.js API Route ---
async function callAgentApi(payload: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/finmon-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Agent API Call Failed:", error);
    throw error;
  }
}

// --- Client-Side Service Functions ---

export const getBudgetAnalysis = async (
  income: number,
  transactions: Transaction[]
): Promise<BudgetAnalysis> => {
  try {
    return await callAgentApi({
      type: 'analyze_budget',
      data: { income, transactions }
    });
  } catch (error) {
    return {
      healthScore: 0,
      summary: "Communication with Professor Ledger failed. Check internet connection.",
      recommendations: ["Retry later."],
      savingsPotential: 0
    };
  }
};

export const getTaxEstimate = async (
  income: number,
  location: string,
  filingStatus: string
): Promise<TaxEstimate> => {
  return await callAgentApi({
    type: 'estimate_tax',
    data: { income, location, filingStatus }
  });
};

export const getChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  userLevel: number = 1
): Promise<string> => {
  try {
    const memoryContext = getRelevantContext(message);
    const learnedRules = getAllRules();

    const data = await callAgentApi({
      type: 'chat_professor',
      history,
      message,
      userLevel,
      memoryContext,
      learnedRules
    });
    return data.response;
  } catch (error) {
    return "Professor Ledger is out of office (Connection Error).";
  }
};

export const getFinMonResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  finMonState: FinMonState,
  financialContext?: any
): Promise<string> => {
  try {
    const memoryContext = getRelevantContext(message);
    const learnedRules = getAllRules();

    const data = await callAgentApi({
      type: 'chat_finmon',
      history,
      message,
      finMonState,
      financialContext,
      memoryContext,
      learnedRules
    });
    return data.response;
  } catch (error) {
    return "... (Silence)";
  }
};

export const analyzePurchaseRisk = async (
  itemName: string, 
  price: number, 
  monthlyBudget: number
): Promise<InterventionResult> => {
  try {
    return await callAgentApi({
      type: 'analyze_purchase',
      data: { itemName, price, monthlyBudget }
    });
  } catch (error) {
    throw error;
  }
};

export const getEvolutionAnalysis = async (
  transactions: Transaction[], 
  savingsRate: number
): Promise<EvolutionAnalysisResult> => {
  try {
    return await callAgentApi({
      type: 'analyze_evolution',
      data: { transactions, savingsRate }
    });
  } catch (error) {
    throw error;
  }
};
