import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Key,
  LogOut,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

const Profile = () => {
  const { user, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-10 space-y-8"
    >
      {/* Header Profile Banner */}
      <div className="bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/20 dark:border-[#534145] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors duration-300">
        <div className="w-20 h-20 rounded-xl bg-[#2D4354] dark:bg-[#FED7A5] text-[#FED7A5] dark:text-[#20212B] flex items-center justify-center font-bold text-3xl shadow-xs">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#20212B] dark:text-[#FED7A5]">
              {user?.username || 'User Profile'}
            </h1>
            {isStaff ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FED7A5] text-[#534145] border border-[#9E6752]/40">
                <Shield className="w-3 h-3 text-[#9E6752]" />
                <span>Admin Staff</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FED7A5]/40 text-[#534145] dark:text-[#FED7A5] border border-[#73766A]/30">
                <GraduationCap className="w-3 h-3 text-[#2D4354] dark:text-[#FED7A5]" />
                <span>Student Candidate</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#73766A]">EduNexus User ID: #{user?.id || 'N/A'}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9E6752]/15 hover:bg-[#9E6752]/25 text-[#9E6752] dark:text-[#FED7A5] text-xs font-semibold border border-[#9E6752] transition min-h-[44px] cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </motion.button>
      </div>

      {/* Account Details Grid */}
      <div className="bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/20 dark:border-[#534145] p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
        <h2 className="text-base font-semibold text-[#20212B] dark:text-[#FED7A5]">Account Credentials</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] space-y-1">
            <div className="flex items-center gap-2 text-[#73766A]">
              <User className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              <span>Username</span>
            </div>
            <p className="text-sm font-semibold text-[#20212B] dark:text-[#FED7A5]">{user?.username || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] space-y-1">
            <div className="flex items-center gap-2 text-[#73766A]">
              <Mail className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              <span>Registered Email</span>
            </div>
            <p className="text-sm font-semibold text-[#20212B] dark:text-[#FED7A5]">{user?.email || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] space-y-1">
            <div className="flex items-center gap-2 text-[#73766A]">
              <Key className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              <span>Database Primary Key</span>
            </div>
            <p className="text-sm font-mono font-semibold text-[#20212B] dark:text-[#FED7A5]">ID #{user?.id || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] space-y-1">
            <div className="flex items-center gap-2 text-[#73766A]">
              <ShieldAlert className="w-4 h-4 text-[#9E6752] dark:text-[#FED7A5]" />
              <span>Staff Authorization</span>
            </div>
            <p className="text-sm font-semibold text-[#20212B] dark:text-[#FED7A5]">
              {isStaff ? 'Authorized Staff Officer' : 'Standard Student Account'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
