import PageHeader from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
import UserListSection from '@/components/features/users/UserListSection';
// import { useAuthStore } from '@/store/useAuthStore'; // Not used in server component

// TODO: Replace with actual server-side role check when available
async function checkAdminRole() {
  // Placeholder: implement real admin check using session/auth context
  // If not admin, redirect to dashboard
  // For now, always allow
  return true;
}

export default async function UserManagementPage() {
  const isAdmin = await checkAdminRole();
  if (!isAdmin) {
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