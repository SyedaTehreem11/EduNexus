import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
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

      {/* Crucial Dates Banner */}
      <div className="bg-[#FED7A5]/25 dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D4354] dark:bg-[#FED7A5] text-white dark:text-[#20212B] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#20212B] dark:text-[#FED7A5]">Current Admission Cycle</h3>
            <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70">
              Applications are accepted on a rolling basis. Priority review deadline is 30 September 2026.
            </p>
          </div>
        </div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            to="/new-application"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white text-xs font-semibold rounded-xl shadow-xs transition min-h-[44px]"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Requirements & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#2D4354] p-6 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2 text-[#20212B] dark:text-[#FED7A5] font-semibold text-base">
            <FileCheck2 className="w-5 h-5 text-[#2D4354] dark:text-[#FED7A5]" />
            <h3>Prerequisite Documents</h3>
          </div>
          <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
            All candidates must submit clear digital copies of the following documents:
          </p>
          <ul className="space-y-2.5 text-xs text-[#534145] dark:text-[#FED7A5]/80">
            {[
              'Valid National CNIC or Form-B identification number',
              'Secondary School Certificate (SSC / Matric / O-Level)',
              'Higher Secondary School Certificate (HSSC / Intermediate / A-Level)',
              'Official Passport Size Photograph',
              'Domicile or Character Certificate (if applicable)',
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
          <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
            Minimum threshold requirements for undergraduate programs:
          </p>
          <ul className="space-y-2.5 text-xs text-[#534145] dark:text-[#FED7A5]/80">
            {[
              'Minimum 50% aggregate score in relevant Intermediate or equivalent diploma',
              'Mathematics / Science background for CS and Engineering faculties',
              'Valid CNIC / Form-B format (e.g. 35404-3451903-1)',
              'Applicant must provide an active, reachable email address',
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
