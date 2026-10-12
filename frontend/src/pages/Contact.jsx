import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto py-10 space-y-10"
    >
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight">
          Contact Admissions Office
        </h1>
        <p className="text-[#534145] dark:text-[#FED7A5]/70 text-sm max-w-lg mx-auto">
          Have an inquiry regarding your application, document review, or campus programs? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#2D4354] p-6 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5] uppercase tracking-wider">Campus Address</h4>
                <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 mt-0.5">EduNexus Academic Complex, Block B</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#73766A]/20 dark:border-[#534145]">
              <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#9E6752] dark:text-[#FED7A5] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5] uppercase tracking-wider">Helpline</h4>
                <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 mt-0.5">+92 (051) 111-222-333</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#73766A]/20 dark:border-[#534145]">
              <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#73766A] dark:text-[#FED7A5] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5] uppercase tracking-wider">Email</h4>
                <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 mt-0.5">admissions@edunexus.edu</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#73766A]/20 dark:border-[#534145]">
              <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#534145] dark:text-[#FED7A5] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5] uppercase tracking-wider">Operating Hours</h4>
                <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 mt-0.5">Mon - Fri: 09:00 AM - 04:30 PM PKT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#2D4354] p-6 sm:p-8 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm transition-colors duration-300">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-[#FED7A5]/40 text-[#2D4354] dark:text-[#FED7A5] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">Message Received</h3>
                <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 max-w-sm mx-auto">
                  Thank you for reaching out. An admissions counselor will respond to{' '}
                  <span className="font-semibold text-[#20212B] dark:text-[#FED7A5]">{formData.email}</span> within 24 hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="text-xs font-semibold text-[#9E6752] dark:text-[#FED7A5] hover:underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-semibold text-[#20212B] dark:text-[#FED7A5] mb-2">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ali Khan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="ali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Document Verification Status Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your question or provide your Application ID if available..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752]"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white rounded-xl text-xs font-semibold shadow-xs transition min-h-[44px] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
