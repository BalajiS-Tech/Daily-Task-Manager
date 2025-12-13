import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { signToken } from '../auth.js';

const SALT = 10;

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id).select('-passwordHash');
    },
    users: async (_, { role }) => {
      const filter = {};
      if (role) filter.role = role;
      return await User.find(filter).select('-passwordHash');
    },
    tasks: async (_, { status, assignedTo, category }) => {
      const filter = {};
      if (status) filter.status = status;
      if (assignedTo) filter.assignedTo = assignedTo;
      if (category) filter.category = category;
      return await Task.find(filter).sort({ createdAt: -1 }).populate('assignedTo').populate('createdBy');
    },
    task: async (_, { id }) => await Task.findById(id).populate('assignedTo').populate('createdBy'),
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password, role } = input;
      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already in use');
      const passwordHash = await bcrypt.hash(password, SALT);
      const user = new User({ name, email, passwordHash, role: role || 'employee' });
      await user.save();
      const token = signToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) throw new Error('Invalid credentials');
      const token = signToken(user);
      return { token, user };
    },

    addTask: async (_, { input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const task = new Task({
        title: input.title,
        description: input.description,
        category: input.category,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        daysToComplete: input.daysToComplete,
        assignedTo: input.assignedTo || null,
        createdBy: user.id,
      });
      await task.save();
      return await task.populate('assignedTo').populate('createdBy');
    },

    assignTask: async (_, { taskId, assignedTo }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const me = await User.findById(user.id);
      if (me.role !== 'manager') throw new Error('Only managers can assign tasks');
      const t = await Task.findByIdAndUpdate(taskId, { assignedTo }, { new: true }).populate('assignedTo').populate('createdBy');
      return t;
    },

    updateTaskStatus: async (_, { id, status, completedAt }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');
      const me = await User.findById(user.id);
      const isAllowed = (task.assignedTo && String(task.assignedTo) === String(user.id)) || String(task.createdBy) === String(user.id) || me.role === 'manager';
      if (!isAllowed) throw new Error('Not authorized');
      const update = { status };
      if (status === 'completed') update.completedAt = completedAt ? new Date(completedAt) : new Date();
      if (status !== 'completed') update.completedAt = null;
      const updated = await Task.findByIdAndUpdate(id, update, { new: true }).populate('assignedTo').populate('createdBy');
      return updated;
    },

    updateTask: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');
      const me = await User.findById(user.id);
      // Only manager or task's creator can update full task
      if (String(task.createdBy) !== String(user.id) && me.role !== 'manager') {
        throw new Error('Not authorized to edit this task');
      }
      const update = {
        title: input.title,
        description: input.description,
        category: input.category,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        daysToComplete: input.daysToComplete,
        assignedTo: input.assignedTo || null,
      };
      const updated = await Task.findByIdAndUpdate(id, update, { new: true }).populate('assignedTo').populate('createdBy');
      return updated;
    },

    deleteTask: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');
      const me = await User.findById(user.id);
      if (String(task.createdBy) !== String(user.id) && me.role !== 'manager') throw new Error('Not authorized to delete');
      await Task.findByIdAndDelete(id);
      return 'Task deleted';
    },
  },
};
