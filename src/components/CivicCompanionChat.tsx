import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Languages, HelpCircle, FileText, CheckCircle, Info } from 'lucide-react';
import { ChatMessage } from '../types';

const INDIAN_LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Hindi', name: 'हिन्दी (Hindi)' },
  { code: 'Bengali', name: 'বাংলা (Bengali)' },
  { code: 'Tamil', name: 'தமிழ் (Tamil)' },
  { code: 'Telugu', name: 'తెలుగు (Telugu)' },
  { code: 'Marathi', name: 'मराठी (Marathi)' },
  { code: 'Kannada', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'Gujarati', name: 'ગુજરાતી (Gujarati)' },
  { code: 'Urdu', name: 'اردو (Urdu)' },
  { code: 'Punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)' }
];

const SUGGESTED_CHIPS = [
  { id: '1', text: 'Aadhaar Card address update process?', label: 'Aadhaar Help' },
  { id: '2', text: 'What documents are needed for an Income Certificate?', label: 'Document Assistant' },
  { id: '3', text: 'Am I eligible for PM-KISAN scheme? Rules please.', label: 'PM-KISAN' },
  { id: '4', text: 'How do I appeal a high water bill?', label: 'Civic Grievance' }
];

export default function CivicCompanionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Jai Hind! I am **Citizen Sevak**, your AI Civic Companion. I am here to help you navigate public schemes, understand complex document requirements, and simplify complicated government notifications.\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredLang, setPreferredLang] = useState('English');
  const [simplifierText, setSimplifierText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [showSimplifier, setShowSimplifier] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          preferredLanguage: preferredLang
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text || 'Sorry, I could not generate a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: '⚠️ **System Notice:** Unable to reach the AI Companion. Please check that your Gemini API Key is configured in the **Secrets** panel and the server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimplifySubmit = async () => {
    if (!simplifierText.trim()) return;
    setIsSimplifying(true);
    setShowSimplifier(false);

    const textToProcess = `Please simplify the following complex government document, legal text, or circular into extremely clear, easy-to-understand bullet points for citizens:\n\n"${simplifierText}"`;
    setSimplifierText('');
    setIsSimplifying(false);
    await handleSendMessage(textToProcess);
  };

  return (
    <div id="civic-chat-section" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] lg:h-[650px]">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div className="space-y-6">
          <div>
            <h3 className="font-sans text-sm font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              Language Settings
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Citizen Sevak can understand and converse in major regional Indian languages.
            </p>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-slate-200" />

          {/* AI Simplification Tool */}
          <div>
            <button
              onClick={() => setShowSimplifier(!showSimplifier)}
              className="w-full flex items-center justify-between text-left px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 hover:border-emerald-200 transition-all text-emerald-800 font-sans font-medium text-sm shadow-sm"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Simplify Complex Text
              </span>
              <span className="text-xs bg-emerald-600 text-white font-mono px-1.5 py-0.5 rounded-full">AI</span>
            </button>

            <AnimatePresence>
              {showSimplifier && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden space-y-3"
                >
                  <p className="text-xs text-slate-500">
                    Paste difficult gazette notices, orders, or rule terms here to translate them into plain English or your preferred language.
                  </p>
                  <textarea
                    rows={4}
                    value={simplifierText}
                    onChange={(e) => setSimplifierText(e.target.value)}
                    placeholder="Paste complex circular text here..."
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    onClick={handleSimplifySubmit}
                    disabled={!simplifierText.trim() || isSimplifying}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Simplify Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200/50 p-3 rounded-xl">
          <div className="flex gap-2 items-start">
            <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Citizen Sevak cross-references valid central guidelines to provide helpful advice. For official documentation, always consult authorized CSC portals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-3 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col h-full bg-white overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-slate-800 text-sm flex items-center gap-2">
                Citizen Sevak
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h4>
              <p className="text-xs font-mono text-slate-500">Government Information Simplified</p>
            </div>
          </div>
          <div className="text-xs bg-slate-200/60 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" />
            <span>Chatting in {preferredLang}</span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm font-sans text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Simulated Markdowns for headers & lists without needing heavy libraries */}
                <div className="whitespace-pre-line prose max-w-none text-sm">
                  {msg.content.split('\n').map((line, idx) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={idx} className="block font-semibold mb-1">{line.replace(/\*\*/g, '')}</strong>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} className="ml-4 list-disc mb-1">{line.replace('- ', '')}</li>;
                    }
                    if (/^\d+\./.test(line)) {
                      return <li key={idx} className="ml-4 list-decimal mb-1">{line}</li>;
                    }
                    // Handle inline bold markers: **text**
                    const parts = [];
                    let lastIndex = 0;
                    const boldRegex = /\*\*([^*]+)\*\*/g;
                    let match;
                    while ((match = boldRegex.exec(line)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(line.substring(lastIndex, match.index));
                      }
                      parts.push(<strong key={match.index} className="font-semibold text-emerald-700">{match[1]}</strong>);
                      lastIndex = boldRegex.lastIndex;
                    }
                    if (lastIndex < line.length) {
                      parts.push(line.substring(lastIndex));
                    }
                    return <p key={idx} className="mb-2">{parts.length > 0 ? parts : line}</p>;
                  })}
                </div>
                <div
                  className={`text-[10px] font-mono mt-2 text-right ${
                    msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%] flex items-center gap-3">
                <div className="flex space-x-1.5 items-center">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500 font-mono">Sevaks are analyzing guidelines...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Chips */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 overflow-x-auto flex gap-2 scrollbar-none">
          {SUGGESTED_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleSendMessage(chip.text)}
              disabled={isLoading}
              className="flex-shrink-0 text-xs px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full text-slate-700 transition-all font-sans font-medium flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            disabled={isLoading}
            placeholder={`Ask Citizen Sevak anything in ${preferredLang} (e.g. 'How do I apply for a ration card?')...`}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-sans text-sm text-slate-700"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-sm hover:shadow transition-all font-sans font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
