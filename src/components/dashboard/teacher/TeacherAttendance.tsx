import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { apiClient } from '../../../api/apiClient';

export function TeacherAttendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [standard, setStandard] = useState('10th');
  const [division, setDivision] = useState('A');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/teacher/students?standard=${standard}&division=${division}`);
        setStudents(res.data.data.map((s: any) => ({ ...s, percentage: 100 })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [standard, division]);

  const handlePercentageChange = (id: string, percentage: number) => {
    setStudents(prev => prev.map(s => s._id === id ? { ...s, percentage } : s));
  };

  const submitAttendance = async () => {
    try {
      await apiClient.post('/api/teacher/attendance', {
        batchId: '000000000000000000000000', // Should be selected batch
        subjectId: '000000000000000000000000', // Should be selected subject
        weekStartDate: new Date().toISOString().split('T')[0],
        students: students.map(s => ({ studentId: s._id, percentage: s.percentage }))
      });
      alert('Attendance marked successfully!');
    } catch (e) {
      alert('Failed to mark attendance.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-surface rounded-2xl shadow-sm text-on-surface border border-outline-variant/30"
    >
      <h2 className="text-[24px] font-h2 font-semibold mb-6 text-primary">Mark Attendance</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="text-xs font-semibold text-on-surface-variant mb-1 block uppercase tracking-widest">Standard</label>
          <select 
            value={standard} 
            onChange={e => setStandard(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-on-surface"
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
        <div className="flex-1">
          <label className="text-xs font-semibold text-on-surface-variant mb-1 block uppercase tracking-widest">Division</label>
          <select 
            value={division} 
            onChange={e => setDivision(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-on-surface"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mb-4 text-sm font-medium text-on-surface-variant px-4">
        <span>Student ({students.length})</span>
        <span>Attendance %</span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-on-surface-variant font-medium">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant font-medium bg-surface-container-low rounded-xl border border-outline-variant/30">
          No students found in {standard} - {division}
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
        {students.map(student => (
          <div key={student._id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-medium text-on-surface-variant">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-on-surface">{student.name}</div>
                <div className="text-xs text-on-surface-variant">{student.userId}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={student.percentage} 
                onChange={(e) => handlePercentageChange(student._id, parseInt(e.target.value) || 0)}
                className="w-20 bg-surface border border-outline-variant/50 rounded-lg px-3 py-2 text-center font-medium text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="font-medium text-on-surface-variant">%</span>
            </div>
          </div>
        ))}
      </div>
      )}

      <button 
        onClick={submitAttendance}
        className="w-full bg-primary text-on-primary font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
      >
        Submit Attendance
      </button>
    </motion.div>
  );
}
