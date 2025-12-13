import { gql } from '@apollo/client';

export const GET_TASKS = gql`query Tasks{ tasks{ id title description status dueDate assignedTo{ id name } createdBy{ id name } } }`;
export const GET_USERS = gql`query Users($role: String){ users(role: $role){ id name email } }`;
