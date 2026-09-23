import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

export function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Amanda';

  const [timetable, setTimetable] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [attendance, setAttendance] = useState<any[]>([]);
  
  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calendar State
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, todoRes, attRes] = await Promise.all([
          apiClient.get('/api/student/timetable/upcoming').catch(() => ({ data: { data: [] } })),
          apiClient.get('/api/student/todos').catch(() => ({ data: { data: [] } })),
          apiClient.get('/api/student/attendance').catch(() => ({ data: { data: null } }))
        ]);
        
        // Ensure timetable always has 3 days even if API fails
        const ttData = ttRes.data?.data?.length === 3 ? ttRes.data.data : [
          { dayName: 'Today', date: new Date(), schedule: [] },
          { dayName: 'Tomorrow', date: new Date(Date.now() + 86400000), schedule: [] },
          { dayName: 'Next', date: new Date(Date.now() + 172800000), schedule: [] }
        ];

        setTimetable(ttData);
        setTodos(todoRes.data?.data || []);
        
        // Use live attendance from backend if available, fallback to default weeks
        if (attRes.data?.data?.weekly && Array.isArray(attRes.data.data.weekly)) {
          setAttendance(attRes.data.data.weekly);
        } else {
          setAttendance([
            { _id: 'w1', label: 'Week 1', percentage: 95 },
            { _id: 'w2', label: 'Week 2', percentage: 88 },
            { _id: 'w3', label: 'Week 3', percentage: 100 }
          ]);
        }

      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Live Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Todo Handlers
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await apiClient.post('/api/student/todos', { title: newTodo });
      setTodos([res.data.data, ...todos]);
      setNewTodo('');
    } catch (e) {
      console.error('Error adding todo', e);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
      await apiClient.put(`/api/student/todos/${id}`, { isCompleted: !currentStatus });
    } catch (e) {
      console.error('Error toggling todo', e);
      // Revert on error
      setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: currentStatus } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setTodos(todos.filter(t => t._id !== id));
      await apiClient.delete(`/api/student/todos/${id}`);
    } catch (e) {
      console.error('Error deleting todo', e);
    }
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

    // Header row
    weekDays.forEach((day, i) => {
      days.push(<div key={`header-${i}`} className="font-bold text-[#1A1A2E]/40 dark:text-white/40 text-xs py-1">{day}</div>);
    });

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    // Day cells
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <button
          key={`day-${i}`}
          onClick={() => setSelectedDate(date)}
          className={`
            w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold transition-all
            ${isSelected ? 'bg-[#0f8ff7] text-white shadow-lg shadow-[#0f8ff7]/30 scale-110' : 
              isToday ? 'bg-[#D9F89A] text-[#1A1A2E]' : 'text-[#1A1A2E] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}
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
      className="flex flex-col gap-6 w-full h-auto min-h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)] text-on-surface p-4 lg:p-6 overflow-visible lg:overflow-hidden bg-transparent"
    >
      {/* ═══════ TOP HEADER ═══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-h1 text-[32px] font-semibold tracking-tight text-primary">
            Hi, {firstName}!
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">
            Let's conquer your academic day.
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
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:min-h-0">
        
        {/* ── Top Row ── */}
        
        {/* Study Progress Graph (2 cols) */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col relative overflow-hidden group min-h-[300px] lg:min-h-0">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[100px] opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex justify-between items-start z-10 mb-6 shrink-0">
            <div>
              <h2 className="text-[24px] font-h2 font-semibold text-primary tracking-tight">Attendance</h2>
              <p className="text-xs font-medium text-on-surface-variant uppercase mt-1 tracking-wider">Last 3 Weeks</p>
            </div>
          </div>

          <div className="flex-1 flex items-end gap-4 z-10 mt-auto pt-4">
            {attendance.length > 0 ? attendance.map((a, i) => (
              <div key={a._id || i} className="flex-1 flex flex-col items-center gap-3">
                <div className="text-primary font-bold text-xl">{a.percentage}%</div>
                <div className="w-full bg-surface-container rounded-full h-32 md:h-40 flex items-end p-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${a.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                    className={`w-full ${a.percentage >= 90 ? 'bg-primary' : a.percentage >= 75 ? 'bg-secondary' : 'bg-error'} rounded-full relative group/bar`}
                  >
                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-medium px-2 py-1 rounded shadow-md transition-opacity whitespace-nowrap z-20">
                      {a.percentage}% Present
                    </div>
                  </motion.div>
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-medium text-on-surface-variant truncate px-1" title={a.label}>{a.label}</div>
                </div>
              </div>
            )) : (
              <div className="w-full text-center text-on-surface-variant font-medium text-sm my-auto">No attendance data available yet.</div>
            )}
          </div>
        </div>

        {/* Calendar Widget (1 col) */}
        <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col h-full shrink-0 min-h-[380px] lg:min-h-0">
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
          <div className="grid grid-cols-7 gap-y-2 text-center flex-1 content-start">
            {renderCalendar()}
          </div>
          <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center shrink-0">
            <div className="text-xs font-medium text-on-surface-variant">Selected: <span className="text-primary font-bold">{selectedDate.getDate()}</span></div>
            <button className="text-[12px] font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md cursor-pointer" onClick={() => {
                const dayName = selectedDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
                const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
                const schedule = isWeekend 
                  ? `📅 ${dayName}\n\nNo classes scheduled — Enjoy your weekend! 🎉`
                  : `📅 ${dayName}\n\n9:00 AM — Mathematics (Dr. Sharma)\n10:30 AM — Physics (Mr. Vikram)\n12:00 PM — Lunch Break\n1:00 PM — Chemistry (Mrs. Iyer)\n2:30 PM — Doubt Solving Lab\n4:00 PM — Self Study`;
                alert(schedule);
              }}>
              View Day
            </button>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        
        {/* Todo List (1 col) */}
        <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col overflow-hidden min-h-[350px] lg:min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-h3 font-medium text-primary">My Tasks</h2>
            <div className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
              {todos.filter(t => !t.isCompleted).length} Left
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="mb-4 shrink-0 relative">
            <input 
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10"
            />
            <button type="submit" disabled={!newTodo.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary text-white dark:text-[#001b3c] rounded flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            <AnimatePresence>
              {todos.map(todo => (
                <motion.div 
                  key={todo._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${todo.isCompleted ? 'bg-surface/50 border-transparent opacity-60' : 'bg-surface border-[#1A1A2E] shadow-[2px_2px_0px_0px_rgba(26,26,46,1)]'}`}
                >
                  <button onClick={() => toggleTodo(todo._id, todo.isCompleted)} className="shrink-0 text-on-surface-variant hover:text-primary transition-colors">
                    {todo.isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`flex-1 text-sm font-medium truncate ${todo.isCompleted ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                    {todo.title}
                  </span>
                  <button onClick={() => deleteTodo(todo._id)} className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <div className="text-center text-on-surface-variant font-medium text-sm mt-10">You're all caught up!</div>
            )}
          </div>
        </div>


      </div>
    </motion.div>
  );
}
