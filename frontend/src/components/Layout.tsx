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

  // 1. Unified Navigation Items: identical across Desktop Sidebar and Mobile Bottom Bar
  const unifiedNavItems = [
    {
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
    },
    {
      label: 'Schemes',
      shortLabel: 'Schemes',
      path: '/schemes',
      icon: '📜',
    },
    {
      label: 'Verification Vault',
      shortLabel: 'Vault',
      path: '/documents',
      icon: '🛡️',
    },
    {
      label: 'Credit & Financial Health',
      shortLabel: 'Credit',
      path: '/credit-score',
      icon: '💳',
    },
    {
      label: 'Stacking Intelligence',
      shortLabel: 'Stacking',
      path: '/scheme-stacking',
      icon: '⚡',
    },
    {
      label: 'Sahayak AI',
      shortLabel: 'Sahayak AI',
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
    { label: t('eligibilityRoadmap'), path: '/eligibility-roadmap', icon: '🗺️' },
    { label: t('applications'), path: '/applications', icon: '📁' },
    { label: t('notifications'), path: '/notifications', icon: '🔔' },
    { label: t('profile'), path: '/profile', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Tricolor Top Accent Strip (Saffron, White, Green) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

      {/* 2. Top Gov Header (Official National Ministry Bar) */}
      <div className="bg-[#002855] text-white border-b border-[#003875] text-xs py-1.5 px-3 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          {/* Official Emblem & Ministry Titles with scaling and truncation */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-semibold tracking-wide text-slate-100 flex items-center gap-1.5 text-xs md:text-sm truncate">
                <span className="truncate">भारत सरकार</span>
                <span className="text-amber-400">|</span>
                <span className="truncate">Government of India</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-200 font-medium truncate">
                सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय | Ministry of MSME
              </div>
            </div>
          </div>

          {/* Accessibility, SIH Tag & Official Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-200 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-semibold text-[10px]">
              <span>🇮🇳</span> SIH 2026
            </div>

            <div className="hidden sm:flex items-center bg-black/20 rounded border border-white/10 px-1.5 py-0.5 gap-1">
              <button
                onClick={() => adjustFontSize(-1)}
                className="hover:text-amber-300 px-1 font-bold"
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                onClick={() => {
                  setFontSizeOffset(0);
                  document.documentElement.style.fontSize = '16px';
                }}
                className="hover:text-amber-300 px-1 font-bold"
                title="Standard Text Size"
              >
                A
              </button>
              <button
                onClick={() => adjustFontSize(1)}
                className="hover:text-amber-300 px-1 font-bold"
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            <span className="hidden md:inline-block text-slate-300 text-[10px] border-l border-white/20 pl-3">
              GIGW 3.0 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Application Header - Cleanly responsive across all viewports */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          {/* Logo & Portal Identity */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-2.5 text-decoration-none group min-w-0 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#002855] to-blue-700 dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md group-hover:shadow-blue-500/30 transition-all shrink-0">
              <span className="text-amber-300 font-serif">स</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-gov-navy dark:text-blue-400 truncate">
                  SAHAYAK AI
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                  NATIONAL PORTAL
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block truncate">
                Unified MSME Copilot • AI-Powered Schemes & Subsidies
              </div>
            </div>
          </Link>

          {/* Action Center: Voice Assistant, Theme Toggle, Language Switcher, Google Sheet Badge & User */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
            {/* Header Voice Assistant Controls */}
            <HeaderVoiceControls />

            {/* Language Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-gov-navy text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-gov-navy'
                }`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
                  language === 'ta'
                    ? 'bg-gov-navy text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-gov-navy'
                }`}
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </button>
              <button
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-gov-navy text-white dark:bg-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-gov-navy'
                }`}
                onClick={() => setLanguage('hi')}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:border-gov-navy dark:hover:border-blue-400 transition-all shadow-sm shrink-0"
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
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 transition shrink-0"
              title="Inspect Live SIH Google Sheets Database"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sheets Live</span>
            </a>

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 border-l border-slate-200 dark:border-slate-800 shrink-0">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-decoration-none"
                  title="Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-gov-navy dark:bg-blue-900/60 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-300 dark:border-blue-700">
                    {(profile?.full_name || 'H').charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {profile?.full_name || 'Hari Haran'}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span> Udyam
                    </div>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                  title="Sign Out from Portal"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-lg bg-gov-navy hover:bg-[#001f42] dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm transition shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 4. Main Body with Official Desktop Sidebar & Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation: exactly synchronized with unifiedNavItems */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col py-6 px-3 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="sticky top-24 space-y-5">
            {/* Quick Status Box */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 dark:text-blue-300 mb-1">
                <span>MSME SINGLE WINDOW</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded font-semibold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Registered under Udyam Registration Portal
              </p>
            </div>

            {/* Core Synchronized Modules */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                Core Modules
              </div>
              <nav className="space-y-1">
                {unifiedNavItems.map((item) => {
                  const isActive = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gov-navy text-white dark:bg-blue-600 dark:text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gov-navy dark:hover:text-slate-200'
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
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                Process &amp; Account
              </div>
              <nav className="space-y-1">
                {secondaryNavItems.map((item) => {
                  const isActive = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gov-navy text-white dark:bg-blue-600 dark:text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gov-navy dark:hover:text-slate-200'
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

        {/* Main Content Area - with pb-20 md:pb-6 to prevent content cutoff behind bottom nav */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar - Exactly synchronized with unifiedNavItems */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-6 py-2 px-1 md:hidden z-50 shadow-lg">
        {unifiedNavItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all text-center min-w-0 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/70 dark:bg-blue-950/50'
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
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs py-6 px-4 md:px-8 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              MSME Sahayak AI • SIH 2026 Model
            </div>
            <span>•</span>
            <div>Ministry of Micro, Small & Medium Enterprises, Govt. of India</div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="hover:underline">
              Official MSME Portal
            </a>
            <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="hover:underline">
              Udyam Registration
            </a>
            <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="hover:underline">
              JanSamarth Portal
            </a>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>GIGW Compliant</span>
          </div>
        </div>
      </footer>

      {/* 7. Sahayak Voice Copilot Floating Interactive Widget */}
      <VoiceAssistant />
    </div>
  );
};
