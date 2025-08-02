import type { User } from '@vantage/shared/src/generated/schemas/users';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Building, Users } from 'lucide-react';
import { useBarangays } from '@/hooks/useBarangays';
import { useGovernanceAreas } from '@/hooks/useGovernanceAreas';
import type { Barangay, GovernanceArea } from '@vantage/shared';

interface UserManagementTableProps {
  users: User[];
  onEditUser?: (user: User) => void;
}

function humanizeRole(role: string) {
  switch (role) {
    case 'SUPERADMIN':
      return 'Superadmin';
    case 'MLGOO_DILG':
      return 'MLGOO DILG';
    case 'AREA_ASSESSOR':
      return 'Area Assessor';
    case 'BLGU_USER':
      return 'BLGU USER';
    default:
      // Capitalize and replace underscores with spaces for any other roles
      return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}

export default function UserManagementTable({ users, onEditUser }: UserManagementTableProps) {
  // Fetch barangays and governance areas data
  const { data: barangaysData } = useBarangays();
  const { data: governanceAreasData } = useGovernanceAreas();
  
  // Type assertions and create lookup maps
  const barangays = barangaysData as Barangay[] | undefined;
  const governanceAreas = governanceAreasData as GovernanceArea[] | undefined;
  
  const barangayMap = new Map(barangays?.map(b => [b.id, b.name]) || []);
  const governanceAreaMap = new Map(governanceAreas?.map(g => [g.id, g.name]) || []);

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div 
          key={user.id}
          className="bg-[var(--card)] border border-[var(--border)] rounded-sm p-6 hover:border-[var(--border)] hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-sm flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{user.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <Badge 
                  variant="outline"
                  className={`px-3 py-1 rounded-sm font-medium ${
                    user.role === 'SUPERADMIN' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' :
                    user.role === 'MLGOO_DILG' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                    user.role === 'AREA_ASSESSOR' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {humanizeRole(user.role)}
                </Badge>
                
                <Badge 
                  variant="outline"
                  className={`px-3 py-1 rounded-sm font-medium ${
                    user.is_active 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                      : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                
                {user.role === 'BLGU_USER' && user.barangay_id && (
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900/30 px-3 py-1 rounded-sm">
                    <Building className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {barangayMap.get(user.barangay_id) || `Barangay #${user.barangay_id}`}
                    </span>
                  </div>
                )}
                
                {user.role === 'AREA_ASSESSOR' && user.governance_area_id && (
                  <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-sm">
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {governanceAreaMap.get(user.governance_area_id) || `Area #${user.governance_area_id}`}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Additional Info */}
              <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                {user.phone_number && (
                  <span>📞 {user.phone_number}</span>
                )}
                {user.is_superuser && (
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-sm font-medium">
                    🔐 Superuser
                  </span>
                )}
                {user.must_change_password && (
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-sm font-medium">
                    🔄 Must Change Password
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditUser?.(user)}
                className="bg-[var(--background)] hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-sm font-medium transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--hover)] rounded-sm flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No users found</h3>
          <p className="text-[var(--muted-foreground)]">Get started by adding your first user account.</p>
        </div>
      )}
    </div>
  );
} 