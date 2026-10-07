import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, currency = '$') => {
    try {
      const res = await api.post('/auth/register', { name, email, password, currency });
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
          setToken(userData.token);
          localStorage.setItem('token', userData.token);
        }
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
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
