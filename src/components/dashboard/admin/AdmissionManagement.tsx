import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Printer,
  X,
  MapPin,
  User,
  Calendar,
  Award,
  Edit2,
  Trash2,
  UserCheck,
  Check,
  Phone,
  Mail,
  Home,
  CreditCard,
  PlusCircle,
  Filter,
  AlertTriangle,
  CheckSquare,
  Square,
  Copy
} from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

interface AdmissionApp {
  _id: string;
  studentName: string;
  fatherName?: string;
  motherName?: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  religion?: string;
  nationality?: string;
  nidNumber?: string;
  bloodGroup?: string;
  occupation?: string;
  maritalStatus?: string;
  presentDivision?: string;
  presentDistrict?: string;
  presentAddress?: string;
  permanentDivision?: string;
  permanentDistrict?: string;
  permanentAddress?: string;
  previousSchool?: string;
  standard: string;
  stream?: string;
  enrollmentType?: 'ALL_SUBJECTS' | 'INDIVIDUAL_SUBJECTS';
  subjects?: string[];
  studentSignature?: string;
  parentSignature?: string;
  photoUrl?: string;
  status: string;
  enrolledStudentId?: string;
  submittedAt: string;
}

export function AdmissionManagement() {
  const [applications, setApplications] = useState<AdmissionApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [standardFilter, setStandardFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<AdmissionApp | null>(null);
  const [editingApp, setEditingApp] = useState<AdmissionApp | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Inline delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[]; names: string[] } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Enrolled student credential popup state
  const [enrolledInfo, setEnrolledInfo] = useState<{ studentName: string; studentId: string; defaultPassword: string; message: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await apiClient.get('/api/admissions');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/api/admissions/${id}/status`, { status });
      setApplications(prev => prev.map(app => (app._id === id ? { ...app, status } : app)));
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(prev => (prev ? { ...prev, status } : null));
      }
      showFeedback(`Application status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      showFeedback('Failed to update status.');
    }
  };

  const deleteApplication = (id: string, name: string) => {
    setDeleteConfirm({ ids: [id], names: [name] });
  };

  const handleBulkDeleteClick = () => {
    const ids = Array.from(selectedIds);
    const names = ids.map(id => applications.find(a => a._id === id)?.studentName || id);
    setDeleteConfirm({ ids, names });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    const { ids } = deleteConfirm;
    try {
      // Delete all selected in parallel
      await Promise.all(ids.map(id => apiClient.delete(`/api/admissions/${id}`)));
      // Update local state — no page reload
      setApplications(prev => prev.filter(app => !ids.includes(app._id)));
      setSelectedIds(new Set());
      if (selectedApp && ids.includes(selectedApp._id)) setSelectedApp(null);
      if (editingApp && ids.includes(editingApp._id)) setEditingApp(null);
      showFeedback(`${ids.length} application${ids.length > 1 ? 's' : ''} deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete:', error);
      showFeedback('Error: Some applications could not be deleted.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const convertToStudent = async (id: string) => {
    try {
      const targetApp = applications.find(a => a._id === id);
      const res = await apiClient.post(`/api/admissions/${id}/convert-to-student`);
      const { studentId, defaultPassword, message } = res.data;
      setApplications(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status: 'APPROVED', enrolledStudentId: studentId } : app
        )
      );
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(prev => (prev ? { ...prev, status: 'APPROVED', enrolledStudentId: studentId } : null));
      }
      setEnrolledInfo({
        studentName: targetApp?.studentName || 'Student',
        studentId,
        defaultPassword,
        message: message || 'Student enrolled successfully!'
      });
      showFeedback(`Enrolled! Student ID: ${studentId}`);
    } catch (error: any) {
      console.error('Failed to convert to student:', error);
      showFeedback(error.response?.data?.error || 'Failed to convert to student.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    try {
      const res = await apiClient.put(`/api/admissions/${editingApp._id}`, editingApp);
      setApplications(prev => prev.map(a => (a._id === editingApp._id ? res.data : a)));
      if (selectedApp && selectedApp._id === editingApp._id) {
        setSelectedApp(res.data);
      }
      setEditingApp(null);
      showFeedback('Application details updated successfully!');
    } catch (error: any) {
      console.error('Failed to update details:', error);
      showFeedback(error.response?.data?.error || 'Failed to update application.');
    }
  };

  const filteredApps = applications.filter(app => {
    const appStatus = (app.status || '').toUpperCase();
    const matchesFilter = filter === 'ALL' || appStatus === filter;
    const matchesStandard = standardFilter === 'ALL' || app.standard === standardFilter;
    const matchesSearch =
      (app.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.phone || '').includes(searchTerm) ||
      (app.nidNumber || '').includes(searchTerm) ||
      (app.standard || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesStandard && matchesSearch;
  });

  // Bulk selection helpers
  const allFilteredSelected = filteredApps.length > 0 && filteredApps.every(a => selectedIds.has(a._id));
  const someFilteredSelected = filteredApps.some(a => selectedIds.has(a._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all currently visible
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredApps.forEach(a => next.delete(a._id));
        return next;
      });
    } else {
      // Select all currently visible
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredApps.forEach(a => next.add(a._id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };


  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-3.5 h-3.5" /> Approved
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* ── Inline Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 w-full max-w-md text-on-surface">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Confirm Delete</h3>
                <p className="text-xs text-on-surface-variant">
                  {deleteConfirm.ids.length === 1
                    ? `Delete application for "${deleteConfirm.names[0]}"?`
                    : `Delete ${deleteConfirm.ids.length} selected applications?`}
                </p>
              </div>
            </div>
            {deleteConfirm.ids.length > 1 && (
              <ul className="mb-4 max-h-32 overflow-y-auto space-y-1 bg-surface-container rounded-xl p-3">
                {deleteConfirm.names.map((n, i) => (
                  <li key={i} className="text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    {n}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-rose-500 font-medium mb-5">⚠️ This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete{deleteConfirm.ids.length > 1 ? ` All ${deleteConfirm.ids.length}` : ''}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">Admissions Control Center</h1>
          <p className="text-on-surface-variant text-sm">
            Control, verify, edit, and convert student applications for Vidhya Tutorials.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x flex-nowrap sm:flex-wrap pb-1 sm:pb-0 w-full sm:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filter === tab
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20">
          <Search className="w-4 h-4 text-on-surface-variant ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, Aadhar ID, or class..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-on-surface placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-2xl border border-outline-variant/20">
          <Filter className="w-4 h-4 text-on-surface-variant shrink-0" />
          <select
            value={standardFilter}
            onChange={e => setStandardFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-on-surface outline-none cursor-pointer"
          >
            <option value="ALL">All Standards</option>
            <option value="6th">6th Standard</option>
            <option value="7th">7th Standard</option>
            <option value="8th">8th Standard</option>
            <option value="9th">9th Standard</option>
            <option value="10th">10th Standard</option>
            <option value="11th">11th Standard</option>
            <option value="12th">12th Standard</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar — shown when items selected */}
      {selectedIds.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 sm:px-5 sm:py-3">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {selectedIds.size} application{selectedIds.size > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              Deselect All
            </button>
            <button
              onClick={handleBulkDeleteClick}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.size})
            </button>
          </div>
        </div>
      )}


      {/* Main Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar touch-pan-x">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                {/* Select All Checkbox */}
                <th className="px-4 py-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title={allFilteredSelected ? 'Deselect All' : 'Select All'}
                  >
                    {allFilteredSelected
                      ? <CheckSquare className="w-4 h-4 text-primary" />
                      : someFilteredSelected
                        ? <CheckSquare className="w-4 h-4 text-primary/50" />
                        : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-4">Applicant & Family</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Standard & Subjects</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4">Status / Student ID</th>
                <th className="px-6 py-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    {loading ? 'Loading admissions...' : 'No admission applications found.'}
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr
                    key={app._id}
                    className={`hover:bg-surface-container-low/50 transition-colors ${
                      selectedIds.has(app._id) ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelectOne(app._id)}
                        className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        {selectedIds.has(app._id)
                          ? <CheckSquare className="w-4 h-4 text-primary" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface flex items-center gap-2">
                        <span>{app.studentName}</span>
                        {app.gender && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                            {app.gender}
                          </span>
                        )}
                      </div>
                      {(app.fatherName || app.motherName) && (
                        <div className="text-xs text-on-surface-variant mt-0.5">
                          Parents: {app.fatherName || '—'} & {app.motherName || '—'}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {app.bloodGroup && (
                          <span className="text-[10px] font-bold text-rose-500">Blood: {app.bloodGroup}</span>
                        )}
                        {app.nidNumber && (
                          <span className="text-[10px] text-on-surface-variant font-mono">Aadhar: {app.nidNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-on-surface">{app.phone}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-on-surface">
                        {app.standard} {app.stream && <span className="text-xs text-primary font-bold">({app.stream})</span>}
                      </div>
                      <div className="mt-1">
                        {app.enrollmentType === 'ALL_SUBJECTS' || (!app.enrollmentType && (!app.subjects || app.subjects.length === 0)) ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary">
                            All Subjects
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              Particular ({app.subjects?.filter(s => s !== 'All Subjects').length || 0}):
                            </span>
                            <span className="text-xs text-on-surface-variant font-medium max-w-xs leading-tight truncate">
                              {app.subjects?.filter(s => s !== 'All Subjects').join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-on-surface-variant">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>{getStatusBadge(app.status)}</div>
                        {app.enrolledStudentId && (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {app.enrolledStudentId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Convert to Student */}
                        {!app.enrolledStudentId && (
                          <button
                            onClick={() => convertToStudent(app._id)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                            title="Enroll & Convert to Student Account"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Button */}
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
                          title="View Official Admission Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingApp({ ...app })}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-primary transition-colors cursor-pointer"
                          title="Edit Application Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Status Select */}
                        <select
                          value={(app.status || 'PENDING').toUpperCase()}
                          onChange={e => updateStatus(app._id, e.target.value)}
                          className="bg-surface-container border border-outline-variant rounded-lg text-xs font-bold px-2 py-1 outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteApplication(app._id, app.studentName)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Official Full Application Inspection Modal ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-surface max-w-2xl w-full rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-outline-variant/30 text-on-surface space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/logo.svg?v=1783890290950"
                  alt="Vidhya Tutorials"
                  className="h-8 sm:h-9 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <span className="text-lg sm:text-xl font-black text-on-surface uppercase tracking-tight font-[var(--font-display)]">
                  VIDHYA TUTORIALS
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Official Admission Document
              </span>
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-2xl font-black text-on-surface">
                  {selectedApp.studentName}
                </h2>
                {selectedApp.enrolledStudentId && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    ID: {selectedApp.enrolledStudentId}
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Standard: {selectedApp.standard} {selectedApp.stream ? `• Stream: ${selectedApp.stream}` : ''}
              </p>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
              <div>
                <span className="text-xs text-on-surface-variant block">Father's Name:</span>
                <span className="font-bold">{selectedApp.fatherName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block">Mother's Name:</span>
                <span className="font-bold">{selectedApp.motherName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block">Birth Date / Gender:</span>
                <span className="font-bold">{selectedApp.dob || 'N/A'} • {selectedApp.gender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block">Parent's Occupation:</span>
                <span className="font-bold">{selectedApp.occupation || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block">Phone:</span>
                <span className="font-bold">{selectedApp.phone}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block">Email:</span>
                <span className="font-bold">{selectedApp.email}</span>
              </div>
              {(selectedApp.bloodGroup || selectedApp.religion || selectedApp.nidNumber || selectedApp.maritalStatus) && (
                <div className="col-span-full pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant flex flex-wrap gap-4">
                  {selectedApp.bloodGroup && <span>Blood Group: <strong className="text-rose-500">{selectedApp.bloodGroup}</strong></span>}
                  {selectedApp.nidNumber && <span>Aadhar: <strong>{selectedApp.nidNumber}</strong></span>}
                  {selectedApp.religion && <span>Religion: <strong>{selectedApp.religion}</strong></span>}
                  {selectedApp.nationality && <span>Nationality: <strong>{selectedApp.nationality}</strong></span>}
                  {selectedApp.maritalStatus && <span>Marital Status: <strong>{selectedApp.maritalStatus}</strong></span>}
                </div>
              )}
            </div>

            {/* Address Details */}
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/60">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                  Present Address
                </span>
                <p className="font-medium text-on-surface">
                  {selectedApp.presentAddress || 'N/A'}, {selectedApp.presentDivision || ''} {selectedApp.presentDistrict ? `(${selectedApp.presentDistrict})` : ''}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/60">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                  Permanent Address
                </span>
                <p className="font-medium text-on-surface">
                  {selectedApp.permanentAddress || selectedApp.presentAddress || 'Same as Present Address'}
                </p>
              </div>
            </div>

            {/* Subjects Enrolled */}
            <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/60">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Enrolled Subjects ({selectedApp.enrollmentType === 'ALL_SUBJECTS' ? 'All Subjects' : 'Particular Subjects'})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.subjects && selectedApp.subjects.length > 0 ? (
                  selectedApp.subjects.map(sub => (
                    <span key={sub} className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 text-xs font-semibold">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-on-surface-variant">All Standard Board Subjects</span>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20 text-xs">
              <div>
                <span className="text-on-surface-variant block">Student's Signature:</span>
                <span className="font-serif italic font-bold text-sm">{selectedApp.studentSignature || selectedApp.studentName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Parent's Signature:</span>
                <span className="font-serif italic font-bold text-sm">{selectedApp.parentSignature || selectedApp.fatherName || 'Parent Verified'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-outline-variant/20">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(selectedApp._id, 'APPROVED')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => updateStatus(selectedApp._id, 'REJECTED')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Reject
                </button>
                {!selectedApp.enrolledStudentId && (
                  <button
                    onClick={() => convertToStudent(selectedApp._id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Convert to Active Student</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingApp({ ...selectedApp });
                    setSelectedApp(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container text-xs font-bold cursor-pointer text-primary"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Edit Admission Form Modal ── */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-surface max-w-2xl w-full rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-outline-variant/30 text-on-surface space-y-5 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setEditingApp(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-outline-variant/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Admin Control</span>
              <h2 className="text-xl font-black text-on-surface mt-1">Edit Application: {editingApp.studentName}</h2>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={editingApp.studentName}
                    onChange={e => setEditingApp({ ...editingApp, studentName: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={editingApp.phone}
                    onChange={e => setEditingApp({ ...editingApp, phone: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editingApp.fatherName || ''}
                    onChange={e => setEditingApp({ ...editingApp, fatherName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={editingApp.motherName || ''}
                    onChange={e => setEditingApp({ ...editingApp, motherName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Standard *</label>
                  <select
                    value={editingApp.standard}
                    onChange={e => setEditingApp({ ...editingApp, standard: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Stream (if 11/12th)</label>
                  <select
                    value={editingApp.stream || 'Science'}
                    onChange={e => setEditingApp({ ...editingApp, stream: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingApp.email}
                    onChange={e => setEditingApp({ ...editingApp, email: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Parent's Occupation</label>
                  <input
                    type="text"
                    value={editingApp.occupation || ''}
                    onChange={e => setEditingApp({ ...editingApp, occupation: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Present Address</label>
                <input
                  type="text"
                  value={editingApp.presentAddress || ''}
                  onChange={e => setEditingApp({ ...editingApp, presentAddress: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Permanent Address</label>
                <input
                  type="text"
                  value={editingApp.permanentAddress || ''}
                  onChange={e => setEditingApp({ ...editingApp, permanentAddress: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Previous School / College</label>
                <input
                  type="text"
                  value={editingApp.previousSchool || ''}
                  onChange={e => setEditingApp({ ...editingApp, previousSchool: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
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
                  Delete {deleteConfirm.ids.length > 1 ? `${deleteConfirm.ids.length} Applications` : 'Application'}?
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {deleteConfirm.ids.length > 1
                    ? `Are you sure you want to permanently delete these ${deleteConfirm.ids.length} applications? This action cannot be undone.`
                    : `Are you sure you want to delete application for "${deleteConfirm.names[0]}"? This action cannot be undone.`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Enrollment Credential Modal */}
      {enrolledInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest dark:bg-surface-container border border-outline-variant/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  Student Enrolled Successfully!
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Account created for <span className="font-semibold text-on-surface">{enrolledInfo.studentName}</span>
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3.5 space-y-2 border border-outline-variant/30 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Student ID / Roll No:</span>
                <span className="font-mono font-bold text-primary text-sm">{enrolledInfo.studentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Default Password:</span>
                <span className="font-mono font-bold text-on-surface">{enrolledInfo.defaultPassword}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Vidhya Tutorials Student Login:\nStudent ID: ${enrolledInfo.studentId}\nPassword: ${enrolledInfo.defaultPassword}`);
                  showFeedback('Credentials copied to clipboard!');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary cursor-pointer transition-colors"
              >
                <Copy size={13} />
                <span>Copy Credentials</span>
              </button>
              <button
                type="button"
                onClick={() => setEnrolledInfo(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-white cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
