import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Menu,
  X,
  LayoutDashboard,
  FilePlus2,
  BotMessageSquare,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm transition-colors duration-200 relative ${
      isActive
        ? 'text-[#2D4354] dark:text-[#FED7A5] font-medium border-b-2 border-[#9E6752]'
        : 'text-[#534145] dark:text-[#FED7A5]/70 hover:text-[#2D4354] dark:hover:text-[#FED7A5]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3.5 py-3 text-base rounded-xl transition-colors duration-200 min-h-[44px] flex items-center ${
      isActive
        ? 'text-[#2D4354] dark:text-[#FED7A5] font-semibold bg-[#FED7A5]/30 dark:bg-[#534145]'
        : 'text-[#534145] dark:text-[#FED7A5]/70 hover:text-[#2D4354] hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145]/50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#20212B] border-b border-[#73766A]/20 dark:border-[#534145] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#2D4354] dark:text-[#FED7A5] transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#2D4354] dark:bg-[#FED7A5] flex items-center justify-center text-white dark:text-[#20212B] shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-[#20212B] dark:text-[#FED7A5]">
                Edu<span className="text-[#9E6752] dark:text-[#FED7A5]">Nexus</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-[#73766A] font-medium">
                Campus Admissions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (>= 768px) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/admissions-info" className={navLinkClass}>
              Admissions Info
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* Authenticated Links */}
            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-[#73766A]/30 mx-1" />
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/new-application" className={navLinkClass}>
                  New Application
                </NavLink>
                <NavLink to="/chatbot" className={navLinkClass}>
                  Campus Chatbot
                </NavLink>

                {/* Staff / Admin Dropdown */}
                {isStaff && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      onBlur={() => setTimeout(() => setAdminMenuOpen(false), 200)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FED7A5] text-[#534145] hover:bg-[#FED7A5]/80 transition cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#9E6752]" />
                      <span>Admin</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <AnimatePresence>
                      {adminMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#2D4354] shadow-lg border border-[#73766A]/20 dark:border-[#534145] py-1.5 z-50"
                        >
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-[#534145] dark:text-[#FED7A5]/90 hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145]"
                          >
                            Admin Overview
                          </Link>
                          <Link
                            to="/admin/queue"
                            className="block px-4 py-2 text-sm text-[#534145] dark:text-[#FED7A5]/90 hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145]"
                          >
                            Review Queue
                          </Link>
                          <Link
                            to="/admin/faqs"
                            className="block px-4 py-2 text-sm text-[#534145] dark:text-[#FED7A5]/90 hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145]"
                          >
                            Manage FAQs
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Desktop Right Actions: Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-[#73766A]/30 text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/30 dark:hover:bg-[#534145] transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FED7A5]" /> : <Moon className="w-4 h-4 text-[#2D4354]" />}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#2D4354] hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145] transition text-sm font-medium text-[#2D4354] dark:text-[#FED7A5]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FED7A5] text-[#534145] flex items-center justify-center font-bold text-xs uppercase">
                    {user?.username ? user.username.charAt(0) : 'U'}
                  </div>
                  <span>{user?.username || 'Profile'}</span>
                  {isStaff && (
                    <span className="text-[10px] font-bold bg-[#FED7A5] text-[#534145] px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 text-[#73766A] hover:text-[#9E6752] hover:bg-[#9E6752]/10 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/30 dark:hover:bg-[#534145] rounded-xl transition min-h-[44px] flex items-center"
                >
                  Log in
                </Link>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] rounded-xl shadow-xs transition min-h-[44px] flex items-center"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button (< 768px) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-[#73766A]/30 text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/30 dark:hover:bg-[#534145] transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FED7A5]" /> : <Moon className="w-4 h-4 text-[#2D4354]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/20 dark:hover:bg-[#534145] transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< 768px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#73766A]/20 dark:border-[#534145] bg-white dark:bg-[#20212B] px-4 pt-3 pb-6 space-y-1 overflow-hidden"
          >
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              About
            </NavLink>
            <NavLink
              to="/admissions-info"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admissions Info
            </NavLink>
            <NavLink to="/faq" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>

            {isAuthenticated ? (
              <>
                <div className="border-t border-[#73766A]/20 dark:border-[#534145] pt-2 my-2" />
                <NavLink
                  to="/dashboard"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/new-application"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Application
                </NavLink>
                <NavLink
                  to="/chatbot"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Campus Chatbot
                </NavLink>
                <NavLink
                  to="/profile"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile ({user?.username})
                </NavLink>

                {isStaff && (
                  <div className="bg-[#FED7A5]/20 dark:bg-[#2D4354] p-2.5 rounded-xl space-y-1 my-2 border border-[#FED7A5]/40">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#534145] dark:text-[#FED7A5] px-2 py-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#9E6752]" />
                      <span>Admin Portal</span>
                    </div>
                    <NavLink
                      to="/admin"
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Overview
                    </NavLink>
                    <NavLink
                      to="/admin/queue"
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Review Queue
                    </NavLink>
                    <NavLink
                      to="/admin/faqs"
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage FAQs
                    </NavLink>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-3 text-base font-medium text-[#9E6752] hover:bg-[#9E6752]/10 rounded-xl transition min-h-[44px] flex items-center cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-[#73766A]/20 dark:border-[#534145] flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-3 px-4 border border-[#2D4354] dark:border-[#FED7A5] rounded-xl text-[#2D4354] dark:text-[#FED7A5] font-medium hover:bg-[#FED7A5]/30 min-h-[44px] flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-3 px-4 bg-[#2D4354] dark:bg-[#FED7A5] text-white dark:text-[#20212B] rounded-xl font-medium hover:bg-[#534145] dark:hover:bg-[#9E6752] min-h-[44px] flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
