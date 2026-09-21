import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export function AdminGallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'Events', src: '', description: '' });
  const [adding, setAdding] = useState(false);

  const fetchPhotos = async () => {
    try {
      const res = await apiClient.get('/api/content/gallery');
      setPhotos(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiClient.delete(`/api/content/gallery/${id}`);
      fetchPhotos();
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await apiClient.post('/api/content/gallery', newPhoto);
      setShowAddModal(false);
      setNewPhoto({ title: '', category: 'Events', src: '', description: '' });
      fetchPhotos();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add photo');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gallery Manager</h2>
          <p className="text-on-surface-variant text-sm mt-1">Manage the photos displayed on the public website.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" /> Add New Photo
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-surface border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center">
          <ImageIcon className="w-12 h-12 text-outline-variant mb-3" />
          <p className="text-on-surface font-semibold">No photos in the gallery.</p>
          <p className="text-on-surface-variant text-sm mt-1">Click "Add New Photo" to upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id || photo._id} className="bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm group">
              <div className="aspect-[4/3] relative overflow-hidden bg-surface-container">
                <img 
                  src={photo.src} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
                />
                <button 
                  onClick={() => handleDelete(photo.id || photo._id)}
                  className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-lg hover:bg-error transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{photo.category}</div>
                <h3 className="font-bold text-on-surface leading-snug line-clamp-2" title={photo.title}>{photo.title}</h3>
                {photo.description && (
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{photo.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface rounded-3xl p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="font-extrabold text-xl text-primary mb-1">Add Gallery Photo</h3>
            <p className="text-xs text-on-surface-variant mb-6">Enter details for the new photo.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Photo Title</label>
                <input 
                  type="text" 
                  required
                  value={newPhoto.title}
                  onChange={e => setNewPhoto({...newPhoto, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl focus:border-primary outline-none text-sm"
                  placeholder="e.g. Annual Day 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Image URL</label>
                <input 
                  type="text" 
                  required
                  value={newPhoto.src}
                  onChange={e => setNewPhoto({...newPhoto, src: e.target.value})}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl focus:border-primary outline-none text-sm"
                  placeholder="https://... or /gallery/..."
                />
                <p className="text-[10px] text-on-surface-variant mt-1">Provide a full URL or a relative path to a local asset.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={newPhoto.category}
                  onChange={e => setNewPhoto({...newPhoto, category: e.target.value})}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl focus:border-primary outline-none text-sm"
                >
                  <option value="Events">Events</option>
                  <option value="Classroom">Classroom</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Achievers">Achievers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Description (Optional)</label>
                <textarea 
                  value={newPhoto.description}
                  onChange={e => setNewPhoto({...newPhoto, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl focus:border-primary outline-none text-sm resize-none h-20"
                  placeholder="Brief context about this photo..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-on-surface-variant font-bold text-sm uppercase tracking-wider hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={adding}
                  className="flex-1 py-3 bg-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 transition-colors flex justify-center disabled:opacity-70"
                >
                  {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
