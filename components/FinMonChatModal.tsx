import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage } from '../types';
import { X, Send, Ghost } from 'lucide-react';
import { FinMon } from './FinMon';
import { getFinMonResponse } from '../services/geminiService';

interface FinMonChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onUpdateUser: (newState: Partial<UserState>) => void;
}

export const FinMonChatModal: React.FC<FinMonChatModalProps> = ({ 
  isOpen, 
  onClose, 
  userState, 
  onUpdateUser 
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize history if empty
  useEffect(() => {
    if (userState.finMonChatHistory && userState.finMonChatHistory.length === 0) {
       onUpdateUser({
         finMonChatHistory: [{
           id: 'init',
           role: 'model',
           text: userState.finMon.stage === 1 ? '...w-wiggle?' : 
                 userState.finMon.stage === 2 ? 'Shiny?' : 
                 userState.finMon.stage === 3 ? 'Yo.' : 'Greetings, Trainer.',
           timestamp: Date.now()
         }]
       });
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userState.finMonChatHistory, isOpen, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    const newHistory = [...(userState.finMonChatHistory || []), userMsg];
    onUpdateUser({ finMonChatHistory: newHistory });
    setInput('');
    setIsTyping(true);

    // AI Call
    const apiHistory = newHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Calculate Financial Context for the AI to give better tips
    const expenses = userState.transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const income = userState.monthlyIncome;
    
    // Find top spending category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const topExpenseString = topCategoryEntry ? `${topCategoryEntry[0]} ($${topCategoryEntry[1]})` : 'None';
    
    const financialContext = {
      income,
      totalExpenses,
      savingsRate: income > 0 ? ((income - totalExpenses) / income * 100).toFixed(1) : '0',
      topExpense: topExpenseString
    };

    const response = await getFinMonResponse(apiHistory, input, userState.finMon, financialContext);

    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      text: response,
      timestamp: Date.now()
    };

    onUpdateUser({ finMonChatHistory: [...newHistory, botMsg] });
    setIsTyping(false);
  };

  if (!isOpen) return null;

  // Theme colors based on stage
  const themeColors = {
    1: 'bg-yellow-100 border-yellow-300',
    2: 'bg-green-100 border-green-300',
    3: 'bg-blue-100 border-blue-300',
    4: 'bg-indigo-100 border-indigo-300'
  };

  const bubbleColors = {
    1: 'bg-yellow-500',
    2: 'bg-green-500',
    3: 'bg-blue-500',
    4: 'bg-indigo-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white w-full max-w-md rounded-3xl shadow-2xl border-4 overflow-hidden flex flex-col h-[600px] ${themeColors[userState.finMon.stage]}`}>
        
        {/* Header */}
        <div className="bg-white/80 p-4 border-b border-slate-200 flex justify-between items-center backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
               <FinMon stage={userState.finMon.stage} mood={userState.finMon.mood} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{userState.finMon.name}</h3>
              <p className="text-xs text-slate-500 capitalize">{userState.finMon.mood}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/50">
          {(userState.finMonChatHistory || []).map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               {msg.role === 'model' && (
                 <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                   <Ghost size={14} className="text-slate-400" />
                 </div>
               )}
               <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                 msg.role === 'user' 
                   ? 'bg-slate-800 text-white rounded-tr-none' 
                   : `${bubbleColors[userState.finMon.stage]} text-white rounded-tl-none`
               }`}>
                 {msg.text}
               </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start animate-pulse">
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none ${bubbleColors[userState.finMon.stage]} opacity-50`}>
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                     <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Talk to ${userState.finMon.name}...`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-xl text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${bubbleColors[userState.finMon.stage]}`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};