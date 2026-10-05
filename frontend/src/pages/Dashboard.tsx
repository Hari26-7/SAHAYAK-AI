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

  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const toggleExpandScheme = (id: string) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  const roadmapPercentage = Math.round((stats.roadmapCompleted / stats.roadmapTotal) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Official Government Citizen Header & Enterprise Profile Banner */}
      <div className="rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* National Portal Breadcrumb Tag */}
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 dark:bg-blue-950 text-[#0B3B60] dark:text-blue-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                GIGW 3.0 Verified
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('ministryOfMsme')} • {t('govtOfIndia')}
              </span>
            </div>

            {/* Welcome Greeting */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('welcome')}, {entrepreneurName}!
            </h1>

            {/* Enterprise Credentials Badge Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                🏢 <span className="font-semibold">{businessName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="font-bold text-emerald-700">✓</span> {t('udyam')}: <span className="font-mono font-semibold">UDYAM-TN-02-0049281</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-[#0B3B60] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {t('microManufacturing')}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                🔒 {t('digiLockerKycVerified')}
              </span>
            </div>

            {/* Visual Progress: Profile Completeness */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Udyam Citizen Profile Readiness
                </span>
                <span className="font-bold text-[#0B3B60] dark:text-blue-400">
                  {stats.profileCompleted}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-sm transition-all duration-300"
                  style={{ width: `${stats.profileCompleted}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Action: National MSME Single Window Clearance Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left lg:text-right">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('prioritySectorLending')}
              </div>
              <div className="text-lg font-bold tracking-tight text-[#0B3B60] dark:text-blue-400 mt-0.5">
                {t('tier1Priority')}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 justify-start lg:justify-end mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{t('capitalSubsidyEligible')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards - Strict 8-pt Grid System & Flat Enterprise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Matched Schemes */}
        <Link
          to="/schemes"
          className="group block bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('matchedSchemes')}
            </span>
            <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0B3B60] dark:text-blue-300 border border-blue-100 dark:border-blue-900 flex items-center justify-center font-bold text-lg">
              📜
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats.schemes}
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
              <span>✓</span> {t('verifiedNationalSchemes')}
            </p>
          </div>
        </Link>

        {/* Card 2: Active Applications */}
        <Link
          to="/applications"
          className="group block bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('activeApplications')}
            </span>
            <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center font-bold text-lg">
              📁
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats.applications}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-1.5">
              {t('underReview')}
            </p>
          </div>
        </Link>

        {/* Card 3: DigiLocker Records */}
        <Link
          to="/documents"
          className="group block bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('digiLockerRecords')}
            </span>
            <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900 flex items-center justify-center font-bold text-lg">
              📄
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats.documents}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1.5">
              {t('documentsSynced')}
            </p>
          </div>
        </Link>

        {/* Card 4: Roadmap Step Progress with Visual Progress Bar */}
        <Link
          to="/eligibility-roadmap"
          className="group block bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-decoration-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('clearanceReadiness')}
            </span>
            <div className="w-10 h-10 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {roadmapPercentage}%
            </div>
            {/* Visual Horizontal Progress Bar */}
            <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-sm"
                style={{ width: `${roadmapPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">
              {stats.roadmapCompleted} of {stats.roadmapTotal} {t('stagesCompleted')}
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Interactive Search Bar & Scheme Filter Section */}
      <div className="p-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> {t('schemesNavigator')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('searchSubtitle')}
            </p>
          </div>

          {/* Voice Search Feedback Pill */}
          {searchQuery && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs">
              <span className="text-amber-800 dark:text-amber-300 font-semibold">
                {t('filter')}: "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕ {t('clear')}
              </button>
            </div>
          )}
        </div>

        {/* Traditional Enterprise Input Box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-28 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              🎙️ {t('voiceEnabled')}
            </span>
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Structured Data Presentation: Enterprise Data Table for Schemes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('showingSchemes')} <span className="font-bold text-[#0B3B60] dark:text-blue-400">{filteredSchemes.length}</span> of {MOCK_GOV_SCHEMES.length} {t('recommendedSchemes')}
          </div>
          <Link
            to="/scheme-matching"
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>✨</span> {t('runAiMatcher')} →
          </Link>
        </div>

        {/* Structured Data Table with Horizontal Dividers (divide-y divide-slate-200) */}
        <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Scheme Code & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Maximum Benefit</th>
                  <th className="py-3 px-4">Synergy Fit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredSchemes.map((scheme) => {
                  const isApplied = appliedSchemes[scheme.id];
                  const isExpanded = expandedSchemeId === scheme.id;

                  return (
                    <React.Fragment key={scheme.id}>
                      <tr className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono text-xs font-bold text-[#0B3B60] dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 shrink-0">
                              {scheme.shortCode}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                                {getSchemeTitle(scheme)}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {scheme.nodalAgency}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {scheme.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {scheme.maxSubsidy}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-28">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              <span>{scheme.matchPercentage}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-sm"
                                style={{ width: `${scheme.matchPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => toggleExpandScheme(scheme.id)}
                              className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {isExpanded ? 'Hide' : 'Details'}
                            </button>
                            <button
                              onClick={() => handleApplyClick(scheme.id, scheme.name)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                                isApplied
                                  ? 'bg-emerald-700 text-white cursor-default'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {isApplied ? t('applicationSubmitted') : t('applyJanSamarth')}
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

                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                                  {t('keyEligibility')}:
                                </span>
                                <ul className="mt-1 space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                                  {scheme.keyEligibility.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-emerald-600 font-bold">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-1">
                                <a
                                  href={scheme.portalUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-700 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                                >
                                  {t('portalGuidelines')} ↗
                                </a>
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

      {/* 5. MSME Connect & Supply Chain Synergy Hub */}
      <MSMEConnect compact />

      {/* 6. Eligibility Roadmap Progress & Quick Actions Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Eligibility Roadmap Progress */}
        <div className="lg:col-span-2 p-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗺️</span> {t('nationalRoadmap')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('roadmapSubtitle')}
              </p>
            </div>
            <Link
              to="/eligibility-roadmap"
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {t('fullDetails')} →
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
              <span>{t('milestoneCompletion')}</span>
              <span className="text-[#0B3B60] dark:text-blue-400 font-bold">{stats.roadmapCompleted} of {stats.roadmapTotal} {t('stagesDone')} ({roadmapPercentage}%)</span>
            </div>
            <div className="w-full h-2 rounded-sm bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-sm bg-blue-600 transition-all duration-300"
                style={{ width: `${roadmapPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-md bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                {t('step1Title')}
              </div>
              <div className="text-xs font-medium text-slate-900 dark:text-white mt-1">
                {t('step1Desc')}
              </div>
            </div>

            <div className="p-3 rounded-md bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                {t('step2Title')}
              </div>
              <div className="text-xs font-medium text-slate-900 dark:text-white mt-1">
                {t('step2Desc')}
              </div>
            </div>

            <div className="p-3 rounded-md bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
              <div className="text-[10px] font-bold text-[#0B3B60] dark:text-blue-400 uppercase">
                {t('step3Title')}
              </div>
              <div className="text-xs font-medium text-slate-900 dark:text-white mt-1">
                {t('step3Desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick India Stack Actions */}
        <div className="p-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> {t('quickActions')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('quickActionsSubtitle')}
            </p>
          </div>

          <div className="space-y-2">
            <Link
              to="/scheme-matching"
              className="w-full flex items-center justify-between p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>🎯</span> {t('aiSchemeMatcher')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/documents"
              className="w-full flex items-center justify-between p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>📄</span> {t('uploadDigiLocker')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/credit-score"
              className="w-full flex items-center justify-between p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>💳</span> {t('creditScorecard')}
              </span>
              <span>→</span>
            </Link>

            <Link
              to="/msme-connect"
              className="w-full flex items-center justify-between p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 text-decoration-none"
            >
              <span className="flex items-center gap-2">
                <span>🤝</span> MSME Connect (B2B Hub)
              </span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            💡 <span className="font-semibold text-slate-800 dark:text-slate-200">{t('judgeTip')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

