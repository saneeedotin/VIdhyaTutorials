import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Hash, 
  CheckCircle2, 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { apiClient } from '../../../api/apiClient';

// Helper function to create a cropped and compressed image
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const cropWidth = pixelCrop?.width || Math.min(image.naturalWidth, image.naturalHeight);
  const cropHeight = pixelCrop?.height || Math.min(image.naturalWidth, image.naturalHeight);
  const cropX = pixelCrop?.x ?? Math.max(0, (image.naturalWidth - cropWidth) / 2);
  const cropY = pixelCrop?.y ?? Math.max(0, (image.naturalHeight - cropHeight) / 2);

  // Resize canvas to a lightweight avatar size (max 400x400)
  const outputSize = 400;
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputSize,
    outputSize
  );

  return canvas.toDataURL('image/jpeg', 0.85);
};

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  
  const adminEmail = (user?.role === 'ADMIN' && (!user?.email || user?.email.includes('vidhya.in')))
    ? 'vidhyatutorials22@gmail.com'
    : (user?.email || '');

  const formatCourses = (courses: any): string => {
    if (Array.isArray(courses)) return courses.join(', ');
    if (typeof courses === 'string') return courses;
    return '';
  };

  const [formData, setFormData] = useState({
    name: user?.name || 'Vikas Tank Sir (Director & Founder)',
    firstName: (user as any)?.firstName || user?.name?.split(' ')[0] || 'Vikas',
    lastName: (user as any)?.lastName || user?.name?.split(' ')?.slice(1)?.join(' ') || 'Tank',
    customUserId: user?.userId || (user?.role === 'ADMIN' ? 'ADM-1234' : ''),
    email: adminEmail,
    phone: user?.phone || '+91 88981 17343',
    age: user?.age ? user.age.toString() : '',
    standard: user?.standard || '6th',
    division: user?.division || 'A',
    courses: formatCourses(user?.courses),
    profilePic: (user?.role === 'ADMIN' && (!user?.profilePic || user?.profilePic?.includes('ui-avatars.com')))
      ? '/admin-avatar.jpg'
      : (user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0f8ff7&color=fff&size=200`),
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      const emailVal = (user.role === 'ADMIN' && (!user.email || user.email.includes('vidhya.in')))
        ? 'vidhyatutorials22@gmail.com'
        : (user.email || '');
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        firstName: (user as any)?.firstName || user.name?.split(' ')[0] || prev.firstName,
        lastName: (user as any)?.lastName || user.name?.split(' ')?.slice(1)?.join(' ') || prev.lastName,
        customUserId: user.userId || prev.customUserId,
        email: emailVal,
        phone: user.phone || prev.phone,
        standard: user.standard || prev.standard,
        division: user.division || prev.division,
        courses: formatCourses(user.courses) || prev.courses,
        profilePic: (user.role === 'ADMIN' && (!user.profilePic || user.profilePic.includes('ui-avatars.com')))
          ? '/admin-avatar.jpg'
          : (user.profilePic || prev.profilePic),
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const showToast = (text: string, error = false) => {
    setToastMsg({ text, error });
    setTimeout(() => setToastMsg(null), 4000);
  };
  
  // Cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);
      setFormData(prev => ({ ...prev, profilePic: croppedImage }));
      setImageSrc(null);
      showToast('Photo updated! Click "Save Changes" to apply.');
    } catch (e) {
      console.error(e);
      showToast('Failed to process image. Please try another photo.', true);
    }
  };

  const handleResetAvatar = () => {
    const defaultPic = user?.role === 'ADMIN' ? '/admin-avatar.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0f8ff7&color=fff&size=200`;
    setFormData(prev => ({ ...prev, profilePic: defaultPic }));
    showToast('Profile photo reset to default. Click "Save Changes" to apply.');
  };

  const handleSave = async () => {
    // Password validation if filled
    if (formData.newPassword) {
      if (formData.newPassword.length < 4) {
        showToast('New password must be at least 4 characters long.', true);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('New passwords do not match. Please re-check.', true);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim() || `${formData.firstName} ${formData.lastName}`.trim(),
        customUserId: formData.customUserId?.trim()?.toUpperCase(),
      };

      const { data } = await apiClient.put('/api/auth/profile', payload);
      if (data.success && data.user) {
        updateUser(data.user);
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        showToast('Profile & credentials updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showToast(error.response?.data?.error || 'Failed to save profile. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent font-sans"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
              toastMsg.error
                ? 'bg-red-50 dark:bg-red-950/80 border-red-200 text-red-700 dark:text-red-300'
                : 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {toastMsg.error ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold tracking-wider uppercase">
              {user?.role || 'User'} Profile
            </span>
            {user?.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck size={13} />
                Official Director Account
              </span>
            )}
          </div>
          <h1 className="text-[28px] md:text-[32px] font-h1 font-bold tracking-tight text-primary">Profile & Account Settings</h1>
          <p className="text-on-surface-variant text-xs md:text-sm font-medium">Manage your personal details, credentials, and institutional access.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-bold py-2.5 px-5 rounded-xl transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-primary/20 text-xs cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col items-center text-center h-max space-y-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md bg-slate-100 dark:bg-slate-800">
              <img 
                src={formData.profilePic} 
                alt={formData.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/admin-avatar.jpg';
                }}
              />
            </div>
            {isEditing && (
              <div className="flex items-center gap-1.5 absolute -bottom-2 left-1/2 -translate-x-1/2">
                <label className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md" title="Upload new photo">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <button 
                  type="button" 
                  onClick={handleResetAvatar}
                  className="w-9 h-9 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md border border-outline-variant/30"
                  title="Reset to default photo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-on-surface leading-snug">{formData.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                ID: {formData.customUserId || user?.userId || 'ADM-1234'}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-outline-variant/20 flex flex-col gap-3 text-left text-xs">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant/70 block">Official Email</span>
                <span className="font-semibold text-on-surface truncate block">{formData.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-on-surface-variant">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant/70 block">Contact Phone</span>
                <span className="font-semibold text-on-surface">{formData.phone || 'Not provided'}</span>
              </div>
            </div>

            {user?.role === 'STUDENT' && (
              <>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/70 block">Grade & Division</span>
                    <span className="font-semibold text-on-surface">Class: {formData.standard} - {formData.division}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/70 block">Enrolled Courses</span>
                    <span className="font-semibold text-on-surface truncate max-w-[180px] block">{formData.courses || 'General'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Edit Form & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Personal Details */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-4">
              <User className="w-5 h-5 text-primary" />
              <span>Personal & Institutional Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Display Name */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  Display Full Name / Title
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g. Vikas Tank Sir (Director & Founder)"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                />
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  This title appears across the website, certificates, notices, and dashboard header.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Vikas"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tank"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  User ID / Username
                </label>
                <input 
                  type="text" 
                  value={formData.customUserId} 
                  onChange={e => setFormData({ ...formData, customUserId: e.target.value.toUpperCase() })}
                  disabled={!isEditing}
                  placeholder="ADM-1234"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-black text-on-surface text-xs uppercase"
                />
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  Unique identifier used for portal login.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  Official Email Address (Protected)
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled={true}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 opacity-80 font-bold text-on-surface text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  Locked to <strong>{formData.email}</strong> for security policy compliance.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+91 88981 17343"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                />
              </div>

              {user?.role === 'STUDENT' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Age</label>
                    <input 
                      type="number" 
                      value={formData.age} 
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Standard / Grade</label>
                    <select 
                      value={formData.standard} 
                      onChange={e => setFormData({ ...formData, standard: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                    >
                      {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Division</label>
                    <select 
                      value={formData.division} 
                      onChange={e => setFormData({ ...formData, division: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                    >
                      {['A', 'B', 'C'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">Enrolled Courses (Comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.courses} 
                      onChange={e => setFormData({ ...formData, courses: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-semibold text-on-surface text-xs"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Change Password & Security */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-4">
              <KeyRound className="w-5 h-5 text-primary" />
              <span>Change Portal Password</span>
            </h3>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-3 text-xs text-on-surface-variant">
              <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                To change your password, enter a new password below and click <strong>"Save Changes"</strong>. Leave blank if you do not wish to change your password.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  Current Password (Optional)
                </label>
                <input 
                  type="password" 
                  value={formData.currentPassword} 
                  onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                  disabled={!isEditing}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-medium text-on-surface text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  New Password
                </label>
                <input 
                  type="password" 
                  value={formData.newPassword} 
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                  disabled={!isEditing}
                  placeholder="At least 4 characters"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-medium text-on-surface text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Re-enter new password"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-75 font-medium text-on-surface text-xs"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : <><CheckCircle2 className="w-4 h-4" /> Save Profile & Password</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      <AnimatePresence>
        {imageSrc && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-outline-variant/40"
            >
              <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-on-surface">Crop Profile Picture</h3>
                  <p className="text-xs text-on-surface-variant">Adjust and zoom photo for optimal display</p>
                </div>
                <button onClick={() => setImageSrc(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              
              <div className="relative h-80 w-full bg-slate-950">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-5 flex items-center justify-between gap-4 border-t border-outline-variant/30 bg-surface">
                <input 
                  type="range" 
                  value={zoom} 
                  min={1} 
                  max={3} 
                  step={0.1} 
                  aria-labelledby="Zoom" 
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <button 
                  onClick={handleCropSave}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-md shadow-primary/20 whitespace-nowrap text-xs cursor-pointer"
                >
                  Apply Crop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
