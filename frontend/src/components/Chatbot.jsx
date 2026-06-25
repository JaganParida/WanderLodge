import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the Vistiqo AI Concierge. Need help finding a property?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chatbot', { message: userMessage });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'ai' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-airbnb flex items-center justify-center">
                 <MessageSquare size={16} />
               </div>
               <span className="font-bold">Vistiqo AI</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:bg-gray-800 p-2 rounded-full transition"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-black text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                   <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="Ask me anything..." 
               className="flex-1 bg-gray-100 outline-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-black transition"
               disabled={isLoading}
             />
             <button 
               type="submit" 
               disabled={isLoading || !input.trim()}
               className="bg-black text-white p-2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
             >
               <Send size={16} className="-ml-0.5 mt-0.5" />
             </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-black hover:bg-gray-800 hover:scale-105 active:scale-95 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2"
        >
          <MessageSquare size={24} />
          <span className="font-bold pr-1 hidden sm:block">Ask AI</span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
