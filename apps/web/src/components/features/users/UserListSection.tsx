'use client';

import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import type { UserListResponse } from '@vantage/shared/src/generated/schemas/users';

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

  // Placeholder: show user count
  return (
    <div className="border rounded p-8 text-center text-muted-foreground">
      {`Total users: ${data.users.length}`}
    </div>
  );
} 