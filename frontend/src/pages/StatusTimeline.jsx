import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApplication, listApplications } from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  Clock,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

const StatusTimeline = () => {
  const [searchParams] = useSearchParams();
  const urlAppId = searchParams.get('id');

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(urlAppId || '');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const apps = await listApplications();
        setApplications(apps || []);

        const targetId = urlAppId || (apps.length > 0 ? apps[0].id : null);
        if (targetId) {
          setSelectedAppId(String(targetId));
          const appData = await getApplication(targetId);
          setApplication(appData);
        }
      } catch (err) {
        console.error('Error fetching timeline applications:', err);
        setError('Failed to load application history.');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [urlAppId]);

  const handleSelectApp = async (id) => {
    setSelectedAppId(id);
    try {
      setLoading(true);
      const appData = await getApplication(id);
      setApplication(appData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Application Created',
      desc: 'Applicant submitted CNIC & Date of Birth credentials into registry.',
      status: 'completed',
    },
    {
      title: 'Document Attachment',
      desc: 'Verification certificates provided and queued for registrar inspection.',
      status: application?.status !== 'Pending' ? 'completed' : 'in_progress',
    },
    {
      title: 'Manual Review & Clearance',
      desc: 'Admissions committee authenticates candidate credentials and academic thresholds.',
      status:
        application?.status === 'Complete'
          ? 'completed'
          : application?.status === 'Manual Review'
          ? 'in_progress'
          : 'upcoming',
    },
    {
      title: 'Enrollment Finalized',
      desc: 'Formal admission granted; student roll number issued for campus orientation.',
      status: application?.status === 'Complete' ? 'completed' : 'upcoming',
    },
  ];

  if (loading && !application) {
    return <Loader message="Generating status timeline..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-10 space-y-8"
    >
      {/* Top back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to={application ? `/applications/${application.id}` : '/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73766A] hover:text-[#2D4354] dark:hover:text-[#FED7A5] transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Docket</span>
        </Link>

        {applications.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#73766A] dark:text-slate-400">Select Docket:</span>
            <select
              value={selectedAppId}
              onChange={(e) => handleSelectApp(e.target.value)}
              className="px-3 py-2 min-h-[44px] rounded-xl border border-[#73766A]/30 dark:border-[#73766A]/40 text-xs bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6] font-medium focus:outline-hidden"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id} className="bg-white dark:bg-[#1a1b23] text-[#20212B] dark:text-[#f3f4f6]">
                  #{app.id} ({app.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#9E6752]/10 border border-[#9E6752]/30 text-[#9E6752] text-xs">
          {error}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white dark:bg-[#20212B] rounded-3xl border border-[#73766A]/20 dark:border-[#73766A]/30 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#73766A]/10 dark:border-[#73766A]/20">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FED7A5]/30 dark:bg-[#FED7A5]/20 text-[#2D4354] dark:text-[#FED7A5] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-[#20212B] dark:text-[#f3f4f6]">
                Admission Status Progression
              </h1>
            </div>
            <p className="text-xs text-[#73766A] dark:text-slate-400 mt-1">
              Tracking Application Docket #{application?.id || 'N/A'}
            </p>
          </div>

          {application && <StatusBadge status={application.status} />}
        </div>

        {/* Visual Timeline Steps */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#73766A]/20 dark:before:bg-[#73766A]/30">
          {steps.map((st, idx) => {
            const isCompleted = st.status === 'completed';
            const isInProgress = st.status === 'in_progress';

            return (
              <div key={idx} className="relative group">
                {/* Node icon indicator */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-[#73766A] text-white ring-4 ring-white dark:ring-[#20212B]'
                      : isInProgress
                      ? 'bg-[#2D4354] dark:bg-[#FED7A5] text-[#FED7A5] dark:text-[#20212B] ring-4 ring-white dark:ring-[#20212B] animate-pulse'
                      : 'bg-[#73766A]/20 dark:bg-[#73766A]/30 text-[#73766A] dark:text-slate-400 ring-4 ring-white dark:ring-[#20212B]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isCompleted
                          ? 'text-[#20212B] dark:text-[#f3f4f6]'
                          : isInProgress
                          ? 'text-[#2D4354] dark:text-[#FED7A5]'
                          : 'text-[#73766A] dark:text-slate-400'
                      }`}
                    >
                      {st.title}
                    </h3>
                    {isInProgress && (
                      <span className="text-[10px] font-bold bg-[#FED7A5]/30 text-[#2D4354] dark:bg-[#FED7A5]/20 dark:text-[#FED7A5] px-2 py-0.5 rounded-full border border-[#FED7A5]/40">
                        Current Stage
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#73766A] dark:text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* History / Audit Log */}
        <div className="pt-6 border-t border-[#73766A]/10 dark:border-[#73766A]/20 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#73766A] dark:text-slate-400">
            System Event Log & Audit History
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#20212B] dark:text-[#f3f4f6]">Initial Submission Recorded</span>
                <p className="text-[11px] text-[#73766A] dark:text-slate-400">CNIC: {application?.cnic}</p>
              </div>
              <span className="text-[11px] font-mono text-[#73766A] dark:text-slate-400">System Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-[#fcfbf9] dark:bg-[#1a1b23] border border-[#73766A]/20 dark:border-[#73766A]/30 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#20212B] dark:text-[#f3f4f6]">Current Assigned Status</span>
                <p className="text-[11px] text-[#73766A] dark:text-slate-400">Stage: {application?.status}</p>
              </div>
              <span className="text-[11px] font-mono text-[#73766A] dark:text-slate-400">Admissions Queue</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusTimeline;
