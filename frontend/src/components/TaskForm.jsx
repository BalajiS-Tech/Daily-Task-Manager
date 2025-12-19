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
      notifySuccess('Task created successfully');

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
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl p-5 shadow-sm mb-6"
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Create New Task
      </h3>

      {/* Title & Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          name="title"
          className="md:col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Task title *"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
        rows="3"
        className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Task description (optional)"
        value={form.description}
        onChange={handleChange}
      />

      {/* Assign to employee */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Assign to employee
        </label>
        <select
          name="assignedTo"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.assignedTo}
          onChange={handleChange}
        >
          <option value="">Unassigned</option>
          {data?.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Due date & Days */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <input
          type="date"
          name="dueDate"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.dueDate}
          onChange={handleChange}
        />

        <input
          type="number"
          name="daysToComplete"
          min="0"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Days to complete"
          value={form.daysToComplete}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading || !form.title.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
