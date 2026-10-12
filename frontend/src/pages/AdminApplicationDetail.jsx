import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApplication, updateApplication } from '../api/applications';
import { listDocuments, updateDocument } from '../api/documents';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Save,
  Check,
  XCircle,
  Clock,
} from 'lucide-react';

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status modification state
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');
  const [statusError, setStatusError] = useState('');

  // Updating single document state
  const [docUpdatingId, setDocUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const appData = await getApplication(id);
      setApplication(appData);
      setNewStatus(appData.status);

      const allDocs = await listDocuments();
      const appDocs = (allDocs || []).filter(
        (d) => String(d.application) === String(id)
      );
      setDocuments(appDocs);
    } catch (err) {
      console.error('Error fetching admin application detail:', err);
      setError('Unable to load application information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setStatusError('');
    setStatusSuccess('');

    try {
      setUpdatingStatus(true);
      const payload = {
        user: application.user,
        dob: application.dob,
        cnic: application.cnic,
        status: newStatus,
      };
      const updated = await updateApplication(id, payload);
      setApplication(updated);
      setStatusSuccess(`Application status successfully updated to "${newStatus}".`);
      setTimeout(() => setStatusSuccess(''), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      setStatusError('Failed to change application status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateDocStatus = async (doc, targetStatus) => {
    try {
      setDocUpdatingId(doc.id);
      const payload = {
        application: doc.application,
        doc_type: doc.doc_type,
        file_path: doc.file_path,
        verification_status: targetStatus,
      };
      const updated = await updateDocument(doc.id, payload);
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? updated : d))
      );
    } catch (err) {
      console.error('Failed to update document verification status:', err);
      alert('Could not update document verification status.');
    } finally {
      setDocUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader message="Loading candidate review docket..." />;
  }

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-[#9E6752]/10 text-[#9E6752] text-xs">
          {error || 'Application not found'}
        </div>
        <Link
          to="/admin/queue"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:text-[#20212B] text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Review Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto py-8 space-y-8"
    >
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/queue"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </Link>

        <span className="text-xs font-mono text-[#73766A] dark:text-slate-400">Owner User #{application.user}</span>
      </div>

      {/* Main Review Card */}
      <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#73766A]/10 dark:border-[#73766A]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#20212B] dark:text-[#f3f4f6]">
                  Officer Review: Docket #{application.id}
                </h1>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-xs text-[#73766A] dark:text-slate-400 mt-0.5">
                Submitted by User ID #{application.user}
              </p>
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#73766A] dark:text-slate-400">
              <Calendar className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              <span>Date of Birth</span>
            </div>
            <span className="font-semibold text-[#20212B] dark:text-[#f3f4f6] text-sm">{application.dob}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#73766A] dark:text-slate-400">
              <CreditCard className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              <span>CNIC / B-Form</span>
            </div>
            <span className="font-mono font-semibold text-[#20212B] dark:text-[#f3f4f6] text-sm">
              {application.cnic}
            </span>
          </div>
        </div>

        {/* Change Status Control Box */}
        <div className="p-5 rounded-2xl bg-[#FED7A5]/15 dark:bg-[#FED7A5]/10 border border-[#FED7A5]/30 space-y-3">
          <h3 className="text-xs font-bold text-[#20212B] dark:text-[#f3f4f6] uppercase tracking-wider">
            Adjudicate Application Status
          </h3>

          {statusSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{statusSuccess}</span>
            </div>
          )}

          {statusError && (
            <div className="p-2.5 rounded-xl bg-[#9E6752]/10 text-[#9E6752] text-xs flex items-center gap-2 border border-[#9E6752]/30">
              <AlertCircle className="w-4 h-4 text-[#9E6752]" />
              <span>{statusError}</span>
            </div>
          )}

          <form onSubmit={handleStatusChange} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs sm:text-sm font-medium bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6] focus:outline-hidden"
            >
              <option value="Pending" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Pending (Awaiting Initial Documents)</option>
              <option value="Manual Review" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Manual Review (Under Formal Inspection)</option>
              <option value="Complete" className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">Complete (Admission Approved & Finalized)</option>
            </select>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={updatingStatus || newStatus === application.status}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] disabled:opacity-40 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {updatingStatus ? (
                <span className="inline-block w-4 h-4 border-2 border-white dark:border-[#20212B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>

      {/* Verification Documents Review */}
      <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#20212B] dark:text-[#f3f4f6]">
            Attached Verification Documents ({documents.length})
          </h2>
          <p className="text-xs text-[#73766A] dark:text-slate-400">
            Verify submitted credentials and mark verification status.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#fcfbf9] dark:bg-[#1a1b23] text-center text-xs text-[#73766A] dark:text-slate-400 border border-[#73766A]/20">
            No verification documents attached by the applicant yet.
          </div>
        ) : (
          <div className="divide-y divide-[#73766A]/10 dark:divide-[#73766A]/20">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#20212B] dark:text-[#f3f4f6]">{doc.doc_type}</span>
                    <StatusBadge status={doc.verification_status} size="small" />
                  </div>
                  <p className="font-mono text-[#73766A] dark:text-slate-400 text-[11px]">Storage: {doc.file_path}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleUpdateDocStatus(doc, 'Verified')}
                    disabled={docUpdatingId === doc.id || doc.verification_status === 'Verified'}
                    className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-xl bg-[#73766A]/15 hover:bg-[#73766A]/25 text-[#2D4354] dark:text-[#FED7A5] font-semibold text-[11px] disabled:opacity-40 transition cursor-pointer"
                    title="Mark Verified"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => handleUpdateDocStatus(doc, 'Missing')}
                    disabled={docUpdatingId === doc.id || doc.verification_status === 'Missing'}
                    className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-xl bg-[#9E6752]/15 hover:bg-[#9E6752]/25 text-[#9E6752] font-semibold text-[11px] disabled:opacity-40 transition cursor-pointer"
                    title="Mark Missing"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missing</span>
                  </button>

                  <button
                    onClick={() => handleUpdateDocStatus(doc, 'Manual Review')}
                    disabled={docUpdatingId === doc.id || doc.verification_status === 'Manual Review'}
                    className="inline-flex items-center gap-1 px-3 py-2 min-h-[38px] rounded-xl bg-[#FED7A5]/25 hover:bg-[#FED7A5]/35 text-[#2D4354] dark:text-[#FED7A5] font-semibold text-[11px] disabled:opacity-40 transition cursor-pointer"
                    title="Flag Manual Review"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminApplicationDetail;
