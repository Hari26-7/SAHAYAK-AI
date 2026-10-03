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

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Component Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-xs">
                AI B2B Ecosystem
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                GeM Portal & MSME Cluster Synergy
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              MSME Connect & Synergy Hub
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Match with certified Udyam enterprises, participate in collaborative procurement tenders, and amplify your scheme eligibility with supply-chain clustering.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shrink-0">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                3
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Active Matches
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                ₹1.32 Cr
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Tender Opportunity
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          {(['All', 'Suppliers', 'Buyers', 'GeM'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab === 'All' ? 'All Opportunities' : tab === 'GeM' ? '🏛️ GeM Tenders' : `🤝 ${tab}`}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {MSME_CONNECT_PARTNERS.map((partner) => {
          const isConnected = connectedIds[partner.id];

          return (
            <div
              key={partner.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 relative group"
            >
              <div>
                {/* Header with AI Synergy Pill */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {partner.category}
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-xs shrink-0">
                    {partner.synergyScore}% Synergy
                  </span>
                </div>

                {/* Partner Name */}
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {partner.name}
                </h3>

                {/* Location & Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    📍 {partner.location}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    ✓ Verified Udyam
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Turnover: {partner.turnover}
                  </span>
                </div>

                {/* Compatibility Progress Ring / Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Supply Chain Synergy</span>
                    <span className="font-bold text-slate-900 dark:text-white">{partner.synergyScore}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${partner.synergyScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Synergy Rationale */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    🤖 AI Strategic Fit
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {partner.synergyReason}
                  </p>
                </div>

                {/* Open GeM Opportunity */}
                <div className="mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                  <div className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>🏛️ Open Consortium Tender</span>
                    <span className="text-amber-900 dark:text-amber-200 font-bold">{partner.tenderValue}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2">
                    {partner.openTender}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  GeM #89201
                </span>
                <button
                  onClick={() => handleConnect(partner.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 shadow-md ${
                    isConnected
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-indigo-500/30'
                  }`}
                >
                  {isConnected ? '✓ Connection Requested' : '🤝 Initiate Synergy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MSMEConnect;
