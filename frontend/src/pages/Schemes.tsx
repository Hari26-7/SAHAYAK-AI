import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { schemesService } from '../lib/services';
import { MOCK_GOV_SCHEMES } from '../data/mockSchemes';
import { useNavigate } from 'react-router-dom';

export default function Schemes() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await schemesService.getAllSchemes();
        if (data && data.length > 0) {
          // Merge with detailed mock fields if available
          const enriched = data.map((s: any, idx: number) => {
            const mock = MOCK_GOV_SCHEMES[idx % MOCK_GOV_SCHEMES.length];
            return {
              ...mock,
              ...s,
              match_score: s.match_score || mock.matchPercentage || (90 + (idx % 9)),
              maxSubsidy: s.benefits || mock.maxSubsidy,
              ministry: s.ministry || mock.ministry,
            };
          });
          setSchemes(enriched);
        } else {
          setSchemes(MOCK_GOV_SCHEMES);
        }
      } catch (err) {
        setSchemes(MOCK_GOV_SCHEMES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [...new Set(schemes.map((s) => s.category).filter(Boolean))];

  const filtered = schemes.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.shortCode && s.shortCode.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.ministry && s.ministry.toLowerCase().includes(q));

    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-xs">
                National Repository
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Government of India MSME Schemes
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ministry of MSME Schemes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Official central and state government credit-linked subsidies, grants, collateral-free credit, and green incentives.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shrink-0">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-[#0B3B60] dark:text-white">
                {filtered.length}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Active Schemes
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                ₹50 Lakh
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Max Grant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700/60 transition-all duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-base">
              🔍
            </span>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
              placeholder="Search by scheme name, subsidy, keyword, or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full py-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CSS Grid Scheme Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No schemes found matching your search</h3>
          <p className="text-sm text-slate-500 mt-1">Try modifying your query or category filters.</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filtered.map((scheme) => {
            const matchScore = scheme.matchPercentage || scheme.match_score || 95;
            const ministryName = scheme.ministry || 'Ministry of MSME';

            return (
              <div
                key={scheme.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 group"
              >
                <div>
                  {/* Visual Badges: Glowing AI Pill & Ministry Name */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {ministryName}
                    </span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-xs">
                      {matchScore}% Match
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-3">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {scheme.name}
                    </h3>
                    {scheme.category && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Category: {scheme.category}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {scheme.description}
                  </p>

                  {/* Subsidy / Benefits Highlight Box */}
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-slate-900/60 border border-amber-200/80 dark:border-slate-700 mb-4">
                    <div className="text-[11px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                      Maximum Subsidy & Benefits:
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {scheme.maxSubsidy || scheme.benefits || 'Up to 35% Capital Subsidy + Collateral-Free Credit'}
                    </div>
                  </div>

                  {/* Eligibility Highlights */}
                  {scheme.keyEligibility && scheme.keyEligibility.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Key Eligibility:
                      </div>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                        {scheme.keyEligibility.slice(0, 3).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Styled Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 mt-4">
                  {scheme.portalUrl ? (
                    <a
                      href={scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Official Portal ↗
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">JanSamarth Integrated</span>
                  )}

                  <button
                    onClick={() => navigate('/applications?scheme=' + scheme.id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 text-xs shadow-md shadow-indigo-500/30"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
