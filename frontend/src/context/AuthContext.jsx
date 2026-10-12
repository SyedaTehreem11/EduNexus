import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile on mount / page refresh
  const loadUser = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load authenticated user profile:', error);
      // If token expired or invalid, cleanup
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username, password) => {
    const data = await apiLogin({ username, password });
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    setToken(data.access);

    // Load full user info
    const userData = await getMe();
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    return await apiRegister({ username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_staff_override');
    setToken(null);
    setUser(null);
  };

  // Helper for quick testing of staff features if role is not flagged in DB
  const toggleStaffMode = () => {
    if (!user) return;
    const nextVal = !user.is_staff;
    if (nextVal) {
      localStorage.setItem('is_staff_override', 'true');
    } else {
      localStorage.removeItem('is_staff_override');
    }
    setUser({ ...user, is_staff: nextVal });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isStaff: Boolean(user?.is_staff),
    login,
    register,
    logout,
    refreshUser: loadUser,
    toggleStaffMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
