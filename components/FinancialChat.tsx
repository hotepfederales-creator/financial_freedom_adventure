
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage, DailyStats } from '../types';
import { Card } from './ui/Card';
import { Send, Bot, User, Lock, Wallet } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface FinancialChatProps {
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
  addPoints: (amount: number) => void;
  incrementDailyStat: (key: keyof Omit<DailyStats, 'date' | 'claimedQuests'>) => void;
}

export const FinancialChat: React.FC<FinancialChatProps> = ({ userState, onUpdateUser, addPoints, incrementDailyStat }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use persistent history or empty array
  const messages = userState.ledgerChatHistory || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Story Narrative Triggers ---
  useEffect(() => {
    let newMessages: ChatMessage[] = [];
    let updatedFlags = { ...userState.storyFlags };
    let hasUpdates = false;

    // Trigger 1: Income Set -> Income Shield
    if (!userState.storyFlags.incomeSetSeen && userState.monthlyIncome > 0) {
        newMessages.push({
            id: 'story-income',
            role: 'model',
            text: "Excellent! Your 'Income Shield' is up. The egg is safe... for now. But to help it hatch, we need to feed it 'Data Berries'. Can you tell me your top 3 expenses? (Log them in the 'Item Bag' tab!)",
            timestamp: Date.now()
        });
        updatedFlags.incomeSetSeen = true;
        hasUpdates = true;
    }

    // Trigger 2: Expense Logged -> Budget Sprout
    if (!userState.storyFlags.expenseLoggedSeen && userState.transactions.length > 0) {
        newMessages.push({
            id: 'story-expense',
            role: 'model',
            text: "Aha! Your egg is shaking... It's hatching into a 'Budget Sprout'! This little one is weak against 'Impulse Buys' but strong against 'Planning'. Listen closely, Trainer. Every time you save money, this Sprout gains XP. If you overspend, it takes damage. Are you ready to become a FinMon Master?",
            timestamp: Date.now() + 500 // Slight delay
        });
        updatedFlags.expenseLoggedSeen = true;
        hasUpdates = true;
    }

    if (hasUpdates) {
        onUpdateUser({
            ledgerChatHistory: [...messages, ...newMessages],
            storyFlags: updatedFlags
        });
    }
  }, [userState.monthlyIncome, userState.transactions.length, userState.storyFlags]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    onUpdateUser({ ledgerChatHistory: newHistory });
    
    setInput('');
    setLoading(true);
    incrementDailyStat('chatMessagesSent');

    // Prepare history for API
    const history = newHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Pass user level to get the dynamic persona (Sarcastic -> Nice)
    const responseText = await getChatResponse(history, userMsg.text, userState.level);

    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    onUpdateUser({ ledgerChatHistory: [...newHistory, botMsg] });
    setLoading(false);
    addPoints(5); // Small reward for engagement
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-lg border-2 border-indigo-50" title={`Financial Advisor (Level ${userState.level})`}>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white ${
              msg.role === 'model' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-700 text-white'
            }`}>
              {msg.role === 'model' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
              msg.role === 'model' 
                ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-md">
               <Bot size={20} />
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
               <div className="flex space-x-1 h-5 items-center">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={userState.level < 3 ? "Ask a dumb question..." : "Seek financial wisdom..."}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-md active:translate-y-0.5"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </Card>
  );
};
