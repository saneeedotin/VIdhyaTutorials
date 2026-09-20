import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings2, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Phone, 
  Mail, 
  Calendar, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Clock, 
  Check, 
  X, 
  User, 
  BookOpen, 
  Tag,
  GraduationCap,
  Compass,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { 
  getAllFormConfigs, 
  saveFormConfig, 
  resetFormConfig, 
  fetchServerFormConfigs,
  WebsiteFormsConfig, 
  DEFAULT_FORM_CONFIGS 
} from '../../../utils/formConfig';
import { apiClient } from '../../../api/apiClient';

interface FormInquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  standard: string;
  message?: string;
  status: string;
  adminNotes?: string;
  source?: string;
  createdAt?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export function FormManagement() {
  const [activeTab, setActiveTab] = useState<'forms' | 'inquiries'>('forms');
  const [selectedFormKey, setSelectedFormKey] = useState<keyof WebsiteFormsConfig>('enquiry');
  const [configs, setConfigs] = useState<WebsiteFormsConfig>(getAllFormConfigs);
  const [currentFormState, setCurrentFormState] = useState<any>(configs.enquiry);
  
  // Tag input state for dynamic lists
  const [newTagInput, setNewTagInput] = useState('');
  const [newSubTagInput, setNewSubTagInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<FormInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  
  // Edit Inquiry Modal State
  const [editingInquiry, setEditingInquiry] = useState<FormInquiry | null>(null);
  const [savingInquiry, setSavingInquiry] = useState(false);
  const [deleteConfirmInquiry, setDeleteConfirmInquiry] = useState<FormInquiry | null>(null);

  useEffect(() => {
    fetchServerFormConfigs().then((serverConfigs) => {
      if (serverConfigs) {
        setConfigs(serverConfigs);
        setCurrentFormState(serverConfigs[selectedFormKey]);
      }
    });
    fetchInquiries();
  }, []);

  useEffect(() => {
    setCurrentFormState(configs[selectedFormKey]);
    setNewTagInput('');
    setNewSubTagInput('');
  }, [selectedFormKey, configs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      // 1. Fetch appointments & general inquiries
      const res = await apiClient.get('/api/appointments');
      const appointmentList: FormInquiry[] = (res.data?.data || []).map((item: any) => {
        let source = 'Quick Enquiry';
        const msg = (item.message || '').toUpperCase();
        if (msg.includes('FREE DEMO')) source = 'Free Demo';
        else if (msg.includes('COUNSELING') || msg.includes('ADVISORY')) source = '1-on-1 Counseling';
        else if (msg.includes('ADMISSION INQUIRY') || msg.includes('AY 2026-27')) source = 'Admission Popup';
        else if (msg.includes('VISIT') || msg.includes('ABOUT')) source = 'Visit / Contact';

        return {
          _id: item._id,
          name: item.name,
          phone: item.phone,
          email: item.email,
          standard: item.standard || 'Not Specified',
          message: item.message,
          status: item.status || 'PENDING',
          adminNotes: item.adminNotes || '',
          source,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      });

      // 2. Fetch full admission applications
      try {
        const admRes = await apiClient.get('/api/admissions');
        const admissionList: FormInquiry[] = (admRes.data || []).map((item: any) => ({
          _id: item._id,
          name: item.studentName || item.name,
          phone: item.phone,
          email: item.email,
          standard: item.standard || '10th',
          message: `Stream: ${item.stream || 'N/A'} | Prev School: ${item.previousSchool || 'N/A'}${item.fatherName ? ` | Father: ${item.fatherName}` : ''}`,
          status: item.status || 'PENDING',
          adminNotes: item.adminRemarks || '',
          source: 'Admission Application Form',
          createdAt: item.submittedAt || item.createdAt,
          updatedAt: item.updatedAt
        }));
        setInquiries([...admissionList, ...appointmentList]);
      } catch (e) {
        setInquiries(appointmentList);
      }
    } catch (err: any) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // ── Form Config Actions ──
  const handleFieldChange = (field: string, value: any) => {
    setCurrentFormState((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddStandardTag = () => {
    if (!newTagInput.trim()) return;
    const currentStandards = currentFormState.standards || [];
    if (currentStandards.includes(newTagInput.trim())) return;
    const updated = [...currentStandards, newTagInput.trim()];
    handleFieldChange('standards', updated);
    setNewTagInput('');
  };

  const handleRemoveStandardTag = (tagToRemove: string) => {
    const updated = (currentFormState.standards || []).filter((t: string) => t !== tagToRemove);
    handleFieldChange('standards', updated);
  };

  const handleAddSubjectTag = () => {
    if (!newSubTagInput.trim()) return;
    const listKey = currentFormState.subjects 
      ? 'subjects' 
      : (currentFormState.topics ? 'topics' : (currentFormState.discussionFocusList ? 'discussionFocusList' : 'streams'));
    
    const currentList = currentFormState[listKey] || [];
    if (currentList.includes(newSubTagInput.trim())) return;
    const updated = [...currentList, newSubTagInput.trim()];
    handleFieldChange(listKey, updated);
    setNewSubTagInput('');
  };

  const handleRemoveSubjectTag = (tagToRemove: string) => {
    const listKey = currentFormState.subjects 
      ? 'subjects' 
      : (currentFormState.topics ? 'topics' : (currentFormState.discussionFocusList ? 'discussionFocusList' : 'streams'));
    
    const updated = (currentFormState[listKey] || []).filter((t: string) => t !== tagToRemove);
    handleFieldChange(listKey, updated);
  };

  const handleSaveCurrentForm = () => {
    saveFormConfig(selectedFormKey, currentFormState);
    setConfigs((prev) => ({
      ...prev,
      [selectedFormKey]: currentFormState
    }));
    showToast(`"${currentFormState.name}" updated successfully! Changes are live on the website.`);
  };

  const handleResetCurrentForm = () => {
    const def = resetFormConfig(selectedFormKey);
    setCurrentFormState(def);
    setConfigs((prev) => ({
      ...prev,
      [selectedFormKey]: def
    }));
    showToast(`"${def.name}" reset to default configuration.`);
  };

  // ── Inquiry Management Actions ──
  const handleSaveInquiryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;
    setSavingInquiry(true);

    try {
      if (editingInquiry.source === 'Admission Application Form') {
        await apiClient.put(`/api/admissions/${editingInquiry._id}`, {
          studentName: editingInquiry.name,
          phone: editingInquiry.phone,
          email: editingInquiry.email,
          standard: editingInquiry.standard,
          status: editingInquiry.status,
          adminRemarks: editingInquiry.adminNotes
        });
      } else {
        await apiClient.put(`/api/appointments/${editingInquiry._id}`, {
          name: editingInquiry.name,
          phone: editingInquiry.phone,
          email: editingInquiry.email,
          standard: editingInquiry.standard,
          status: editingInquiry.status,
          adminNotes: editingInquiry.adminNotes
        });
      }

      setInquiries((prev) =>
        prev.map((item) => (item._id === editingInquiry._id ? { ...editingInquiry, updatedAt: new Date().toISOString() } : item))
      );
      setEditingInquiry(null);
      showToast('Submission updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update submission.');
    } finally {
      setSavingInquiry(false);
    }
  };

  const handleDeleteInquiry = async () => {
    if (!deleteConfirmInquiry) return;
    try {
      if (deleteConfirmInquiry.source === 'Admission Application Form') {
        await apiClient.delete(`/api/admissions/${deleteConfirmInquiry._id}`);
      } else {
        await apiClient.delete(`/api/appointments/${deleteConfirmInquiry._id}`);
      }
      setInquiries((prev) => prev.filter((i) => i._id !== deleteConfirmInquiry._id));
      setDeleteConfirmInquiry(null);
      showToast('Submission removed.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete submission.');
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      (inq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone || '').includes(searchQuery) ||
      (inq.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.standard || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || inq.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const formMetaMap = [
    { key: 'enquiry', name: 'Quick Enquiry Modal', icon: MessageSquare, badge: 'High Traffic' },
    { key: 'admission', name: 'Admission Application Form', icon: GraduationCap, badge: 'Full Form' },
    { key: 'freeDemo', name: 'Free Demo Class Modal', icon: BookOpen, badge: 'Lead Gen' },
    { key: 'counseling', name: '1-on-1 Counseling Form', icon: Compass, badge: 'Mentorship' },
    { key: 'admissionPopup', name: 'Admission Popup & Badge', icon: Sparkles, badge: 'Floating' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Header & Tab Switcher ── */}
      <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
                  Website Forms & Inquiries Manager
                </h1>
                <p className="text-sm text-on-surface-variant">
                  Customize public forms, contact helplines, standard options, and edit incoming lead submissions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-center gap-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Website Forms:</span>
              <span className="text-lg font-extrabold text-primary">5 Active</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-center gap-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Leads:</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{inquiries.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-outline-variant/20">
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'forms'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Edit Website Forms (5)</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Form Submissions & Leads</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-white/20">
              {inquiries.length}
            </span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: EDIT WEBSITE FORMS (SETTINGS & CUSTOMIZATION) ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          
          {/* Form Selection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {formMetaMap.map((meta) => {
              const Icon = meta.icon;
              const isSelected = selectedFormKey === meta.key;
              const isEnabled = configs[meta.key as keyof WebsiteFormsConfig]?.enabled !== false;

              return (
                <button
                  key={meta.key}
                  onClick={() => setSelectedFormKey(meta.key as keyof WebsiteFormsConfig)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 relative group ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm shadow-primary/10 scale-[1.02]'
                      : 'bg-surface hover:bg-surface-container border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isEnabled 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {isEnabled ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  <div>
                    <h3 className={`font-bold text-xs leading-snug line-clamp-2 ${
                      isSelected ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {meta.name}
                    </h3>
                    <span className="text-[10px] text-on-surface-variant/80 font-medium">
                      {meta.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form Editor & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ── Left 7 Cols: Form Field Editor ── */}
            <div className="lg:col-span-7 bg-surface rounded-3xl p-6 md:p-7 border border-outline-variant/30 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>Edit {currentFormState.name}</span>
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Changes here directly update this form on the live website.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={currentFormState.enabled !== false}
                      onChange={(e) => handleFieldChange('enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-xs font-bold text-on-surface">
                      {currentFormState.enabled !== false ? 'Form Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Input Group: Title & Tagline */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Form Heading / Main Title
                  </label>
                  <input
                    type="text"
                    value={currentFormState.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm font-semibold text-on-surface"
                    placeholder="e.g. Inquire for Admission"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Subtitle / Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={currentFormState.subtitle || ''}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm text-on-surface"
                    placeholder="Short description displayed beneath the title"
                  />
                </div>
              </div>

              {/* Row: Session Tag & Helpline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Academic Session Tag
                  </label>
                  <input
                    type="text"
                    value={currentFormState.sessionTag || ''}
                    onChange={(e) => handleFieldChange('sessionTag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm text-on-surface"
                    placeholder="Academic Session 2026–2027"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Helpline Phone Number
                  </label>
                  <input
                    type="text"
                    value={currentFormState.helplinePhone || ''}
                    onChange={(e) => handleFieldChange('helplinePhone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm text-on-surface"
                    placeholder="+91 88981 17343"
                  />
                </div>
              </div>

              {/* Standard / Class Options Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Available Standards / Classes Dropdown Options
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(currentFormState.standards || []).map((std: string) => (
                    <span
                      key={std}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20"
                    >
                      <span>{std}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandardTag(std)}
                        className="hover:text-rose-500 transition-colors"
                        title="Remove option"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStandardTag();
                      }
                    }}
                    placeholder="Add standard (e.g. 10th ICSE or NEET Repeater)"
                    className="flex-1 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={handleAddStandardTag}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Standard</span>
                  </button>
                </div>
              </div>

              {/* Subject / Stream / Topics Options Editor */}
              {(currentFormState.subjects || currentFormState.topics || currentFormState.discussionFocusList || currentFormState.streams) && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    {currentFormState.subjects
                      ? 'Preferred Subject Options'
                      : currentFormState.topics
                      ? 'Inquiry Topic Options'
                      : currentFormState.discussionFocusList
                      ? 'Counseling Discussion Topics'
                      : 'Available Streams'}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(
                      currentFormState.subjects ||
                      currentFormState.topics ||
                      currentFormState.discussionFocusList ||
                      currentFormState.streams ||
                      []
                    ).map((topic: string) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30"
                      >
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectTag(topic)}
                          className="text-on-surface-variant hover:text-rose-500 transition-colors"
                          title="Remove option"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSubTagInput}
                      onChange={(e) => setNewSubTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubjectTag();
                        }
                      }}
                      placeholder="Add choice option..."
                      className="flex-1 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubjectTag}
                      className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-outline-variant/40 text-on-surface font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form-Specific Settings (Popup toggles, etc.) */}
              {selectedFormKey === 'admissionPopup' && (
                <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-on-surface">
                    Popup & Floating Badge Behaviour
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentFormState.autoPopupEnabled !== false}
                        onChange={(e) => handleFieldChange('autoPopupEnabled', e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-xs font-semibold text-on-surface">Auto-Open Popup on Load</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentFormState.floatingBadgeEnabled !== false}
                        onChange={(e) => handleFieldChange('floatingBadgeEnabled', e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-xs font-semibold text-on-surface">Show Floating Admissions Button</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Success Message & Notice */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Success Message Shown After Submit
                  </label>
                  <input
                    type="text"
                    value={currentFormState.successMessage || ''}
                    onChange={(e) => handleFieldChange('successMessage', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm text-on-surface"
                    placeholder="Confirmation message..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Disclaimer / Bottom Notice
                  </label>
                  <input
                    type="text"
                    value={currentFormState.noticeText || ''}
                    onChange={(e) => handleFieldChange('noticeText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm text-on-surface"
                    placeholder="Short notice or helpline reminder"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={handleResetCurrentForm}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:text-rose-500 hover:border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCurrentForm}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:scale-[1.01]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Form Changes</span>
                </button>
              </div>

            </div>

            {/* ── Right 5 Cols: Live Form Preview ── */}
            <div className="lg:col-span-5 bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm sticky top-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface">
                    Live Form Preview
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Website Visual
                </span>
              </div>

              {/* Mockup Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg p-5 space-y-4 text-slate-900 dark:text-white">
                <div className="h-1.5 -mx-5 -mt-5 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>{currentFormState.sessionTag || 'Session 2026–2027'}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                    {currentFormState.title || 'Form Heading'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {currentFormState.subtitle || 'Form description'}
                  </p>
                </div>

                {/* Simulated Fields */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Student / Parent Name:</span>
                    <div className="mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs">
                      Enter full name...
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Phone Number:</span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs">
                        +91 98765...
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Standard / Class:</span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold truncate">
                        {currentFormState.standards?.[0] || '10th Standard'}
                      </div>
                    </div>
                  </div>

                  {(currentFormState.topics || currentFormState.subjects || currentFormState.discussionFocusList) && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Topic / Subject:</span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold truncate">
                        {(currentFormState.topics || currentFormState.subjects || currentFormState.discussionFocusList)?.[0] || 'Selected Topic'}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-center text-xs shadow-sm">
                      Submit Details
                    </div>
                  </div>

                  {currentFormState.noticeText && (
                    <p className="text-[10px] text-slate-400 text-center italic pt-1">
                      {currentFormState.noticeText}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    <Phone className="w-3 h-3 text-primary" />
                    <span>Helpline: {currentFormState.helplinePhone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-on-surface-variant flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Any edits made on the left are saved immediately and update public visitors' modal popups in real-time.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: FORM SUBMISSIONS & LEADS (VIEW & EDIT LEADS) ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Search & Filters */}
          <div className="bg-surface rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, phone, standard..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-hidden text-xs text-on-surface font-medium"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Form Source Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-on-surface-variant">Source:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface focus:outline-hidden"
                >
                  <option value="ALL">All Forms</option>
                  <option value="Quick Enquiry">Quick Enquiry</option>
                  <option value="Free Demo">Free Demo</option>
                  <option value="1-on-1 Counseling">1-on-1 Counseling</option>
                  <option value="Admission Application Form">Admission Form</option>
                  <option value="Admission Popup">Admission Popup</option>
                  <option value="Visit / Contact">Visit / Contact</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-on-surface-variant">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface focus:outline-hidden"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="APPROVED">APPROVED / ENROLLED</option>
                  <option value="REJECTED">REJECTED / CLOSED</option>
                </select>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchInquiries}
                disabled={loadingInquiries}
                className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
                title="Refresh submissions"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
            {loadingInquiries ? (
              <div className="py-16 text-center text-on-surface-variant">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                <p className="text-sm font-semibold">Loading submissions...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-on-surface-variant/40" />
                <h3 className="font-bold text-base text-on-surface">No submissions found</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'ALL' || sourceFilter !== 'ALL'
                    ? 'No submissions match your active search or filter criteria.'
                    : 'Incoming submissions from website forms will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container/60 border-b border-outline-variant/20 text-on-surface-variant font-extrabold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Applicant / Student</th>
                      <th className="py-3.5 px-4">Standard & Source</th>
                      <th className="py-3.5 px-4">Message / Notes</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                    {filteredInquiries.map((item) => {
                      const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
                      const waLink = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                        `Hello ${item.name}, thank you for contacting Vidhya Tutorials regarding ${item.standard}. How can we assist you today?`
                      )}`;

                      return (
                        <tr key={item._id} className="hover:bg-surface-container/40 transition-colors">
                          {/* Student Info */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-sm text-on-surface">{item.name}</div>
                            <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-medium">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-primary" />
                                <span>{item.phone}</span>
                              </span>
                              {item.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-on-surface-variant/60" />
                                  <span className="truncate max-w-[150px]">{item.email}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Standard & Source */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-on-surface">{item.standard}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                              {item.source}
                            </span>
                          </td>

                          {/* Message / Notes */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-2 text-on-surface-variant text-[11px] whitespace-pre-line">
                              {item.message || 'No additional message.'}
                            </p>
                            {item.adminNotes && (
                              <div className="mt-1 text-[10px] text-primary font-semibold flex items-center gap-1">
                                <span>Note: {item.adminNotes}</span>
                              </div>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.status === 'APPROVED' || item.status === 'CONVERTED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : item.status === 'CONTACTED'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : item.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{item.status}</span>
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-on-surface-variant text-[11px] whitespace-nowrap">
                            {item.createdAt 
                              ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Recent'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Direct WhatsApp */}
                              {cleanPhone && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}

                              {/* Call */}
                              {cleanPhone && (
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                                  title="Call Applicant"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}

                              {/* Edit Submission Button */}
                              <button
                                onClick={() => setEditingInquiry({ ...item })}
                                className="px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1 transition-colors"
                                title="Edit submission details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeleteConfirmInquiry(item)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                title="Delete submission"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── EDIT SUBMISSION MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl p-6 md:p-8 space-y-5 text-on-surface my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {editingInquiry.source}
                </span>
                <h3 className="text-xl font-black text-on-surface mt-1">
                  Edit Submission Details
                </h3>
              </div>
              <button
                onClick={() => setEditingInquiry(null)}
                className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInquiryEdit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-on-surface-variant uppercase mb-1">
                  Applicant / Student Name
                </label>
                <input
                  type="text"
                  required
                  value={editingInquiry.name}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-sm font-semibold text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.phone}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs font-semibold text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingInquiry.email || ''}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Standard / Class
                  </label>
                  <input
                    type="text"
                    value={editingInquiry.standard}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, standard: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs font-semibold text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Lead Status
                  </label>
                  <select
                    value={editingInquiry.status}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs font-bold text-on-surface"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="APPROVED">APPROVED / ENROLLED</option>
                    <option value="REJECTED">REJECTED / CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant uppercase mb-1">
                  Inquiry Message / Details
                </label>
                <textarea
                  rows={3}
                  value={editingInquiry.message || ''}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant uppercase mb-1">
                  Internal Admin Follow-up Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Called parent, interested in 10th SSC evening batch, demo scheduled for Friday."
                  value={editingInquiry.adminNotes || ''}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, adminNotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingInquiry(null)}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-bold text-xs hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInquiry}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingInquiry ? 'Saving...' : 'Update Submission'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteConfirmInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl p-6 space-y-4 text-on-surface">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-on-surface">Delete Submission?</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Are you sure you want to delete inquiry for <strong>{deleteConfirmInquiry.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmInquiry(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant/40 text-on-surface-variant font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInquiry}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
