import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import TaskCard from '../components/TaskCard.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { notifyError, notifySuccess } from '../components/Notification.jsx';

const GET_MY_TASKS = gql`
  query MyTasks($assignedTo: ID!) {
    tasks(assignedTo: $assignedTo) {
      id
      title
      description
      status
      dueDate
      createdBy { id name }
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function EmployeeDashboard({ user }) {
  const userId = String(user.id || user._id);

  const { loading, error, data, refetch } = useQuery(GET_MY_TASKS, {
    variables: { assignedTo: userId }
  });

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus({ variables: { id: taskId, status } });
      notifySuccess('Status updated');
      refetch();
    } catch {
      notifyError('Failed to update status');
    }
  };

  if (loading) return <p>Loading my tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  // 📊 Analytics
  const total = data.tasks.length;
  const pending = data.tasks.filter(t => t.status === 'pending').length;
  const inProgress = data.tasks.filter(t => t.status === 'in_progress').length;
  const completed = data.tasks.filter(t => t.status === 'completed').length;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>

      {/* 📊 Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tasks" value={total} />
        <StatsCard title="Pending" value={pending} color="orange" />
        <StatsCard title="In Progress" value={inProgress} color="purple" />
        <StatsCard title="Completed" value={completed} color="green" />
      </div>

      {/* Task list */}
      {total === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              employeeView
            />
          ))}
        </div>
      )}
    </div>
  );
}
