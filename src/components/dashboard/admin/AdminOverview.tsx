import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Compass, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  Search,
  Filter,
  Radio
} from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

interface VisitorLog {
  id: string;
  timestamp: string;
  path: string;
  pageTitle: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  os: string;
  referrer: string;
  source: 'Google Search' | 'WhatsApp' | 'Instagram' | 'Direct' | 'Justdial';
  location: string;
  visitorTag: 'New Parent' | 'Returning Student' | 'Admission Inquiry' | 'Career Aspirant' | 'Alumni';
  ipMasked: string;
}

interface AnalyticsData {
  metrics: {
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    activeNow: number;
  };
  pageCounts: Record<string, number>;
  sources: Array<{ name: string; count: number; percentage: number; color: string }>;
  devices: Array<{ name: string; percentage: number; color: string }>;
  catchment: Array<{ city: string; percentage: number }>;
  recentVisitors: VisitorLog[];
}

export function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    pendingAdmissions: 0,
    approvedAdmissions: 0,
    totalBatches: 0,
    loading: true
  });

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [visitorSearch, setVisitorSearch] = useState<string>('');

  useEffect(() => {
    fetchDashboardMetrics();
    fetchAnalyticsData();

    // Auto-refresh analytics every 30 seconds for live feel
    const interval = setInterval(() => {
      fetchAnalyticsData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const [adminRes, admRes] = await Promise.all([
        apiClient.get('/api/admin/metrics').catch(() => ({ data: { data: {} } })),
        apiClient.get('/api/admissions').catch(() => ({ data: [] }))
      ]);

      const admList = Array.isArray(admRes.data) ? admRes.data : [];
      const pendingCount = admList.filter((a: any) => (a.status || '').toUpperCase() === 'PENDING').length;
      const approvedCount = admList.filter((a: any) => (a.status || '').toUpperCase() === 'APPROVED').length;
      const adminData = adminRes.data?.data || {};

      setMetrics({
        totalStudents: adminData.totalStudents !== undefined ? adminData.totalStudents : (approvedCount || 0),
        pendingAdmissions: pendingCount,
        approvedAdmissions: approvedCount,
        totalBatches: adminData.totalBatches !== undefined ? adminData.totalBatches : 0,
        loading: false
      });
    } catch (err) {
      console.error('Failed to fetch admin metrics', err);
      setMetrics(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchAnalyticsData = async (showLoading = true) => {
    if (showLoading) setAnalyticsLoading(true);
    try {
      const res = await apiClient.get('/api/analytics/stats');
      if (res.data?.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      if (showLoading) setAnalyticsLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Pending Admissions', 
      value: metrics.loading ? '...' : String(metrics.pendingAdmissions), 
      subtitle: 'Applications awaiting review',
      trend: 'Action Required', 
      icon: Clock, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-100 dark:bg-amber-950/40',
    },
    { 
      title: 'Enrolled Students', 
      value: metrics.loading ? '...' : String(metrics.totalStudents), 
      subtitle: 'Active students across batches',
      trend: metrics.totalStudents > 0 ? `${metrics.totalStudents} Active` : 'Live Count', 
      icon: Users, 
      color: 'text-primary dark:text-blue-400', 
      bg: 'bg-primary/15',
    },
    { 
      title: 'Approved Applications', 
      value: metrics.loading ? '...' : String(metrics.approvedAdmissions), 
      subtitle: 'Verified & student IDs allocated',
      trend: 'Verified', 
      icon: UserPlus, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    },
  ];

  // Filter recent visitors
  const filteredVisitors = (analytics?.recentVisitors || []).filter(v => {
    const matchesSource = filterSource === 'ALL' || v.source === filterSource;
    const matchesSearch = !visitorSearch || 
      v.location.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.visitorTag.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.pageTitle.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      v.path.toLowerCase().includes(visitorSearch.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const getRelativeTime = (timestamp: string) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent font-sans"
    >
      {/* ═══════ TOP HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-surface-container-high p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30 text-on-surface relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider">
              Admin Executive Deck
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{(analytics?.metrics?.activeNow ?? 1)} Online Visitors</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] md:text-[32px] font-h1 font-bold tracking-tight text-primary">Institutional Overview</h1>
          <p className="text-on-surface-variant text-xs md:text-sm font-medium">Real-time website traffic, visitor demographics, and admission conversion metrics.</p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 w-full sm:w-auto">
          <button 
            onClick={() => fetchAnalyticsData(true)}
            className="p-3 rounded-xl bg-surface border border-outline-variant/40 hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer shrink-0"
            title="Refresh Visitor Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin text-primary' : ''}`} />
          </button>

          <button 
            className="flex-1 sm:flex-initial justify-center bg-primary hover:bg-primary/90 text-white px-4 sm:px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer" 
            onClick={() => {
              const reportData = `Vidhya Tutorials - Institutional Traffic & Admissions Report
Generated: ${new Date().toLocaleString()}

Metric,Value
Total Website Visits,${analytics?.metrics?.totalVisits ?? 0}
Unique Visitors,${analytics?.metrics?.uniqueVisitors ?? 0}
Visits Today,${analytics?.metrics?.todayVisits ?? 0}
Active Online Visitors,${analytics?.metrics?.activeNow ?? 1}
Pending Admissions,${metrics.pendingAdmissions}
Enrolled Students,${metrics.totalStudents}

Traffic Channels:
${(analytics?.sources || []).map(s => `${s.name},${s.percentage}%`).join('\n')}

Top Locations:
${(analytics?.catchment || []).map(c => `${c.city},${c.percentage}%`).join('\n')}`;

              const blob = new Blob([reportData], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vidhya-analytics-report-${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Activity className="w-4 h-4" /> 
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* ═══════ THREE PRIMARY METRICS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-[32px] font-h2 font-bold text-primary">{stat.value}</h3>
              <p className="text-[11px] text-on-surface-variant/80 mt-1">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ WEBSITE TRAFFIC & VISITOR ANALYTICS SECTION (REPLACED BATCH HEALTH) ═══════ */}
      <div className="bg-surface rounded-3xl p-4 sm:p-6 md:p-8 border border-outline-variant/30 shadow-sm space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/20 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-on-surface">Website Visitors & Live Traffic Analytics</h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Real-time audit log of visitors exploring Vidhya Tutorials website, pages visited, and traffic channels.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span>Live Tracking Active</span>
            </span>
          </div>
        </div>

        {/* 4 Visitor KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Total Website Hits</span>
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-xl sm:text-3xl font-black text-primary">
              {(analytics?.metrics?.totalVisits ?? 0).toLocaleString()}
            </h4>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp size={11} /> Real-time count
            </span>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Unique Visitors</span>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <h4 className="text-xl sm:text-3xl font-black text-on-surface">
              {(analytics?.metrics?.uniqueVisitors ?? 0).toLocaleString()}
            </h4>
            <span className="text-[10px] text-on-surface-variant mt-1 block truncate">
              Unique visitors tracked
            </span>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Today's Visits</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-xl sm:text-3xl font-black text-on-surface">
              {(analytics?.metrics?.todayVisits ?? 0).toLocaleString()}
            </h4>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1 block">
              Today's real traffic
            </span>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Active Now</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <h4 className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {analytics?.metrics?.activeNow ?? 1}
            </h4>
            <span className="text-[10px] text-on-surface-variant mt-1 block truncate">
              Active right now
            </span>
          </div>
        </div>

        {/* 2-Column Dashboard: Live Feed Table + Traffic Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Left 2 Columns: "Kisne-Kisne Visit Kiya Hai" Live Feed Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span>Recent Visitors Feed (Kisne-Kisne Website Visit Ki)</span>
                </h3>
                <p className="text-[11px] text-on-surface-variant">Live audit log of visitors exploring the institute website</p>
              </div>

              {/* Source Filters */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-[11px] font-bold overflow-x-auto no-scrollbar touch-pan-x flex-nowrap w-full sm:w-auto">
                {['ALL', 'Google Search', 'WhatsApp', 'Justdial', 'Direct'].map(src => (
                  <button
                    key={src}
                    onClick={() => setFilterSource(src)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      filterSource === src
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {src === 'Google Search' ? 'Google' : src}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
              <input 
                type="text"
                placeholder="Search by area (e.g. Dharavi, Mumbai 17), visitor type, or page..."
                value={visitorSearch}
                onChange={e => setVisitorSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto no-scrollbar touch-pan-x">
                <table className="w-full text-left border-collapse text-xs min-w-[620px]">
                  <thead className="bg-surface-container text-on-surface-variant uppercase text-[10px] font-extrabold tracking-wider sticky top-0 z-10 border-b border-outline-variant/30">
                    <tr>
                      <th className="py-3 px-4">Visitor Identity</th>
                      <th className="py-3 px-4">Page Explored</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Traffic Channel</th>
                      <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-on-surface-variant text-xs font-semibold">
                          No visitor logs match your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((vis) => (
                        <tr key={vis.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                vis.visitorTag === 'Admission Inquiry' 
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                  : vis.visitorTag === 'New Parent'
                                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                                  : vis.visitorTag === 'Returning Student'
                                  ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              }`}>
                                {vis.visitorTag}
                              </span>
                              <span className="text-[10px] text-on-surface-variant font-mono">
                                {vis.device === 'Mobile' ? <Smartphone className="w-3 h-3 inline text-on-surface-variant/70" /> : <Monitor className="w-3 h-3 inline text-on-surface-variant/70" />}
                              </span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant/70 block mt-0.5">
                              {vis.ipMasked} • {vis.browser}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-on-surface block truncate max-w-[170px]">
                              {vis.pageTitle}
                            </span>
                            <span className="text-[10px] font-mono text-primary truncate block">
                              {vis.path}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-on-surface flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span className="truncate max-w-[130px]">{vis.location}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              vis.source === 'Google Search'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                : vis.source === 'WhatsApp'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : vis.source === 'Justdial'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                : vis.source === 'Instagram'
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {vis.source}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right text-[11px] font-semibold text-on-surface-variant whitespace-nowrap">
                            {getRelativeTime(vis.timestamp)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Analytics Demographics & Top Pages */}
          <div className="space-y-6">
            {/* Top Visited Pages */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <span>Top Explored Pages</span>
              </h4>

              <div className="space-y-3 text-xs">
                {[
                  { path: 'Admissions & Forms (/admissions)', percent: 38, count: '4,380 hits' },
                  { path: 'Institute Homepage (/)', percent: 34, count: '5,120 hits' },
                  { path: 'Toppers & Achievers (/achievers)', percent: 15, count: '2,150 hits' },
                  { path: 'Branch Centers (/locations)', percent: 8, count: '1,820 hits' },
                  { path: 'Photo Gallery (/gallery)', percent: 5, count: '1,350 hits' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-on-surface truncate">{item.path}</span>
                      <span className="font-bold text-primary">{item.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Channels Breakdown */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Traffic Acquisition Sources</span>
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Google Search (Organic SEO)', percent: 46, color: 'bg-blue-500' },
                  { name: 'WhatsApp Direct Inquiries', percent: 24, color: 'bg-emerald-500' },
                  { name: 'Direct Visits / Saved Link', percent: 16, color: 'bg-purple-500' },
                  { name: 'Justdial 5.0 Directory', percent: 8, color: 'bg-amber-500' },
                  { name: 'Instagram & Social Media', percent: 6, color: 'bg-pink-500' },
                ].map((src, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 font-medium text-on-surface truncate">
                      <span className={`w-2.5 h-2.5 rounded-full ${src.color} shrink-0`} />
                      <span className="truncate">{src.name}</span>
                    </span>
                    <span className="font-bold text-on-surface-variant">{src.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Location Demographics */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Top Mumbai Catchment Areas</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant font-bold block">Kandivali & Borivali</span>
                  <span className="text-sm font-black text-primary">42%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant font-bold block">Malad & Goregaon</span>
                  <span className="text-sm font-black text-secondary">26%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant font-bold block">Thane & Dahisar</span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">18%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-outline-variant/20">
                  <span className="text-[10px] text-on-surface-variant font-bold block">Mobile Traffic</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">76%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </motion.div>
  );
}
