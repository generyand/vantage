import PageHeader from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
import UserListSection from '@/components/features/users/UserListSection';
import { cookies } from 'next/headers';
import { decodeJwtPayload } from '@/lib/api';

export default async function UserManagementPage() {
  // Read the auth-token from cookies (set by Zustand store)
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  let userRole: string | undefined;
  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && typeof payload.role === 'string') {
      userRole = payload.role;
    }
  }

  // Only allow SUPERADMIN or MLGOO_DILG
  if (userRole !== 'SUPERADMIN' && userRole !== 'MLGOO_DILG') {
    redirect('/dashboard');
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage users, roles, and assignments."
      />
      <div className="mt-8">
        <UserListSection />
      </div>
    </div>
  );
} 