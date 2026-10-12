import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh] flex items-center justify-center py-12 px-4 text-center"
    >
      <div className="max-w-md w-full bg-white dark:bg-[#20212B] p-8 sm:p-10 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-6">
        <div className="w-16 h-16 bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] rounded-3xl flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[#20212B] dark:text-[#f3f4f6]">Page Not Found</h1>
          <p className="text-xs text-[#73766A] dark:text-slate-400">
            The admissions portal route you requested could not be located or has moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] text-xs font-semibold shadow-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#fcfbf9] hover:bg-[#73766A]/10 dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6] border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs font-semibold transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
