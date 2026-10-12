import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Shield, Eye, Lock, HeartHandshake, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto py-10 space-y-12"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FED7A5]/50 dark:bg-[#FED7A5] text-[#534145] dark:text-[#20212B] text-xs font-semibold border border-[#9E6752]">
          <GraduationCap className="w-3.5 h-3.5 text-[#9E6752] dark:text-[#20212B]" />
          <span>About EduNexus Campus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight">
          Modernizing Campus Admissions
        </h1>
        <p className="text-[#534145] dark:text-[#FED7A5]/70 text-base max-w-2xl mx-auto leading-relaxed">
          EduNexus is our dedicated campus admissions portal, created to give prospective students
          and parents a smooth, reliable, and transparent enrollment experience.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#20212B] p-6 sm:p-7 rounded-2xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">Our Mission</h2>
          <p className="text-sm text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">
            At EduNexus, we believe the admission journey should be as smooth as the education that follows.
            We have replaced paperwork and long queues with a clear, digital process that respects your time.
          </p>
        </div>

        <div className="bg-white dark:bg-[#20212B] p-6 sm:p-7 rounded-2xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#9E6752] dark:text-[#FED7A5] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">Campus Integrity</h2>
          <p className="text-sm text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">
            We ensure that every candidate's application is handled with the highest standards of accuracy,
            data privacy, and prompt institutional review.
          </p>
        </div>
      </div>

      {/* Why Choose EduNexus */}
      <div className="bg-white dark:bg-[#20212B] p-6 sm:p-8 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-6 transition-colors duration-300">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#20212B] dark:text-[#FED7A5]">Why Choose EduNexus</h2>
          <p className="text-xs text-[#73766A] dark:text-slate-400">
            Our commitment to a smooth, transparent, and supportive admission journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Eye,
              title: 'Transparent Admissions',
              desc: 'Every applicant receives a unique application ID and can track the complete review journey online.',
            },
            {
              icon: Lock,
              title: 'Secure Document Handling',
              desc: 'Student credentials are stored securely and reviewed only by authorized admissions staff.',
            },
            {
              icon: HeartHandshake,
              title: 'Personalized Support',
              desc: 'Our admissions team reviews every application with care. Correction requests include clear guidance.',
            },
            {
              icon: MessageSquare,
              title: 'Quick Query Resolution',
              desc: 'Have questions about eligibility, deadlines, or documents? Our campus assistant answers instantly.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex gap-3.5 p-4 rounded-2xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#20212B] dark:text-[#FED7A5]">{item.title}</h4>
                  <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default About;
