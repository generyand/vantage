import DataTable, { Column } from '@/components/shared/DataTable';
import type { User } from '@vantage/shared/src/generated/schemas/users';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface UserManagementTableProps {
  users: User[];
  onEditUser?: (user: User) => void;
}

type UserTableRow = Record<string, unknown> & User;

export default function UserManagementTable({ users, onEditUser }: UserManagementTableProps) {
  const columns: Column<UserTableRow>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'assigned',
      label: 'Assigned Barangay/Area',
      render: (_: unknown, user: UserTableRow) => {
        if (user.role === 'BLGU_USER') {
          return user.barangay_id ? `Barangay #${user.barangay_id}` : '-';
        }
        if (user.role === 'AREA_ASSESSOR') {
          return user.governance_area_id ? `Area #${user.governance_area_id}` : '-';
        }
        return '-';
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: unknown) => (
        <span className={value ? 'text-green-600' : 'text-gray-400'}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, user: UserTableRow) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditUser?.(user)}
          className="flex items-center gap-1 hover:bg-gray-50"
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={users as unknown as UserTableRow[]}
      columns={columns}
      emptyMessage="No users found."
    />
  );
} 