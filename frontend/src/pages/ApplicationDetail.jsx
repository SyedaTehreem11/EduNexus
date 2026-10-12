import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApplication, updateApplication, deleteApplication } from '../api/applications';
import { listDocuments, deleteDocument } from '../api/documents';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  FileText,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Clock,
  Save,
  X,
} from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStaff } = useAuth();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit application state
  const [isEditing, setIsEditing] = useState(false);
  const [editDob, setEditDob] = useState('');
  const [editCnic, setEditCnic] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleting, setDeleting] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const appData = await getApplication(id);
      setApplication(appData);
      setEditDob(appData.dob || '');
      setEditCnic(appData.cnic || '');
      setEditStatus(appData.status || 'Pending');

      const allDocs = await listDocuments();
      const appDocs = (allDocs || []).filter(
        (doc) => String(doc.application) === String(id)
      );
      setDocuments(appDocs);
    } catch (err) {
      console.error('Error fetching application detail:', err);
      setError('Failed to load application details. It may not exist or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
    setEditCnic(formatted);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');

    if (editDob > todayStr) {
      setEditError('Date of Birth cannot be in the future.');
      return;
    }

    const digits = editCnic.replace(/\D/g, '');
    if (digits.length !== 13) {
      setEditError('CNIC / B-Form must contain 13 digits (format: 35404-3451903-1).');
      return;
    }

    try {
      setSavingEdit(true);
      const payload = {
        user: application.user,
        dob: editDob,
        cnic: editCnic,
        status: editStatus,
      };
      const updated = await updateApplication(id, payload);
      setApplication(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      setEditError(
        err.response?.data?.detail || 'Failed to update application. Verify inputs.'
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this admission application docket? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteApplication(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete application failed:', err);
      alert('Failed to delete application. Please try again.');
      setDeleting(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this attached document record?')) {
      return;
    }

    try {
      await deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (err) {
      console.error('Delete document failed:', err);
      alert('Unable to delete document record.');
    }
  };

  if (loading) {
    return <Loader message="Loading application details..." />;
  }

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-[#9E6752]/15 border border-[#9E6752] text-[#9E6752] dark:text-[#FED7A5] text-sm">
          {error || 'Application not found.'}
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D4354] dark:bg-[#FED7A5] text-white dark:text-[#20212B] rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
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
      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/status-timeline?id=${application.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FED7A5]/30 text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/50 text-xs font-semibold border border-[#73766A]/20 transition min-h-[44px]"
          >
            <Clock className="w-3.5 h-3.5 text-[#9E6752]" />
            <span>Timeline</span>
          </Link>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#20212B] text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/20 border border-[#73766A]/30 text-xs font-semibold transition min-h-[44px] cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Docket'}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDeleteApplication}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9E6752]/15 text-[#9E6752] dark:text-[#FED7A5] hover:bg-[#9E6752]/25 text-xs font-semibold border border-[#9E6752] transition min-h-[44px] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/20 dark:border-[#534145] p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#73766A]/20 dark:border-[#534145]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#20212B] dark:text-[#FED7A5]">
                  Application Docket #{application.id}
                </h1>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-xs text-[#73766A]">Owner User ID: #{application.user}</p>
            </div>
          </div>
        </div>

        {/* Edit Form or Readonly View */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4 p-5 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145]">
            <h3 className="text-sm font-semibold text-[#20212B] dark:text-[#FED7A5]">Edit Application Details</h3>

            {editError && (
              <div className="p-3 rounded-xl bg-[#9E6752]/15 text-[#9E6752] dark:text-[#FED7A5] text-xs border border-[#9E6752]">
                {editError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  max={todayStr}
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/30 dark:border-[#534145] text-sm text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752]"
                />
                <p className="text-[11px] text-[#73766A] mt-1">Applicant date of birth must be a past date.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
                  CNIC Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={editCnic}
                  onChange={handleCnicChange}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/30 dark:border-[#534145] text-sm font-mono text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752]"
                />
                <p className="text-[11px] text-[#73766A] mt-1">Format: 35404-3451903-1</p>
              </div>
            </div>

            {isStaff && (
              <div>
                <label className="block text-xs font-medium text-[#2D4354] dark:text-[#FED7A5] mb-1">
                  Application Status (Staff Admin Control)
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/30 dark:border-[#534145] text-sm text-[#20212B] dark:text-[#FED7A5] focus:outline-hidden focus:ring-2 focus:ring-[#9E6752]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Manual Review">Manual Review</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-[#73766A]/30 text-xs font-medium text-[#534145] dark:text-[#FED7A5] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2D4354] dark:bg-[#FED7A5] text-white dark:text-[#20212B] text-xs font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#73766A]">
                <Calendar className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
                <span>Date of Birth</span>
              </div>
              <span className="font-semibold text-[#20212B] dark:text-[#FED7A5] text-sm">{application.dob}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-[#73766A]/20 dark:border-[#534145] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#73766A]">
                <CreditCard className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
                <span>CNIC / B-Form</span>
              </div>
              <span className="font-mono font-semibold text-[#20212B] dark:text-[#FED7A5] text-sm">
                {application.cnic}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/20 dark:border-[#534145] p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">
              Attached Documents ({documents.length})
            </h2>
            <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70">
              Identity cards, academic marksheets, and birth certificates linked to this docket.
            </p>
          </div>

          <Link
            to={`/document-upload?applicationId=${application.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white text-xs font-semibold rounded-xl shadow-xs transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] border border-dashed border-[#73766A]/30 dark:border-[#534145] text-center space-y-3">
            <FileCheck className="w-8 h-8 text-[#73766A] mx-auto" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5]">
                No verification documents attached yet
              </h4>
              <p className="text-[11px] text-[#73766A]">
                Attach your CNIC or academic records so admissions counselors can verify your application.
              </p>
            </div>
            <Link
              to={`/document-upload?applicationId=${application.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-white dark:bg-[#2D4354] border border-[#73766A]/30 text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/20 rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach First Document</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#73766A]/20 dark:divide-[#534145]">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#20212B] dark:text-[#FED7A5]">{doc.doc_type}</span>
                    <StatusBadge status={doc.verification_status} size="small" />
                  </div>
                  <div className="font-mono text-[#73766A] text-[11px]">
                    Path: {doc.file_path}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-2 text-[#73766A] hover:text-[#9E6752] hover:bg-[#9E6752]/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    title="Delete document record"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default ApplicationDetail;
