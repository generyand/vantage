'use client';

import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import type { UserListResponse, User, UserAdminCreate, UserAdminUpdate } from '@vantage/shared/src/generated/schemas/users';
import UserManagementTable from './UserManagementTable';
import { UserForm } from './UserForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePostUsers, usePutUsersUserId } from '@vantage/shared/src/generated/endpoints/users';
import { useQueryClient } from '@tanstack/react-query';

export default function UserListSection() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { data, isLoading, error } = useUsers() as { data?: UserListResponse, isLoading: boolean, error: unknown };
  
  const queryClient = useQueryClient();
  const createUserMutation = usePostUsers();
  const updateUserMutation = usePutUsersUserId();

  const handleCreateUser = (userData: UserAdminCreate) => {
    createUserMutation.mutate(
      { data: userData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          setIsFormOpen(false);
        },
        onError: (error) => {
          console.error('Failed to create user:', error);
          // TODO: Add proper error handling/toast notification
        },
      }
    );
  };

  const handleUpdateUser = (userData: UserAdminUpdate) => {
    if (!editingUser) return;
    
    updateUserMutation.mutate(
      { userId: editingUser.id, data: userData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          setIsFormOpen(false);
          setEditingUser(null);
        },
        onError: (error) => {
          console.error('Failed to update user:', error);
          // TODO: Add proper error handling/toast notification
        },
      }
    );
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error loading users.</div>;
  }
  if (!data || !data.users) {
    return <div>No users found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="flex items-center gap-2 px-4 py-2"
            size="default"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <UserManagementTable 
        users={data.users} 
        onEditUser={handleEditUser}
      />
      
      <UserForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        initialValues={editingUser ? {
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          phone_number: editingUser.phone_number || undefined,
          governance_area_id: editingUser.governance_area_id || undefined,
          barangay_id: editingUser.barangay_id || undefined,
          is_active: editingUser.is_active,
          is_superuser: editingUser.is_superuser,
          must_change_password: editingUser.must_change_password,
        } : undefined}
        onSubmit={(values) => {
          if (editingUser) {
            handleUpdateUser(values as UserAdminUpdate);
          } else {
            handleCreateUser(values as UserAdminCreate);
          }
        }}
        isEditing={!!editingUser}
      />
    </div>
  );
} 