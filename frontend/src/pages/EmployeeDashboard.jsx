import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import TaskCard from '../components/TaskCard.jsx';
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
  const { loading, error, data, refetch } = useQuery(GET_MY_TASKS, {
    variables: { assignedTo: user.id }
  });

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus({ variables: { id: taskId, status } });
      notifySuccess('Status updated');
      refetch();
    } catch (err) {
      notifyError('Failed to update status');
    }
  };

  if (loading) return <p>Loading my tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>

      {data.tasks.length === 0 ? (
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
