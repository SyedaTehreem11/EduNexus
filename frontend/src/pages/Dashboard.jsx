import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listApplications } from '../api/applications';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  FileText,
  Plus,
  ArrowRight,
  AlertCircle,
  Calendar,
  CreditCard,
  RefreshCw,
  FolderOpen,
  Eye,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listApplications();
      if (user?.id && !user.is_staff) {
        const userApps = data.filter((app) => app.user === user.id);
        setApplications(userApps.length > 0 ? userApps : data);
      } else {
        setApplications(data || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Unable to load applications from the admissions server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-8 space-y-8 max-w-6xl mx-auto"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#2D4354] p-6 sm:p-8 rounded-xl border border-[#73766A]/20 dark:border-[#534145] shadow-sm transition-colors duration-300">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#534145] dark:text-[#20212B] bg-[#FED7A5] px-2.5 py-1 rounded-md">
            Student Admissions Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#20212B] dark:text-[#FED7A5] tracking-tight mt-2.5">
            Welcome, {user?.username || 'Applicant'}
          </h1>
          <p className="text-[#534145] dark:text-[#FED7A5]/70 text-xs sm:text-sm mt-1">
            Track your ongoing admission applications, attach certificates, and monitor review stages.
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            to="/new-application"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </Link>
        </motion.div>
      </div>

      {/* Loading state */}
      {loading && <Loader message="Retrieving your admission files..." />}

      {/* Error state */}
      {!loading && error && (
        <div className="p-5 rounded-xl bg-[#9E6752]/15 border border-[#9E6752] text-[#9E6752] dark:text-[#FED7A5] text-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#9E6752]" />
            <div>
              <h4 className="font-semibold text-[#20212B] dark:text-[#FED7A5]">Connection Notice</h4>
              <p className="text-xs text-[#534145] dark:text-[#FED7A5]/80 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchApplications}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#20212B] border border-[#73766A]/30 rounded-xl text-xs font-semibold text-[#2D4354] dark:text-[#FED7A5] hover:bg-[#FED7A5]/20 transition cursor-pointer min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 px-4 rounded-xl bg-white dark:bg-[#2D4354] border border-[#73766A]/20 dark:border-[#534145] shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FED7A5]/40 text-[#2D4354] dark:text-[#FED7A5] mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">No Admission Applications Found</h3>
            <p className="text-xs text-[#73766A] dark:text-[#FED7A5]/70 max-w-md mx-auto">
              You haven't submitted an admission application docket yet. Start your submission to enroll.
            </p>
          </div>
          <div className="pt-2">
            <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/new-application"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D4354] hover:bg-[#534145] dark:bg-[#FED7A5] dark:text-[#20212B] hover:dark:bg-[#9E6752] text-white rounded-xl text-xs font-semibold shadow-xs transition min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Application</span>
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* Applications Cards Grid */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#20212B] dark:text-[#FED7A5]">
              Your Applications ({applications.length})
            </h2>
            <button
              onClick={fetchApplications}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-[#2D4354] rounded-xl border border-[#73766A]/20 dark:border-[#534145] p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FED7A5]/40 dark:bg-[#534145] text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#20212B] dark:text-[#FED7A5]">Docket #{app.id}</span>
                        <p className="text-[10px] text-[#73766A]">User ID: #{app.user}</p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Card Details */}
                  <div className="space-y-2 py-2 border-t border-b border-[#73766A]/15 dark:border-[#534145] text-xs text-[#534145] dark:text-[#FED7A5]/80">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#73766A]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Date of Birth</span>
                      </span>
                      <span className="font-semibold text-[#20212B] dark:text-[#FED7A5]">{app.dob}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#73766A]">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>CNIC / B-Form</span>
                      </span>
                      <span className="font-mono font-medium text-[#20212B] dark:text-[#FED7A5]">{app.cnic}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 flex items-center gap-2">
                  <Link
                    to={`/applications/${app.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#faf9f6] dark:bg-[#20212B] hover:bg-[#FED7A5]/25 text-[#2D4354] dark:text-[#FED7A5] border border-[#73766A]/20 dark:border-[#534145] text-xs font-semibold transition min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Edit</span>
                  </Link>

                  <Link
                    to={`/status-timeline?id=${app.id}`}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#FED7A5]/30 hover:bg-[#FED7A5]/50 text-[#2D4354] dark:text-[#FED7A5] border border-[#73766A]/20 text-xs font-semibold transition min-h-[44px] min-w-[44px]"
                    title="View Status Timeline"
                  >
                    <ArrowRight className="w-4 h-4 text-[#9E6752] dark:text-[#FED7A5]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
