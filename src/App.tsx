import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shield, Trophy } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import BaseScoring from './components/BaseScoring';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, requireAdmin }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { session, userRole } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/base" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">Team Scoring System</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/base" 
              element={
                <ProtectedRoute>
                  <BaseScoring />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;