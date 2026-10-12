import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { listFAQs } from '../api/faqs';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, User, RefreshCcw, Lock, LogIn } from 'lucide-react';

const Chatbot = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your EduNexus Campus AI Assistant. You can ask me anything about admission criteria, deadlines, fee structures, or document verification.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const messagesEndRef = useRef(null);

  // Preload FAQs for fast client-side query matching
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoadingFaqs(true);
        const data = await listFAQs();

        if (data?.unauthorized || (!isAuthenticated && (!data || data.length === 0))) {
          setIsUnauthorized(true);
          setFaqs([]);
        } else {
          setIsUnauthorized(false);
          const items = data?.data || (Array.isArray(data) ? data : []);
          setFaqs(items);
        }
      } catch (err) {
        // Silently handle without console errors
        setIsUnauthorized(true);
        setFaqs([]);
      } finally {
        setLoadingFaqs(false);
      }
    };

    loadFaqs();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate natural thinking delay
    setTimeout(async () => {
      let faqsList = faqs;
      if (faqsList.length === 0) {
        try {
          const res = await listFAQs();
          if (res?.unauthorized) {
            setIsUnauthorized(true);
            setIsTyping(false);
            return;
          }
          faqsList = res?.data || (Array.isArray(res) ? res : []);
          setFaqs(faqsList);
        } catch (e) {
          // Silently ignore
        }
      }

      const lowerQuery = query.toLowerCase();
      let bestAnswer = null;
      let highestScore = 0;

      for (const faq of faqsList) {
        const qText = (faq.question || '').toLowerCase();
        const aText = (faq.answer || '').toLowerCase();

        // Exact substring match in question or query
        if (qText.includes(lowerQuery) || lowerQuery.includes(qText)) {
          bestAnswer = faq.answer;
          highestScore = 100;
          break;
        }

        // Keyword overlap match
        const queryWords = lowerQuery
          .replace(/[^a-z0-9 ]/g, '')
          .split(/\s+/)
          .filter((w) => w.length > 2);

        let currentScore = 0;
        for (const word of queryWords) {
          if (qText.includes(word)) currentScore += 2;
          else if (aText.includes(word)) currentScore += 1;
        }

        if (currentScore > highestScore) {
          highestScore = currentScore;
          bestAnswer = faq.answer;
        }
      }

      const botReply =
        bestAnswer && highestScore > 0
          ? bestAnswer
          : "I couldn't find a reliable answer to that question in the admissions repository. Please visit the FAQ page or contact the admissions helpdesk directly.";

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const samplePrompts = [
    'What is the admission deadline?',
    'What documents do I need to submit?',
    'How is my application verified?',
    'Can I update my CNIC number?',
  ];

  const showLoginGate = !loadingFaqs && !isAuthenticated && (isUnauthorized || faqs.length === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-8 space-y-4"
    >
      {/* Header */}
      <div className="bg-white dark:bg-[#20212B] p-5 rounded-2xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D4354] dark:bg-[#FED7A5] text-[#FED7A5] dark:text-[#20212B] flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#20212B] dark:text-[#f3f4f6]">EduNexus Campus Assistant</h1>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#73766A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#73766A]" />
              </span>
            </div>
            <p className="text-xs text-[#73766A] dark:text-slate-400">
              Interactive Admissions Inquiry Chatbot
            </p>
          </div>
        </div>

        {!showLoginGate && (
          <button
            onClick={() =>
              setMessages([
                {
                  id: Date.now(),
                  sender: 'bot',
                  text: 'Chat history cleared. How may I help you with admissions?',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#73766A] hover:text-[#20212B] dark:hover:text-[#FED7A5] hover:bg-[#73766A]/10 rounded-xl transition cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Login Gate when unauthenticated / 401 */}
      {showLoginGate ? (
        <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#20212B] dark:text-[#f3f4f6]">
              Authentication Required
            </h3>
            <p className="text-xs text-[#73766A] dark:text-slate-400 max-w-sm mx-auto">
              The AI assistant needs you to be logged in. Please log in to continue.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Chat Messages Frame */
        <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs p-5 sm:p-6 h-[480px] flex flex-col justify-between">
          <div className="overflow-y-auto space-y-4 pr-1">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#2D4354]/10 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] border border-[#2D4354]/20 dark:border-[#FED7A5]/30 flex items-center justify-center shrink-0 text-xs font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#2D4354] dark:bg-[#FED7A5] text-white dark:text-[#20212B] rounded-br-xs shadow-xs'
                        : 'bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 text-[#20212B] dark:text-[#f3f4f6] rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 ${
                        isUser ? 'text-white/70 dark:text-[#20212B]/70 text-right' : 'text-[#73766A] dark:text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] border border-[#FED7A5]/40 flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-[#73766A] dark:text-slate-400 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-[#2D4354]/10 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center text-xs font-bold">
                  AI
                </div>
                <div className="flex items-center gap-1 bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 px-3 py-2 rounded-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#73766A] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#73766A] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#73766A] animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="pt-3 border-t border-[#73766A]/10 dark:border-[#73766A]/20 space-y-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#fcfbf9] dark:bg-[#1a1b23] hover:bg-[#FED7A5]/20 text-[#20212B] dark:text-[#f3f4f6] hover:text-[#2D4354] dark:hover:text-[#FED7A5] border border-[#73766A]/20 dark:border-[#73766A]/30 text-[11px] font-medium transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask an admission question (e.g. deadline, documents, verification)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-[#fcfbf9] dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] disabled:opacity-40 rounded-xl shadow-xs transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Chatbot;
