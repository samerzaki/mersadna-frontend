"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { NotificationChannels, LinkedAccounts } from '@/types/user';
import { login as loginApi, register as registerApi, whoAmI, logout as logoutApi } from '@/lib/api-auth';
import { removeStoredToken } from '@/lib/auth-utils';
import type { AuthUser } from '@/types/auth';

export interface User {
  id: number;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  avatarUrls?: {
    small: string;
    medium: string;
    large: string;
  };
  phone?: string;
  emailVerified?: boolean;
  preferences?: {
    currency: string;
    notifications: boolean;
    favoriteCurrencies: string[];
    favoriteGoldKarat: string[];
  };
  notificationChannels?: NotificationChannels;
  linkedAccounts?: LinkedAccounts;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAuthUser(apiUser: AuthUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.full_name,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    avatar: apiUser.avatar?.medium || apiUser.avatar?.small,
    avatarUrls: apiUser.avatar,
    phone: apiUser.mobile_number || undefined,
    emailVerified: apiUser.email_verified,
    preferences: {
      currency: 'EGP',
      notifications: true,
      favoriteCurrencies: ['USD', 'EUR'],
      favoriteGoldKarat: ['24', '21'],
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await whoAmI();
        if (response.success && response.data) setUser(mapAuthUser(response.data));
      } catch { removeStoredToken(); }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for unauthorized events (401 from API)
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      removeStoredToken();
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });

      if (response.success && response.data) {
        setUser(mapAuthUser(response.data));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'فشل تسجيل الدخول' };
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : 'فشل تسجيل الدخول';
      return { success: false, error: message };
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      const response = await registerApi({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        mobile_number: userData.phone || undefined,
      });

      if (response.success && response.data) {
        setUser(mapAuthUser(response.data));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'فشل إنشاء الحساب' };
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : 'فشل إنشاء الحساب';
      return { success: false, error: message };
    }
  };

  const logout = useCallback(() => {
    void logoutApi().catch(() => undefined);
    setUser(null);
    removeStoredToken();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await whoAmI();
      if (response.success && response.data) {
        setUser(mapAuthUser(response.data));
      }
    } catch {
      // Silently fail - user will see stale data
    }
  }, []);

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        } as User['preferences'],
      };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
