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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const finishLoading = () => {
      if (isMounted) {
        // A brief delay to let everything paint smoothly
        setTimeout(() => setIsLoading(false), 400);
      }
    };

    const waitForAssets = async () => {
      try {
        // 1. Wait for document load event if not already complete
        if (document.readyState !== 'complete') {
          await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
        }
        
        // 2. Wait for web fonts to load
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // 3. Wait for any images currently in the DOM to finish loading
        const images = Array.from(document.images);
        const incompleteImages = images.filter(img => !img.complete);
        
        if (incompleteImages.length > 0) {
          await Promise.all(incompleteImages.map(img => new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if an image fails to load
          })));
        }
      } catch (error) {
        console.error("Error waiting for assets:", error);
      } finally {
        finishLoading();
      }
    };

    waitForAssets();

    // Safety fallback: never hang the loading screen forever (e.g. slow network)
    const fallbackTimer = setTimeout(finishLoading, 8000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col select-none overflow-x-hidden w-full max-w-[100vw]">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
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
