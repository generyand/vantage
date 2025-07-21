import PageHeader from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
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
        {/* UserManagementTable will be rendered here in a later task */}
        <div className="border rounded p-8 text-center text-muted-foreground">
          User management table coming soon...
        </div>
      </div>
    </div>
  );
} 