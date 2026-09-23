import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sliders, 
  Image as ImageIcon, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Star, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Camera, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from '../../landing/CampusGallery';
import { REAL_REVIEWS, Review } from '../../landing/GoogleReviewsWall';
import { getFormConfig, saveFormConfig } from '../../../utils/formConfig';
import { apiClient } from '../../../api/apiClient';

export function WebsiteContentManager() {
  const [activeTab, setActiveTab] = useState<'admissions_widget' | 'gallery' | 'reviews'>('admissions_widget');
  const [saveToast, setSaveToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'photo' | 'review'; id: string; name: string } | null>(null);

  // ── 1. Floating Admissions Widget Config ──
  const [floatingEnabled, setFloatingEnabled] = useState(() => {
    const legacy = localStorage.getItem('vt_floating_admission_button');
    const formCfg = getFormConfig('admissionPopup');
    if (legacy !== null) {
      return legacy !== 'false' && formCfg.floatingBadgeEnabled !== false && formCfg.enabled !== false;
    }
    return formCfg.floatingBadgeEnabled !== false && formCfg.enabled !== false;
  });

  useEffect(() => {
    const handleSync = () => {
      const legacy = localStorage.getItem('vt_floating_admission_button');
      const formCfg = getFormConfig('admissionPopup');
      if (legacy !== null) {
        setFloatingEnabled(legacy !== 'false' && formCfg.floatingBadgeEnabled !== false && formCfg.enabled !== false);
      } else {
        setFloatingEnabled(formCfg.floatingBadgeEnabled !== false && formCfg.enabled !== false);
      }
    };
    window.addEventListener('vt_admin_setting_changed', handleSync);
    window.addEventListener('vt_form_configs_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('vt_admin_setting_changed', handleSync);
      window.removeEventListener('vt_form_configs_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const toggleFloatingButton = () => {
    const nextState = !floatingEnabled;
    setFloatingEnabled(nextState);
    localStorage.setItem('vt_floating_admission_button', String(nextState));

    // Keep formConfig and backend in 100% sync
    try {
      const currentPopupCfg = getFormConfig('admissionPopup');
      saveFormConfig('admissionPopup', {
        ...currentPopupCfg,
        floatingBadgeEnabled: nextState,
      });
    } catch (e) {
      console.error('Error saving form config:', e);
    }

    window.dispatchEvent(new Event('vt_admin_setting_changed'));
    window.dispatchEvent(new CustomEvent('vt_form_configs_updated', { detail: { nextState } }));
    showToast(`Admissions floating badge ${nextState ? 'enabled' : 'hidden'} on public site!`);
  };

  // ── 2. Gallery Management ──
  const [galleryList, setGalleryList] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('vt_admin_custom_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return GALLERY_PHOTOS;
  });

  // Fetch live gallery from backend
  useEffect(() => {
    apiClient.get('/api/content/gallery')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setGalleryList(res.data.data);
          localStorage.setItem('vt_admin_custom_gallery', JSON.stringify(res.data.data));
        }
      })
      .catch(err => console.warn('Could not fetch remote gallery, using local cache:', err));
  }, []);

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Events' as 'Events' | 'Achievers' | 'Mentorship' | 'Classroom',
    src: '',
    description: ''
  });

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.src) {
      showToast('Please provide title and image URL / file path.');
      return;
    }
    const photo: GalleryPhoto = {
      id: `photo-custom-${Date.now()}`,
      title: newPhoto.title,
      category: newPhoto.category,
      src: newPhoto.src,
      description: newPhoto.description || 'Uploaded via Admin Panel'
    };

    try {
      await apiClient.post('/api/content/gallery', photo);
    } catch (err) {
      console.warn('Saved photo locally:', err);
    }

    const updated = [photo, ...galleryList];
    setGalleryList(updated);
    localStorage.setItem('vt_admin_custom_gallery', JSON.stringify(updated));
    setNewPhoto({ title: '', category: 'Events', src: '', description: '' });
    window.dispatchEvent(new Event('vt_admin_setting_changed'));
    showToast('New photo added to Gallery!');
  };

  // ── 3. Reviews Management ──
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('vt_sticky_reviews_actual_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return REAL_REVIEWS;
  });

  // Fetch live reviews from backend
  useEffect(() => {
    apiClient.get('/api/content/reviews')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setReviewsList(res.data.data);
          localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(res.data.data));
        }
      })
      .catch(err => console.warn('Could not fetch remote reviews, using local cache:', err));
  }, []);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    name: '',
    role: 'Parent' as 'Parent' | 'Student' | 'Alumni',
    detail: '',
    comment: '',
    rating: 5
  });

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      showToast('Please provide reviewer name and comment.');
      return;
    }
    const paletteKeys = Object.keys(REAL_REVIEWS.length > 0 ? { cream: 1, mint: 1, rose: 1, sky: 1, lavender: 1, peach: 1 } : {});
    const review: Review = {
      id: `rev-custom-${Date.now()}`,
      name: newReview.name,
      role: newReview.role,
      detail: newReview.detail || 'Vidhya Tutorials',
      rating: newReview.rating,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      comment: newReview.comment,
      likes: 0,
      colorKey: paletteKeys[Math.floor(Math.random() * paletteKeys.length)] || 'cream',
      frontRotate: (Math.random() * 4 - 2)
    };

    try {
      await apiClient.post('/api/content/reviews', review);
    } catch (err) {
      console.warn('Saved review locally:', err);
    }

    const updated = [review, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(updated));
    window.dispatchEvent(new Event('vt_admin_setting_changed'));
    setNewReview({ name: '', role: 'Parent', detail: '', comment: '', rating: 5 });
    showToast('New review added to Website Wall!');
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      await apiClient.put(`/api/content/reviews/${editingReview.id}`, editingReview);
    } catch (err) {
      console.warn('Updated review locally:', err);
    }

    const updated = reviewsList.map(r => r.id === editingReview.id ? editingReview : r);
    setReviewsList(updated);
    localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(updated));
    window.dispatchEvent(new Event('vt_admin_setting_changed'));
    setEditingReview(null);
    showToast('Review updated successfully!');
  };

  const handleDeletePhoto = (id: string, title: string) => {
    setDeleteConfirm({ type: 'photo', id, name: title || 'Photo' });
  };

  const handleDeleteReview = (id: string, name: string) => {
    setDeleteConfirm({ type: 'review', id, name: name || 'Review' });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'photo') {
      try {
        await apiClient.delete(`/api/content/gallery/${deleteConfirm.id}`);
      } catch (err) {
        console.warn('Deleted locally:', err);
      }
      const updated = galleryList.filter(p => p.id !== deleteConfirm.id);
      setGalleryList(updated);
      localStorage.setItem('vt_admin_custom_gallery', JSON.stringify(updated));
      window.dispatchEvent(new Event('vt_admin_setting_changed'));
      showToast('Photo removed from Gallery.');
    } else {
      try {
        await apiClient.delete(`/api/content/reviews/${deleteConfirm.id}`);
      } catch (err) {
        console.warn('Deleted locally:', err);
      }
      const updated = reviewsList.filter(r => r.id !== deleteConfirm.id);
      setReviewsList(updated);
      localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(updated));
      window.dispatchEvent(new Event('vt_admin_setting_changed'));
      showToast('Review removed from Website Wall.');
    }
    setDeleteConfirm(null);
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-on-surface">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface flex items-center gap-3">
            <span>Website Live Content & Widgets</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
              Admin Controller
            </span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Toggle admissions button on/off, upload gallery photos, and edit Google/Justdial reviews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container rounded-2xl border border-outline-variant/30">
          <button
            onClick={() => setActiveTab('admissions_widget')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admissions_widget'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Sliders size={15} />
            <span>Admissions Widget</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ImageIcon size={15} />
            <span>Gallery Photos ({galleryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <MessageSquare size={15} />
            <span>Reviews Wall ({reviewsList.length})</span>
          </button>

          <Link
            to="/admin/forms"
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          >
            <FileText size={15} />
            <span>Edit Website Forms & Inquiries</span>
          </Link>
        </div>
      </div>

      {/* ── TAB 1: ADMISSIONS POPUP & FLOATING BUTTON TOGGLE ── */}
      {activeTab === 'admissions_widget' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Right-Side Floating Admission Badge
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Controls the persistent "AY 2026-27 Admissions Open" floating pill docked on the right side of the public website.
                </p>
              </div>

              <button
                onClick={toggleFloatingButton}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  floatingEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                    floatingEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">Current Live Status:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                floatingEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
              }`}>
                {floatingEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>{floatingEnabled ? 'VISIBLE TO VISITORS' : 'HIDDEN FROM VISITORS'}</span>
              </span>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant space-y-2">
              <p className="font-semibold text-on-surface">Features Controlled:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Instant Admission Quick Form popup trigger on the right side</li>
                <li>Automatic popup modal after 1.5s on first visit</li>
                <li>Zero code edit required; toggles instantly across all browser tabs</li>
              </ul>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Live Preview of Button</span>
            <div className="p-6 bg-slate-950 rounded-2xl w-full max-w-sm flex items-center justify-center">
              <div className="flex items-center gap-3 pl-4 pr-3.5 py-3 bg-white text-slate-900 rounded-l-2xl shadow-xl border-l-2 border-primary">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary leading-none mb-1">
                    AY 2026–27
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap flex items-center gap-1.5 text-slate-900">
                    <span>Admissions Open</span>
                    <Sparkles size={12} className="text-amber-500" />
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">
              When toggled off, visitors see a completely unobstructed page view.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 2: GALLERY PHOTOS MANAGER ── */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Add New Photo Card */}
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Add New Photo to Gallery</span>
            </h3>

            <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Batch Practical Lab"
                  value={newPhoto.title}
                  onChange={e => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Category *
                </label>
                <select
                  value={newPhoto.category}
                  onChange={e => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Events">Events & Picnics</option>
                  <option value="Achievers">Board Toppers & Achievers</option>
                  <option value="Mentorship">Faculty & Mentorship</option>
                  <option value="Classroom">Classroom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Image Path / URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /gallery/gallery-02.jpg or URL"
                  value={newPhoto.src}
                  onChange={e => setNewPhoto({ ...newPhoto, src: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Plus size={16} />
                  <span>Publish Photo</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {galleryList.map(photo => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-surface border border-outline-variant/30 shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center relative">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id, photo.title)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-700 cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="p-2.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary block truncate">
                    {photo.category}
                  </span>
                  <p className="text-xs font-bold text-on-surface truncate mt-0.5">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: REVIEWS MANAGER ── */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Edit / Add Review Form */}
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              {editingReview ? <Edit3 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-primary" />}
              <span>{editingReview ? `Editing Review: ${editingReview.name}` : 'Add New Review to Website Wall'}</span>
            </h3>

            {editingReview ? (
              <form onSubmit={handleUpdateReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingReview.name}
                      onChange={e => setEditingReview({ ...editingReview, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Role *
                    </label>
                    <select
                      value={editingReview.role}
                      onChange={e => setEditingReview({ ...editingReview, role: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Student">Student</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Batch / Detail
                    </label>
                    <input
                      type="text"
                      value={editingReview.detail}
                      onChange={e => setEditingReview({ ...editingReview, detail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Review Comment / Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingReview.comment}
                    onChange={e => setEditingReview({ ...editingReview, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save size={15} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Reviewer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Shah"
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Role *
                    </label>
                    <select
                      value={newReview.role}
                      onChange={e => setNewReview({ ...newReview, role: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Student">Student</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Batch Detail
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10th SSC Batch"
                      value={newReview.detail}
                      onChange={e => setNewReview({ ...newReview, detail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Review Text *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter review feedback..."
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs sm:text-sm text-on-surface resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus size={15} />
                  <span>Publish Review to Wall</span>
                </button>
              </form>
            )}
          </div>

          {/* Active Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewsList.map(rev => (
              <div
                key={rev.id}
                className="bg-surface rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface leading-tight">
                        {rev.name}
                      </h4>
                      <span className="text-[11px] text-primary font-semibold">
                        {rev.role} • {rev.detail}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={13} className="fill-amber-400" />
                      <span className="text-xs font-bold text-on-surface">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-2.5 leading-relaxed line-clamp-3">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant/70 font-medium">{rev.date}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingReview(rev)}
                      className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary cursor-pointer transition-colors"
                      title="Edit review"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev.id, rev.name)}
                      className="p-1.5 rounded-lg bg-surface-container hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 cursor-pointer transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inline Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest dark:bg-surface-container border border-outline-variant/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  Delete {deleteConfirm.type === 'photo' ? 'Photo' : 'Review'}?
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Are you sure you want to remove &ldquo;<span className="font-semibold text-on-surface">{deleteConfirm.name}</span>&rdquo;? This will immediately update the live website.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
