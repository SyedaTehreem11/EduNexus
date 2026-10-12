import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createDocument } from '../api/documents';
import { listApplications } from '../api/applications';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import {
  UploadCloud,
  ArrowLeft,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

const DocumentUpload = () => {
  const [searchParams] = useSearchParams();
  const preselectedAppId = searchParams.get('applicationId');

  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Form states
  const [applicationId, setApplicationId] = useState(preselectedAppId || '');
  const [docType, setDocType] = useState('CNIC');
  const [filePath, setFilePath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoadingApps(true);
        const data = await listApplications();
        // Filter by user if not staff
        const relevant =
          user?.id && !user.is_staff
            ? data.filter((app) => app.user === user.id)
            : data;
        setApplications(relevant);
        if (!preselectedAppId && relevant.length > 0) {
          setApplicationId(String(relevant[0].id));
        }
      } catch (err) {
        console.error('Failed to load applications for dropdown:', err);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, [user, preselectedAppId]);

  const validate = () => {
    const errs = {};
    if (!applicationId) {
      errs.applicationId = 'Please select an application docket.';
    }
    if (!docType) {
      errs.docType = 'Please select a document type.';
    }
    if (!filePath.trim()) {
      errs.filePath = 'File path or storage key is required.';
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

      const payload = {
        application: parseInt(applicationId, 10),
        doc_type: docType,
        file_path: filePath.trim(),
        verification_status: 'Manual Review',
      };

      await createDocument(payload);
      navigate(`/applications/${applicationId}`);
    } catch (err) {
      console.error('Error attaching document record:', err);
      let msg = 'Failed to submit document record. Verify inputs.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          msg = Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ');
        } else if (typeof data === 'string') {
          msg = data;
        }
      }
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingApps) {
    return <Loader message="Loading application dockets..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto py-10 space-y-6"
    >
      <Link
        to={applicationId ? `/applications/${applicationId}` : '/dashboard'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Application</span>
      </Link>

      <div className="bg-white dark:bg-[#20212B] p-8 sm:p-10 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#20212B] dark:text-[#f3f4f6]">
            Attach Admission Document
          </h1>
          <p className="text-xs text-[#73766A] dark:text-slate-400">
            Link an identification or academic credential to your admission application.
          </p>
        </div>

        {/* Server Error alert */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* No applications warning */}
        {applications.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FED7A5]/15 dark:bg-[#FED7A5]/10 border border-[#FED7A5]/40 text-center space-y-3">
            <FolderOpen className="w-8 h-8 text-[#9E6752] mx-auto" />
            <h3 className="text-sm font-bold text-[#20212B] dark:text-[#f3f4f6]">No Applications Available</h3>
            <p className="text-xs text-[#73766A] dark:text-slate-300 max-w-sm mx-auto">
              You must submit an admission application before you can attach verification documents.
            </p>
            <div className="pt-1">
              <Link
                to="/new-application"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Create Application First
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Application Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#20212B] dark:text-[#f3f4f6] mb-1.5">
                Target Application Docket
              </label>
              <select
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-sm focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id} className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">
                    Application #{app.id} — CNIC: {app.cnic} ({app.status})
                  </option>
                ))}
              </select>
              {errors.applicationId && (
                <p className="text-[11px] text-[#9E6752] mt-1">{errors.applicationId}</p>
              )}
            </div>

            {/* Document Type Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#20212B] dark:text-[#f3f4f6] mb-1.5">
                Document Classification
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-sm focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
              >
                <option value="CNIC" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">National Identity Card (CNIC / B-Form)</option>
                <option value="Birth Certificate" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Birth Certificate</option>
                <option value="SSC Marksheet" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Secondary School Certificate (SSC / Matric)</option>
                <option value="HSSC Marksheet" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Higher Secondary Certificate (HSSC / Inter)</option>
                <option value="Passport Photo" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Passport Size Photograph</option>
                <option value="Character Certificate" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Character / Domicile Certificate</option>
              </select>
              {errors.docType && (
                <p className="text-[11px] text-[#9E6752] mt-1">{errors.docType}</p>
              )}
            </div>

            {/* File Path input */}
            <div>
              <label className="block text-xs font-semibold text-[#20212B] dark:text-[#f3f4f6] mb-1.5">
                Document File Path / Storage URI
              </label>
              <input
                type="text"
                required
                placeholder="e.g. uploads/student_cnic_front.png or /docs/matric_cert.pdf"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm focus:outline-hidden bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6] ${
                  errors.filePath
                    ? 'border-[#9E6752] focus:border-[#9E6752]'
                    : 'border-[#73766A]/30 dark:border-[#73766A]/40 focus:border-[#2D4354] dark:focus:border-[#FED7A5]'
                }`}
              />
              <p className="text-[11px] text-[#73766A] dark:text-slate-400 mt-1">
                Specify document reference path stored in cloud/storage bucket.
              </p>
              {errors.filePath && (
                <p className="text-[11px] text-[#9E6752] mt-1">{errors.filePath}</p>
              )}
            </div>

            {/* Verification Status Notice */}
            <div className="p-3.5 rounded-xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 flex items-center justify-between text-xs text-[#73766A] dark:text-slate-400">
              <span>Initial Verification Stage:</span>
              <span className="font-semibold text-[#2D4354] dark:text-[#FED7A5] bg-[#FED7A5]/25 dark:bg-[#2D4354]/40 px-2.5 py-1 rounded-lg border border-[#FED7A5]/40">
                Manual Review
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to={applicationId ? `/applications/${applicationId}` : '/dashboard'}
                className="px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs font-semibold text-[#73766A] dark:text-slate-300 hover:bg-[#73766A]/10 transition"
              >
                Cancel
              </Link>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] disabled:opacity-50 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white dark:border-[#20212B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Attach Document</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default DocumentUpload;
