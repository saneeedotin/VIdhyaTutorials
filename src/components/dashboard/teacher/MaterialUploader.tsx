import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Link, FileText, Video, Eye, Users, Search, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

export function MaterialUploader() {
  const [type, setType] = useState<'PDF' | 'VIDEO_LINK'>('PDF');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    courseId: '507f191e810c19729de860ea', // valid dummy ObjectId
    chapterId: '507f191e810c19729de860eb',
    lessonId: '507f191e810c19729de860ec',
    contentUrl: '',
    isViewOnly: true,
    visibility: 'CLASS',
    standard: '10th',
    division: 'A'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/api/teacher/materials', {
        ...formData,
        type
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ ...formData, title: '', contentUrl: '' });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      // Simulate file upload by setting a fake URL
      setFormData({ ...formData, contentUrl: `https://storage.vidhya.com/materials/${encodeURIComponent(file.name)}` });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full text-on-surface pb-12 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
      <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary">Material Uploader</h1>
          <p className="text-on-surface-variant text-sm font-medium">Distribute notes and video lectures to your batches securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-sm"
        >
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setType('PDF')}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'PDF' ? 'bg-error/10 text-error border border-error/30' : 'bg-surface-container text-on-surface-variant border border-transparent hover:bg-surface-container-high'
              }`}
            >
              <FileText className="w-5 h-5" /> Document / PDF
            </button>
            <button 
              onClick={() => setType('VIDEO_LINK')}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'VIDEO_LINK' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-transparent hover:bg-surface-container-high'
              }`}
            >
              <Video className="w-5 h-5" /> Video Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-2 block">Material Title</label>
              <input 
                required
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-on-surface" 
                placeholder="e.g. Chapter 4 Newton's Laws Notes" 
              />
            </div>

            {type === 'VIDEO_LINK' ? (
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-2 block">Video URL (YouTube / S3 / Vimeo)</label>
                <div className="relative">
                  <Link className="w-5 h-5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    required
                    type="url" 
                    value={formData.contentUrl} 
                    onChange={e => setFormData({...formData, contentUrl: e.target.value})} 
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-on-surface" 
                    placeholder="https://" 
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-2 block">Upload File</label>
                <label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  {selectedFileName ? (
                    <p className="font-bold text-primary mb-1">{selectedFileName}</p>
                  ) : (
                    <>
                      <p className="font-medium text-on-surface mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-on-surface-variant">PDF, PPTX, or DOCX up to 50MB</p>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    required={!formData.contentUrl}
                  />
                  
                  {!selectedFileName && (
                    <input 
                      type="url" 
                      value={formData.contentUrl} 
                      onChange={e => setFormData({...formData, contentUrl: e.target.value})} 
                      className="w-full max-w-sm mt-4 bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="Or paste direct CDN link here" 
                      onClick={(e) => e.preventDefault()} // Prevent clicking input from opening file dialog
                    />
                  )}
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={formData.isViewOnly} onChange={e => setFormData({...formData, isViewOnly: e.target.checked})} className="w-5 h-5 mt-1 rounded text-primary focus:ring-primary" />
                  <div>
                    <p className="font-medium text-on-surface flex items-center gap-2"><Eye className="w-4 h-4 text-emerald-500" /> View Only Mode</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">Prevents students from downloading or printing PDFs. Applies server-side watermarking.</p>
                  </div>
                </label>

                <div>
                  <p className="font-medium text-on-surface flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary" /> Visibility</p>
                  <select 
                    value={formData.visibility} 
                    onChange={e => setFormData({...formData, visibility: e.target.value as any})}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="CLASS">Specific Class Only</option>
                    <option value="ALL">All Classes (Public)</option>
                  </select>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block uppercase tracking-widest">Standard</label>
                  <select 
                    value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value})} 
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-on-surface"
                  >
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block uppercase tracking-widest">Division</label>
                  <select 
                    value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} 
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-on-surface"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`mt-4 w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                success ? 'bg-emerald-500' : 'bg-primary hover:bg-primary/90 shadow-sm'
              }`}
            >
              {loading ? 'Uploading...' : success ? <><CheckCircle2 className="w-5 h-5" /> Published Successfully</> : <><Upload className="w-5 h-5" /> Publish Material</>}
            </button>
          </form>
        </motion.div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary text-on-primary rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg mb-2 relative z-10">Select Destination</h3>
            <p className="text-xs text-on-primary/80 mb-6 relative z-10">Where should this material appear?</p>

            <div className="flex flex-col gap-3 relative z-10">
              <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                <p className="text-[10px] font-bold text-on-primary/70 uppercase">Course</p>
                <p className="font-bold text-sm">Class 11 Physics (Core)</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                <p className="text-[10px] font-bold text-on-primary/70 uppercase">Chapter</p>
                <p className="font-bold text-sm">Ch 4: Kinematics</p>
              </div>
              <div className="bg-white/20 border border-white/30 rounded-lg p-3 shadow-inner">
                <p className="text-[10px] font-bold text-on-primary/70 uppercase">Lesson</p>
                <p className="font-bold text-sm">Lesson 2: Projectile Motion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
