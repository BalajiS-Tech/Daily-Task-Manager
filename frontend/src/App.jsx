import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(()=> {
    const raw = localStorage.getItem('taskmanager_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('taskmanager_token', token);
    localStorage.setItem('taskmanager_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskmanager_token');
    localStorage.removeItem('taskmanager_user');
    setUser(null);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header user={user} onLogout={handleLogout} />
      <main className='max-w-6xl mx-auto p-6'>
        <Routes>
          <Route path='/' element={user ? <Navigate to='/dashboard'/> : <Navigate to='/login'/>} />
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
          <Route path='/signup' element={<Signup onSignup={handleLogin} />} />
          <Route path='/dashboard' element={user ? <Dashboard user={user}/> : <Navigate to='/login'/>} />
          <Route path='/manager' element={user && user.role==='manager' ? <ManagerDashboard user={user}/> : <Navigate to='/dashboard'/>} />
          <Route path='/employee' element={user && user.role==='employee' ? <EmployeeDashboard user={user}/> : <Navigate to='/dashboard'/>} />
        </Routes>
      </main>
      <ToastContainer position='top-right' autoClose={2200} />
    </div>
  );
}
