import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IndianRupee, Search, BellRing, Filter, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export function GlobalLedger() {
  const [fees] = useState([
    { id: 'f1', student: 'Aarav Patel', batch: 'Science Morning A', title: 'Term 1 Installment', amount: 25000, dueDate: '2026-06-15', status: 'PENDING' },
    { id: 'f2', student: 'Priya Patel', batch: 'Foundation Batch 2', title: 'Registration Fee', amount: 5000, dueDate: '2026-04-01', status: 'PAID', paidAt: '2026-03-28' },
    { id: 'f3', student: 'Rahul Verma', batch: 'Commerce Evening B', title: 'Term 1 Installment', amount: 22000, dueDate: '2026-05-01', status: 'OVERDUE' },
    { id: 'f4', student: 'Sneha Gupta', batch: 'Science Morning A', title: 'Term 1 Installment', amount: 25000, dueDate: '2026-06-15', status: 'PAID', paidAt: '2026-06-01' },
  ]);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredFees = fees.filter(f => activeFilter === 'ALL' || f.status === activeFilter);
  const overdueCount = fees.filter(f => f.status === 'OVERDUE').length;

  const handleSweep = () => {
    showToast(`📢 Triggering push notifications to ${overdueCount} parent accounts for overdue fees.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary">Global Ledger</h1>
          <p className="text-on-surface-variant text-sm font-medium">Track all incoming payments and manage overdue accounts.</p>
        </div>
        
        {overdueCount > 0 && (
          <button 
            onClick={handleSweep}
            className="bg-error/10 hover:bg-error text-error hover:text-white border border-transparent font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md group"
          >
            <BellRing className="w-5 h-5 group-hover:animate-wiggle" /> Overdue Sweeper ({overdueCount})
          </button>
        )}
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
        {/* Filters & Search */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low">
          <div className="flex bg-surface rounded-lg border border-outline-variant/30 p-1">
            {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeFilter === status ? 'bg-primary text-white dark:text-[#001b3c] shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by student or receipt..." className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                <th className="p-6">Student / Batch</th>
                <th className="p-6">Fee Title</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status / Due Date</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-6">
                    <p className="font-medium text-on-surface">{fee.student}</p>
                    <p className="text-xs text-on-surface-variant">{fee.batch}</p>
                  </td>
                  <td className="p-6 font-medium text-on-surface">
                    {fee.title}
                  </td>
                  <td className="p-6">
                    <span className="font-medium font-mono text-on-surface">₹{fee.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      {fee.status === 'PAID' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-max">
                          <CheckCircle2 className="w-3 h-3" /> Paid on {fee.paidAt}
                        </span>
                      )}
                      {fee.status === 'PENDING' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md w-max">
                          Due by {fee.dueDate}
                        </span>
                      )}
                      {fee.status === 'OVERDUE' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-error bg-error/10 px-2 py-1 rounded-md w-max animate-pulse">
                          <AlertCircle className="w-3 h-3" /> OVERDUE ({fee.dueDate})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {fee.status !== 'PAID' && (
                        <button 
                          title="Send Manual Reminder"
                          className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          onClick={() => {
                            showToast(`✅ Payment reminder sent to ${fee.student} for ₹${fee.amount.toLocaleString()}!`);
                          }}>
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container-highest text-on-surface text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border border-outline-variant/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </motion.div>
  );
}
