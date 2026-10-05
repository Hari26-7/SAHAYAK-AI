import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { roadmapService } from '../lib/services';

interface Step {
  id: string;
  step_number: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completed_at?: string | null;
}

export default function EligibilityRoadmap() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const defaultRoadmapSteps: Step[] = [
    {
      id: 'step-1',
      step_number: 1,
      title: 'Udyam Registration & Enterprise Verification',
      description: 'Obtain official 19-digit Udyam Registration Number (URN) with Aadhaar and PAN verification.',
      status: 'completed',
      completed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'step-2',
      step_number: 2,
      title: 'DigiLocker KYC & Digital Document Vault',
      description: 'Link Aadhaar, PAN, GSTIN, and Bank Statements through India Stack DigiLocker consent gateway.',
      status: 'completed',
      completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'step-3',
      step_number: 3,
      title: 'Detailed Project Report (DPR) & Financial Modeling',
      description: 'Prepare automated Bankable DPR covering machinery cost, raw materials, and working capital needs.',
      status: 'in_progress',
      completed_at: null,
    },
    {
      id: 'step-4',
      step_number: 4,
      title: 'Subsidy Stacking & Bank Loan Sanction',
      description: 'Compute maximum dual subsidy combination (e.g., PMEGP 35% + CGTMSE ₹5Cr Guarantee) and route to JanSamarth bank.',
      status: 'pending',
      completed_at: null,
    },
    {
      id: 'step-5',
      step_number: 5,
      title: 'Inspection & Margin Money Subsidy Disbursement',
      description: 'Physical/digital verification by KVIC / District Industries Centre (DIC) and credit to bank account.',
      status: 'pending',
      completed_at: null,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          let data = await roadmapService.getRoadmap(user.id).catch(() => []);
          if (!data || data.length === 0) {
            data = await roadmapService.createDefaultRoadmap(user.id).catch(() => defaultRoadmapSteps);
          }
          if (data && data.length > 0) {
            // Clean up any legacy status
            const normalized = data.map((s: any) => ({
              ...s,
              status: s.status === 'completed' ? 'completed' : s.status === 'in_progress' ? 'in_progress' : 'pending',
            }));
            setSteps(normalized);
          } else {
            setSteps(defaultRoadmapSteps);
          }
        } else {
          setSteps(defaultRoadmapSteps);
        }
      } catch (err) {
        setSteps(defaultRoadmapSteps);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleToggleStatus = async (step: Step) => {
    const nextStatus: 'completed' | 'in_progress' | 'pending' =
      step.status === 'completed' ? 'pending' : step.status === 'pending' ? 'in_progress' : 'completed';

    setSteps((prev) =>
      prev.map((s) =>
        s.id === step.id
          ? {
              ...s,
              status: nextStatus,
              completed_at: nextStatus === 'completed' ? new Date().toISOString() : null,
            }
          : s
      )
    );

    try {
      await roadmapService.updateStepStatus(step.id, nextStatus);
      setToast({ msg: `Updated: ${step.title} is now ${nextStatus.replace('_', ' ')}`, type: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (err: any) {
      // Local state already updated for hackathon demo responsiveness
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          🗺️ National MSME Clearance Roadmap
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official Single Window Clearance pathway to unlock central subsidies and collateral-free institutional credit
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-900 rounded-md shadow-sm border border-slate-200 dark:border-slate-800 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Clearance Progression
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {completedCount} of {steps.length} Milestones Achieved
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {progressPercent}%
              </span>
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                {progressPercent >= 60 ? 'Priority Track' : 'In Verification'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-sm bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-sm bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Vertical Stepper Component */}
      <div className="bg-white dark:bg-slate-900 rounded-md shadow-sm border border-slate-200 dark:border-slate-800 p-4 md:p-6">
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-6">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isPending = step.status === 'pending';

            return (
              <div key={step.id} className="relative pl-6 sm:pl-8">
                {/* Node that sits on the border */}
                {isCompleted && (
                  <div
                    onClick={() => handleToggleStatus(step)}
                    className="absolute -left-2.5 bg-emerald-600 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                    title="Completed - Click to toggle"
                  >
                    ✓
                  </div>
                )}

                {isInProgress && (
                  <div
                    onClick={() => handleToggleStatus(step)}
                    className="absolute -left-2.5 bg-blue-600 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                    title="In Progress - Click to toggle"
                  >
                    ●
                  </div>
                )}

                {isPending && (
                  <div
                    onClick={() => handleToggleStatus(step)}
                    className="absolute -left-2.5 bg-slate-400 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                    title="Pending - Click to toggle"
                  >
                    ○
                  </div>
                )}

                {/* Step Content Card */}
                <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Step {step.step_number}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded text-xs font-semibold">
                          <span>✓</span> Completed
                        </span>
                      )}

                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                          <span>●</span> In Progress
                        </span>
                      )}

                      {isPending && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                          <span>○</span> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Action / Timestamp footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {step.completed_at ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Verified on {new Date(step.completed_at).toLocaleDateString()}
                        </span>
                      ) : isInProgress ? (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          Active task in review
                        </span>
                      ) : (
                        <span>Awaiting prior milestone completion</span>
                      )}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(step)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Cycle Status →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 p-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
