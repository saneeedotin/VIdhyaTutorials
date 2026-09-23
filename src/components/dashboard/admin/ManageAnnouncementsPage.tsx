import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Megaphone, Calendar, Image as ImageIcon, Search, AlertTriangle, Check } from 'lucide-react';

interface Announcement {
  _id: string;
  type: 'NEWS' | 'EVENT';
  title: string;
  date: string;
  time?: string;
  imgUrl?: string;
  tags?: string[];
  isActive: boolean;
}

export function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'NEWS' | 'EVENT'>('ALL');
  const [search, setSearch] = useState('');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    type: 'EVENT',
    title: '',
    date: '',
    time: '',
    imgUrl: '',
    tags: [],
    isActive: true
  });
  const [tagInput, setTagInput] = useState('');

  // Delete confirm modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get('/api/announcements/all');
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      showToast('Error loading announcements', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingId(announcement._id);
      setFormData({ ...announcement });
    } else {
      setEditingId(null);
      setFormData({ type: 'EVENT', title: '', date: '', time: '', imgUrl: '', tags: [], isActive: true });
    }
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/api/announcements/${editingId}`, formData);
        showToast('Announcement updated successfully!');
      } else {
        await apiClient.post('/api/announcements', formData);
        showToast('New announcement created successfully!');
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving', error);
      showToast('Failed to save announcement.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/api/announcements/${deleteConfirm.id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== deleteConfirm.id));
      showToast(`Deleted: "${deleteConfirm.title}"`);
    } catch (error) {
      console.error('Error deleting', error);
      showToast('Failed to delete announcement.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
  };

  const filtered = announcements.filter(a => {
    if (filterType !== 'ALL' && a.type !== filterType) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-primary" />
            Manage Announcements
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">Add or edit News and Events displayed on the landing page.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
        {/* Filters */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex bg-surface rounded-lg border border-outline-variant/30 p-1 w-full md:w-auto">
          {['ALL', 'NEWS', 'EVENT'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`flex-1 px-4 py-2 rounded-md font-semibold text-xs transition-colors ${filterType === type ? 'bg-primary text-white dark:text-[#001b3c] shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">Loading announcements...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">Abhi Koi Announcement Nahi Hai</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mb-6">
              Aap jab yahan se nayi announcement publish karenge, tabhi woh website aur portal par dikhayi degi.
            </p>
            <button
              onClick={() => openModal()}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nayi Announcement Dalein
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-6">Type</th>
                <th className="p-6">Title</th>
                <th className="p-6">Date/Time</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.map(item => (
                <tr key={item._id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${item.type === 'EVENT' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary/10 text-primary'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="font-medium text-on-surface line-clamp-1">{item.title}</p>
                    {item.type === 'EVENT' && item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant border border-outline-variant/50 px-1.5 py-0.5 rounded-md">{tag}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-6">
                    <p className="font-medium text-on-surface text-sm">{item.date}</p>
                    {item.time && <p className="text-xs text-on-surface-variant">{item.time}</p>}
                  </td>
                  <td className="p-6">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${item.isActive ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-max' : 'text-on-surface-variant bg-surface-container px-2 py-1 rounded-md w-max'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-outline-variant'}`} />
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(item)} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-colors cursor-pointer"
                        title="Edit Announcement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ id: item._id, title: item.title })} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface">
                <h2 className="text-[24px] font-h2 font-semibold text-primary">{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="announcement-form" onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Type</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({ ...formData, type: e.target.value as 'NEWS' | 'EVENT' })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="EVENT">Event (What's happening)</option>
                        <option value="NEWS">News (Stories & highlights)</option>
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.isActive}
                          onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
                        />
                        <span className="font-medium text-on-surface">Display Publicly</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Title <span className="text-error">*</span></label>
                    <input 
                      type="text" required
                      value={formData.title} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder={formData.type === 'EVENT' ? 'e.g. Revision Masterclass' : 'e.g. Admissions Open'}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Display Date <span className="text-error">*</span></label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                        <input 
                          type="text" required
                          value={formData.date} 
                          onChange={e => setFormData({ ...formData, date: e.target.value })}
                          placeholder="e.g. June 10"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    {formData.type === 'EVENT' && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-on-surface">Time (Optional)</label>
                        <input 
                          type="text"
                          value={formData.time || ''} 
                          onChange={e => setFormData({ ...formData, time: e.target.value })}
                          placeholder="e.g. 10:00am - 4:00pm"
                          className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>

                  {formData.type === 'NEWS' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-on-surface-variant" />
                        Image URL (Optional)
                      </label>
                      <input 
                        type="text"
                        value={formData.imgUrl || ''} 
                        onChange={e => setFormData({ ...formData, imgUrl: e.target.value })}
                        placeholder="https://example.com/image.png"
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <p className="text-xs text-on-surface-variant">Provide a direct link to an image. Leave blank to use a placeholder.</p>
                    </div>
                  )}

                  {formData.type === 'EVENT' && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface">Tags</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={tagInput} 
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          placeholder="e.g. Academic"
                          className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium rounded-lg transition-colors">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags?.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-on-surface-variant hover:text-error"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface flex justify-end gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" form="announcement-form"
                  className="px-6 py-2.5 bg-primary text-white dark:text-[#001b3c] font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Announcement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inline Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant/30 text-on-surface"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">Delete Announcement</h3>
                  <p className="text-xs text-on-surface-variant">
                    Are you sure you want to delete "{deleteConfirm.title}"?
                  </p>
                </div>
              </div>
              <p className="text-xs text-rose-500 font-medium mb-5">
                ⚠️ This announcement will be removed from the public website notice board immediately.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-[200] font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-white ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
