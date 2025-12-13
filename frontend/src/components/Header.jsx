import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header className='bg-white shadow p-4 mb-6'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-bold text-primary'>Task Manager</h1>
          <nav className='hidden md:flex gap-3'>
            <Link to='/dashboard' className='text-gray-600 hover:text-primary'>Dashboard</Link>
            <Link to='/manager' className='text-gray-600 hover:text-primary'>Manager</Link>
            <Link to='/employee' className='text-gray-600 hover:text-primary'>Employee</Link>
          </nav>
        </div>
        <div>
          {user ? (
            <div className='flex items-center gap-3'>
              <div className='text-sm text-gray-700'>{user.name || user.email} ({user.role})</div>
              <button onClick={onLogout} className='bg-red-500 text-white px-3 py-1 rounded'>Logout</button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <Link to='/login' className='text-gray-600'>Login</Link>
              <Link to='/signup' className='text-gray-600'>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
