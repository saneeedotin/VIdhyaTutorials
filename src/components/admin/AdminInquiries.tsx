import React, { useEffect, useState } from 'react';
import { Loader2, Search, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInquiries = async () => {
    try {
      const res = await apiClient.get('/api/admissions');
      setInquiries(res.data || []);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/api/admissions/${id}/status`, { status });
      fetchInquiries(); // Refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    (i.studentName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (i.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (i.phone || '').includes(searchTerm)
  );

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
          <h2 className="text-2xl font-bold text-primary">Inquiries Manager</h2>
          <p className="text-on-surface-variant text-sm mt-1">Review and manage admission applications and website inquiries.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search name, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container uppercase text-[11px] font-bold tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Course / Std</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No inquiries found matching your search.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id || inquiry.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-on-surface">{inquiry.studentName}</div>
                      <div className="text-[11px] text-on-surface-variant">Parent: {inquiry.parentName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-on-surface">{inquiry.phone}</div>
                      <div className="text-[11px] text-on-surface-variant">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-on-surface font-medium">{inquiry.standard || 'General'}</div>
                      <div className="text-[11px] text-on-surface-variant truncate max-w-[150px]">{inquiry.stream || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(inquiry.submittedAt || inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {inquiry.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {inquiry.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error/10 text-error font-bold text-[10px] uppercase tracking-wider">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inquiry.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(inquiry._id || inquiry.id, 'APPROVED')}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-bold text-[11px] uppercase tracking-wider rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(inquiry._id || inquiry.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-error/10 hover:bg-error/20 text-error font-bold text-[11px] uppercase tracking-wider rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {inquiry.status === 'APPROVED' && !inquiry.enrolledStudentId && (
                           <button 
                             onClick={async () => {
                               try {
                                 const res = await apiClient.post(`/api/admissions/${inquiry._id || inquiry.id}/convert-to-student`);
                                 alert(res.data.message);
                                 fetchInquiries();
                               } catch (err: any) {
                                 alert(err.response?.data?.error || 'Failed to convert');
                               }
                             }}
                             className="px-3 py-1.5 bg-primary text-white font-bold text-[11px] uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
                           >
                             <ExternalLink className="w-3.5 h-3.5" /> Convert to Student
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
