import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, AlertCircle, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let errorMsg = 'Invalid credentials or login failed.';
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.response?.data?.non_field_errors) {
        errorMsg = err.response.data.non_field_errors.join(' ');
      } else if (typeof err.response?.data === 'string') {
        errorMsg = err.response.data;
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#2D4354] p-6 sm:p-10 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm transition-colors duration-300">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] rounded-xl flex items-center justify-center mx-auto border border-[#73766A]/20 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight">
            Sign in to your admission account
          </h2>
          <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
            Access your application, documents, and review status.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#9E6752]/15 border border-[#9E6752] text-[#9E6752] dark:text-[#FED7A5] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#9E6752]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#73766A]/30 dark:border-[#534145] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] min-h-[44px]"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white dark:border-[#20212B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Register footer link */}
        <div className="pt-2 text-center text-xs text-[#534145] dark:text-[#FED7A5]/70">
          <span>Don't have an admission account yet? </span>
          <Link to="/register" className="font-semibold text-[#9E6752] dark:text-[#FED7A5] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
