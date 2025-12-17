import React from 'react';

export default function StatsCard({ title, value, color = 'blue' }) {
  return (
    <div className="bg-white rounded shadow p-4 border-l-4" style={{ borderColor: color }}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
