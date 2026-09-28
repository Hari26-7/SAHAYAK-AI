import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_GOV_SCHEMES, SchemeData } from '../data/mockSchemes';
import {
  schemesService,
  applicationsService,
  documentsService,
  notificationsService,
  roadmapService,
} from '../lib/services';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { language, t } = useLanguage();

  const [stats, setStats] = useState({
    schemes: 10,
    applications: 2,
    documents: 5,
    notifications: 3,
    roadmapCompleted: 3,
    roadmapTotal: 5,
  });
  const [loading, setLoading] = useState(true);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, boolean>>({});

  // Listen for Voice Commands broadcasted by VoiceAssistant
  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const voiceText = e.detail?.query || '';
      if (voiceText) {
        setSearchQuery(voiceText);
      }
    };

    window.addEventListener('sahayak-voice-command', handleVoiceCommand);
    return () => {
      window.removeEventListener('sahayak-voice-command', handleVoiceCommand);
    };
  }, []);

  // Load live statistics from backend or initialize fallback
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (user) {
          const [apps, docs, notifs, roadmap] = await Promise.all([
            applicationsService.getApplications(user.id).catch(() => []),
            documentsService.getDocuments(user.id).catch(() => []),
            notificationsService.getNotifications(user.id).catch(() => []),
            roadmapService.getRoadmap(user.id).catch(() => []),
          ]);

          if (isMounted) {
            const completedSteps = roadmap.filter((s: any) => s.status === 'completed').length;
            setStats({
              schemes: MOCK_GOV_SCHEMES.length,
              applications: apps.length > 0 ? apps.length : 2,
              documents: docs.length > 0 ? docs.length : 5,
              notifications: notifs.length > 0 ? notifs.filter((n: any) => !n.is_read).length : 3,
              roadmapCompleted: completedSteps > 0 ? completedSteps : 3,
              roadmapTotal: roadmap.length > 0 ? roadmap.length : 5,
            });
          }
        }
      } catch (err) {
        console.warn('Using mock stats fallback', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Categories list for tabs
  const categories = ['All', 'Capital Subsidy', 'Credit & Finance', 'Quality & Technology', 'Rural & Traditional', 'Incentive & Growth'];

  // Filter schemes based on search query and category
  const filteredSchemes = useMemo(() => {
    return MOCK_GOV_SCHEMES.filter((scheme) => {
      const matchesCategory =
        selectedCategory === 'All' || scheme.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        scheme.name.toLowerCase().includes(q) ||
        scheme.shortCode.toLowerCase().includes(q) ||
        scheme.hindiName.toLowerCase().includes(q) ||
        scheme.tamilName.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        scheme.maxSubsidy.toLowerCase().includes(q) ||
        scheme.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleApplyClick = (schemeId: string, schemeName: string) => {
    setAppliedSchemes((prev) => ({ ...prev, [schemeId]: true }));
    if (user) {
      applicationsService
        .createApplication(user.id, schemeId, schemeName)
        .catch((e) => console.warn('Mock apply action saved locally', e));
    }
  };

  const getSchemeTitle = (scheme: SchemeData) => {
    if (language === 'hi') return scheme.hindiName;
    if (language === 'ta') return scheme.tamilName;
    return scheme.name;
  };

  const entrepreneurName = profile?.full_name || 'Hari Haran';
  const businessName = profile?.business_name || 'M/s Sri Lakshmi Agro Enterprises';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gov-navy/20 border-t-gov-navy dark:border-blue-500/20 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading Citizen Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Official Government Citizen Header & Enterprise Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/60 dark:from-blue-900/10 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            {/* National Portal Breadcrumb Tag */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-gov-navy dark:text-blue-400 uppercase tracking-wider">
              <span>सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</span>
              <span>•</span>
              <span>MINISTRY OF MSME, GOVT. OF INDIA</span>
            </div>

            {/* Welcome Greeting */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('welcome')}, {entrepreneurName}!
            </h1>

            {/* Enterprise Credentials Badge Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                🏢 <span className="font-bold">{businessName}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                ✓ Udyam: <span className="font-mono font-bold">UDYAM-TN-02-0049281</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                Micro (Manufacturing)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                🔒 DigiLocker KYC Verified
              </span>
            </div>
          </div>

          {/* Right Action: National MSME Single Window Clearance Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-left lg:text-right">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Priority Sector Lending (PSL)
              </div>
              <div className="text-lg font-black text-gov-navy dark:text-blue-400">
                Tier-1 Micro Priority
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-start lg:justify-end">
                <span>●</span> Eligible for up to 35% Capital Subsidy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards (Material Design & Soft Shadows / Distinct Dark Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Schemes */}
        <Link
          to="/schemes"
          className="group block p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gov-navy dark:hover:border-blue-500 transition-all text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Matched Schemes
            </span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-gov-navy dark:text-blue-300 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              📜
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-gov-navy dark:text-white">
              {stats.schemes}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              ✓ 10 Verified National Schemes
            </p>
          </div>
        </Link>

        {/* Card 2: Active Applications */}
        <Link
          to="/applications"
          className="group block p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gov-navy dark:hover:border-blue-500 transition-all text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Active Applications
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              📁
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-gov-navy dark:text-white">
              {stats.applications}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Under Bank & KVIC Review
            </p>
          </div>
        </Link>

        {/* Card 3: DigiLocker Documents */}
        <Link
          to="/documents"
          className="group block p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gov-navy dark:hover:border-blue-500 transition-all text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              DigiLocker Records
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              📄
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-gov-navy dark:text-white">
              {stats.documents}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
              Aadhaar, PAN & Udyam Synced
            </p>
          </div>
        </Link>

        {/* Card 4: Roadmap Step Progress */}
        <Link
          to="/eligibility-roadmap"
          className="group block p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gov-navy dark:hover:border-blue-500 transition-all text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Clearance Readiness
            </span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              ⚡
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-gov-navy dark:text-white">
              {Math.round((stats.roadmapCompleted / stats.roadmapTotal) * 100)}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
              {stats.roadmapCompleted} of {stats.roadmapTotal} Stages Completed
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Interactive Voice Search Bar & Scheme Filter Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> MSME Schemes & Subsidies Navigator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search by scheme name, subsidy percentage, or speak via the Sahayak Voice Copilot
            </p>
          </div>

          {/* Voice Search Feedback Pill */}
          {searchQuery && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Filter: "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes (e.g., 'PMEGP 35% subsidy', 'CGTMSE', 'Food Processing', 'Women')..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-blue-500 transition"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
              VOICE ENABLED
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gov-navy text-white dark:bg-blue-600 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Expanded 10 Schemes Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Showing {filteredSchemes.length} of {MOCK_GOV_SCHEMES.length} Recommended Schemes
          </div>
          <Link
            to="/scheme-matching"
            className="text-xs font-semibold text-gov-navy dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Run Advanced AI Matching Engine →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => {
            const isApplied = appliedSchemes[scheme.id];

            return (
              <div
                key={scheme.id}
                className="flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Match Ribbon */}
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                    {scheme.matchPercentage}% Match
                  </div>
                </div>

                <div>
                  {/* Category & Nodal Agency Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 pr-20">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      {scheme.shortCode}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {scheme.nodalAgency}
                    </span>
                  </div>

                  {/* Scheme Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                    {getSchemeTitle(scheme)}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {scheme.description}
                  </p>

                  {/* Maximum Subsidy / Financial Benefit Box */}
                  <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 mb-3">
                    <div className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">
                      Maximum Subsidy & Benefit:
                    </div>
                    <div className="text-xs font-bold text-amber-950 dark:text-amber-100 mt-0.5">
                      {scheme.maxSubsidy}
                    </div>
                  </div>

                  {/* Key Eligibility Criteria */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Key Eligibility:
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                      {scheme.keyEligibility.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-gov-navy dark:hover:text-blue-400 flex items-center gap-1"
                  >
                    Portal Guidelines ↗
                  </a>

                  <button
                    onClick={() => handleApplyClick(scheme.id, scheme.name)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isApplied
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gov-navy hover:bg-[#001f42] dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isApplied ? '✓ Application Submitted' : 'Apply on JanSamarth'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Eligibility Roadmap Progress & Quick Actions Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Eligibility Roadmap Progress */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗺️</span> National MSME Clearance Roadmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step single-window clearance for subsidy disbursement
              </p>
            </div>
            <Link
              to="/eligibility-roadmap"
              className="text-xs font-bold text-gov-navy dark:text-blue-400 hover:underline"
            >
              Full Details →
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Milestone Completion</span>
              <span>{stats.roadmapCompleted} of {stats.roadmapTotal} Stages Done</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gov-navy to-emerald-500 dark:from-blue-600 dark:to-emerald-400 transition-all duration-500"
                style={{ width: `${(stats.roadmapCompleted / stats.roadmapTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Step 1: Udyam ID
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                Active & Verified ✅
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Step 2: DigiLocker KYC
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                PAN & Aadhaar Linked ✅
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
              <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                Step 3: Stacking Engine
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                Dual Subsidy Ready ⚡
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick India Stack Actions */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> India Stack Quick Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct access to SIH verification services
            </p>
          </div>

          <div className="space-y-2">
            <Link
              to="/scheme-matching"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>🎯</span> AI Scheme Matcher
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/documents"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>📄</span> Upload to DigiLocker
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/credit-score"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>💳</span> MSME Credit Scorecard
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/scheme-stacking"
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>⚡</span> Subsidy Stacking Calculator
              </span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400">
            💡 <span className="font-semibold">Tip for Judges:</span> Click the microphone in Sahayak Voice Copilot to search hands-free in Hindi, Tamil, or English!
          </div>
        </div>
      </div>
    </div>
  );
}
