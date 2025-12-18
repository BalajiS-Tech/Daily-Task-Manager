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

  return (
    <div className="card border rounded p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`font-semibold ${
            task.status === 'completed'
              ? 'line-through text-gray-400'
              : ''
          }`}
        >
          {task.title}
        </h3>

        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {task.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-2">
        {task.description}
      </p>

      {/* Assignment info */}
      <div className="text-xs text-gray-500 mb-3">
        Assigned:
        <span className="font-semibold ml-1">
          {task.assignedTo?.name || 'Unassigned'}
        </span>
      </div>

      {/* 👨‍💼 MANAGER VIEW */}
      {!employeeView && (
        <>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm mb-2"
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
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Assign
            </button>

            <button
              onClick={() => onDelete(task)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* 👷 EMPLOYEE VIEW */}
      {employeeView && (
        <div className="flex gap-2 justify-end mt-3">
          {task.status !== 'pending' && (
            <button
              onClick={() => onStatusChange(task.id, 'pending')}
              className="px-3 py-1 text-xs bg-gray-200 rounded"
            >
              Pending
            </button>
          )}

          {task.status !== 'in_progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'in_progress')}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
            >
              In Progress
            </button>
          )}

          {task.status !== 'completed' && (
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded"
            >
              Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
