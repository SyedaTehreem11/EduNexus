import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, AlertCircle, CheckCircle2, User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password should be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);
      await register(formData.username.trim(), formData.email.trim(), formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      let message = 'Registration failed. Please check the form data.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          const fieldMsgs = Object.entries(data)
            .map(([field, errList]) => `${field}: ${Array.isArray(errList) ? errList.join(', ') : errList}`)
            .join(' | ');
          message = fieldMsgs;
        } else if (typeof data === 'string') {
          message = data;
        }
      }
      setServerError(message);
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
            Create Your Admission Account
          </h2>
          <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
            Register to submit your application, upload documents, and track your review status.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 rounded-xl bg-[#73766A]/20 border border-[#73766A] text-[#2D4354] dark:text-[#FED7A5] text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D4354] dark:text-[#FED7A5]" />
            <span>Account created successfully! Redirecting you to sign in...</span>
          </div>
        )}

        {/* Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#9E6752]/15 border border-[#9E6752] text-[#9E6752] dark:text-[#FED7A5] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#9E6752]" />
            <span>{serverError}</span>
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
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] ${
                  errors.username ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            {errors.username && <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] ${
                  errors.email ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.email}</p>}
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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] ${
                  errors.password ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] ${
                  errors.confirmPassword ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.confirmPassword}</p>
            )}
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
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="pt-2 text-center text-xs text-[#534145] dark:text-[#FED7A5]/70">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-[#9E6752] dark:text-[#FED7A5] hover:underline">
            Log in to your account
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
