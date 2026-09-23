import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { LandingPage } from './components/landing/LandingPage';
import { AdmissionsPage } from './components/landing/AdmissionsPage';
import { AboutPage } from './components/landing/AboutPage';
import { LifeAtVidhyaPage } from './components/landing/LifeAtVidhyaPage';
import { GalleryPage } from './components/landing/GalleryPage';
import { OurCoursesPage } from './components/landing/OurCoursesPage';
import { OurLocationsPage } from './components/landing/OurLocationsPage';
import { AdmissionFormPage } from './components/landing/AdmissionFormPage';
import { AchieversPage } from './components/landing/AchieversPage';
import { LayoutPublic } from './components/LayoutPublic';
import { LoginRegisterPage } from './components/auth/LoginRegisterPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminInquiries } from './components/admin/AdminInquiries';
import { AdminGallery } from './components/admin/AdminGallery';

export default function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col select-none overflow-x-hidden w-full max-w-[100vw]">
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          {/* Public Routes with Loyalist Design Wrapper */}
          <Route element={<LayoutPublic />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/achievers" element={<AchieversPage />} />
            <Route path="/wall-of-fame" element={<AchieversPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/apply" element={<AdmissionFormPage />} />
            <Route path="/admission-form" element={<AdmissionFormPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/life" element={<LifeAtVidhyaPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/campus-life" element={<GalleryPage />} />
            <Route path="/courses" element={<OurCoursesPage />} />
            <Route path="/our-locations" element={<OurLocationsPage />} />
            <Route path="/locate-us" element={<OurLocationsPage />} />
            <Route path="/locations" element={<OurLocationsPage />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}
