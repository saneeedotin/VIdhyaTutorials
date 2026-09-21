import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const reviews = [
  {
    quote: "The academic monitoring system at Vidhya Tutorials gives me complete peace of mind. I can see my daughter's growth not just in marks, but in her confidence.",
    author: "Mrs. Sharma",
    role: "Parent of 12th Grade Student",
    initials: "S",
    color: "bg-blue-100 text-blue-700"
  },
  {
    quote: "I love the real-time attendance alerts. Knowing exactly when my son reaches the campus and when he leaves is extremely reassuring for a working parent.",
    author: "Mr. Patel",
    role: "Parent of 10th Grade Student",
    initials: "P",
    color: "bg-green-100 text-green-700"
  },
  {
    quote: "The expert mentorship and regular parent-teacher coordination have helped us understand our child's strengths and weaknesses better than ever.",
    author: "Dr. Verma",
    role: "Parent of 11th Grade Student",
    initials: "V",
    color: "bg-purple-100 text-purple-700"
  }
];

export const ReviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-surface-bright p-8 rounded-xl shadow-md border border-outline-variant/30 relative h-[220px] overflow-hidden flex flex-col justify-center mt-4">
      <span className="material-symbols-outlined text-secondary text-4xl absolute top-4 left-4 bg-surface-bright rounded-full p-2 opacity-50">format_quote</span>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col h-full"
        >
          <p className="italic text-on-surface-variant font-body-lg text-[16px] md:text-[18px] mb-4 flex-1">"{reviews[currentIndex].quote}"</p>
          <div className="flex items-center gap-3 mt-auto">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${reviews[currentIndex].color}`}>
              {reviews[currentIndex].initials}
            </div>
            <div>
              <p className="font-bold text-primary leading-tight">{reviews[currentIndex].author}</p>
              <p className="text-xs text-on-surface-variant">{reviews[currentIndex].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const DashboardPreview = () => {
  const [currentView, setCurrentView] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGreenClick = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    } else {
      navigate('/login');
    }
  };

  const handleYellowClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView((prev) => (prev + 1) % 3);
    }, 1500); // 1.5s loader
  };

  const handleRedClick = () => {
    if (isLoading) return;
    setCurrentView((prev) => (prev + 1) % 3);
  };

  return (
    <div className="bg-surface-bright rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 relative">
      {/* Mac OS Header */}
      <div className="p-6 bg-primary text-white flex justify-between items-center relative z-20">
        <span className="font-bold">VT Academic Dashboard</span>
        <div className="flex gap-2 group">
          <button onClick={handleRedClick} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer shadow-sm relative overflow-hidden"></button>
          <button onClick={handleYellowClick} className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer shadow-sm relative overflow-hidden"></button>
          <button onClick={handleGreenClick} className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer shadow-sm relative overflow-hidden"></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 h-[320px] relative">
        <AnimatePresence mode="wait">
          {!isLoading && currentView === 0 && (
            <motion.div
              key="view1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 h-full"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm text-on-surface-variant">Overall Attendance</p>
                  <p className="text-h3 text-[24px] font-bold text-primary">98.5%</p>
                </div>
                <div className="px-4 py-1.5 rounded-full border-[3px] border-green-500 flex items-center justify-center text-green-600 font-bold text-sm uppercase tracking-wide">Excellent</div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-primary">Recent Results (Weekly Test)</p>
                <div className="space-y-3">
                  {[['Mathematics', '92%'], ['Physics', '88%'], ['Chemistry', '95%']].map(([subject, score]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm w-24">{subject}</span>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <div className="h-2 bg-secondary-container rounded-full flex-1">
                          <div className="h-2 bg-primary rounded-full" style={{ width: score }}></div>
                        </div>
                        <span className="text-xs font-bold w-8 text-right">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && currentView === 1 && (
            <motion.div
              key="view2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 h-full flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-xl">Personalized Mentorship</h4>
                  <p className="text-sm text-on-surface-variant">One-on-one expert guidance</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-xs">Dr. S</div>
                    <div>
                      <span className="font-semibold block leading-tight">Dr. Sharma</span>
                      <span className="text-xs text-on-surface-variant">Physics Expert</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">Active</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-primary/30 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <p className="text-xs font-bold text-primary uppercase">Next Doubt Session</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Advanced Mechanics</span>
                    <span className="text-sm font-semibold text-secondary">Today, 4:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && currentView === 2 && (
            <motion.div
              key="view3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 h-full flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-400/20 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">menu_book</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-xl">Premium Resources</h4>
                  <p className="text-sm text-on-surface-variant">24/7 access to curated study materials</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-secondary">smart_display</span>
                  <span className="font-bold text-sm">Video Lectures</span>
                  <span className="text-xs text-on-surface-variant">500+ Hours</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col items-center text-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-secondary">quiz</span>
                  <span className="font-bold text-sm">Mock Tests</span>
                  <span className="text-xs text-on-surface-variant">Instant Grading</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-bright/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 border-4 border-outline-variant/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-primary animate-pulse">Switching Views...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Small dark blue loader at the bottom during yellow click */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#1f406d] origin-left z-20"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
