import React from 'react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  employeeView = false
}) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <h3
          className={
            task.status === 'completed'
              ? 'line-through text-gray-500'
              : 'font-semibold'
          }
        >
          {task.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      )}

      {task.createdBy && (
        <div className="text-xs text-gray-500 mb-2">
          Created by: <span className="font-semibold">{task.createdBy.name}</span>
        </div>
      )}

      {/* EMPLOYEE VIEW → STATUS UPDATE ONLY */}
      {employeeView && (
        <div className="flex justify-end mt-3">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* MANAGER VIEW → FULL ACTIONS */}
      {!employeeView && (
        <div className="flex gap-2 justify-end mt-3">
          <button
            onClick={() => onEdit(task)}
            className="bg-yellow-400 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
