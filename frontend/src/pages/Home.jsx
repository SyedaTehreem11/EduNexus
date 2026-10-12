import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  CheckCircle2,
  BotMessageSquare,
  Users,
  Bell,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-16 py-8 md:py-12"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FED7A5]/25 via-[#FED7A5]/10 to-white dark:from-[#2D4354]/40 dark:via-[#20212B] dark:to-[#20212B] border border-[#73766A]/20 dark:border-[#534145] p-6 sm:p-10 lg:p-16 transition-colors duration-300">
        <div className="max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FED7A5]/50 dark:bg-[#FED7A5] text-[#534145] dark:text-[#20212B] border border-[#9E6752] text-xs font-semibold tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E6752] dark:text-[#20212B]" />
            <span>EduNexus Admissions Portal</span>
          </motion.div>

          {/* Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 border-l-4 border-[#2D4354] dark:border-[#FED7A5] text-[#20212B] dark:text-[#FED7A5] text-xs font-medium shadow-2xs"
          >
            <Bell className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5] shrink-0" />
            <span>Admissions Open for the 2026/2027 Academic Session</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight leading-tight"
          >
            Your Gateway to a{' '}
            <span className="text-[#2D4354] dark:text-[#FED7A5] underline decoration-[#FED7A5] dark:decoration-[#9E6752]">
              Smarter
            </span>{' '}
            Campus Future
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-base sm:text-lg text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed max-w-2xl"
          >
            Welcome to EduNexus — apply online, submit your documents, and track your admission status every step of the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
          >
            {isAuthenticated ? (
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white font-medium text-sm shadow-xs transition min-h-[44px]"
                >
                  <span>Go to Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white font-medium text-sm shadow-xs transition min-h-[44px]"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#2D4354] dark:border-[#FED7A5] text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/40 dark:hover:bg-[#534145] font-medium text-sm transition min-h-[44px]"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}

            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#FED7A5]/30 hover:bg-[#FED7A5]/50 dark:bg-[#534145] dark:hover:bg-[#534145]/80 text-[#2D4354] dark:text-[#FED7A5] font-medium text-sm border border-[#73766A]/20 dark:border-[#534145] transition min-h-[44px]"
            >
              <BotMessageSquare className="w-4 h-4 text-[#9E6752] dark:text-[#FED7A5]" />
              <span>Ask AI Chatbot</span>
            </Link>
          </motion.div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block pr-12 opacity-60 pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-[#FED7A5]/40 to-[#2D4354]/20 blur-2xl" />
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#20212B] dark:text-[#FED7A5]">
            Engineered for Fast, Transparent Admissions
          </h2>
          <p className="text-sm text-[#73766A]">
            A frictionless digital procedure eliminating paperwork and long queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5] mb-2">Paperless Submission</h3>
            <p className="text-sm text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">
              Fill out your profile with date of birth and CNIC details in moments. Safe, encrypted,
              and stored directly in the central campus registry.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#9E6752] dark:text-[#FED7A5] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5] mb-2">Transparent Document Review</h3>
            <p className="text-sm text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">
              Track verification status stages for your academic transcripts and identity
              certificates with instant status updates.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#73766A] dark:text-[#FED7A5] flex items-center justify-center mb-4">
              <BotMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5] mb-2">Smart Campus Chatbot</h3>
            <p className="text-sm text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">
              Get immediate answers to admissions criteria, deadlines, fee details, and program
              requirements with our built-in student assistant.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Journey */}
      <section className="bg-white dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-[#20212B] dark:text-[#FED7A5]">Your Step-by-Step Path</h2>
          <p className="text-sm text-[#73766A]">
            Click any step to start or track that part of your application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Create Account',
              desc: 'Register with your student username and email to activate your profile.',
              to: '/register',
            },
            {
              step: '02',
              title: 'Submit Application',
              desc: 'Enter your CNIC and date of birth to start your admission application.',
              to: '/new-application',
            },
            {
              step: '03',
              title: 'Provide Documents',
              desc: 'Attach required identity and educational credentials for admissions review.',
              to: '/dashboard',
            },
            {
              step: '04',
              title: 'Verified Enrollment',
              desc: 'Admissions staff reviews credentials and verifies your acceptance status.',
              to: '/dashboard',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="bg-[#faf9f6] dark:bg-[#20212B] p-6 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-xs relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block group focus:outline-hidden focus:ring-2 focus:ring-[#9E6752]"
            >
              <span className="text-xs font-semibold text-[#534145] dark:text-[#FED7A5] bg-[#FED7A5]/50 dark:bg-[#534145] border border-[#9E6752]/40 px-2.5 py-1 rounded-md">
                Step {item.step}
              </span>
              <h3 className="text-base font-semibold text-[#20212B] dark:text-[#FED7A5] mt-3.5 mb-1 group-hover:text-[#9E6752] transition">
                {item.title}
              </h3>
              <p className="text-xs text-[#534145] dark:text-[#FED7A5]/70 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center rounded-3xl bg-[#2D4354] dark:bg-[#534145] text-white p-8 sm:p-12 space-y-5 shadow-xs border border-[#73766A]/20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#FED7A5]">
          Ready to Start Your Academic Journey?
        </h2>
        <p className="text-[#FED7A5]/80 max-w-xl mx-auto text-sm sm:text-base">
          Join thousands of prospective scholars. Applications for the upcoming academic cycle are now open.
        </p>
        <div className="pt-2">
          <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to={isAuthenticated ? '/new-application' : '/register'}
              className="inline-flex items-center gap-2 bg-[#FED7A5] text-[#20212B] hover:bg-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-xs min-h-[44px]"
            >
              <span>Start Application Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
