import React, { useEffect, useState } from 'react';
import { Users, Image as ImageIcon, TrendingUp, Clock } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    pendingInquiries: 0,
    totalPhotos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admissionsRes, galleryRes] = await Promise.all([
          apiClient.get('/api/admissions'),
          apiClient.get('/api/content/gallery')
        ]);

        const admissions = admissionsRes.data || [];
        const gallery = galleryRes.data?.data || [];

        setStats({
          totalInquiries: admissions.length,
          pendingInquiries: admissions.filter((a: any) => a.status === 'PENDING').length,
          totalPhotos: gallery.length,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Inquiries', value: stats.totalInquiries, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pending Inquiries', value: stats.pendingInquiries, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Gallery Photos', value: stats.totalPhotos, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Dashboard Overview</h2>
        <p className="text-on-surface-variant text-sm mt-1">Welcome to the Vidhya Tutorials Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{stat.title}</p>
              <p className="text-3xl font-bold text-on-surface mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">Manage new student inquiries or update website photos.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a href="/admin/inquiries" className="flex-1 md:flex-none px-4 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors text-center">
            View Inquiries
          </a>
          <a href="/admin/gallery" className="flex-1 md:flex-none px-4 py-2 bg-surface border border-outline-variant text-primary text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-surface-container transition-colors text-center">
            Manage Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
