"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return; 

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isHomePage = pathname === '/';
    const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/owner') || pathname.startsWith('/advertiser');

    if (user) {
      if (isAuthPage || isHomePage) {
        router.replace(`/${user.role.toLowerCase()}/dashboard`);
        return;
      }

      if (isProtectedRoute) {
        const userRole = user.role.toLowerCase();
        if (
          (pathname.startsWith('/admin') && userRole !== 'admin') ||
          (pathname.startsWith('/owner') && userRole !== 'owner') ||
          (pathname.startsWith('/advertiser') && userRole !== 'advertiser')
        ) {
          router.replace('/login');
          return;
        }
      }
    } else {
      if (isProtectedRoute) {
        router.replace('/login');
        return;
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {loading ? <LoadingSpinner message="Checking authentication..." /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
