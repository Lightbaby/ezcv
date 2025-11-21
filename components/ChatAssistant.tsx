import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, CheckCircle, AlertTriangle, FileJson, ChevronRight } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ResumeData, Language } from '../types';
import { UI_LABELS } from '../constants';

interface Message {
  id: string;
  text: string;
  rawText?: string; // Store the full response (including JSON) for AI context
  sender: 'user' | 'ai';
  timestamp: number;
  updatePayload?: any; // Stores the parsed JSON update if available
  applied?: boolean;
}

interface ChatAssistantProps {
  data: ResumeData;
  lang: Language;
  onUpdateData: (type: string, payload: any) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ data, lang, onUpdateData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting when language changes or on mount
  useEffect(() => {
    if (messages.length === 0) {
        setMessages([{ 
            id: 'init', 
            text: UI_LABELS[lang].aiGreeting, 
            sender: 'ai', 
            timestamp: Date.now() 
        }]);
    }
  }, [lang, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    // Optimistically add user message
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for AI (exclude the message we just added visually to avoid dupes if we handled it differently, 
      // but here we pass the *previous* messages as history)
      const history = messages.map(m => ({
          role: m.sender,
          text: m.rawText || m.text
      }));

      const rawResponse = await generateAIResponse(input, history, data, lang);
      
      // Attempt to parse JSON from the response
      // Look for ```json ... ``` or just {...}
      let parsedPayload = null;
      let cleanText = rawResponse;

      const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || rawResponse.match(/```\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch) {
          try {
              parsedPayload = JSON.parse(jsonMatch[1]);
              // Remove the JSON block from the text shown to user to keep it clean
              cleanText = rawResponse.replace(jsonMatch[0], '').trim();
              if (!cleanText) cleanText = UI_LABELS[lang].applyUpdate;
          } catch (e) {
              console.error("JSON Parse Error", e);
          }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanText,
        rawText: rawResponse, // Important: Keep the full JSON response for future context
        sender: 'ai',
        timestamp: Date.now(),
        updatePayload: parsedPayload
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Connection Error. Neural link unstable.",
        sender: 'ai',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyUpdate = (msgId: string, payload: any) => {
    if (!payload || !payload.type) return;
    
    onUpdateData(payload.type, payload.data);
    
    setMessages(prev => prev.map(m => 
        m.id === msgId ? { ...m, applied: true } : m
    ));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all duration-300 hover:scale-110 flex items-center justify-center
          ${isOpen ? 'bg-gray-800 text-gray-400 rotate-90' : 'bg-hud-accent text-black'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] glass-panel rounded-lg border border-hud-accent/30 shadow-2xl flex flex-col transition-all duration-300 z-40 transform origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3 border-b border-white/10 bg-black/40 flex items-center gap-2 rounded-t-lg">
           <Bot size={18} className="text-hud-accent" />
           <span className="font-display font-bold tracking-wider text-sm text-white">AI OPERATOR</span>
           <div className="ml-auto flex gap-1">
              <div className="w-2 h-2 rounded-full bg-hud-accent animate-pulse"></div>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                    <div 
                        className={`p-3 rounded-lg text-sm leading-relaxed
                            ${msg.sender === 'user' 
                                ? 'bg-hud-accent text-black rounded-tr-none font-medium' 
                                : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                            }
                        `}
                    >
                        {msg.text}
                    </div>

                    {/* Update Card */}
                    {msg.updatePayload && (
                        <div className="mt-2 w-full bg-black/60 border border-hud-accent/50 rounded p-3 animate-[fadeIn_0.3s]">
                            <div className="flex items-center gap-2 text-hud-accent text-xs font-bold uppercase mb-2 border-b border-white/10 pb-2">
                                <FileJson size={12} /> {UI_LABELS[lang].applyUpdate}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono mb-3 line-clamp-3">
                                {JSON.stringify(msg.updatePayload.data, null, 2)}
                            </div>
                            
                            {msg.applied ? (
                                <div className="flex items-center gap-2 text-green-500 text-xs font-bold bg-green-500/10 p-2 rounded justify-center">
                                    <CheckCircle size={12} /> UPDATED
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleApplyUpdate(msg.id, msg.updatePayload)}
                                    className="w-full py-2 bg-hud-accent/10 hover:bg-hud-accent text-hud-accent hover:text-black border border-hud-accent/50 rounded text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {UI_LABELS[lang].apply} <ChevronRight size={12} />
                                </button>
                            )}
                        </div>
                    )}

                    <span className="text-[10px] text-gray-600 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            ))}
            
            {isLoading && (
                 <div className="flex items-center gap-2 text-hud-accent text-xs p-2 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    PROCESSING...
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={UI_LABELS[lang].aiPlaceholder}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-hud-accent/50 placeholder-gray-600"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-hud-accent text-black rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </>
  );
};