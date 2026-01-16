import { Transaction, BudgetAnalysis, TaxEstimate, FinMonState } from "../types";
import { saveMemory, getRelevantContext } from "./memoryService";

// Add this helper at the top
const getBaseUrl = () => {
  // If running on device/emulator, point to your hosted backend or local IP
  // For Prod: return 'https://your-vercel-app.vercel.app';
  // For Dev: return 'http://192.168.1.XX:3000';
  return process.env.NEXT_PUBLIC_API_URL || '';
};

// Helper to extract [[MEMORY:CAT:CONTENT]] tags
const extractAndSaveMemories = (text: string): string => {
  const regex = /\[\[MEMORY:([A-Z]+):(.*?)\]\]/g;
  let cleanText = text;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const category = match[1] as any;
    const content = match[2].trim();
    saveMemory(category, content);
    // Remove the tag from the displayed text
    cleanText = cleanText.replace(match[0], '');
  }
  return cleanText;
};

export const getBudgetAnalysis = async (
  income: number,
  transactions: Transaction[]
): Promise<BudgetAnalysis> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/finmon-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'analyze_budget',
        data: { income, transactions }
      }),
    });

    if (!response.ok) throw new Error("Server error");
    return await response.json();
  } catch (error) {
    console.error("Budget Analysis Error:", error);
    return {
      healthScore: 0,
      summary: "My scanner is malfunctioning! I can't read your financial data right now.",
      recommendations: ["Check your internet connection."],
      savingsPotential: 0
    };
  }
};

export const getTaxEstimate = async (
  income: number,
  location: string,
  filingStatus: string
): Promise<TaxEstimate> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/finmon-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'estimate_tax',
        data: { income, location, filingStatus }
      }),
    });

    if (!response.ok) throw new Error("Server error");
    return await response.json();
  } catch (error) {
    console.error("Tax Estimate Error:", error);
    throw error;
  }
};

export const getChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  userLevel: number = 1
): Promise<string> => {
  try {
    // 1. Retrieve Context
    const memoryContext = getRelevantContext(message);

    const response = await fetch(`${getBaseUrl()}/api/finmon-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chat_professor',
        history,
        message,
        userLevel,
        memoryContext // Pass to API
      }),
    });

    const data = await response.json();
    const rawText = data.response || "I'm studying my ledger... ask again in a moment.";

    // 2. Process Memories
    return extractAndSaveMemories(rawText);
  } catch (error) {
    console.error("Chat Error:", error);
    return "A wild error appeared! Please try again.";
  }
};

export const getFinMonResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  finMonState: FinMonState
): Promise<string> => {
  try {
    // FinMon also gets context, though maybe less complex
    const memoryContext = getRelevantContext(message);

    const response = await fetch(`${getBaseUrl()}/api/finmon-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chat_finmon',
        history,
        message,
        finMonState,
        memoryContext
      }),
    });

    const data = await response.json();
    const rawText = data.response || "...";

    // Process Memories (FinMon might remember "User likes apples")
    return extractAndSaveMemories(rawText);
  } catch (error) {
    console.error("FinMon Chat Error:", error);
    return "Zzz...";
  }
};