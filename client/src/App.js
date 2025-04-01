import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseDetails from './pages/CaseDetails';
import Report from './pages/Report';
import EmergencyForm from './pages/EmergencyForm';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/:caseId" element={<CaseDetails />} />
        <Route path="/report" element={<Report />} />
        <Route path="/emergency" element={<EmergencyForm />} />

        {/* Admin Only Routes */}
        <Route 
          path="/admin/feedback" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminFeedbackPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
