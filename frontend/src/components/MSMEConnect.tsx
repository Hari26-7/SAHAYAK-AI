import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface B2BPartner {
  id: string;
  name: string;
  category: string;
  synergyScore: number;
  location: string;
  turnover: string;
  verifiedUdyam: boolean;
  synergyReason: string;
  openTender: string;
  tenderValue: string;
}

export const MSME_CONNECT_PARTNERS: B2BPartner[] = [
  {
    id: 'conn-01',
    name: 'Kaveri Agro Machinery & Cold Storage Works',
    category: 'Supply Chain Partner • Equipment',
    synergyScore: 96,
    location: 'Coimbatore, Tamil Nadu',
    turnover: '₹4.2 Cr',
    verifiedUdyam: true,
    synergyReason: 'Direct complementary supplier for agro-processing expansion with JanSamarth priority subsidy eligibility.',
    openTender: 'Supply of Stainless Steel Pasteurizers (GeM Ref #GEM/2026/B/89201)',
    tenderValue: '₹38.5 Lakhs',
  },
  {
    id: 'conn-02',
    name: 'Bharat Bio-Packaging Solutions Ltd',
    category: 'Green Tech • Sustainable Packaging',
    synergyScore: 92,
    location: 'Hosur, Tamil Nadu',
    turnover: '₹2.8 Cr',
    verifiedUdyam: true,
    synergyReason: 'ZED Gold certified green packaging unit offering 15% procurement rebate under MSME Green Synergy cluster.',
    openTender: 'Eco-friendly Biodegradable Pouches Contract (GeM Ref #GEM/2026/B/77114)',
    tenderValue: '₹18.0 Lakhs',
  },
  {
    id: 'conn-03',
    name: 'Deccan Agro Exports Consortium',
    category: 'Offtaker • Institutional Buyer',
    synergyScore: 89,
    location: 'Bengaluru Rural, Karnataka',
    turnover: '₹12.5 Cr',
    verifiedUdyam: true,
    synergyReason: 'Seeking bulk organic processed produce; eligible for ODOP cluster export freight subsidies.',
    openTender: 'Annual Organic Certified Food Grade Dispatch Batch 4',
    tenderValue: '₹75.0 Lakhs',
  },
];

export const MSMEConnect: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'All' | 'Suppliers' | 'Buyers' | 'GeM'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Component Header Banner - Flat Enterprise Design */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#0B3B60] text-white font-semibold px-2.5 py-0.5 rounded text-xs">
                B2B Enterprise Synergy
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                GeM Portal & MSME Cluster Verification
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              MSME Connect & Cluster Procurement
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Match with verified Udyam enterprises, participate in collaborative procurement tenders, and amplify your scheme eligibility with supply-chain clustering.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                3
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Active Matches
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                ₹1.32 Cr
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Consortium Opportunity
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          {(['All', 'Suppliers', 'Buyers', 'GeM'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === tab
                  ? 'bg-[#0B3B60] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {tab === 'All' ? 'All Opportunities' : tab === 'GeM' ? 'GeM Tenders' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Enterprise Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Synergy Matches & Procurement Opportunities ({MSME_CONNECT_PARTNERS.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Source: GeM & MSME Databank
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Enterprise Partner</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Annual Turnover</th>
                <th className="py-3 px-4">Synergy Score</th>
                <th className="py-3 px-4">Open GeM Tender</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {MSME_CONNECT_PARTNERS.map((partner) => {
                const isConnected = connectedIds[partner.id];
                const isExpanded = expandedId === partner.id;

                return (
                  <React.Fragment key={partner.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{partner.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            Udyam Verified
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                        <div>{partner.category}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-[11px]">{partner.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {partner.turnover}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-700 dark:text-slate-300">{partner.synergyScore}%</span>
                            <span className="text-[10px] text-slate-500">Fit</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-sm"
                              style={{ width: `${partner.synergyScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs" title={partner.openTender}>
                          {partner.openTender}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                          Value: {partner.tenderValue}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : partner.id)}
                            className="px-2.5 py-1.5 text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 font-medium"
                          >
                            {isExpanded ? 'Hide' : 'Details'}
                          </button>
                          <button
                            onClick={() => handleConnect(partner.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                              isConnected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isConnected ? '✓ Requested' : 'Connect'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Strategic Fit Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50 dark:bg-slate-800/40">
                        <td colSpan={6} className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wide block mb-1">
                                Strategic Fit Analysis:
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {partner.synergyReason}
                              </p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wide block mb-1">
                                GeM Tender Specifications:
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Tender ID: GeM-MSME-2026-X9. Collaborative bidding allows consortium quota reservation under Public Procurement Policy (25% reserved for MSMEs).
                              </p>
                            </div>
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
    </div>
  );
};

export default MSMEConnect;
