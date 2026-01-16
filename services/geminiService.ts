import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, BudgetAnalysis, TaxEstimate } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FLASH = 'gemini-3-flash-preview';

export const getBudgetAnalysis = async (
  income: number,
  transactions: Transaction[]
): Promise<BudgetAnalysis> => {
  try {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    const prompt = `
      Analyze this monthly budget:
      Monthly Income: $${income}
      Expenses: ${JSON.stringify(expenses)}
      Total Expenses: $${totalExpenses}

      Provide a health score (0-100), a brief summary, 3 actionable recommendations to save money, and potential monthly savings if recommendations are followed.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            savingsPotential: { type: Type.NUMBER }
          },
          required: ["healthScore", "summary", "recommendations", "savingsPotential"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as BudgetAnalysis;

  } catch (error) {
    console.error("Budget Analysis Error:", error);
    return {
      healthScore: 0,
      summary: "Could not analyze budget at this time.",
      recommendations: ["Check your network connection."],
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
    const prompt = `
      Estimate taxes for a user with:
      Annual Gross Income: $${income}
      Location: ${location}
      Filing Status: ${filingStatus}

      Provide estimated total tax, effective tax rate, take home pay, likely tax bracket, and 2 quick tax tips.
      Assume standard deduction for the current tax year. This is for educational purposes only.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedTax: { type: Type.NUMBER },
            effectiveRate: { type: Type.NUMBER },
            takeHomePay: { type: Type.NUMBER },
            bracket: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as TaxEstimate;
  } catch (error) {
    console.error("Tax Estimate Error:", error);
    throw error;
  }
};

export const getChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_FLASH,
      history: history,
      config: {
        systemInstruction: "You are a helpful, encouraging, and knowledgeable financial advisor. Keep answers concise (under 150 words) unless asked for detail. Use formatting like bullet points for readability."
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
