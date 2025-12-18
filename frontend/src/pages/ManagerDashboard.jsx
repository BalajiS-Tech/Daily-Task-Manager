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
      assignedTo { id name }
    }
    users(role: "employee") {
      id
      name
    }
  }
`;

const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $assignedTo: ID!) {
    assignTask(taskId: $taskId, assignedTo: $assignedTo) {
      id
      assignedTo { id name }
    }
  }
`;

const DELETE_TASK = gql`
  mutation Delete($id: ID!) {
    deleteTask(id: $id)
  }
`;

export default function ManagerDashboard() {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [assignTask] = useMutation(ASSIGN_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  const handleAssign = async (taskId, userId) => {
    try {
      await assignTask({ variables: { taskId, assignedTo: userId } });
      notifySuccess('Task assigned');
      refetch();
    } catch {
      notifyError('Assignment failed');
    }
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

  const { tasks, users } = data;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manager Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total" value={tasks.length} />
        <StatsCard title="Pending" value={tasks.filter(t => t.status === 'pending').length} />
        <StatsCard title="In Progress" value={tasks.filter(t => t.status === 'in_progress').length} />
        <StatsCard title="Completed" value={tasks.filter(t => t.status === 'completed').length} />
      </div>

      <TaskForm onAdded={refetch} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            users={users}
            onAssign={handleAssign}
            onDelete={(t) => { setToDelete(t); setShowDialog(true); }}
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
