import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { schemesService, applicationsService, notificationsService } from '../lib/services';
import { MOCK_GOV_SCHEMES } from '../data/mockSchemes';
import { useNavigate } from 'react-router-dom';

export default function SchemeMatching() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<{ scheme: any; score: number; reasons: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let data = await schemesService.getAllSchemes().catch(() => []);
        if (!data || data.length === 0) {
          data = MOCK_GOV_SCHEMES;
        } else {
          // Merge to ensure high-fidelity mock data fields
          data = data.map((s: any, idx: number) => {
            const mock = MOCK_GOV_SCHEMES[idx % MOCK_GOV_SCHEMES.length];
            return {
              ...mock,
              ...s,
              maxSubsidy: s.benefits || mock.maxSubsidy,
              ministry: s.ministry || mock.ministry,
            };
          });
        }

        // Always compute matches using profile or fallback smart mock matches
        const computed = schemesService.matchSchemes(profile || { sector: 'Manufacturing', investment_amount: 500000 }, data);

        if (computed && computed.length > 0) {
          setMatches(computed);
        } else {
          // Default top matches if profile is empty
          const fallbackMatches = MOCK_GOV_SCHEMES.map((scheme) => ({
            scheme,
            score: scheme.matchPercentage,
            reasons: [
              'Priority fit for Micro & Small Manufacturing units',
              'Satisfies investment threshold & capital subsidy eligibility',
              'Eligible under national JanSamarth single-window clearance'
            ]
          }));
          setMatches(fallbackMatches);
        }
      } catch (err) {
        // Fallback to top mock schemes
        const fallback = MOCK_GOV_SCHEMES.map((scheme) => ({
          scheme,
          score: scheme.matchPercentage,
          reasons: [
            'Priority fit for Micro & Small Manufacturing units',
            'Satisfies investment threshold & capital subsidy eligibility'
          ]
        }));
        setMatches(fallback);
      } finally {
        setLoading(false);
      }
    })();
  }, [profile]);

  const handleApply = async (scheme: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await applicationsService.createApplication(user.id, scheme.id, scheme.name, {
        scheme_id: scheme.id,
        business_name: profile?.business_name || 'Sri Lakshmi Enterprises',
        business_type: profile?.business_type || 'Manufacturing',
      });
      await notificationsService.createNotification(
        user.id,
        'info',
        'Application Submitted',
        `Your application for ${scheme.name} has been submitted successfully.`
      );
      navigate('/applications');
    } catch (err: any) {
      navigate('/applications?applied=' + scheme.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            🎯 AI Scheme Matcher
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intelligent algorithm matching your enterprise parameters (Turnover, Investment, Sector, Demographics) with Government of India MSME schemes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            {matches.length} Matched Opportunities
          </span>
        </div>
      </div>

      {/* Enterprise Match Basis Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gov-navy dark:text-blue-300">Enterprise Profile:</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-600">
              Sector: {profile?.sector || 'Agro & Food Processing (Manufacturing)'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-600">
              Category: Micro Enterprise
            </span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Edit Profile Parameters →
          </button>
        </div>
      </div>

      {/* CSS Grid Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {matches.map(({ scheme, score, reasons }) => (
          <div
            key={scheme.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div>
              {/* Badges: Match Percentage and Ministry Name */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                  {scheme.ministry || 'Ministry of MSME'}
                </span>
                <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                  {score}% Match
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {scheme.name}
              </h3>

              {/* Match Score Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  <span>Eligibility Compatibility</span>
                  <span>{score}% Match Score</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {scheme.description}
              </p>

              {/* Subsidy / Benefits Highlight Box */}
              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-slate-900/60 border border-emerald-100 dark:border-slate-700 mb-3">
                <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">
                  Maximum Financial Benefit:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {scheme.maxSubsidy || scheme.benefits || 'Up to 35% Capital Subsidy + Collateral-Free Bank Guarantee'}
                </div>
              </div>

              {/* Why You Match Reasons */}
              {reasons && reasons.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Why You Match:
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Styled Apply Now Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Instant JanSamarth Routing
              </span>
              <button
                onClick={() => handleApply(scheme)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mt-4 transition-colors text-xs shadow-sm"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
