import React, { useState } from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskCard from '../components/TaskCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useQuery, useMutation, gql } from '@apollo/client';
import { notifySuccess, notifyError } from '../components/Notification.jsx';

const GET_TASKS = gql`query Tasks{ tasks{ id title description status dueDate assignedTo{ id name } createdBy{ id name } } }`;
const DELETE_TASK = gql`mutation Delete($id: ID!){ deleteTask(id: $id) }`;

export default function EmployeeDashboard({ user }) {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [editing, setEditing] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleAdded = () => refetch();

  const handleDelete = (task) => {
    // only allow deleting if user created the task or user is manager
    const current = localStorage.getItem('taskmanager_user');
    const me = current ? JSON.parse(current) : null;
    if (!me) return notifyError('Not authorized');
    if (String(task.createdBy?.id || task.createdBy) !== String(me.id) && me.role !== 'manager') {
      return notifyError('You cannot delete manager-assigned task');
    }
    setToDelete(task); setShowDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask({ variables: { id: toDelete.id } });
      notifySuccess('Task deleted');
      refetch();
    } catch (err) { notifyError('Delete failed'); }
    setShowDialog(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>Employee Dashboard</h2>
      <TaskForm onAdded={handleAdded} />
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {data.tasks.map(t => <TaskCard key={t.id} task={t} onEdit={setEditing} onDelete={handleDelete} />)}
      </div>

      <ConfirmDialog open={showDialog} title='Delete Task?' message={`Delete "${toDelete?.title}"?`} onConfirm={confirmDelete} onCancel={()=>setShowDialog(false)} />
    </div>
  );
}
