import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/auth';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role: UserRole, avatar?: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with null — user must actively log in
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const token = localStorage.getItem('edumanage_auth_token');
      const saved = localStorage.getItem('edumanage_auth_user');
      if (token && saved) {
        return JSON.parse(saved) as AuthUser;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem('edumanage_auth_token');
      return !!token;
    } catch {
      return false;
    }
  });

  // Verify token with backend on mount
  useEffect(() => {
    const token = localStorage.getItem('edumanage_auth_token');
    if (!token) {
      // No token — make sure we're logged out
      setCurrentUser(null);
      setIsAuthenticated(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await api.auth.getCurrentUser();
        if (res.success && res.user) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } else {
          // Invalid token on server — log out
          handleLogout();
        }
      } catch {
        // If server unreachable, keep cached session
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      localStorage.setItem('edumanage_auth_user', JSON.stringify(currentUser));
    } else if (!isAuthenticated) {
      localStorage.removeItem('edumanage_auth_user');
    }
  }, [currentUser, isAuthenticated]);

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edumanage_auth_user');
  };

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.login(email, password, role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid email or password' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    avatar?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.register(name, email, password, role, avatar);
      if (res.success) {
        // Registration successful; do not auto-login so user must log in from login page
        return { success: true, message: res.message || 'Registration successful! Please login.' };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed. Please try again.' };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    if (!email) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    try {
      const res = await api.auth.forgotPassword(email);
      return { success: true, message: res.message };
    } catch {
      return { success: true, message: `Password reset link has been dispatched to ${email}` };
    }
  };

  const logout = () => {
    handleLogout();
  };

  const switchRole = async (role: UserRole) => {
    try {
      const res = await api.auth.switchRole(role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
      }
    } catch {
      // If role switch fails, do nothing
    }
  };

  const updateProfile = async (data: { name?: string; avatar?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.updateProfile(data);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem('edumanage_auth_user', JSON.stringify(res.user));
        } catch {}
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Failed to update profile' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        updateProfile,
        forgotPassword,
        logout,
        switchRole,
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
