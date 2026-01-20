import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

export const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message) return;
    // Simulate send
    setSent(true);
    setTimeout(() => {
        setSent(false);
        setIsOpen(false);
        setMessage('');
    }, 2000);
  };
  
  return (
    <div className="fixed bottom-20 right-4 z-[90]">
      {isOpen ? (
        <div className="bg-white p-4 rounded-xl shadow-2xl w-72 border border-slate-200 animate-fade-in-up">
          <div className="flex justify-between items-center mb-3">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle size={16} className="text-indigo-600"/> Beta Feedback
             </h4>
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
          </div>
          
          {sent ? (
             <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-bold text-sm">
                Message Sent! <br/> Thanks for helping us.
             </div>
          ) : (
            <>
                <textarea 
                    className="w-full border border-slate-300 p-3 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50" 
                    rows={3}
                    placeholder="Report a bug or suggest a feature..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-3">
                    <button 
                        onClick={handleSend}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Send size={12} /> Send Report
                    </button>
                </div>
            </>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-yellow-400 text-yellow-900 font-bold p-3 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-yellow-200"
          title="Report Bug"
        >
          📣
        </button>
      )}
    </div>
  );
};