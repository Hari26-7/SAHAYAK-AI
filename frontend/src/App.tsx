import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';

import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import SchemeMatching from './pages/SchemeMatching';
import SchemeStacking from './pages/SchemeStacking';
import Applications from './pages/Applications';
import Documents from './pages/Documents';
import CreditScore from './pages/CreditScore';
import EligibilityRoadmap from './pages/EligibilityRoadmap';
import FaceVerification from './pages/FaceVerification';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import LanguageSelection from './pages/LanguageSelection';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Pages without sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/language" element={<LanguageSelection />} />

            {/* Application Pages with Sidebar Layout */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/schemes" element={<Layout><Schemes /></Layout>} />
            <Route path="/scheme-matching" element={<Layout><SchemeMatching /></Layout>} />
            <Route path="/scheme-stacking" element={<Layout><SchemeStacking /></Layout>} />
            <Route path="/applications" element={<Layout><Applications /></Layout>} />
            <Route path="/documents" element={<Layout><Documents /></Layout>} />
            <Route path="/credit-score" element={<Layout><CreditScore /></Layout>} />
            <Route path="/eligibility-roadmap" element={<Layout><EligibilityRoadmap /></Layout>} />
            <Route path="/face-verification" element={<Layout><FaceVerification /></Layout>} />
            <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
