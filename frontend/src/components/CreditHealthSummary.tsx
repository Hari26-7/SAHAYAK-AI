import React from 'react';

interface CreditHealthSummaryProps {
  score: number;
  ratingTier?: string;
  totalDebt: number;
  monthlyEMI: number;
  turnover: number;
  activeLoans: number;
}

export const CreditHealthSummary: React.FC<CreditHealthSummaryProps> = ({
  score,
  totalDebt,
  monthlyEMI,
  turnover,
  activeLoans,
}) => {
  // Determine Credit Tier & Dynamic Badge
  const getTierInfo = (scoreVal: number) => {
    if (scoreVal >= 750) {
      return {
        tier: 'Excellent (Prime Tier)',
        badgeClass:
          'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        barColor: 'bg-emerald-600',
        message: 'Prime — Eligible for instant low-interest collateral-free schemes (PMEGP, CGTMSE, Stand-Up India)',
        icon: '✓',
      };
    } else if (scoreVal >= 650) {
      return {
        tier: 'Good (Moderate Tier)',
        badgeClass:
          'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        barColor: 'bg-blue-600',
        message: 'Moderate — Eligible for collateral-free schemes (MUDRA Kishore/Tarun, CGTMSE)',
        icon: '✓',
      };
    } else if (scoreVal >= 550) {
      return {
        tier: 'Fair (Conditional Tier)',
        badgeClass:
          'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        barColor: 'bg-amber-600',
        message: 'Fair — Requires margin money participation (15%–25%) or co-guarantor',
        icon: '⚠️',
      };
    } else {
      return {
        tier: 'Needs Improvement',
        badgeClass:
          'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-700',
        barColor: 'bg-red-600',
        message: 'Needs Attention — Micro Credit counseling recommended under Udyam Assist Scheme',
        icon: '!',
      };
    }
  };

  const tierInfo = getTierInfo(score);
  const percentage = Math.min(Math.max(((score - 300) / (900 - 300)) * 100, 5), 100);

  // Compute Debt-to-Income / Debt Service Ratio if turnover > 0
  const annualEMI = monthlyEMI * 12;
  const debtServiceRatio = turnover > 0 ? Math.round((annualEMI / turnover) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 md:p-6 shadow-sm mb-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            Official MSME Credit Readiness
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 uppercase tracking-wide">
            Credit Health & Solvency Gauge
          </h2>
        </div>

        {/* Dynamic Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${tierInfo.badgeClass}`}
        >
          <span>{tierInfo.icon}</span>
          <span>{tierInfo.message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
        {/* Visual Gauge Bar */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Current CIBIL / Bureau Score
          </span>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">
            {score > 0 ? score : 'N/A'}
          </div>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            {tierInfo.tier}
          </span>

          {/* Meter Bar */}
          <div className="w-full mt-3">
            <div className="w-full h-2 rounded-sm bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-sm ${tierInfo.barColor} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
              <span>300 (Poor)</span>
              <span>650 (Good)</span>
              <span>900 (Max)</span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Summary */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Total Outstanding Debt
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              ₹{totalDebt.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{activeLoans} Active Account(s)</div>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Monthly Debt Outflow (EMI)
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              ₹{monthlyEMI.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">₹{(monthlyEMI * 12).toLocaleString('en-IN')} / year</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Debt Service Ratio
            </div>
            <div
              className={`text-base sm:text-lg font-bold mt-1 ${
                debtServiceRatio <= 30
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : debtServiceRatio <= 50
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {debtServiceRatio > 0 ? `${debtServiceRatio}%` : 'Healthy (<15%)'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {debtServiceRatio <= 40 ? '✓ Bank Lending Safe' : 'Review EMI Burden'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
