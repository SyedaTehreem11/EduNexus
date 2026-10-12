import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listApplications } from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  ListFilter,
  Search,
  ArrowRight,
  RefreshCw,
  FolderOpen,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';

const AdminQueue = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load queue:', err);
      setError('Unable to load admissions queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    const matchesStatus =
      statusFilter === 'All' ? true : app.status === statusFilter;
    const matchesSearch =
      searchQuery === ''
        ? true
        : String(app.id).includes(searchQuery) ||
          (app.cnic && app.cnic.toLowerCase().includes(searchQuery.toLowerCase())) ||
          String(app.user).includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-8 space-y-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white dark:bg-[#20212B] p-6 sm:p-8 rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] text-xs font-bold border border-[#FED7A5]/40">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Admissions Review Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20212B] dark:text-[#f3f4f6] tracking-tight mt-2">
            Application Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#73766A] dark:text-slate-400 mt-1">
            Filter, inspect, and transition candidate admission files across verification phases.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={fetchApplications}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-[#fcfbf9] hover:bg-[#73766A]/10 dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6] rounded-xl text-xs font-semibold border border-[#73766A]/30 dark:border-[#73766A]/40 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#20212B] p-4 rounded-2xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Manual Review', 'Complete'].map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#2D4354] text-white dark:bg-[#FED7A5] dark:text-[#20212B] shadow-xs'
                    : 'bg-[#fcfbf9] dark:bg-[#1a1b23] text-[#73766A] dark:text-slate-300 hover:bg-[#73766A]/10'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73766A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by ID or CNIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs focus:border-[#2D4354] dark:focus:border-[#FED7A5] focus:outline-hidden bg-[#fcfbf9] dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]"
          />
        </div>
      </div>

      {loading && <Loader message="Filtering admission applications..." />}

      {!loading && error && (
        <div className="p-4 rounded-2xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-xs">
          {error}
        </div>
      )}

      {/* Applications Display: Stacked Cards for Mobile (< 768px), Table for Desktop (>= 768px) */}
      {!loading && !error && (
        <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-[#73766A]/50 mx-auto" />
              <p className="text-sm font-semibold text-[#20212B] dark:text-[#f3f4f6]">No matching applications in queue</p>
              <p className="text-xs text-[#73766A] dark:text-slate-400">Try adjusting your status filter or search parameters.</p>
            </div>
          ) : (
            <>
              {/* Mobile View: Stacked Cards */}
              <div className="md:hidden divide-y divide-[#73766A]/10 dark:divide-[#73766A]/20 p-2 sm:p-4 space-y-3">
                {filtered.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#20212B] dark:text-[#f3f4f6] text-sm">
                        Docket #{app.id}
                      </div>
                      <StatusBadge status={app.status} size="small" />
                    </div>

                    <div className="space-y-1.5 text-xs text-[#73766A] dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> User ID:
                        </span>
                        <span className="font-mono font-medium text-[#20212B] dark:text-white">#{app.user}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" /> CNIC:
                        </span>
                        <span className="font-mono font-medium text-[#20212B] dark:text-white">{app.cnic}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> DOB:
                        </span>
                        <span className="font-medium text-[#20212B] dark:text-white">{app.dob}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#2D4354] hover:bg-[#20212B] dark:bg-[#FED7A5] dark:hover:bg-white text-white dark:text-[#20212B] font-semibold text-xs transition"
                      >
                        <span>Review Docket #{app.id}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfbf9] dark:bg-[#1a1b23] border-b border-[#73766A]/10 dark:border-[#73766A]/20 text-[#73766A] dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Docket ID</th>
                      <th className="py-3.5 px-6">User ID</th>
                      <th className="py-3.5 px-6">Date of Birth</th>
                      <th className="py-3.5 px-6">CNIC / B-Form</th>
                      <th className="py-3.5 px-6">Current Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#73766A]/10 dark:divide-[#73766A]/20 text-[#20212B] dark:text-[#f3f4f6]">
                    {filtered.map((app) => (
                      <tr key={app.id} className="hover:bg-[#fcfbf9]/60 dark:hover:bg-[#1a1b23]/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#20212B] dark:text-[#f3f4f6]">#{app.id}</td>
                        <td className="py-4 px-6 font-mono text-[#73766A] dark:text-slate-400">User #{app.user}</td>
                        <td className="py-4 px-6">{app.dob}</td>
                        <td className="py-4 px-6 font-mono">{app.cnic}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={app.status} size="small" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/admin/applications/${app.id}`}
                            className="inline-flex items-center gap-1 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#2D4354]/10 hover:bg-[#2D4354]/20 dark:bg-[#FED7A5]/20 dark:hover:bg-[#FED7A5]/30 text-[#2D4354] dark:text-[#FED7A5] font-semibold transition"
                          >
                            <span>Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminQueue;
