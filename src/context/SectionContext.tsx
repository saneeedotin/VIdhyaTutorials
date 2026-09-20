import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SectionContextType {
  activeSectionId: string | null;
  activeBatchId: string | null;
  setActiveSectionId: (id: string | null) => void;
  setActiveBatchId: (id: string | null) => void;
}

const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT' && user.sectionId && user.batchId) {
        setActiveSectionId(user.sectionId);
        setActiveBatchId(user.batchId);
      } else if (user.role === 'TEACHER') {
        // Default to first section/batch if available
        if (user.sectionIds && user.sectionIds.length > 0) {
          setActiveSectionId(user.sectionIds[0]);
        }
        if (user.batchIds && user.batchIds.length > 0) {
          setActiveBatchId(user.batchIds[0]);
        }
      }
    } else {
      setActiveSectionId(null);
      setActiveBatchId(null);
    }
  }, [user]);

  return (
    <SectionContext.Provider value={{ activeSectionId, activeBatchId, setActiveSectionId, setActiveBatchId }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
};
