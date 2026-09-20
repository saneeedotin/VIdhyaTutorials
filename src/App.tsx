import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CustomCursor } from './components/ui/CustomCursor';
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
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { StudentDashboard } from './components/dashboard/student/StudentDashboard';

import { TeacherAttendance } from './components/dashboard/teacher/TeacherAttendance';


// Shared UI imports
import { ProfileSettings } from './components/dashboard/shared/ProfileSettings';

// Phase 7A Student UI imports
import { CourseViewer } from './components/dashboard/student/CourseViewer';

// Phase 7B Teacher UI imports
import { TeacherDashboard } from './components/dashboard/teacher/TeacherDashboard';
import { MaterialUploader } from './components/dashboard/teacher/MaterialUploader';

// Phase 8 Admin UI imports
import { AdminOverview } from './components/dashboard/admin/AdminOverview';
import { UserManagement } from './components/dashboard/admin/UserManagement';
import { ManageAnnouncementsPage } from './components/dashboard/admin/ManageAnnouncementsPage';
import { AdmissionManagement } from './components/dashboard/admin/AdmissionManagement';
import { WebsiteContentManager } from './components/dashboard/admin/WebsiteContentManager';
import { FormManagement } from './components/dashboard/admin/FormManagement';

/* ─── Placeholder dashboards (will be replaced in later phases) ─── */
function PlaceholderDashboard({ role }: { role: string }) {
  return (
    <div className="flex items-center justify-center h-full text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">{role} Dashboard</h1>
        <p className="text-white/60">This dashboard is under construction.</p>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col select-none">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      <ScrollToTop />
      <CustomCursor />
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

          {/* Authentication Route (Standalone dark theme) */}
          <Route path="/login" element={<LoginRegisterPage />} />

          {/* Dashboards (Phase 6+) */}
          {/* Student Portal */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<CourseViewer />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="*" element={<PlaceholderDashboard role="Student Area" />} />
          </Route>

          {/* Teacher Portal */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="materials/upload" element={<MaterialUploader />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="*" element={<PlaceholderDashboard role="Teacher Area" />} />
          </Route>

          {/* Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="forms" element={<FormManagement />} />
            <Route path="admissions" element={<AdmissionManagement />} />
            <Route path="content" element={<WebsiteContentManager />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="announcements" element={<ManageAnnouncementsPage />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="*" element={<PlaceholderDashboard role="Admin Area" />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}
