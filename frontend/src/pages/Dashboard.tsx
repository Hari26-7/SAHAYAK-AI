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
import { MSMEConnect } from '../components/MSMEConnect';

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
    profileCompleted: 75,
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
              profileCompleted: 80,
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

  // Categories list with dynamic translation keys
  const categoryOptions = [
    { id: 'All', labelKey: 'catAll' },
    { id: 'Capital Subsidy', labelKey: 'catCapitalSubsidy' },
    { id: 'Credit & Finance', labelKey: 'catCreditFinance' },
    { id: 'Quality & Technology', labelKey: 'catQualityTech' },
    { id: 'Rural & Traditional', labelKey: 'catRuralTraditional' },
    { id: 'Incentive & Growth', labelKey: 'catIncentiveGrowth' },
  ];

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
        scheme.tags.some((tItem) => tItem.toLowerCase().includes(q));

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
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('loadingCitizenDashboard')}
          </span>
        </div>
      </div>
    );
  }

  const roadmapPercentage = Math.round((stats.roadmapCompleted / stats.roadmapTotal) * 100);

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4 space-y-8">
      {/* 1. Official Government Citizen Header & Enterprise Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 dark:from-blue-900/20 via-indigo-50/20 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* National Portal Breadcrumb Tag with Glowing Gradient Accent */}
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-[10px] uppercase tracking-wider">
                GIGW 3.0 Verified
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {t('ministryOfMsme')} • {t('govtOfIndia')}
              </span>
            </div>

            {/* Welcome Greeting */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('welcome')}, {entrepreneurName}!
            </h1>

            {/* Enterprise Credentials Badge Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80 shadow-xs">
                🏢 <span className="font-bold">{businessName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                <span className="font-bold text-emerald-600">✓</span> {t('udyam')}: <span className="font-mono font-bold">UDYAM-TN-02-0049281</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#0B3B60] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-xs">
                {t('microManufacturing')}
              </span>
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-xs">
                🔒 {t('digiLockerKycVerified')}
              </span>
            </div>

            {/* Visual Progress: Profile Completeness */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Udyam Citizen Profile Readiness
                </span>
                <span className="font-extrabold text-[#0B3B60] dark:text-blue-400">
                  {stats.profileCompleted}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${stats.profileCompleted}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Action: National MSME Single Window Clearance Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 text-left lg:text-right shadow-xs">
              <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('prioritySectorLending')}
              </div>
              <div className="text-xl font-extrabold tracking-tight text-[#0B3B60] dark:text-blue-400 mt-1">
                {t('tier1Priority')}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 justify-start lg:justify-end mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t('capitalSubsidyEligible')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards - Elevated with Multi-Layer Soft Shadows & Micro-Interactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Card 1: Matched Schemes */}
        <Link
          to="/schemes"
          className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('matchedSchemes')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#0B3B60] dark:text-blue-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
              📜
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.schemes}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <span>✓</span> {t('verifiedNationalSchemes')}
            </p>
          </div>
        </Link>

        {/* Card 2: Active Applications */}
        <Link
          to="/applications"
          className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('activeApplications')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
              📁
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.applications}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-2">
              {t('underReview')}
            </p>
          </div>
        </Link>

        {/* Card 3: DigiLocker Records */}
        <Link
          to="/documents"
          className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('digiLockerRecords')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
              📄
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.documents}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-2">
              {t('documentsSynced')}
            </p>
          </div>
        </Link>

        {/* Card 4: Roadmap Step Progress with Visual Progress Bar */}
        <Link
          to="/eligibility-roadmap"
          className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('clearanceReadiness')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
              ⚡
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {roadmapPercentage}%
            </div>
            {/* Visual Animated Horizontal Progress Bar */}
            <div className="mt-2.5 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${roadmapPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">
              {stats.roadmapCompleted} of {stats.roadmapTotal} {t('stagesCompleted')}
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Interactive Voice Search Bar & Scheme Filter Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-5 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> {t('schemesNavigator')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('searchSubtitle')}
            </p>
          </div>

          {/* Voice Search Feedback Pill */}
          {searchQuery && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                {t('filter')}: "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ {t('clear')}
              </button>
            </div>
          )}
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-base">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-32 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-[10px]">
              {t('voiceEnabled')}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Expanded Schemes Catalog Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t('showingSchemes')} <span className="font-extrabold text-[#0B3B60] dark:text-blue-400">{filteredSchemes.length}</span> of {MOCK_GOV_SCHEMES.length} {t('recommendedSchemes')}
          </div>
          <Link
            to="/scheme-matching"
            className="text-xs font-extrabold text-[#0B3B60] dark:text-blue-400 hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>✨</span> {t('runAiMatcher')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredSchemes.map((scheme) => {
            const isApplied = appliedSchemes[scheme.id];

            return (
              <div
                key={scheme.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* AI Glowing Gradient Pill for Match Score */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-100 text-[#0B3B60] dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {scheme.shortCode}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[180px]">
                      {scheme.nodalAgency}
                    </span>
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-500/30 text-xs shrink-0">
                    {scheme.matchPercentage}% {t('match')}
                  </span>
                </div>

                <div>
                  {/* Scheme Title in Active Language */}
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getSchemeTitle(scheme)}
                  </h3>

                  {/* Compatibility Progress Bar */}
                  <div className="mb-3.5">
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${scheme.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {scheme.description}
                  </p>

                  {/* Maximum Subsidy / Financial Benefit Box */}
                  <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/50 mb-4 shadow-xs">
                    <div className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300">
                      {t('maximumSubsidyBenefit')}
                    </div>
                    <div className="text-xs font-bold text-amber-950 dark:text-amber-100 mt-1">
                      {scheme.maxSubsidy}
                    </div>
                  </div>

                  {/* Key Eligibility Criteria */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                      {t('keyEligibility')}
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-0.5">
                      {scheme.keyEligibility.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    {t('portalGuidelines')} ↗
                  </a>

                  <button
                    onClick={() => handleApplyClick(scheme.id, scheme.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 shadow-md ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20 cursor-default'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-indigo-500/30'
                    }`}
                  >
                    {isApplied ? t('applicationSubmitted') : t('applyJanSamarth')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MSME Connect & Supply Chain Synergy Hub */}
      <MSMEConnect compact />

      {/* 6. Eligibility Roadmap Progress & Quick Actions Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left 2 Cols: Eligibility Roadmap Progress */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗺️</span> {t('nationalRoadmap')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('roadmapSubtitle')}
              </p>
            </div>
            <Link
              to="/eligibility-roadmap"
              className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('fullDetails')} →
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{t('milestoneCompletion')}</span>
              <span className="text-[#0B3B60] dark:text-blue-400">{stats.roadmapCompleted} of {stats.roadmapTotal} {t('stagesDone')} ({roadmapPercentage}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700"
                style={{ width: `${roadmapPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                {t('step1Title')}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {t('step1Desc')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                {t('step2Title')}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {t('step2Desc')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
              <div className="text-[10px] font-bold text-[#0B3B60] dark:text-blue-400 uppercase">
                {t('step3Title')}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {t('step3Desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick India Stack Actions */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between space-y-5 transition-all duration-300">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> {t('quickActions')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('quickActionsSubtitle')}
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/scheme-matching"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 ease-out hover:-translate-y-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 text-decoration-none shadow-xs"
            >
              <span className="flex items-center gap-2">
                <span>🎯</span> {t('aiSchemeMatcher')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/documents"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 ease-out hover:-translate-y-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 text-decoration-none shadow-xs"
            >
              <span className="flex items-center gap-2">
                <span>📄</span> {t('uploadDigiLocker')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/credit-score"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 ease-out hover:-translate-y-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 text-decoration-none shadow-xs"
            >
              <span className="flex items-center gap-2">
                <span>💳</span> {t('creditScorecard')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/msme-connect"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 ease-out hover:-translate-y-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 text-decoration-none shadow-xs"
            >
              <span className="flex items-center gap-2">
                <span>🤝</span> MSME Connect (B2B Hub)
              </span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            💡 <span className="font-bold text-slate-800 dark:text-slate-200">{t('judgeTip')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
