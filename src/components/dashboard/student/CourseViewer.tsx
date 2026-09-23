import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, PlayCircle, Download, X } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

interface Material {
  _id: string;
  title: string;
  type: 'DOCUMENT' | 'VIDEO';
  url: string;
  subject: string;
  fileSize?: string;
  duration?: string;
}

export function CourseViewer() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeVideo, setActiveVideo] = useState<Material | null>(null);

  useEffect(() => {
    apiClient.get('/api/student/materials')
      .then(res => {
        if (res.data.success) {
          setMaterials(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  const documents = materials.filter(m => m.type === 'DOCUMENT');
  const videos = materials.filter(m => m.type === 'VIDEO');

  // Helper to convert standard youtube url to embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
    } catch(e) { console.error(e) }
    return url;
  };

  const getThumbnailUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    } catch(e) { console.error(e) }
    return 'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary">
          My Courses
        </h1>
        <p className="text-on-surface-variant text-sm font-medium">Materials assigned to your Standard and Division.</p>
      </div>


    </motion.div>
  );
}
