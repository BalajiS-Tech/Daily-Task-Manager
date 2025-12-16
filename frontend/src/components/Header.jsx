import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Left side */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-blue-600">
            Task Manager
          </h1>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex gap-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
            </nav>
          )}
        </div>

        {/* Right side */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {user.name || user.email}
                <span className="ml-1 text-gray-500">
                  ({user.role})
                </span>
              </span>

              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
