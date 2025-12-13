import React from 'react';
import ManagerDashboard from './ManagerDashboard.jsx';
import EmployeeDashboard from './EmployeeDashboard.jsx';

export default function Dashboard({ user }) {
  const raw = localStorage.getItem('taskmanager_user');
  const u = user || (raw ? JSON.parse(raw) : null);
  if (!u) return <p>Please login</p>;
  return u.role === 'manager' ? <ManagerDashboard user={u} /> : <EmployeeDashboard user={u} />;
}
