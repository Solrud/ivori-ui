import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from './api/mockApi';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_jwt'));

  useEffect(() => {
    adminApi.setToken(token);
    if (token) {
      // Validate current session with backend GET /api/auth/me
      adminApi.getMe().catch((err) => {
        console.warn('Session verification failed, logging out:', err);
        // If 401 or invalid token, logout
        logout();
      });
    }
  }, [token]);

  const isAuthenticated = !!token;

  const login = async (email: string, password: string) => {
    try {
      const res = await adminApi.login(email, password);
      if (res && res.token) {
        localStorage.setItem('admin_jwt', res.token);
        setToken(res.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_jwt');
    setToken(null);
    adminApi.setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
