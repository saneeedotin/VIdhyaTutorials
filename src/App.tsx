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

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminOverview } from './components/dashboard/admin/AdminOverview';
import { AdmissionManagement } from './components/dashboard/admin/AdmissionManagement';
import { FormManagement } from './components/dashboard/admin/FormManagement';
import { WebsiteContentManager } from './components/dashboard/admin/WebsiteContentManager';
import { UserManagement } from './components/dashboard/admin/UserManagement';
import { ManageAnnouncementsPage } from './components/dashboard/admin/ManageAnnouncementsPage';
import { BatchManagement } from './components/dashboard/admin/BatchManagement';
import { GlobalLedger } from './components/dashboard/admin/GlobalLedger';
import { ProfileSettings } from './components/dashboard/shared/ProfileSettings';

import { StudentDashboard } from './components/dashboard/student/StudentDashboard';
import { CourseViewer } from './components/dashboard/student/CourseViewer';
import { TeacherDashboard } from './components/dashboard/teacher/TeacherDashboard';
import { TeacherAttendance } from './components/dashboard/teacher/TeacherAttendance';
import { MaterialUploader } from './components/dashboard/teacher/MaterialUploader';

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
          </Route>

          {/* Admin Portal (Full Featured) */}
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
            <Route path="admissions" element={<AdmissionManagement />} />
            <Route path="forms" element={<FormManagement />} />
            <Route path="content" element={<WebsiteContentManager />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="fees" element={<GlobalLedger />} />
            <Route path="announcements" element={<ManageAnnouncementsPage />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}
