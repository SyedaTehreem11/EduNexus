import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createApplication } from '../api/applications';
import { useAuth } from '../context/AuthContext';
import {
  FilePlus2,
  Calendar,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Send,
  Info,
} from 'lucide-react';

const NewApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dob, setDob] = useState('');
  const [cnic, setCnic] = useState('');
  const [errors, setErrors] = useState({});
  const [dobWarning, setDobWarning] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-format CNIC/B-Form to XXXXX-XXXXXXX-X
  const handleCnicChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 13);
    let formatted = '';
    if (digits.length <= 5) {
      formatted = digits;
    } else if (digits.length <= 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }

    setCnic(formatted);

    // Live validation
    if (digits.length > 0 && digits.length < 13) {
      setErrors((prev) => ({
        ...prev,
        cnic: 'CNIC / B-Form is incomplete (13 digits required).',
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cnic;
        return next;
      });
    }
  };

  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);

    if (val > todayStr) {
      setErrors((prev) => ({
        ...prev,
        dob: 'Date of Birth cannot be in the future.',
      }));
      setDobWarning('');
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.dob;
        return next;
      });

      if (val) {
        const birthDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 5 || age > 80) {
          setDobWarning(`Notice: Calculated age is ${age} years. Please ensure date of birth is correct.`);
        } else {
          setDobWarning('');
        }
      } else {
        setDobWarning('');
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!dob) {
      errs.dob = 'Date of birth is required.';
    } else if (dob > todayStr) {
      errs.dob = 'Date of Birth cannot be in the future.';
    }

    const digits = cnic.replace(/\D/g, '');
    if (!cnic.trim()) {
      errs.cnic = 'CNIC or B-Form number is required.';
    } else if (digits.length !== 13 || cnic.length !== 15) {
      errs.cnic = 'CNIC must be complete (format: 35404-3451903-1).';
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

    if (!user?.id) {
      setServerError('Unable to identify applicant user ID. Please re-login.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        user: user.id,
        dob,
        cnic: cnic.trim(),
        status: 'Pending',
      };
      const created = await createApplication(payload);
      navigate(`/applications/${created.id}`);
    } catch (err) {
      console.error('Failed to create application:', err);
      let message = 'Failed to submit application. Please check provided data.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          message = Object.entries(data)
            .map(([field, errList]) => `${field}: ${Array.isArray(errList) ? errList.join(', ') : errList}`)
            .join(' | ');
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
      className="max-w-2xl mx-auto py-10 space-y-6"
    >
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white dark:bg-[#2D4354] p-6 sm:p-10 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-6 transition-colors duration-300">
        {/* Header */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center mb-3">
            <FilePlus2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold text-[#20212B] dark:text-[#FED7A5]">
            New Admission Application
          </h1>
          <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
            Submit your core identity particulars to initiate your campus admission docket.
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#9E6752]/15 border border-[#9E6752] text-[#9E6752] dark:text-[#FED7A5] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#9E6752]" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Applicant Info Banner */}
          <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] flex items-center justify-between text-xs text-[#534145] dark:text-[#FED7A5]/80">
            <div>
              <span className="text-[#73766A]">Applicant: </span>
              <span className="font-semibold text-[#20212B] dark:text-[#FED7A5]">{user?.username}</span>
            </div>
            <div>
              <span className="text-[#73766A]">User ID: </span>
              <span className="font-mono font-semibold text-[#20212B] dark:text-[#FED7A5]">#{user?.id}</span>
            </div>
          </div>

          {/* Date of Birth field */}
          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              Date of Birth (DOB)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                max={todayStr}
                value={dob}
                onChange={handleDobChange}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] focus:border-[#9E6752] transition ${
                  errors.dob ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            <p className="text-[11px] text-[#73766A] mt-1">Applicant date of birth must be a past date.</p>
            {errors.dob && <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.dob}</p>}
            {dobWarning && !errors.dob && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FED7A5]/40 text-[#534145] dark:text-[#FED7A5] text-[11px] mt-1.5 border border-[#9E6752]/30">
                <Info className="w-3.5 h-3.5 text-[#9E6752] shrink-0" />
                <span>{dobWarning}</span>
              </div>
            )}
          </div>

          {/* CNIC / B-Form field */}
          <div>
            <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
              CNIC / B-Form Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                maxLength={15}
                placeholder="35404-3451903-1"
                value={cnic}
                onChange={handleCnicChange}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm min-h-[44px] font-mono bg-white dark:bg-[#20212B] text-[#20212B] dark:text-[#FED7A5] placeholder-[#73766A]/60 focus:outline-hidden focus:ring-2 focus:ring-[#9E6752] focus:border-[#9E6752] transition ${
                  errors.cnic ? 'border-[#9E6752]' : 'border-[#73766A]/30 dark:border-[#534145]'
                }`}
              />
            </div>
            <p className="text-[11px] text-[#73766A] mt-1">Format: 35404-3451903-1</p>
            {errors.cnic && <p className="text-[11px] text-[#9E6752] font-medium mt-1">{errors.cnic}</p>}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl border border-[#2D4354] dark:border-[#FED7A5] text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/30 min-h-[44px] flex items-center justify-center transition"
            >
              Cancel
            </Link>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition min-h-[44px] cursor-pointer"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white dark:border-[#20212B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default NewApplication;
