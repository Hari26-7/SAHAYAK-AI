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
            Ministry of MSME Schemes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official central and state government credit-linked subsidies, grants, and incentives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            {filtered.length} Active Schemes Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="Search by scheme name, subsidy, keyword, or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
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
        <div className="p-12 text-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No schemes found matching your search</h3>
          <p className="text-sm text-slate-500 mt-1">Try modifying your query or category filters.</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((scheme) => {
            const matchScore = scheme.matchPercentage || scheme.match_score || 95;
            const ministryName = scheme.ministry || 'Ministry of MSME';

            return (
              <div
                key={scheme.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  {/* Visual Badges: Match Percentage and Ministry Name */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {ministryName}
                    </span>
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                      {matchScore}% Match
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
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
                  <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-700 mb-4">
                    <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                      Maximum Subsidy & Benefits:
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {scheme.maxSubsidy || scheme.benefits || 'Up to 35% Capital Subsidy + Collateral-Free Credit'}
                    </div>
                  </div>

                  {/* Eligibility Highlights */}
                  {scheme.keyEligibility && scheme.keyEligibility.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Key Eligibility:
                      </div>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        {scheme.keyEligibility.slice(0, 3).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Styled Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
                  {scheme.portalUrl ? (
                    <a
                      href={scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Official Portal ↗
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">JanSamarth Integrated</span>
                  )}

                  <button
                    onClick={() => navigate('/applications?scheme=' + scheme.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mt-4 transition-colors text-xs shadow-sm"
                  >
                    Apply Now
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
