'use client';

import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import type { UserListResponse } from '@vantage/shared/src/generated/schemas/users';
import UserManagementTable from './UserManagementTable';

export default function UserListSection() {
  const { data, isLoading, error } = useUsers() as { data?: UserListResponse, isLoading: boolean, error: unknown };

  if (isLoading) {
    return <div>Loading users...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error loading users.</div>;
  }
  if (!data || !data.users) {
    return <div>No users found.</div>;
  }

  return <UserManagementTable users={data.users} />;
} 