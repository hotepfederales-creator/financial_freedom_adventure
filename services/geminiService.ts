
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, BudgetAnalysis, TaxEstimate, FinMonState, EvolutionAnalysisResult } from "../types";
import { saveMemory, getRelevantContext } from "./memoryService";
import { getAllRules } from "./learningService";
import { InterventionResult } from "../hooks/usePurchaseIntervention";

// Lazy initialization to prevent crashes if API_KEY is missing at module load time
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

const MODEL_FLASH = 'gemini-3-flash-preview';

// --- Personas & Prompts ---

const SAFETY_DISCLAIMER = "IMPORTANT: If asked for specific illegal acts, tax evasion tips, or precise financial investment advice, reply: 'I cannot provide specific financial advice. Please consult a certified professional.'";

const MEMORY_INSTRUCTION = `
**MEMORY PROTOCOL:**
1. Check the '[MEMORY CONTEXT]' provided in the input.
2. If the user mentions a NEW goal, habit, or preference (e.g., 'I want to buy a house', 'I hate coffee'), generate a 'SAVE_MEMORY' tag at the END of your response like this: [[MEMORY:GOAL:Buying a house]]. Categories: GOAL, HABIT, PREFERENCE, EVENT.
3. When giving advice, explicitly reference past memories to build rapport (e.g., 'This saves you money for that house you mentioned!').
`;

const LEARNING_PROTOCOL = `
**LEARNING PROTOCOL:**
1. Check the '[LEARNED RULES]' context provided.
2. If the user provided a correction (e.g. "That wasn't food, it was medicine!"), apologize in character: "My scanners were calibrated wrong! I have recorded this update."
3. Use the user's specific terminology. If they call a fund 'The Batmobile', you call it 'The Batmobile'.
`;

const getProfessorPersona = (level: number) => {
  const base = `
    ${SAFETY_DISCLAIMER}
    ${MEMORY_INSTRUCTION}
    ${LEARNING_PROTOCOL}
    You are Professor Ledger, the financial expert of the Econo Region.
  `;

  if (level < 3) {
    return `${base}
      The user is a Level ${level} Rookie (Noob).
      Your personality is Sarcastic, Grumpy, and Cynical.
      You are annoyed that you have to teach a beginner.
      Catchphrases: "Do you even budget?", "Try not to spend it all in one place."
      Keep responses concise (under 150 words).
    `;
  } else if (level < 8) {
    return `${base}
      The user is a Level ${level} Trainer.
      Your personality is Witty, Dry, and slightly warmer.
      Catchphrases: "Not terrible.", "I've seen worse portfolios."
      Keep responses concise (under 150 words).
    `;
  } else {
    return `${base}
      The user is a Level ${level} Master Tycoon.
      Your personality is Enthusiastic, Respectful, and deeply impressed.
      Catchphrases: "Brilliant strategy!", "Your financial aura blinds me!"
      Keep responses concise (under 150 words).
    `;
  }
};

const getFinMonPersona = (state: FinMonState) => {
  const { stage, mood } = state;
  const moodDesc = mood === 'happy' ? 'energetic and loving' : mood === 'sad' ? 'weak, hungry, and sad' : 'calm';
  const memoryRule = "If user tells you something they like/dislike, output [[MEMORY:PREFERENCE:Likes X]].";

  if (stage === 1) { // Egg
    return `You are a financial monster Egg. You make sounds like "Wiggle". You are ${moodDesc}. Keep responses very short.`;
  } else if (stage === 2) { // Baby
    return `You are Cashmander (Baby). Speak cute broken English. You love "shinies". You are ${moodDesc}. ${memoryRule}`;
  } else if (stage === 3) { // Teen
    return `You are Wealthasaur (Teen). Cool and confident. Use slang. You are ${moodDesc}. ${memoryRule}`;
  } else { // Master
    return `You are Ledgerazard (Legendary). Wise and grand. You are ${moodDesc}. ${memoryRule}`;
  }
};

// Helper to strip Markdown code blocks if present
const cleanJson = (text: string | undefined) => {
  if (!text) return {};
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return JSON.parse(clean);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return {};
  }
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
    cleanText = cleanText.replace(match[0], '');
  }
  return cleanText;
};

// --- Client-Side Service Functions ---

