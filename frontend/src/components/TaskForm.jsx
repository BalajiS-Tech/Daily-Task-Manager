import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { notifySuccess, notifyError } from './Notification.jsx';

const ADD_TASK = gql`mutation AddTask($input: TaskInput!){ addTask(input: $input){ id title } }`;

export default function TaskForm({ onAdded }) {
  const [form, setForm] = useState({ title:'', description:'', category:'Work', dueDate:'', daysToComplete:0, assignedTo:'' });
  const [addTask, { loading }] = useMutation(ADD_TASK);

  const handle = async (e) => {
    e.preventDefault();
    try {
      await addTask({ variables: { input: { ...form, assignedTo: form.assignedTo || null } } });
      notifySuccess('Task added');
      setForm({ title:'', description:'', category:'Work', dueDate:'', daysToComplete:0, assignedTo:'' });
      onAdded && onAdded();
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <form onSubmit={handle} className='card mb-6'>
      <div className='flex gap-3 mb-3'>
        <input className='flex-1 p-2 border rounded' placeholder='Title' value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required />
        <select className='p-2 border rounded' value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
          <option>Work</option><option>Personal</option><option>Urgent</option>
        </select>
      </div>
      <textarea className='w-full p-2 border rounded mb-3' placeholder='Description' value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
      <div className='flex gap-3 items-center'>
        <input type='date' className='p-2 border rounded' value={form.dueDate} onChange={(e)=>setForm({...form, dueDate:e.target.value})} />
        <input type='number' min='0' className='p-2 border rounded w-40' placeholder='Days' value={form.daysToComplete} onChange={(e)=>setForm({...form, daysToComplete:e.target.value})} />
        <button className='ml-auto bg-primary text-white px-4 py-2 rounded'>{loading ? 'Adding...' : 'Add Task'}</button>
      </div>
    </form>
  );
}
