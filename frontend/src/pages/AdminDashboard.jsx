import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listApplications } from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  ShieldAlert,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ListFilter,
  FileQuestion,
} from 'lucide-react';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Unable to fetch admissions applications from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const total = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const reviewCount = applications.filter((a) => a.status === 'Manual Review').length;
  const completeCount = applications.filter((a) => a.status === 'Complete').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-8 space-y-8 max-w-6xl mx-auto"
    >
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#20212B] p-6 sm:p-8 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] text-xs font-bold border border-[#FED7A5]/40">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admissions Staff Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20212B] dark:text-[#f3f4f6] tracking-tight mt-2">
            Admissions Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#73766A] dark:text-slate-400 mt-1">
            Real-time telemetry and metrics for candidate submissions, audits, and verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/queue"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <ListFilter className="w-4 h-4" />
            <span>Open Review Queue</span>
          </Link>
          <Link
            to="/admin/faqs"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#fcfbf9] hover:bg-[#73766A]/10 dark:bg-[#1a1b23] dark:hover:bg-[#1a1b23]/80 text-[#20212B] dark:text-[#f3f4f6] border border-[#73766A]/30 dark:border-[#73766A]/40 rounded-xl text-xs font-semibold transition"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Manage FAQs</span>
          </Link>
        </div>
      </div>

      {loading && <Loader message="Compiling application registry metrics..." />}

      {!loading && error && (
        <div className="p-4 rounded-2xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchStats}
            className="px-3 py-1 bg-white dark:bg-[#1a1b23] rounded-lg border border-[#9E6752]/40 text-[#9E6752] hover:bg-[#9E6752]/10 min-h-[36px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metrics Counters Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#20212B] border border-[#2D4354]/30 dark:border-[#2D4354]/50 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#73766A] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
                <Users className="w-4 h-4 text-[#2D4354] dark:text-[#FED7A5]" />
              </div>
              <div className="text-3xl font-extrabold text-[#20212B] dark:text-[#f3f4f6]">{total}</div>
              <p className="text-[11px] text-[#73766A] dark:text-slate-400">All submissions in database</p>
            </div>

            {/* Pending */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#20212B] border border-[#9E6752]/40 dark:border-[#9E6752]/50 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#9E6752]">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
                <Clock className="w-4 h-4 text-[#9E6752]" />
              </div>
              <div className="text-3xl font-extrabold text-[#9E6752]">{pendingCount}</div>
              <p className="text-[11px] text-[#9E6752]/80">Awaiting initial document audit</p>
            </div>

            {/* Manual Review */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#20212B] border border-[#9E6752]/30 dark:border-[#534145]/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#534145] dark:text-[#FED7A5]">
                <span className="text-xs font-bold uppercase tracking-wider">Manual Review</span>
                <AlertCircle className="w-4 h-4 text-[#9E6752] dark:text-[#FED7A5]" />
              </div>
              <div className="text-3xl font-extrabold text-[#534145] dark:text-[#FED7A5]">{reviewCount}</div>
              <p className="text-[11px] text-[#73766A] dark:text-slate-400">In desk evaluation stage</p>
            </div>

            {/* Complete */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#20212B] border border-[#73766A]/40 dark:border-[#73766A]/50 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#73766A] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Complete Verified</span>
                <CheckCircle2 className="w-4 h-4 text-[#73766A] dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-[#2D4354] dark:text-[#FED7A5]">{completeCount}</div>
              <p className="text-[11px] text-[#73766A] dark:text-slate-400">Approved and verified admissions</p>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#20212B] dark:text-[#f3f4f6]">Recent Applications</h2>
                <p className="text-xs text-[#73766A] dark:text-slate-400">Latest admission candidates awaiting review</p>
              </div>
              <Link
                to="/admin/queue"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D4354] dark:text-[#FED7A5] hover:underline min-h-[44px]"
              >
                <span>View Full Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#73766A] dark:text-slate-400">
                No applications submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-[#73766A]/10 dark:divide-[#73766A]/20">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#20212B] dark:text-[#f3f4f6]">Docket #{app.id}</span>
                        <StatusBadge status={app.status} size="small" />
                      </div>
                      <div className="text-[11px] text-[#73766A] dark:text-slate-400 flex flex-wrap items-center gap-3">
                        <span>User PK: {app.user}</span>
                        <span>CNIC: {app.cnic}</span>
                        <span>DOB: {app.dob}</span>
                      </div>
                    </div>

                    <Link
                      to={`/admin/applications/${app.id}`}
                      className="self-start sm:self-center inline-flex items-center gap-1 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#2D4354]/10 hover:bg-[#2D4354]/20 dark:bg-[#FED7A5]/20 dark:hover:bg-[#FED7A5]/30 text-[#2D4354] dark:text-[#FED7A5] text-xs font-semibold transition"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
