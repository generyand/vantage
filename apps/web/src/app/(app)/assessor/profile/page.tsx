import { PageHeader } from "@/components/shared";

export default function AssessorProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your account settings and profile information"
      />
      
      <div className="mt-8 space-y-6">
        {/* Profile Information */}
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>aa
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Full Name
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                Area Assessor
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                assessor@example.com
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Role
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                Area Assessor
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Assigned Area
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                Region IV-A (CALABARZON)
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Account Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--foreground)]">Change Password</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Update your account password for security
                </p>
              </div>
              <button className="bg-[var(--cityscape-yellow)] text-[var(--cityscape-accent-foreground)] px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--cityscape-yellow-dark)] transition-colors">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[var(--foreground)]">Notification Settings</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Manage your email and notification preferences
                </p>
              </div>
              <button className="bg-[var(--cityscape-yellow)] text-[var(--cityscape-accent-foreground)] px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--cityscape-yellow-dark)] transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Statistics */}
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Assessment Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--cityscape-yellow)] mb-2">0</div>
              <div className="text-sm text-[var(--text-secondary)]">Assessments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">0</div>
              <div className="text-sm text-[var(--text-secondary)]">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
              <div className="text-sm text-[var(--text-secondary)]">Days Active</div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Last Login
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                Never
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Account Created
              </label>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)]">
                Not available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 