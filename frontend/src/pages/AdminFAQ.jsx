import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { listFAQs, createFAQ, updateFAQ, deleteFAQ } from '../api/faqs';
import Loader from '../components/Loader';
import {
  FileQuestion,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
} from 'lucide-react';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [savingCreate, setSavingCreate] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listFAQs();
      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching admin FAQs:', err);
      setError('Failed to retrieve FAQs from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      setSavingCreate(true);
      const created = await createFAQ({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      });
      setFaqs([...faqs, created]);
      setNewQuestion('');
      setNewAnswer('');
      setShowCreate(false);
      setSuccessMessage('FAQ item published successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Create FAQ failed:', err);
      alert('Failed to create FAQ entry.');
    } finally {
      setSavingCreate(false);
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editQuestion.trim() || !editAnswer.trim()) return;

    try {
      setSavingEdit(true);
      const updated = await updateFAQ(editingId, {
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
      });
      setFaqs(faqs.map((f) => (f.id === editingId ? updated : f)));
      setEditingId(null);
      setSuccessMessage('FAQ item updated.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update FAQ failed:', err);
      alert('Failed to update FAQ entry.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ entry?')) return;

    try {
      await deleteFAQ(id);
      setFaqs(faqs.filter((f) => f.id !== id));
      setSuccessMessage('FAQ item deleted.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete FAQ failed:', err);
      alert('Failed to delete FAQ entry.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-8 space-y-8 max-w-5xl mx-auto"
    >
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#20212B] p-6 sm:p-8 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] text-xs font-bold border border-[#FED7A5]/40">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Admissions Knowledge Base Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20212B] dark:text-[#f3f4f6] tracking-tight mt-2">
            Manage FAQs
          </h1>
          <p className="text-xs sm:text-sm text-[#73766A] dark:text-slate-400 mt-1">
            Maintain questions and answers surfaced across the public FAQ and campus AI chatbot.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showCreate ? 'Close Form' : 'New FAQ'}</span>
        </motion.button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Create FAQ Form */}
      {showCreate && (
        <div className="bg-white dark:bg-[#20212B] p-6 sm:p-8 rounded-3xl border border-[#2D4354]/30 dark:border-[#FED7A5]/40 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#20212B] dark:text-[#f3f4f6]">Add New FAQ Question</h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#20212B] dark:text-[#f3f4f6] mb-1.5">Question</label>
              <input
                type="text"
                required
                placeholder="e.g. When will the admission merit list be declared?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20212B] dark:text-[#f3f4f6] mb-1.5">Answer</label>
              <textarea
                rows={3}
                required
                placeholder="Official answer providing dates, instructions, or office links..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs font-semibold text-[#73766A] dark:text-slate-300 hover:bg-[#73766A]/10"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={savingCreate}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] disabled:opacity-40 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish FAQ</span>
              </motion.button>
            </div>
          </form>
        </div>
      )}

      {loading && <Loader message="Fetching FAQs..." />}

      {!loading && error && (
        <div className="p-4 rounded-2xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchFaqs}
            className="px-3.5 py-1.5 min-h-[36px] bg-white dark:bg-[#1a1b23] border border-[#9E6752]/40 text-[#9E6752] rounded-lg text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* List of FAQs */}
      {!loading && !error && (
        <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs divide-y divide-[#73766A]/10 dark:divide-[#73766A]/20 overflow-hidden">
          {faqs.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#73766A] dark:text-slate-400">
              No FAQs recorded yet. Click "New FAQ" to add your first query.
            </div>
          ) : (
            faqs.map((faq) => {
              const isEditing = editingId === faq.id;

              if (isEditing) {
                return (
                  <div key={faq.id} className="p-6 bg-[#fcfbf9] dark:bg-[#1a1b23] space-y-4">
                    <h4 className="text-xs font-bold text-[#20212B] dark:text-[#f3f4f6] uppercase">Edit FAQ #{faq.id}</h4>
                    <form onSubmit={handleUpdate} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#f3f4f6] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={3}
                          required
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#f3f4f6] focus:outline-hidden"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 min-h-[40px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs font-medium text-[#73766A] dark:text-slate-300 hover:bg-[#73766A]/10"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={savingEdit}
                          className="inline-flex items-center gap-1 px-4 py-2 min-h-[40px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:text-[#20212B] text-white rounded-xl text-xs font-semibold"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </motion.button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div
                  key={faq.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[#fcfbf9]/60 dark:hover:bg-[#1a1b23]/60 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#73766A] dark:text-slate-400">#{faq.id}</span>
                      <h4 className="text-sm font-bold text-[#20212B] dark:text-[#f3f4f6]">{faq.question}</h4>
                    </div>
                    <p className="text-xs text-[#73766A] dark:text-slate-300 leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => startEdit(faq)}
                      className="p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] hover:bg-[#73766A]/10 rounded-xl transition cursor-pointer"
                      title="Edit question"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#9E6752] hover:bg-[#9E6752]/10 rounded-xl transition cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminFAQ;
