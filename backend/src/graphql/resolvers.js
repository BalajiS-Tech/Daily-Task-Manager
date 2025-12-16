import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { signToken } from '../auth.js';

const SALT = 10;

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return User.findById(user.id).select('-passwordHash');
    },

    users: async (_, { role }) => {
      const filter = role ? { role } : {};
      return User.find(filter).select('-passwordHash');
    },

    tasks: async (_, { status, assignedTo, category }) => {
      const filter = {};
      if (status) filter.status = status;
      if (assignedTo) filter.assignedTo = assignedTo;
      if (category) filter.category = category;

      const tasks = await Task.find(filter).sort({ createdAt: -1 });
      await Task.populate(tasks, ['assignedTo', 'createdBy']);
      return tasks;
    },

    task: async (_, { id }) => {
      const task = await Task.findById(id);
      if (!task) return null;
      await task.populate(['assignedTo', 'createdBy']);
      return task;
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password, role } = input;

      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already in use');

      const passwordHash = await bcrypt.hash(password, SALT);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: role || 'employee',
      });

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
      if (!input.title?.trim()) throw new Error('Task title is required');

      const task = await Task.create({
        title: input.title.trim(),
        description: input.description || '',
        category: input.category || 'General',
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        daysToComplete: input.daysToComplete,
        assignedTo: input.assignedTo || null,
        createdBy: user.id,
      });

      await task.populate(['assignedTo', 'createdBy']);
      return task;
    },

    assignTask: async (_, { taskId, assignedTo }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const me = await User.findById(user.id);
      if (me.role !== 'manager') {
        throw new Error('Only managers can assign tasks');
      }

      const task = await Task.findByIdAndUpdate(
        taskId,
        { assignedTo },
        { new: true }
      );

      if (!task) throw new Error('Task not found');

      await task.populate(['assignedTo', 'createdBy']);
      return task;
    },

    updateTaskStatus: async (_, { id, status, completedAt }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');

      const me = await User.findById(user.id);
      const isAllowed =
        String(task.createdBy) === String(user.id) ||
        String(task.assignedTo) === String(user.id) ||
        me.role === 'manager';

      if (!isAllowed) throw new Error('Not authorized');

      task.status = status;
      task.completedAt =
        status === 'completed'
          ? completedAt
            ? new Date(completedAt)
            : new Date()
          : null;

      await task.save();
      await task.populate(['assignedTo', 'createdBy']);
      return task;
    },

    updateTask: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');

      const me = await User.findById(user.id);
      if (
        String(task.createdBy) !== String(user.id) &&
        me.role !== 'manager'
      ) {
        throw new Error('Not authorized to edit this task');
      }

      Object.assign(task, {
        title: input.title ?? task.title,
        description: input.description ?? task.description,
        category: input.category ?? task.category,
        dueDate: input.dueDate ? new Date(input.dueDate) : task.dueDate,
        daysToComplete: input.daysToComplete ?? task.daysToComplete,
        assignedTo: input.assignedTo ?? task.assignedTo,
      });

      await task.save();
      await task.populate(['assignedTo', 'createdBy']);
      return task;
    },

    deleteTask: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');

      const me = await User.findById(user.id);
      if (
        String(task.createdBy) !== String(user.id) &&
        me.role !== 'manager'
      ) {
        throw new Error('Not authorized to delete');
      }

      await Task.findByIdAndDelete(id);
      return 'Task deleted';
    },
  },
};
