import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Library, Plus, ChevronRight, Users, UserCheck, Calendar } from 'lucide-react';

export function BatchManagement() {
  const [sections, setSections] = useState([
    { id: 's1', name: 'Science (11th & 12th)', batches: 4, students: 240 },
    { id: 's2', name: 'Commerce (11th & 12th)', batches: 2, students: 110 },
    { id: 's3', name: 'Foundation (6th - 10th)', batches: 5, students: 300 },
  ]);

  const [batches] = useState([
    { id: 'b1', name: 'Morning Alpha', section: 'Science', teacher: 'Dr. Priya Sharma', schedule: 'M-W-F 8:00 AM', capacity: 60, enrolled: 58 },
    { id: 'b2', name: 'Evening Beta', section: 'Science', teacher: 'Mr. Vikram Singh', schedule: 'T-T-S 4:00 PM', capacity: 60, enrolled: 45 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rosterBatch, setRosterBatch] = useState<string | null>(null);

  const handleNewSection = () => {
    const name = window.prompt('Enter new section name (e.g. Arts 11th & 12th):');
    if (name && name.trim()) {
      setSections(prev => [...prev, { id: `s-${Date.now()}`, name: name.trim(), batches: 0, students: 0 }]);
    }
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
          <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary">Curriculum & Batches</h1>
          <p className="text-on-surface-variant text-sm font-medium">Define overarching sections and construct specific student batches.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-all cursor-pointer" onClick={handleNewSection}>
            <Library className="w-5 h-5" /> New Section
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" /> New Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-h3 font-medium text-primary px-2">Active Sections</h2>
          {sections.map(sec => (
            <div key={sec.id} className="bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-sm hover:border-primary/50 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                  <Library className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-medium text-on-surface mb-1">{sec.name}</h3>
              <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {sec.students} Students</span>
                <span className="flex items-center gap-1"><Library className="w-3 h-3" /> {sec.batches} Batches</span>
              </div>
            </div>
          ))}
        </div>

        {/* Batches View */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-h3 font-medium text-primary px-2">Batches in Science</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {batches.map(batch => (
              <div key={batch.id} className="bg-surface p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">{batch.section}</span>
                    <span className="text-xs font-medium text-on-surface-variant">{batch.enrolled}/{batch.capacity} Full</span>
                  </div>
                  <h3 className="text-xl font-h3 font-semibold text-primary mb-4">{batch.name}</h3>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                      <UserCheck className="w-4 h-4 text-primary/70" />
                      Lead: <span className="text-on-surface font-semibold">{batch.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      {batch.schedule}
                    </div>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-surface-container-low border border-outline-variant/20 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }} />
                </div>
                
                <button className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-medium py-2 rounded-lg transition-colors border border-outline-variant/30 text-sm cursor-pointer" onClick={() => setRosterBatch(rosterBatch === batch.id ? null : batch.id)}>
                  {rosterBatch === batch.id ? 'Hide Roster' : 'Manage Roster'}
                </button>
                {rosterBatch === batch.id && (
                  <div className="mt-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/20 text-sm space-y-2">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Enrolled Students ({batch.enrolled})</p>
                    {Array.from({ length: Math.min(5, batch.enrolled) }, (_, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/10 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{String.fromCharCode(65 + i)}</div>
                          <span className="text-on-surface font-medium">Student {i + 1}</span>
                        </div>
                        <span className="text-on-surface-variant text-xs">Roll #{1001 + i}</span>
                      </div>
                    ))}
                    {batch.enrolled > 5 && <p className="text-xs text-primary font-semibold pt-1">+ {batch.enrolled - 5} more students...</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-2xl p-8 w-full max-w-md shadow-xl border border-outline-variant/30"
            >
              <h2 className="text-[24px] font-h2 font-semibold text-primary mb-6">Create New Batch</h2>
              <div className="flex flex-col gap-4 mb-8">
                <input type="text" placeholder="Batch Name (e.g. Morning Alpha)" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-on-surface">
                  <option>Select Section</option>
                  <option>Science</option>
                  <option>Commerce</option>
                </select>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-on-surface">
                  <option>Assign Lead Teacher</option>
                  <option>Dr. Priya Sharma</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Capacity" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input type="text" placeholder="Schedule" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium py-3 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors shadow-sm">Create Batch</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
