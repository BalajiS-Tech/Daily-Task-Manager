import React, { useState } from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskCard from '../components/TaskCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { useQuery, useMutation, gql } from '@apollo/client';
import { notifySuccess, notifyError } from '../components/Notification.jsx';

const GET_TASKS = gql`
  query Tasks {
    tasks {
      id
      title
      description
      status
      dueDate
      assignedTo { id name }
      createdBy { id name }
    }
  }
`;

const DELETE_TASK = gql`
  mutation Delete($id: ID!) {
    deleteTask(id: $id)
  }
`;

export default function ManagerDashboard({ user }) {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleAdded = () => refetch();
  const handleDelete = (task) => {
    setToDelete(task);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask({ variables: { id: toDelete.id } });
      notifySuccess('Task deleted');
      refetch();
    } catch {
      notifyError('Delete failed');
    }
    setShowDialog(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  // 📊 Analytics calculations
  const total = data.tasks.length;
  const pending = data.tasks.filter(t => t.status === 'pending').length;
  const inProgress = data.tasks.filter(t => t.status === 'in_progress').length;
  const completed = data.tasks.filter(t => t.status === 'completed').length;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manager Dashboard</h2>

      {/* 📊 Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tasks" value={total} />
        <StatsCard title="Pending" value={pending} color="orange" />
        <StatsCard title="In Progress" value={inProgress} color="purple" />
        <StatsCard title="Completed" value={completed} color="green" />
      </div>

      {/* Task creation */}
      <TaskForm onAdded={handleAdded} />

      {/* Task list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ConfirmDialog
        open={showDialog}
        title="Delete Task?"
        message={`Delete "${toDelete?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDialog(false)}
      />
    </div>
  );
}
