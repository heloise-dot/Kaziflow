import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import { UserRole } from '../../types';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, verify token validity on mount
    if (token) {
      // decode token to get role/exp if needed
      // for now assuming valid if present
      const storedRole = localStorage.getItem('role') || UserRole.VENDOR;
      setUser({ role: storedRole });
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken: string, role: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
    setToken(newToken);
    setUser({ role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
