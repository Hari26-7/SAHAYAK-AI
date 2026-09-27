import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: t('welcome') + ' (Dashboard)', path: '/dashboard', icon: '📊' },
    { label: t('schemes'), path: '/schemes', icon: '📜' },
    { label: t('findSchemes'), path: '/scheme-matching', icon: '🎯' },
    { label: t('schemeStacking'), path: '/scheme-stacking', icon: '⚡' },
    { label: t('eligibilityRoadmap'), path: '/eligibility-roadmap', icon: '🗺️' },
    { label: t('applications'), path: '/applications', icon: '📁' },
    { label: t('documents'), path: '/documents', icon: '📄' },
    { label: t('creditScore'), path: '/credit-score', icon: '💳' },
    { label: t('faceVerification'), path: '/face-verification', icon: '👤' },
    { label: t('notifications'), path: '/notifications', icon: '🔔' },
    { label: t('profile'), path: '/profile', icon: '⚙️' },
  ];

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="header-logo-icon">M</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {t('appName')}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              SIH 2026 Model • React + Python + Google Sheets
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Language selector */}
          <div className="lang-switcher">
            <button className={`lang-pill ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
            <button className={`lang-pill ${language === 'ta' ? 'active' : ''}`} onClick={() => setLanguage('ta')}>தமிழ்</button>
            <button className={`lang-pill ${language === 'hi' ? 'active' : ''}`} onClick={() => setLanguage('hi')}>हिन्दी</button>
          </div>

          {/* Google Sheets DB Link */}
          <a
            href="https://docs.google.com/spreadsheets/d/1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="sheet-live-badge"
          >
            <span className="live-dot"></span>
            Google Sheet DB
          </a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#cbd5e1', fontSize: '13px', fontWeight: 600 }}>
                {profile?.full_name || 'Entrepreneur'}
              </Link>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
