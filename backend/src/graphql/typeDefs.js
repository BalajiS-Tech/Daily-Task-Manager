import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
    category: String
    status: String
    assignedTo: User
    createdBy: User
    dueDate: String
    daysToComplete: Int
    completedAt: String
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    role: String
  }

  input TaskInput {
    title: String!
    description: String
    category: String
    dueDate: String
    daysToComplete: Int
    assignedTo: ID
  }

  type Query {
    me: User
    users(role: String): [User!]
    tasks(status: String, assignedTo: ID, category: String): [Task!]
    task(id: ID!): Task
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    addTask(input: TaskInput!): Task
    assignTask(taskId: ID!, assignedTo: ID!): Task
    updateTaskStatus(id: ID!, status: String!, completedAt: String): Task
    updateTask(id: ID!, input: TaskInput!): Task
    deleteTask(id: ID!): String
  }
`;
