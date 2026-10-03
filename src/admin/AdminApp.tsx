import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
