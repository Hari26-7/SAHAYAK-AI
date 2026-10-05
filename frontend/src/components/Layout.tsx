import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { VoiceAssistant, HeaderVoiceControls } from './VoiceAssistant';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const adjustFontSize = (delta: number) => {
    setFontSizeOffset((prev) => {
      const next = prev + delta;
      if (next < -2 || next > 4) return prev;
      document.documentElement.style.fontSize = `${16 + next}px`;
      return next;
    });
  };

  // 1. Unified Navigation Items: dynamically localized across Desktop Sidebar and Mobile Bottom Bar
  const unifiedNavItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      shortLabel: t('dashboardShort'),
      path: '/dashboard',
      icon: '📊',
    },
    {
      id: 'schemes',
      label: t('schemes'),
      shortLabel: t('schemesShort'),
      path: '/schemes',
      icon: '📜',
    },
    {
      id: 'vault',
      label: t('verificationVault'),
      shortLabel: t('vaultShort'),
      path: '/documents',
      icon: '🛡️',
    },
    {
      id: 'credit',
      label: t('creditAndFinance'),
      shortLabel: t('creditShort'),
      path: '/credit-score',
      icon: '💳',
    },
    {
      id: 'stacking',
      label: t('stackingIntelligence'),
      shortLabel: t('stackingShort'),
      path: '/scheme-stacking',
      icon: '⚡',
    },
    {
      id: 'sahayak',
      label: t('sahayakAI'),
      shortLabel: t('sahayakAI'),
      path: '/scheme-matching',
      icon: '🤖',
    },
  ];

  // Path matcher supporting aliases like / and /sahayak-ai
  const isItemActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    if (path === '/scheme-matching') {
      return location.pathname === '/scheme-matching' || location.pathname === '/sahayak-ai';
    }
    return location.pathname === path;
  };

  // Secondary navigational shortcuts for desktop sidebar
  const secondaryNavItems = [
    { label: 'MSME Connect (B2B Hub)', path: '/msme-connect', icon: '🤝' },
    { label: t('eligibilityRoadmap'), path: '/eligibility-roadmap', icon: '🗺️' },
    { label: t('applications'), path: '/applications', icon: '📁' },
    { label: t('notifications'), path: '/notifications', icon: '🔔' },
    { label: t('profile'), path: '/profile', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1. Tricolor Top Accent Strip (Saffron, White, Green) - Razor-sharp GIGW standard */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-white"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* 2. Top Gov Header - Flush Edge-to-Edge */}
      <div className="w-full bg-[#0B3B60] text-white border-b border-[#082b47] text-xs py-1.5 px-4 sm:px-6 md:px-8">
        <div className="w-full flex items-center justify-between gap-2 overflow-hidden">
          {/* Official Emblem & Formal Ministry Titles */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#082b47] border border-blue-900/60 p-1 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-bold tracking-wide text-white flex items-center gap-1.5 text-xs md:text-sm truncate">
                <span className="truncate">भारत सरकार</span>
                <span className="text-amber-400 font-bold">|</span>
                <span className="truncate tracking-wider">GOVERNMENT OF INDIA</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-300 font-normal truncate">
                सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय | MINISTRY OF MSME
              </div>
            </div>
          </div>

          {/* Accessibility, SIH Tag & GIGW 3.0 Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-200 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#082b47] text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-semibold text-[10px]">
              <span>🇮🇳</span> {t('sihBadge')}
            </div>

            <div className="hidden sm:flex items-center bg-[#082b47] rounded border border-blue-900 px-2 py-0.5 gap-1.5">
              <button
                onClick={() => adjustFontSize(-1)}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Decrease Text Size"
                aria-label="Decrease Text Size"
              >
                A-
              </button>
              <button
                onClick={() => {
                  setFontSizeOffset(0);
                  document.documentElement.style.fontSize = '16px';
                }}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Standard Text Size"
                aria-label="Standard Text Size"
              >
                A
              </button>
              <button
                onClick={() => adjustFontSize(1)}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Increase Text Size"
                aria-label="Increase Text Size"
              >
                A+
              </button>
            </div>

            <span className="hidden md:inline-block text-slate-300 text-[10px] border-l border-white/20 pl-3">
              {t('gigwCompliant')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Application Header - Flush Edge-to-Edge Solid White / Slate-900 */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="w-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <Link to="/dashboard" className="flex items-center gap-3 text-decoration-none min-w-0 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-[#0B3B60] border border-[#082b47] text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
              <span className="text-amber-300 font-serif">स</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#0B3B60] dark:text-blue-400 truncate">
                  SAHAYAK AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0B3B60] dark:bg-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                  {t('nationalPortal')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block truncate">
                {t('portalSubtitle')}
              </div>
            </div>
          </Link>

          {/* Action Center */}
          <div className="flex items-center justify-end gap-2.5 shrink-0">
            {/* Header Voice Assistant Controls */}
            <HeaderVoiceControls />

            {/* Language Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-300 dark:border-slate-700 shrink-0">
              <button
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                onClick={() => setLanguage('en')}
                title="Switch language to English"
              >
                EN
              </button>
              <button
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  language === 'ta'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                onClick={() => setLanguage('ta')}
                title="மொழியை தமிழுக்கு மாற்றவும்"
              >
                தமிழ்
              </button>
              <button
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  language === 'hi'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                onClick={() => setLanguage('hi')}
                title="भाषा हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
              title={theme === 'dark' ? 'Switch to Official Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <span className="text-sm leading-none">☀️</span>
              ) : (
                <span className="text-sm leading-none">🌙</span>
              )}
            </button>

            {/* Live Google Sheets Status */}
            <a
              href="https://docs.google.com/spreadsheets/d/1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
              title={t('inspectLiveSheets')}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>{t('sheetsLive')}</span>
            </a>

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 shrink-0">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-decoration-none"
                  title="Profile"
                >
                  <div className="w-7 h-7 rounded-md bg-[#0B3B60] text-white font-bold text-xs flex items-center justify-center border border-[#082b47]">
                    {(profile?.full_name || 'H').charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {profile?.full_name || 'Hari Haran'}
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span> {t('udyam')}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
                  title="Sign Out from Portal"
                >
                  <span className="hidden sm:inline">{t('logout')}</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 4. Enterprise App Shell: Rigid Sidebar & Flat Canvas */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar: Rigid Deep Navy #0B3B60, flush with viewport, sharp active left border */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col py-4 border-r border-[#082b47] bg-[#0B3B60] text-white">
          <div className="sticky top-20 flex flex-col h-[calc(100vh-5rem)] justify-between">
            <div>
              {/* Quick Status Box */}
              <div className="mx-3 mb-4 p-3 rounded-md bg-[#082b47] border border-blue-900/60">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-200 mb-1">
                  <span>{t('msmeSingleWindow')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                    {t('active')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {t('registeredUdyam')}
                </p>
              </div>

              {/* Core Synchronized Modules */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-4 mb-1">
                  {t('coreModules')}
                </div>
                <nav className="flex flex-col">
                  {unifiedNavItems.map((item) => {
                    const isActive = isItemActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 text-xs transition-colors ${
                          isActive
                            ? 'border-l-4 border-blue-400 bg-[#082b47] text-white font-semibold'
                            : 'border-l-4 border-transparent text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Secondary Services & Account */}
              <div className="mt-4 pt-3 border-t border-blue-900/40">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-4 mb-1">
                  {t('processAndAccount')}
                </div>
                <nav className="flex flex-col">
                  {secondaryNavItems.map((item) => {
                    const isActive = isItemActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 text-xs transition-colors ${
                          isActive
                            ? 'border-l-4 border-blue-400 bg-[#082b47] text-white font-semibold'
                            : 'border-l-4 border-transparent text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom info in sidebar */}
            <div className="p-3 mx-3 text-[10px] text-slate-400 border-t border-blue-900/40">
              Ministry of MSME, Govt of India
            </div>
          </div>
        </aside>

        {/* Main Content Canvas - Strict 8-pt Grid System */}
        <main className="flex-1 min-w-0 p-6 md:p-8 pb-24 md:pb-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar - Flat Solid Design */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-6 py-1.5 px-1 md:hidden z-50 shadow-sm">
        {unifiedNavItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1 px-0.5 transition-colors text-center min-w-0 ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold border-t-2 border-blue-600 -mt-1.5 pt-1 bg-slate-50 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-base leading-tight mb-0.5">{item.icon}</span>
              <span className="text-[9px] font-medium leading-tight truncate w-full px-0.5">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 6. Official Indian Gov Portal Footer - Edge-to-Edge Solid */}
      <footer className="mt-auto w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs py-4 px-4 md:px-8 text-slate-600 dark:text-slate-400">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t('footerModel')}
            </span>
            <span>•</span>
            <span>{t('footerMinistry')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {t('officialMsmePortal')}
            </a>
            <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {t('udyamRegistration')}
            </a>
            <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {t('janSamarthPortal')}
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>{t('gigwCompliant')}</span>
          </div>
        </div>
      </footer>

      {/* 7. Voice Assistant Controls */}
      <VoiceAssistant />
    </div>
  );
};

