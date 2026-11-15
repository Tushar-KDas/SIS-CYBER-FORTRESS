'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken, getAuthToken } from './api';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  isMfaEnabled: boolean;
  securityScore: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<any>;
  register: (fullName: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sis_user');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const updateUserData = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      if (u) {
        localStorage.setItem('sis_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('sis_user');
      }
    }
  };

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      updateUserData(null);
      setIsLoading(false);
      return;
    }
    try {
      const profile = await apiClient<AuthUser>('/auth/me');
      updateUserData(profile);
    } catch (e) {
      updateUserData(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string, mfaCode?: string) => {
    const res = await apiClient<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, mfaCode }),
    });

    if (res.accessToken) {
      setAuthToken(res.accessToken);
      updateUserData(res.user);
    }
    return res;
  };

  const register = async (fullName: string, email: string, password: string) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    } finally {
      updateUserData(null);
      setAuthToken(null);
      router.push('/login');
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
