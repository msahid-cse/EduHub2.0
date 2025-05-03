import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import PromotionalVideoManager from './pages/PromotionalVideoManager';
import PartnerManagement from './pages/PartnerManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admindashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/partners" element={
          <ProtectedRoute requiredRole="admin">
            <PartnerManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/promotional-video" element={
          <ProtectedRoute requiredRole="admin">
            <PromotionalVideoManager />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 