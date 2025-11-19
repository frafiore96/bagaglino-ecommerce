import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User, RegisterData } from '../services/api';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Mostra il popup di benvenuto
      setShowWelcomePopup(true);
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Errore durante login' 
      };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Errore durante registrazione' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const isAdmin = (): boolean => user?.role === 'admin';
  const isAuthenticated = (): boolean => !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    loading,
    showWelcomePopup,
    setShowWelcomePopup,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};