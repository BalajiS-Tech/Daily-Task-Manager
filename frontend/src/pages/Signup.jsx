import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { notifySuccess, notifyError } from '../components/Notification.jsx';

const SIGNUP = gql`mutation Signup($input:SignupInput!){ signup(input:$input){ token user{ id name email role } } }`;

export default function Signup({ onSignup }) {
  const [form,setForm] = useState({ name:'', email:'', password:'', role:'employee' });
  const [signup,{ loading }] = useMutation(SIGNUP);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ variables: { input: form } });
      localStorage.setItem('taskmanager_token', data.signup.token);
      localStorage.setItem('taskmanager_user', JSON.stringify(data.signup.user));
      notifySuccess('Account created');
      navigate('/dashboard');
      onSignup && onSignup(data.signup.user, data.signup.token);
    } catch (err) {
      notifyError(err.message.replace('GraphQL error: ', ''));
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[60vh]'>
      <form onSubmit={handle} className='w-full max-w-md bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Sign up</h2>
        <input className='w-full p-2 border mb-3' placeholder='Full name' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input className='w-full p-2 border mb-3' placeholder='Email' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className='w-full p-2 border mb-3' type='password' placeholder='Password' value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <select className='w-full p-2 border mb-3' value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value='employee'>Employee</option>
          <option value='manager'>Manager</option>
        </select>
        <button className='w-full bg-green-600 text-white py-2 rounded'>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  );
}
