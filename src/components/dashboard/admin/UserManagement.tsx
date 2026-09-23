import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  Shield, 
  Eye, 
  X, 
  Check, 
  KeyRound,
  AlertTriangle,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { apiClient, setImpersonationHeader } from '../../../api/apiClient';

interface UserRecord {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  standard?: string;
  phone?: string;
  isActive?: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'ADMIN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');
  const [formStandard, setFormStandard] = useState('10th');
  const [formPhone, setFormPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/admin/users');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error('Failed to load users from backend', error);
      showToast('Error loading users list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = (userId: string, userName: string) => {
    setImpersonationHeader(userId);
    showToast(`Impersonation active for ${userName}. Next views load as this user.`);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('STUDENT');
    setFormStandard('10th');
    setFormPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setFormName(user.name || '');
    setFormEmail(user.email || '');
    setFormRole(user.role || 'STUDENT');
    setFormStandard(user.standard || '10th');
    setFormPhone(user.phone || '');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Please enter both name and email', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingUser) {
        const payload = {
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          standard: formStandard,
          phone: formPhone.trim()
        };
        const res = await apiClient.put(`/api/admin/users/${editingUser._id}`, payload);
        const updated = res.data?.data || res.data;
        setUsers(prev => prev.map(u => (u._id === editingUser._id ? { ...u, ...updated } : u)));
        showToast(`User ${formName} updated successfully`);
      } else {
        const payload = {
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          standard: formStandard,
          phone: formPhone.trim()
        };
        const res = await apiClient.post('/api/admin/users', payload);
        const created = res.data?.data;
        if (created) {
          setUsers(prev => [created, ...prev]);
          showToast(`Added ${formName} (${created.userId || 'Created'}). Password: password123`);
        } else {
          fetchUsers();
          showToast(`User ${formName} created successfully`);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save user', err);
      showToast(err.response?.data?.error || 'Failed to save user', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/api/admin/users/${deleteConfirm._id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteConfirm._id));
      showToast(`${deleteConfirm.name} has been removed successfully`);
    } catch (err) {
      console.error('Failed to delete user', err);
      showToast('Error removing user', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const toggleUserStatus = async (user: UserRecord) => {
    const nextStatus = user.isActive === false ? true : false;
    try {
      await apiClient.put(`/api/admin/users/${user._id}`, { isActive: nextStatus });
      setUsers(prev => prev.map(u => (u._id === user._id ? { ...u, isActive: nextStatus } : u)));
      showToast(`Status updated to ${nextStatus ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error('Failed to toggle status', err);
      showToast('Failed to update user status', 'error');
    }
  };

  const handleResetPassword = async (user: UserRecord) => {
    try {
      await apiClient.post(`/api/admin/users/${user._id}/reset-password`);
      showToast(`Password for ${user.name} reset to: password123`);
    } catch (err) {
      console.error('Failed to reset password', err);
      showToast('Failed to reset password', 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      (u.name || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (u.userId || '').toLowerCase().includes(searchLower) ||
      (u.standard || '').toLowerCase().includes(searchLower);
    return matchesRole && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full h-full text-on-surface pb-12 bg-transparent"
    >
      {/* ── Inline Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 max-w-md w-full text-on-surface"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">Delete User</h3>
                  <p className="text-xs text-on-surface-variant">
                    Remove user account "{deleteConfirm.name}" ({deleteConfirm.userId || deleteConfirm.email})?
                  </p>
                </div>
              </div>
              <p className="text-xs text-rose-500 font-medium mb-5">
                ⚠️ This will revoke portal access and remove their student/teacher record.
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
                  onClick={confirmDeleteUser}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-h1 font-semibold tracking-tight mb-1.5 text-primary">User Management</h1>
          <p className="text-on-surface-variant text-sm font-medium">Control platform credentials, roles, student IDs, and access permissions.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters & Search */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low">
          <div className="flex flex-wrap bg-surface rounded-xl border border-outline-variant/30 p-1">
            {(['ALL', 'STUDENT', 'TEACHER', 'ADMIN'] as const).map(role => (
              <button 
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterRole === role 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, ID, email, standard..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-primary" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">User ID / Standard</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant text-sm">
                    Loading users list...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant text-sm">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs ${
                          u.role === 'ADMIN' ? 'bg-indigo-600' : u.role === 'TEACHER' ? 'bg-amber-600' : 'bg-primary'
                        }`}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface">{u.name}</p>
                          <p className="text-xs text-on-surface-variant">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-primary">{u.userId || '—'}</span>
                        {u.standard && <span className="text-[11px] text-on-surface-variant">Class {u.standard}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                        u.role === 'ADMIN' 
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' 
                          : u.role === 'TEACHER' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                            : 'bg-primary/10 text-primary dark:text-blue-400 border-primary/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleUserStatus(u)} 
                        className="cursor-pointer" 
                        title="Click to toggle user access"
                      >
                        {u.isActive !== false ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleResetPassword(u)}
                          title="Reset Password to password123"
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-amber-500 hover:text-white text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleImpersonate(u._id, u.name)}
                          title="Debug as this user"
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-indigo-600 hover:text-white text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer" 
                          onClick={() => openEditModal(u)}
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer" 
                          onClick={() => setDeleteConfirm(u)}
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-outline-variant/30 relative text-on-surface"
            >
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-on-surface mb-5">
                {editingUser ? 'Edit User Credentials' : 'Add New Portal User'}
              </h2>
              
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aarav Sharma" 
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary" 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="student@example.com" 
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Role *</label>
                    <select 
                      value={formRole}
                      onChange={e => setFormRole(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-primary text-on-surface"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Standard / Class</label>
                    <select 
                      value={formStandard}
                      onChange={e => setFormStandard(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-primary text-on-surface"
                    >
                      <option value="6th">6th Standard</option>
                      <option value="7th">7th Standard</option>
                      <option value="8th">8th Standard</option>
                      <option value="9th">9th Standard</option>
                      <option value="10th">10th Standard</option>
                      <option value="11th">11th Standard</option>
                      <option value="12th">12th Standard</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary" 
                  />
                </div>

                {!editingUser && (
                  <p className="text-[11px] text-on-surface-variant bg-surface-container p-2.5 rounded-xl">
                    ℹ️ Default password will be <code className="font-bold text-primary">password123</code>. The user can change it anytime in settings.
                  </p>
                )}

                <div className="flex gap-3 pt-3 border-t border-outline-variant/20">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {isSaving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-[300] font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-white ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
