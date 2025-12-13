import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { notifySuccess, notifyError } from '../components/Notification.jsx';

const LOGIN = gql`mutation Login($email:String!,$password:String!){ login(email:$email,password:$password){ token user{ id name email role } } }`;

export default function Login({ onLogin }) {
  const [form,setForm] = useState({ email:'', password:'' });
  const [login,{ loading }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email: form.email, password: form.password } });
      localStorage.setItem('taskmanager_token', data.login.token);
      localStorage.setItem('taskmanager_user', JSON.stringify(data.login.user));
      notifySuccess('Logged in');
      navigate('/dashboard');
      onLogin && onLogin(data.login.user, data.login.token);
    } catch (err) {
      notifyError(err.message.replace('GraphQL error: ', ''));
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[60vh]'>
      <form onSubmit={handle} className='w-full max-w-md bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Login</h2>
        <input className='w-full p-2 border mb-3' placeholder='Email' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className='w-full p-2 border mb-3' type='password' placeholder='Password' value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button className='w-full bg-blue-600 text-white py-2 rounded'>{loading ? 'Logging...' : 'Login'}</button>
      </form>
    </div>
  );
}
