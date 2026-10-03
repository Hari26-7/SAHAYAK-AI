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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Tricolor Top Accent Strip (Saffron, White, Green) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

      {/* 2. Top Gov Header (Official National Ministry Bar in Deep Navy #0B3B60) */}
      <div className="bg-[#0B3B60] text-white border-b border-[#082b47] text-xs py-1.5 px-3 sm:px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          {/* Official Emblem & Formal Ministry Titles */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-bold tracking-wide text-white flex items-center gap-1.5 text-xs md:text-sm truncate">
                <span className="truncate">भारत सरकार</span>
                <span className="text-amber-400 font-extrabold">|</span>
                <span className="truncate tracking-wider">GOVERNMENT OF INDIA</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-100 font-medium truncate">
                सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय | MINISTRY OF MSME
              </div>
            </div>
          </div>

          {/* Accessibility, SIH Tag & GIGW 3.0 Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-200 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-semibold text-[10px] shadow-sm">
              <span>🇮🇳</span> {t('sihBadge')}
            </div>

            <div className="hidden sm:flex items-center bg-black/30 rounded-lg border border-white/20 px-2 py-0.5 gap-1.5 shadow-inner">
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

            <span className="hidden md:inline-block text-blue-100 text-[10px] border-l border-white/20 pl-3">
              {t('gigwCompliant')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Application Header - Upgraded with Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-3">
          {/* Logo & Portal Identity */}
          <Link to="/dashboard" className="flex items-center gap-2.5 sm:gap-3 text-decoration-none group min-w-0 shrink-0 transition-transform duration-300 hover:scale-102">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#0B3B60] via-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md shadow-blue-900/20 group-hover:shadow-indigo-500/30 transition-all shrink-0">
              <span className="text-amber-300 font-serif">स</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-[#0B3B60] dark:text-blue-400 truncate">
                  SAHAYAK AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#0B3B60] dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                  {t('nationalPortal')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block truncate">
                {t('portalSubtitle')}
              </div>
            </div>
          </Link>

          {/* Action Center: Voice Assistant, Theme Toggle, Language Switcher, Google Sheet Badge & User */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
            {/* Header Voice Assistant Controls */}
            <HeaderVoiceControls />

            {/* Language Switcher */}
            <div className="flex bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0 shadow-inner">
              <button
                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B3B60]'
                }`}
                onClick={() => setLanguage('en')}
                title="Switch language to English"
              >
                EN
              </button>
              <button
                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-300 ${
                  language === 'ta'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B3B60]'
                }`}
                onClick={() => setLanguage('ta')}
                title="மொழியை தமிழுக்கு மாற்றவும்"
              >
                தமிழ்
              </button>
              <button
                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-300 ${
                  language === 'hi'
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B3B60]'
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
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-amber-300 hover:border-[#0B3B60] dark:hover:border-blue-400 transition-all duration-300 ease-out hover:-translate-y-0.5 shadow-sm shrink-0"
              title={theme === 'dark' ? 'Switch to Official Light Mode' : 'Switch to Slate Dark Mode'}
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 hover:bg-emerald-100 transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0 shadow-xs"
              title={t('inspectLiveSheets')}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('sheetsLive')}</span>
            </a>

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 border-l border-slate-200/60 dark:border-slate-800 shrink-0">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ease-out hover:-translate-y-0.5 text-decoration-none"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                    {(profile?.full_name || 'H').charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                      {profile?.full_name || 'Hari Haran'}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓</span> {t('udyam')}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 ease-out hover:-translate-y-0.5"
                  title="Sign Out from Portal"
                >
                  <span className="hidden sm:inline">{t('logout')}</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0B3B60] to-blue-700 hover:from-[#082b47] hover:to-blue-800 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white shadow-md shadow-blue-900/20 transition-all duration-300 ease-out hover:-translate-y-0.5 shrink-0"
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 4. Main Body with Official Deep Navy Desktop Sidebar & High-Readability Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col py-6 px-4 border-r border-[#082b47] dark:border-slate-800 bg-[#0B3B60] dark:bg-slate-900 text-white shadow-sm transition-colors duration-200">
          <div className="sticky top-24 space-y-6">
            {/* Quick Status Box */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-800/80 border border-white/10 dark:border-slate-700/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-200 dark:text-blue-300 mb-1.5">
                <span>{t('msmeSingleWindow')}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 rounded-full font-bold">
                  {t('active')}
                </span>
              </div>
              <p className="text-[11px] text-blue-100/80 dark:text-slate-400 leading-snug">
                {t('registeredUdyam')}
              </p>
            </div>

            {/* Core Synchronized Modules */}
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200/70 dark:text-slate-500 px-3 mb-2">
                {t('coreModules')}
              </div>
              <nav className="space-y-1.5">
                {unifiedNavItems.map((item) => {
                  const isActive = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                        isActive
                          ? 'bg-white text-[#0B3B60] dark:bg-blue-600 dark:text-white shadow-md shadow-black/10'
                          : 'text-blue-100/90 hover:text-white hover:bg-white/10 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Secondary Services & Account */}
            <div className="pt-3 border-t border-blue-400/20 dark:border-slate-800">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200/70 dark:text-slate-500 px-3 mb-2">
                {t('processAndAccount')}
              </div>
              <nav className="space-y-1.5">
                {secondaryNavItems.map((item) => {
                  const isActive = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                        isActive
                          ? 'bg-white text-[#0B3B60] dark:bg-blue-600 dark:text-white shadow-md shadow-black/10'
                          : 'text-blue-100/90 hover:text-white hover:bg-white/10 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-5 sm:p-6 md:p-8 pb-24 md:pb-8 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar - Upgraded with Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-6 py-2 px-1 md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all duration-300">
        {unifiedNavItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-300 ease-out text-center min-w-0 ${
                isActive
                  ? 'text-[#0B3B60] dark:text-blue-400 font-extrabold bg-blue-100/60 dark:bg-blue-950/60 shadow-xs scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-lg leading-tight mb-0.5">{item.icon}</span>
              <span className="text-[9px] font-bold leading-tight truncate w-full px-0.5">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 6. Official Indian Gov Portal Footer */}
      <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs py-6 px-4 md:px-8 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              {t('footerModel')}
            </div>
            <span>•</span>
            <div>{t('footerMinistry')}</div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-[#0B3B60] dark:hover:text-blue-400">
              {t('officialMsmePortal')}
            </a>
            <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-[#0B3B60] dark:hover:text-blue-400">
              {t('udyamRegistration')}
            </a>
            <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="hover:underline transition-colors hover:text-[#0B3B60] dark:hover:text-blue-400">
              {t('janSamarthPortal')}
            </a>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>{t('gigwCompliant')}</span>
          </div>
        </div>
      </footer>

      {/* 7. Sahayak Voice Copilot Floating Interactive Widget */}
      <VoiceAssistant />
    </div>
  );
};
