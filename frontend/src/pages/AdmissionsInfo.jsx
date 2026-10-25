import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const AdmissionsInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto py-10 space-y-10"
    >
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight">
          Admissions Guidelines & Requirements
        </h1>
        <p className="text-[#534145] dark:text-[#FED7A5]/70 text-sm sm:text-base max-w-2xl mx-auto">
          Please review the academic criteria, prerequisite documentation, and crucial timeline
          deadlines before initiating your application.
        </p>
      </div>

      {/* Requirements & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#2D4354] p-6 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2 text-[#20212B] dark:text-[#FED7A5] font-semibold text-base">
            <FileCheck2 className="w-5 h-5 text-[#2D4354] dark:text-[#FED7A5]" />
            <h3>Documents</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-[#534145] dark:text-[#FED7A5]/80">
            {[
              'Birth Certificate',
              "Parent's CNIC",
            ].map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#73766A] shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-[#2D4354] p-6 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2 text-[#20212B] dark:text-[#FED7A5] font-semibold text-base">
            <AlertCircle className="w-5 h-5 text-[#9E6752] dark:text-[#FED7A5]" />
            <h3>Eligibility Criteria</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-[#534145] dark:text-[#FED7A5]/80">
            {[
              'Minimum aggregate in previous class (if applicable)',
            ].map((crit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#9E6752] shrink-0 mt-0.5" />
                <span>{crit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Helpful hint */}
      <div className="p-4 rounded-xl bg-[#FED7A5]/30 dark:bg-[#534145] border border-[#9E6752]/30 flex items-start gap-3 text-xs text-[#534145] dark:text-[#FED7A5]">
        <HelpCircle className="w-4 h-4 text-[#9E6752] dark:text-[#FED7A5] shrink-0 mt-0.5" />
        <p>
          Need assistance or clarifications? Chat with our virtual assistant or check our{' '}
          <Link to="/faq" className="underline font-semibold hover:text-[#2D4354] dark:hover:text-white">
            Frequently Asked Questions
          </Link>{' '}
          for immediate help.
        </p>
      </div>
    </motion.div>
  );
};

export default AdmissionsInfo;
