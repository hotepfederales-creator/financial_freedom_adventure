
import React, { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';

export const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    // In real app, send to API
    setSent(true);
    setTimeout(() => {
        setSent(false);
        setText('');
        setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-24 right-4 z-[90]">
      {isOpen ? (
        <div className="bg-white p-4 rounded-2xl shadow-2xl w-72 border-2 border-indigo-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-3">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
                 <MessageSquarePlus size={18} className="text-indigo-600"/> Beta Feedback
             </h4>
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
          </div>
          
          {sent ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold text-sm">
                  Thanks for your feedback!
              </div>
          ) : (
              <form onSubmit={handleSubmit}>
                <textarea 
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 mb-3" 
                    placeholder="Found a bug? Have an idea?" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                    <Send size={14}/> Send Report
                </button>
              </form>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold p-3 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-yellow-500"
          title="Report Issue"
        >
          <MessageSquarePlus size={24} />
        </button>
      )}
    </div>
  );
};
