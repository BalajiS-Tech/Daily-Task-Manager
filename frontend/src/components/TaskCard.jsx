import React from 'react';

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className='card'>
      <div className='flex justify-between items-start mb-2'>
        <h3 className={task.status==='completed' ? 'line-through text-gray-500' : 'font-semibold'}>{task.title}</h3>
        <span className='text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800'>{task.status}</span>
      </div>
      <p className='text-sm text-gray-600 mb-2'>{task.description}</p>
      <div className='text-xs text-gray-500 mb-2'>Assigned: <span className='font-semibold'>{task.assignedTo?.name || 'Unassigned'}</span></div>
      <div className='flex gap-2 justify-end mt-3'>
        <button onClick={()=>onEdit(task)} className='bg-yellow-400 text-white px-3 py-1 rounded'>Edit</button>
        <button onClick={()=>onDelete(task)} className='bg-red-500 text-white px-3 py-1 rounded'>Delete</button>
      </div>
    </div>
  );
}
