
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage, DailyStats } from '../types';
import { Card } from './ui/Card';
import { Send, User, Lock, Wallet } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ProfLedgerAvatar } from './ProfLedgerAvatar';

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
            text: "Ah! There we go! Your 'Income Shield' is active. That wasn't so hard, was it? Now, the egg needs 'Data Berries' to hatch. I need you to log your TOP 3 EXPENSES in the Item Bag. Don't lie to me—I'll know.",
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
            text: "Great Scott! The egg is shaking... It's hatching into a 'Budget Sprout'! This creature feeds on savings. If you overspend, it withers. If you save, it evolves. Simple, right? Even a Rookie could understand that.",
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
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.role === 'model' ? (
                 <ProfLedgerAvatar className="w-12 h-12 flex-shrink-0" emotion={msg.text.includes('!') ? 'shocked' : 'neutral'} />
            ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white">
                     <User size={20} />
                </div>
            )}
            
            <div className={`max-w-[80%] p-5 rounded-2xl text-sm shadow-sm relative ${
              msg.role === 'model' 
                ? 'bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              {/* Little triangle for speech bubble */}
              <div className={`absolute top-0 w-0 h-0 border-8 border-transparent ${
                  msg.role === 'model' ? '-left-[18px] border-t-amber-200 border-r-0' : '-right-2 border-t-indigo-600 border-l-0'
              }`}></div>
              
              <div className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
             <ProfLedgerAvatar className="w-12 h-12 animate-pulse" />
             <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
               <div className="flex space-x-1 h-5 items-center">
                 <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
