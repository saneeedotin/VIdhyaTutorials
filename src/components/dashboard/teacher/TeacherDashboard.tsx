import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

export function TeacherDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  // State
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Calendar State
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Todo State
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Attendance Giver State
  const [selectedStd, setSelectedStd] = useState('10th');
  const [selectedDiv, setSelectedDiv] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendancePercent, setAttendancePercent] = useState('');
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Upcoming Lectures State
  const [timetable, setTimetable] = useState<any[]>([
    {
      dayName: 'Today',
      date: new Date(),
      schedule: [
        { startTime: '10:00 AM', endTime: '11:30 AM', subjectId: { name: 'Mathematics' }, batchInfo: '10th A' },
        { startTime: '01:00 PM', endTime: '02:00 PM', subjectId: { name: 'Physics' }, batchInfo: '9th B' },
      ]
    },
    {
      dayName: 'Tomorrow',
      date: new Date(Date.now() + 86400000),
      schedule: [
        { startTime: '09:00 AM', endTime: '10:30 AM', subjectId: { name: 'Physics' }, batchInfo: '10th A' },
      ]
    },
    {
      dayName: 'Next',
      date: new Date(Date.now() + 172800000),
      schedule: []
    }
  ]);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch teacher todos from backend
  useEffect(() => {
    apiClient.get('/api/teacher/todos')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setTodos(res.data.data);
        }
      })
      .catch(err => console.warn('Could not fetch teacher todos:', err));
  }, []);

  // Todo Handlers
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await apiClient.post('/api/teacher/todos', { title: newTodo });
      if (res.data?.data) {
        setTodos([res.data.data, ...todos]);
      }
    } catch {
      const fallback = { _id: Date.now().toString(), title: newTodo, isCompleted: false };
      setTodos([fallback, ...todos]);
    }
    setNewTodo('');
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
    try {
      await apiClient.put(`/api/teacher/todos/${id}`, { isCompleted: !currentStatus });
    } catch (err) {
      console.warn('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter(t => t._id !== id));
    try {
      await apiClient.delete(`/api/teacher/todos/${id}`);
    } catch (err) {
      console.warn('Failed to delete todo:', err);
    }
  };

  // Attendance Handlers
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !attendancePercent) return;
    
    // Simulate API Call
    setAttendanceSuccess(true);
    setTimeout(() => {
      setAttendanceSuccess(false);
      setSelectedStudent('');
      setAttendancePercent('');
    }, 2000);
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday index 0
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    weekDays.forEach((day, i) => {
      days.push(<div key={`header-${i}`} className="font-bold text-[#1A1A2E]/40 dark:text-white/40 text-xs py-1">{day}</div>);
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <button
          key={`day-${i}`}
          onClick={() => setSelectedDate(date)}
          className={`
            w-10 h-10 md:w-12 md:h-12 mx-auto flex items-center justify-center rounded-2xl text-sm font-bold transition-all border-2
            ${isSelected ? 'bg-[#0f8ff7] text-white shadow-lg shadow-[#0f8ff7]/30 scale-110 border-[#0f8ff7]' : 
              isToday ? 'bg-[#D9F89A] text-[#1A1A2E] border-[#1A1A2E]' : 'bg-slate-50 dark:bg-slate-800/50 text-[#1A1A2E] dark:text-white border-transparent hover:border-[#1A1A2E]/20 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-slate-700'}
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col gap-6 w-full flex-1 h-fit text-on-surface p-4 lg:p-6 bg-transparent"
    >
      {/* ═══════ TOP HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-h1 text-[32px] font-semibold tracking-tight text-primary">
            Hi, {firstName}!
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">
            Manage your classes and students.
          </p>
        </div>
        
        {/* Live Clock Widget */}
        <div className="bg-surface border border-outline-variant/30 rounded-xl px-4 md:px-6 py-3 flex flex-row items-center justify-between md:justify-start gap-4 md:gap-6 shadow-sm w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
            <span className="font-medium text-sm text-primary">
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-outline-variant/30" />
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="font-h3 text-xl font-medium text-primary">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN GRID ═══════ */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6">
        
        {/* ── Top Row ── */}
        


        {/* Grid 1: Calendar of the Month (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col h-full min-h-[380px] lg:min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-h3 font-medium text-primary">Schedule</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                &lsaquo;
              </button>
              <span className="text-xs font-semibold uppercase tracking-wider min-w-[80px] text-center text-on-surface-variant">
                {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                &rsaquo;
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center flex-1 content-start mt-4">
            {renderCalendar()}
          </div>
          <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center shrink-0">
            <div className="text-xs font-medium text-on-surface-variant">Selected: <span className="text-primary font-bold">{selectedDate.getDate()}</span></div>
            <button onClick={() => setIsDayModalOpen(true)} className="text-[12px] font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
              View Day
            </button>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        
        {/* Grid 2: Todo List (1 col) */}
        <div className="lg:col-span-1 bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <h2 className="text-xl font-h3 font-medium text-primary">My Tasks</h2>
            <div className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
              {todos.filter(t => !t.isCompleted).length} Left
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="mb-3 shrink-0 relative">
            <input 
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10"
            />
            <button type="submit" disabled={!newTodo.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary text-white dark:text-[#001b3c] rounded flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            <AnimatePresence>
              {todos.map(todo => (
                <motion.div 
                  key={todo._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${todo.isCompleted ? 'bg-surface border-transparent opacity-60' : 'bg-surface border-outline-variant/30 shadow-sm'}`}
                >
                  <button onClick={() => toggleTodo(todo._id, todo.isCompleted)} className="shrink-0 text-on-surface-variant hover:text-primary transition-colors">
                    {todo.isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`flex-1 text-sm font-medium truncate ${todo.isCompleted ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                    {todo.title}
                  </span>
                  <button onClick={() => deleteTodo(todo._id)} className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <div className="text-center text-on-surface-variant font-medium text-sm mt-6">You're all caught up!</div>
            )}
          </div>
        </div>

        {/* Grid 3: Upcoming Lectures (3 cols) */}
        <div className="lg:col-span-3 bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-h3 font-medium text-primary">My Upcoming Lectures</h2>
            <div className="text-xs font-semibold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">
              Next 3 Days
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 min-h-0">
            {timetable.map((dayData, idx) => {
              const dateObj = new Date(dayData.date);
              const isToday = idx === 0;
              return (
                <div key={idx} className={`flex flex-col border rounded-xl overflow-hidden ${isToday ? 'border-primary ring-1 ring-primary shadow-sm' : 'border-outline-variant/30'}`}>
                  {/* Day Header */}
                  <div className={`px-4 py-3 border-b flex justify-between items-center shrink-0 ${isToday ? 'bg-primary border-primary text-white dark:text-[#001b3c]' : 'bg-surface-container border-outline-variant/30 text-on-surface'}`}>
                    <span className="font-semibold uppercase tracking-wider text-xs">{isToday ? 'Today' : dayData.dayName}</span>
                    <span className={`font-medium text-xs ${isToday ? 'text-white/80' : 'text-on-surface-variant'}`}>
                      {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  {/* Subject List */}
                  <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-2 bg-surface">
                    {dayData.schedule && dayData.schedule.length > 0 ? (
                      dayData.schedule.map((session: any, sIdx: number) => (
                        <div key={sIdx} className="p-3 rounded-lg border border-outline-variant/30 bg-surface hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                          <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">{session.startTime} - {session.endTime}</div>
                          <div className="font-medium text-sm text-primary truncate leading-tight">{session.subjectId?.name || 'Class Session'}</div>
                          <div className="text-[10px] font-medium bg-secondary-container text-on-secondary-container inline-block px-2 py-0.5 rounded mt-1">{session.batchInfo}</div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-2">
                          <span className="text-lg">☕</span>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Free Day</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isDayModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDayModalOpen(false)}
              className="absolute inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                  <h2 className="text-2xl font-h2 font-semibold text-primary">Daily Schedule</h2>
                  <p className="text-sm font-medium text-secondary uppercase tracking-wider mt-1">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDayModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors text-on-surface font-medium"
                >
                  X
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {[
                  { time: '09:00 AM - 10:30 AM', subject: 'Advanced Mathematics', batch: '10th A', room: 'Room 402' },
                  { time: '11:00 AM - 12:30 PM', subject: 'Physics (Mechanics)', batch: '11th B', room: 'Lab 2' },
                  { time: '02:00 PM - 03:30 PM', subject: 'Chemistry (Organic)', batch: '12th A', room: 'Lab 1' },
                ].map((cls, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                    <div className="w-16 flex flex-col items-end shrink-0 pt-1">
                      <span className="text-xs font-semibold text-primary">{cls.time.split(' - ')[0]}</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">to {cls.time.split(' - ')[1].split(' ')[0]}</span>
                    </div>
                    <div className="w-[2px] bg-outline-variant/30 group-hover:bg-primary transition-colors rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-medium text-primary text-base leading-tight mb-1">{cls.subject}</h3>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-[10px] font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">{cls.batch}</span>
                        <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" /> {cls.room}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 shrink-0">
                <button 
                  onClick={() => setIsDayModalOpen(false)}
                  className="w-full bg-primary text-white dark:text-[#001b3c] font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Close Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
