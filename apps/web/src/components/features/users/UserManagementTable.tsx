import DataTable, { Column } from '@/components/shared/DataTable';
import type { User } from '@vantage/shared/src/generated/schemas/users';

interface UserManagementTableProps {
  users: User[];
}

type UserTableRow = Record<string, unknown> & User;

export default function UserManagementTable({ users }: UserManagementTableProps) {
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
          return user.assessor_area ? `Area #${user.assessor_area}` : '-';
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
  ];

  return (
    <DataTable
      data={users as unknown as UserTableRow[]}
      columns={columns}
      emptyMessage="No users found."
    />
  );
} 