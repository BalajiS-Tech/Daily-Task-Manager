import React from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-80'>
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        <p className='text-gray-600 mb-4'>{message}</p>
        <div className='flex justify-end gap-3'>
          <button onClick={onCancel} className='px-4 py-1 rounded bg-gray-300 hover:bg-gray-400'>Cancel</button>
          <button onClick={onConfirm} className='px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white'>Confirm</button>
        </div>
      </div>
    </div>
  );
}
