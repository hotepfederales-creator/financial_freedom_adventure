import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage, DailyStats } from '../types';
import { Card } from './ui/Card';
import { Send, Bot, User, Lock, Wallet } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface FinancialChatProps {
  userState: UserState;
  addPoints: (amount: number) => void;
  incrementDailyStat: (key: keyof Omit<DailyStats, 'date' | 'claimedQuests'>) => void;
}

export const FinancialChat: React.FC<FinancialChatProps> = ({ userState, addPoints, incrementDailyStat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Professor Ledger here. I suppose you want financial advice? Make it quick, I'm auditing a Dragon's hoard.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock Logic: User must log at least 1 expense today
  const isLocked = userState.dailyStats.expensesLogged < 1;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    incrementDailyStat('chatMessagesSent');

    // Prepare history for API
    const history = messages.map(m => ({
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

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
    addPoints(5); // Small reward for engagement
  };

  if (isLocked) {
    return (
      <Card className="h-[600px] flex items-center justify-center text-center p-8 bg-slate-50 relative overflow-hidden" title="Financial Advisor Chat">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 to-transparent"></div>
        
        <div className="max-w-md space-y-8 relative z-10">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-slate-200 relative animate-pulse">
            <Bot size={64} className="text-slate-300" />
            <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-3 rounded-full border-4 border-white shadow-lg">
              <Lock size={24} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-800">The Lab is Locked!</h2>
            <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm transform rotate-1">
              <p className="text-lg text-slate-600 italic font-medium">
                "Zzz... I don't talk to trainers who slack off! 
                <br/>
                <span className="text-red-500 font-bold not-italic">Log at least 1 expense today</span> to wake me up."
              </p>
              <p className="text-right text-xs font-bold text-slate-400 mt-2">- Prof. Ledger</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
             <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full font-bold text-sm">
                <Wallet size={16} />
                <span>Expenses Logged Today: {userState.dailyStats.expensesLogged}/1</span>
             </div>
             <p className="text-xs text-slate-400">Go to the 'Item Bag (Budget)' tab to complete this task.</p>
          </div>
        </div>
      </Card>
    );
  }

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