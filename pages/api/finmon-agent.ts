
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type } from "@google/genai";
import { FinMonState } from '../../types';

// Initialize on server-side only
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_FLASH = 'gemini-3-flash-preview'; // Fast model for chat
const MODEL_PRO = 'gemini-3-pro-preview';     // Thinking model for complex analysis

// --- Personas (Moved from Client) ---

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
    // Return a valid fallback object structure to prevent frontend crash
    return {
      healthScore: 50,
      summary: "I analyzed your data, but my report got scrambled. Please try again.",
      recommendations: ["Try entering data again."],
      savingsPotential: 0
    };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { type, data, history, message, userLevel, finMonState, memoryContext, learnedRules } = req.body;

  try {
    // 1. Budget Analysis (Complex Task -> Thinking Mode)
    if (type === 'analyze_budget') {
      const { income, transactions } = data;
      // Optimize data to save tokens
      const expenses = transactions
        .filter((t: any) => t.type === 'expense')
        .map((t: any) => ({ category: t.category, amount: t.amount })); // Only send essential fields

      const totalExpenses = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);

      const prompt = `
        Analyze this monthly budget for a FinMon Trainer:
        Monthly Income (Power): $${income}
        Expenses (Damage): ${JSON.stringify(expenses)}
        Total Expenses: $${totalExpenses}

        Provide a health score (0-100), a brief summary in the voice of Professor Ledger, 3 actionable training tips (recommendations), and potential monthly savings (HP recovery).
      `;

      const response = await ai.models.generateContent({
        model: MODEL_PRO, // Use Pro model for deeper analysis
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }, // Enable Thinking
          systemInstruction: getProfessorPersona(5), // Default persona for analysis
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

      // NOTE: Use .text property, not .text() method
      // Sanitize the text output before parsing
      return res.status(200).json(cleanJson(response.text));
    }

    // 2. Tax Estimation (Complex Task -> Thinking Mode)
    if (type === 'estimate_tax') {
      const { income, location, filingStatus } = data;
      const prompt = `
        Estimate taxes for a Trainer with:
        Annual Gross Income: $${income}
        Location: ${location}
        Filing Status: ${filingStatus}

        Provide stats: estimated total tax, effective rate, take home pay, bracket, and 2 tips.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_PRO, // Use Pro for complex tax reasoning
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }, // Enable Thinking
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
            },
            required: ["estimatedTax", "effectiveRate", "takeHomePay", "bracket", "tips"]
          }
        }
      });

      return res.status(200).json(cleanJson(response.text));
    }

    // 3. Professor Ledger Chat (Fast -> Flash)
    if (type === 'chat_professor') {
      // Inject memory and learned rules
      const contextMessage = memoryContext ? `\n\n${memoryContext}` : '';
      const rulesMessage = learnedRules && learnedRules.length > 0 ? `\n\n[LEARNED RULES]: ${JSON.stringify(learnedRules)}` : '';
      const fullMessage = message + contextMessage + rulesMessage;

      const chat = ai.chats.create({
        model: MODEL_FLASH, // Keep Flash for chat latency
        history: history || [],
        config: {
          systemInstruction: getProfessorPersona(userLevel || 1)
        }
      });

      const result = await chat.sendMessage({ message: fullMessage });
      return res.status(200).json({ response: result.text });
    }

    // 4. FinMon Chat (Fast -> Flash)
    if (type === 'chat_finmon') {
      const { financialContext } = req.body;
      const contextMessage = memoryContext ? `\n\n${memoryContext}` : '';
      const rulesMessage = learnedRules && learnedRules.length > 0 ? `\n\n[LEARNED RULES]: ${JSON.stringify(learnedRules)}` : '';
      const fullMessage = message + contextMessage + rulesMessage;

      let systemPrompt = getFinMonPersona(finMonState);
      
      // Inject real-time financial data for personalized tips
      if (financialContext) {
        systemPrompt += `\n\n[CURRENT FINANCIAL STATUS]\nMonthly Income: $${financialContext.income}\nTotal Expenses: $${financialContext.totalExpenses}\nSavings Rate: ${financialContext.savingsRate}%\nTop Expense Category: ${financialContext.topExpense}\n\n[INSTRUCTION]\nUse the financial status above to give specific, character-appropriate tips if the user asks for advice or how they are doing. If their savings rate is low (<20%), be concerned. If high (>50%), be happy.`;
      }

      const chat = ai.chats.create({
        model: MODEL_FLASH, // Keep Flash for chat latency
        history: history || [],
        config: {
          systemInstruction: systemPrompt
        }
      });

      const result = await chat.sendMessage({ message: fullMessage });
      return res.status(200).json({ response: result.text });
    }
    
    // 5. Evolution Engine Analysis (Reasoning -> Thinking Mode)
    if (type === 'analyze_evolution') {
      const { transactions, savingsRate } = data;
      
      const prompt = `
        **ROLE:**
        You are the 'FinMon Evolutionary Biologist'. Your task is to analyze financial transaction history and determine which 'Form' the user's creature should evolve into based on behavioral psychology.

        **ARCHETYPES (EVOLUTION FORMS):**
        1. **The Hoarding Squirrel (Defense Type):**
           - Trigger: User makes frequent small transfers to savings (micro-saving).
           - Behavior: Cautious, high transaction count, low individual value.

        2. **The Golden Hawk (Attack Type):**
           - Trigger: User allocates >15% of income to investments or aggressive debt payments.
           - Behavior: High risk/reward, focus on net worth growth.

        3. **The Iron Tortoise (Stamina Type):**
           - Trigger: User stays exactly within budget (+/- 5%) for consecutive periods.
           - Behavior: Consistent, predictable, zero overdrafts.

        4. **The Rising Phoenix (Special Type):**
           - Trigger: User recovers from a negative balance or pays off a loan completely.
           - Behavior: Comeback mechanic, resilience.

        **INPUT DATA:**
        - Transactions: ${JSON.stringify(transactions)}
        - Savings Rate: ${savingsRate}

        Determine the evolution form. If no specific trigger is met strongly, set evolutionTriggered to false.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_PRO, // Use Pro for behavioral analysis
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }, // Enable Thinking
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

      return res.status(200).json(cleanJson(response.text));
    }

    // 6. Purchase Intervention Analysis (Fast -> Flash)
    if (type === 'analyze_purchase') {
      const { itemName, price, monthlyBudget } = data;
      
      const prompt = `
        ACT AS: Professor Ledger.
        TASK: Analyze a purchase of "${itemName}" for $${price}.
        CONTEXT: User has a monthly budget/savings remaining of $${monthlyBudget}.
        OUTPUT: JSON with fields: riskLevel (SAFE/CAUTION/DANGER), message (short RPG warning/approval), opportunityCost (relatable comparison, e.g. "That's 20 coffees!").
      `;

      const response = await ai.models.generateContent({
        model: MODEL_FLASH, // Use Flash for real-time intervention speed
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

      return res.status(200).json(cleanJson(response.text));
    }

    return res.status(400).json({ message: 'Invalid request type' });

  } catch (error) {
    console.error("Server AI Error:", error);
    return res.status(500).json({ message: "The server is overloaded. Please try again later." });
  }
}
