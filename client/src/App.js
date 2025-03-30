import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Added
import Dashboard from './pages/Dashboard';
import CaseDetails from './pages/CaseDetails';
import Report from './pages/Report';
import EmergencyForm from './pages/EmergencyForm';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Added */}
        <Route path="/emergency" element={<EmergencyForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/:caseId" element={<CaseDetails />} />
        <Route
          path="/case/:caseId"
          element={
            <PrivateRoute>
              <CaseDetails />
            </PrivateRoute>
          }
        />
        <Route path="/report" element={<Report />} />
       
      </Routes>
      <Footer />
    </>
  );
}

export default App;