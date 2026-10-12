import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { listFAQs } from '../api/faqs';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import {
  ChevronDown,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Lock,
  LogIn,
} from 'lucide-react';

const FAQ = () => {
  const { isAuthenticated } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listFAQs();

      if (res?.unauthorized) {
        setIsUnauthorized(true);
        setFaqs([]);
      } else {
        setIsUnauthorized(false);
        const items = res?.data || (Array.isArray(res) ? res : []);
        setFaqs(items);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.status === 401) {
        setIsUnauthorized(true);
        setFaqs([]);
      } else {
        setError('Unable to load admissions FAQs from the server. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [isAuthenticated]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const showLoginPrompt = !isAuthenticated && (isUnauthorized || faqs.length === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-10 space-y-8"
    >
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] text-xs font-semibold border border-[#FED7A5]/40">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl font-bold text-[#20212B] dark:text-[#f3f4f6] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-[#73766A] dark:text-slate-400 text-sm max-w-xl mx-auto">
          Find fast answers regarding application timelines, documents verification, and campus procedures.
        </p>
      </div>

      {/* Loading state */}
      {loading && <Loader message="Fetching FAQs from admissions registry..." />}

      {/* Clean Unauthenticated / Unauthorized Empty State */}
      {!loading && showLoginPrompt && (
        <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#20212B] dark:text-[#f3f4f6]">FAQ Access</h3>
            <p className="text-xs text-[#73766A] dark:text-slate-400 max-w-sm mx-auto">
              Please log in to view the admissions FAQ knowledge base.
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
      )}

      {/* Genuine Non-401 Error state */}
      {!loading && !showLoginPrompt && error && (
        <div className="p-5 rounded-2xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#9E6752]" />
            <div>
              <h4 className="font-semibold text-[#20212B] dark:text-[#f3f4f6]">Notice</h4>
              <p className="text-xs text-[#73766A] dark:text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchFaqs}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#1a1b23] border border-[#73766A]/30 rounded-xl text-xs font-medium text-[#20212B] dark:text-[#f3f4f6] hover:bg-[#73766A]/10 transition min-h-[44px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Authenticated Empty State (user is logged in, but 0 FAQs exist) */}
      {!loading && !showLoginPrompt && !error && faqs.length === 0 && (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] mx-auto flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#20212B] dark:text-[#f3f4f6]">No FAQs currently available</h3>
            <p className="text-xs text-[#73766A] dark:text-slate-400 mt-1">
              Admissions staff have not published public FAQs yet. You can still consult our campus chatbot or helpdesk.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] text-xs font-semibold rounded-xl transition min-h-[44px]"
            >
              Open Campus Chatbot
            </Link>
          </div>
        </div>
      )}

      {/* FAQs Accordion List */}
      {!loading && !showLoginPrompt && !error && faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || index}
                className="bg-white dark:bg-[#20212B] rounded-2xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-[#20212B] dark:text-[#f3f4f6] text-sm focus:outline-hidden min-h-[44px] cursor-pointer"
                >
                  <span className="flex-1">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-[#73766A] shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 text-[#73766A] dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-[#73766A]/10 dark:border-[#73766A]/20 bg-[#fcfbf9] dark:bg-[#1a1b23]">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default FAQ;
