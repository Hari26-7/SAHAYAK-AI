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

  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 dark:bg-blue-950 text-[#0B3B60] dark:text-blue-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                National Repository
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Government of India MSME Schemes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ministry of MSME Schemes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Official central and state government credit-linked subsidies, grants, collateral-free credit, and green incentives.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <div className="text-3xl font-bold tracking-tight text-[#0B3B60] dark:text-white">
                {filtered.length}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Active Schemes
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                ₹50 Lakh
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Max Grant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              placeholder="Search by scheme name, subsidy, keyword, or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full py-2.5 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
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

      {/* Structured Schemes Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No schemes found matching your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try modifying your query or category filters.</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Scheme Code & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Maximum Subsidy & Benefit</th>
                  <th className="py-3 px-4">Nodal Authority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filtered.map((scheme) => {
                  const isExpanded = expandedSchemeId === scheme.id;
                  const ministryName = scheme.ministry || 'Ministry of MSME';

                  return (
                    <React.Fragment key={scheme.id}>
                      <tr className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            {scheme.shortCode && (
                              <span className="font-mono text-xs font-bold text-[#0B3B60] dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 shrink-0">
                                {scheme.shortCode}
                              </span>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                                {scheme.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {scheme.nodalAgency || ministryName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {scheme.category || 'General MSME'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white max-w-xs">
                            {scheme.maxSubsidy || scheme.benefits || 'Up to 35% Capital Subsidy'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                          {ministryName}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(scheme.id)}
                              className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {isExpanded ? 'Hide' : 'Details'}
                            </button>
                            {scheme.portalUrl && (
                              <a
                                href={scheme.portalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                Portal ↗
                              </a>
                            )}
                            <button
                              onClick={() => navigate('/applications?scheme=' + scheme.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1 rounded-md transition-colors"
                            >
                              Apply Now
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/60 dark:bg-slate-800/20">
                          <td colSpan={5} className="p-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="space-y-3 max-w-4xl text-xs">
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                                  Description:
                                </span>
                                <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                  {scheme.description}
                                </p>
                              </div>

                              {scheme.keyEligibility && scheme.keyEligibility.length > 0 && (
                                <div>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                                    Key Eligibility Criteria:
                                  </span>
                                  <ul className="mt-1 space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                                    {scheme.keyEligibility.map((item: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

