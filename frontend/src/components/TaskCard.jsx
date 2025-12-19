import React, { useState } from 'react';

export default function TaskCard({
  task,
  users = [],
  onAssign,
  onDelete,
  onStatusChange,
  employeeView = false,
}) {
  const [selectedUser, setSelectedUser] = useState('');

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`text-base font-semibold ${
            task.status === 'completed'
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {task.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            statusStyles[task.status]
          }`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">
          {task.description}
        </p>
      )}

      {/* Assignment Info */}
      <div className="text-xs text-gray-500 mb-4">
        Assigned to:
        <span className="ml-1 font-semibold text-gray-700">
          {task.assignedTo?.name || 'Unassigned'}
        </span>
      </div>

      {/* ================= MANAGER VIEW ================= */}
      {!employeeView && (
        <div className="border-t pt-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Assign to employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => onAssign(task.id, selectedUser)}
              disabled={!selectedUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm disabled:opacity-50"
            >
              Assign
            </button>

            <button
              onClick={() => onDelete(task)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ================= EMPLOYEE VIEW ================= */}
      {employeeView && (
        <div className="border-t pt-3 flex flex-wrap gap-2 justify-end">
          {task.status !== 'pending' && (
            <button
              onClick={() => onStatusChange(task.id, 'pending')}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Pending
            </button>
          )}

          {task.status !== 'in_progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'in_progress')}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              In Progress
            </button>
          )}

          {task.status !== 'completed' && (
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              className="px-3 py-1.5 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white"
            >
              Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
