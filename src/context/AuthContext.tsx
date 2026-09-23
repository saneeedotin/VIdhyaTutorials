import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { apiClient, setAccessToken } from '../api/apiClient';

interface User {
  _id: string;
  userId: string;
  role: string;
  name: string;
  email: string;
  schoolCode: string;
  sectionId?: string;
  batchId?: string;
  sectionIds?: string[];
  batchIds?: string[];
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  phone?: string;
  age?: number;
  standard?: string;
  division?: string;
  courses?: string[];
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial check: Try to refresh token on boot to restore session silently
  useEffect(() => {
    const normalizeUser = (u: any) => {
      if (!u) return null;
      if (u.role === 'ADMIN' && (!u.email || u.email.includes('vidhya.in'))) {
        return { ...u, email: 'vidhyatutorials22@gmail.com' };
      }
      return u;
    };

    const restoreSession = async () => {
      try {
        // Use plain axios call with credentials so it does NOT trigger apiClient's response interceptor on 401
        const baseUrl = apiClient.defaults.baseURL || '';
        const { data } = await axios.post(`${baseUrl}/api/auth/refresh`, {}, {
          withCredentials: true
        });
        setAccessToken(data.accessToken);
        
        // Fetch user profile
        const userRes = await apiClient.get('/api/auth/me');
        setUser(normalizeUser(userRes.data.user));
      } catch (error) {
        // No valid session, stay logged out
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // Listen for unauthorized events from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    if (userData?.role === 'ADMIN' && (!userData?.email || userData?.email.includes('vidhya.in'))) {
      setUser({ ...userData, email: 'vidhyatutorials22@gmail.com' });
    } else {
      setUser(userData);
    }
  };

  const logout = async () => {
    // Clear state immediately FIRST to prevent race conditions
    setUser(null);
    setAccessToken(null);
    
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    
    // Clear any stored tokens/cookies from the browser side
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    document.cookie = 'jwt=; Max-Age=0; path=/;';
    document.cookie = 'token=; Max-Age=0; path=/;';
    
    // Full page reload to /login ensures clean state
    window.location.href = '/login';
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
