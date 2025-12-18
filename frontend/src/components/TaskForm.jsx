import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { notifySuccess, notifyError } from './Notification.jsx';

/* 🔹 Get employees */
const GET_EMPLOYEES = gql`
  query GetEmployees {
    users(role: "employee") {
      id
      name
      email
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($input: TaskInput!) {
    addTask(input: $input) {
      id
      title
      status
      assignedTo { id name }
      createdAt
    }
  }
`;

export default function TaskForm({ onAdded }) {
  const { data } = useQuery(GET_EMPLOYEES);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Work',
    dueDate: '',
    daysToComplete: '',
    assignedTo: '',
  });

  const [addTask, { loading }] = useMutation(ADD_TASK);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const input = {
      title: form.title.trim(),
      description: form.description || null,
      category: form.category,
      dueDate: form.dueDate || null,
      daysToComplete: form.daysToComplete
        ? Number(form.daysToComplete)
        : null,
      assignedTo: form.assignedTo || null,
    };

    if (!input.title) {
      notifyError('Title is required');
      return;
    }

    try {
      await addTask({ variables: { input } });
      notifySuccess('Task added & assigned successfully');

      setForm({
        title: '',
        description: '',
        category: 'Work',
        dueDate: '',
        daysToComplete: '',
        assignedTo: '',
      });

      onAdded && onAdded();
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6 p-4 border rounded">
      {/* Title & Category */}
      <div className="flex gap-3 mb-3">
        <input
          name="title"
          className="flex-1 p-2 border rounded"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="p-2 border rounded"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Description */}
      <textarea
        name="description"
        className="w-full p-2 border rounded mb-3"
        placeholder="Task description"
        value={form.description}
        onChange={handleChange}
      />

      {/* Assign to employee */}
      <select
        name="assignedTo"
        className="w-full p-2 border rounded mb-3"
        value={form.assignedTo}
        onChange={handleChange}
      >
        <option value="">Assign to employee (optional)</option>
        {data?.users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Due date & Days */}
      <div className="flex gap-3 items-center">
        <input
          type="date"
          name="dueDate"
          className="p-2 border rounded"
          value={form.dueDate}
          onChange={handleChange}
        />

        <input
          type="number"
          name="daysToComplete"
          min="0"
          className="p-2 border rounded w-40"
          placeholder="Days"
          value={form.daysToComplete}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading || !form.title.trim()}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