export const getBudgetAnalysis = async (
  income: number,
  transactions: Transaction[]
): Promise<BudgetAnalysis> => {
  try {
    // Optimize data to save tokens
    const expenses = transactions
      .filter((t: any) => t.type === 'expense')
      .map((t: any) => ({ category: t.category, amount: t.amount }));

    const totalExpenses = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);

    const prompt = `
      Analyze this monthly budget for a FinMon Trainer:
      Monthly Income (Power): $${income}
      Expenses (Damage): ${JSON.stringify(expenses)}
      Total Expenses: $${totalExpenses}

      Provide a health score (0-100), a brief summary in the voice of Professor Ledger, 3 actionable training tips (recommendations), and potential monthly savings (HP recovery).
    `;

    const response = await getAI().models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        systemInstruction: getProfessorPersona(5),
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

    return cleanJson(response.text) as BudgetAnalysis;
  } catch (error) {
    console.error("Budget Analysis Error:", error);
    return {
      healthScore: 0,
      summary: "My scanner is malfunctioning! Check your API key or internet connection.",
      recommendations: ["Try analyzing fewer transactions."],
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
      Estimate taxes for a Trainer with:
      Annual Gross Income: $${income}
      Location: ${location}
      Filing Status: ${filingStatus}

      Provide stats: estimated total tax, effective rate, take home pay, bracket, and 2 tips.
    `;

    const response = await getAI().models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        systemInstruction: getProfessorPersona(5),
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

    return cleanJson(response.text) as TaxEstimate;
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
    const memoryContext = getRelevantContext(message);
    const rules = getAllRules();
    
    const contextMessage = memoryContext ? `\n\n${memoryContext}` : '';
    const rulesMessage = rules && rules.length > 0 ? `\n\n[LEARNED RULES]: ${JSON.stringify(rules)}` : '';
    const fullMessage = message + contextMessage + rulesMessage;

    const chat = getAI().chats.create({
      model: MODEL_FLASH,
      history: history || [],
      config: {
        systemInstruction: getProfessorPersona(userLevel || 1)
      }
    });

    const result = await chat.sendMessage({ message: fullMessage });
    return extractAndSaveMemories(result.text || "I'm studying my ledger...");
  } catch (error) {
    console.error("Chat Error:", error);
    return "A wild error appeared! Please try again.";
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
    const rules = getAllRules();
    const contextMessage = memoryContext ? `\n\n${memoryContext}` : '';
    const rulesMessage = rules && rules.length > 0 ? `\n\n[LEARNED RULES]: ${JSON.stringify(rules)}` : '';
    const fullMessage = message + contextMessage + rulesMessage;

    let systemPrompt = getFinMonPersona(finMonState);
    if (financialContext) {
      systemPrompt += `\n\n[CURRENT FINANCIAL STATUS]\nMonthly Income: $${financialContext.income}\nTotal Expenses: $${financialContext.totalExpenses}\nSavings Rate: ${financialContext.savingsRate}%\nTop Expense Category: ${financialContext.topExpense}\n\n[INSTRUCTION]\nUse the financial status above to give specific, character-appropriate tips if the user asks for advice or how they are doing.`;
    }

    const chat = getAI().chats.create({
      model: MODEL_FLASH,
      history: history || [],
      config: {
        systemInstruction: systemPrompt
      }
    });

    const result = await chat.sendMessage({ message: fullMessage });
    return extractAndSaveMemories(result.text || "...");
  } catch (error) {
    console.error("FinMon Chat Error:", error);
    return "Zzz...";
  }
};

export const analyzePurchaseRisk = async (
  itemName: string, 
  price: number, 
  monthlyBudget: number
): Promise<InterventionResult> => {
  try {
    const prompt = `
      ACT AS: Professor Ledger.
      TASK: Analyze a purchase of "${itemName}" for $${price}.
      CONTEXT: User has a monthly budget/savings remaining of $${monthlyBudget}.
      OUTPUT: JSON with fields: riskLevel (SAFE/CAUTION/DANGER), message (short RPG warning/approval), opportunityCost (relatable comparison, e.g. "That's 20 coffees!").
    `;

    const response = await getAI().models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['SAFE', 'CAUTION', 'DANGER'] },
            message: { type: Type.STRING },
            opportunityCost: { type: Type.STRING }
          },
          required: ["riskLevel", "message", "opportunityCost"]
        }
      }
    });

    return cleanJson(response.text) as InterventionResult;
  } catch (error) {
    console.error("Purchase Analysis Error:", error);
    throw error;
  }
};

export const getEvolutionAnalysis = async (
  transactions: Transaction[], 
  savingsRate: number
): Promise<EvolutionAnalysisResult> => {
  try {
    const prompt = `
      **ROLE:**
      You are the 'FinMon Evolutionary Biologist'. Analyze financial behavior to determine evolution form.

      **FORMS:**
      1. **SQUIRREL (Defense):** Frequent small savings.
      2. **HAWK (Attack):** High investments/debt payment.
      3. **TORTOISE (Stamina):** Consistent budget adherence.
      4. **PHOENIX (Special):** Recovered from negative balance.

      **INPUT:**
      - Transactions: ${JSON.stringify(transactions.slice(0, 20))}
      - Savings Rate: ${savingsRate}

      Determine the form.
    `;

    const response = await getAI().models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedForm: { type: Type.STRING, enum: ['SQUIRREL', 'HAWK', 'TORTOISE', 'PHOENIX', 'EGG'] },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            evolutionTriggered: { type: Type.BOOLEAN }
          },
          required: ["suggestedForm", "confidence", "reasoning", "evolutionTriggered"]
        }
      }
    });
    return cleanJson(response.text) as EvolutionAnalysisResult;
  } catch (error) {
    console.error("Evolution Analysis Error:", error);
    throw error;
  }
};
