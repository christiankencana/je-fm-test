import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Master from './components/Master/Master';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Periksa status autentikasi dari localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login navigateTo={(page) => navigate(`/${page}`)} />} />
      <Route path="/dashboard" element={<Dashboard navigateTo={(page) => navigate(`/${page}`)} />} />
      <Route path="/master" element={<Master navigateTo={(page) => navigate(`/${page}`)} />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
