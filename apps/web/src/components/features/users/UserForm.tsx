import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGovernanceAreas } from '@/hooks/useGovernanceAreas';
import { useBarangays } from '@/hooks/useBarangays';
import { UserRole, UserAdminCreate, UserAdminUpdate } from '@vantage/shared';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    phone_number?: string;
    governance_area_id?: number;
    barangay_id?: number;
    is_active?: boolean;
    is_superuser?: boolean;
    must_change_password?: boolean;
  };
  onSubmit?: (values: UserAdminCreate | UserAdminUpdate) => void;
  isEditing?: boolean;
}

export function UserForm({ open, onOpenChange, initialValues, onSubmit, isEditing = false }: UserFormProps) {
  const [form, setForm] = React.useState({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    password: initialValues?.password || '',
    role: initialValues?.role || UserRole.BLGU_USER,
    phone_number: initialValues?.phone_number || '',
    governance_area_id: initialValues?.governance_area_id || null,
    barangay_id: initialValues?.barangay_id || null,
    is_active: initialValues?.is_active ?? true,
    is_superuser: initialValues?.is_superuser ?? false,
    must_change_password: initialValues?.must_change_password ?? true,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Fetch governance areas and barangays data
  const { data: governanceAreas, isLoading: isLoadingGovernanceAreas } = useGovernanceAreas();
  const { data: barangays, isLoading: isLoadingBarangays } = useBarangays();

  React.useEffect(() => {
    setForm({
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      password: initialValues?.password || '',
      role: initialValues?.role || UserRole.BLGU_USER,
      phone_number: initialValues?.phone_number || '',
      governance_area_id: initialValues?.governance_area_id || null,
      barangay_id: initialValues?.barangay_id || null,
      is_active: initialValues?.is_active ?? true,
      is_superuser: initialValues?.is_superuser ?? false,
      must_change_password: initialValues?.must_change_password ?? true,
    });
    setErrors({}); // Clear errors when form is reset
  }, [initialValues, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ 
      ...prev, 
      [name]: value === '' ? null : value 
    }));
  };

  const handleRoleChange = (role: string) => {
    setForm((prev) => ({ 
      ...prev, 
      role: role as UserRole,
      // Clear area assignments when role changes
      governance_area_id: role === UserRole.AREA_ASSESSOR ? prev.governance_area_id : null,
      barangay_id: role === UserRole.BLGU_USER ? prev.barangay_id : null,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!isEditing && !form.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      // For editing, exclude password if not provided
      const updateData: UserAdminUpdate = {
        name: form.name || null,
        email: form.email || null,
        role: form.role,
        phone_number: form.phone_number || null,
        governance_area_id: form.governance_area_id,
        barangay_id: form.barangay_id,
        is_active: form.is_active,
        is_superuser: form.is_superuser,
        must_change_password: form.must_change_password,
      };
      onSubmit?.(updateData);
    } else {
      // For creating, include password
      const createData: UserAdminCreate = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone_number: form.phone_number || null,
        governance_area_id: form.governance_area_id,
        barangay_id: form.barangay_id,
        is_active: form.is_active,
        is_superuser: form.is_superuser,
        must_change_password: form.must_change_password,
      };
      onSubmit?.(createData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Edit User' : 'Add User'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={form.name} 
                onChange={handleInputChange} 
                required 
                className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleInputChange} 
                required 
                className={`mt-1 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditing && (
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleInputChange} 
                  required 
                  className={`mt-1 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            )}
            
            <div>
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value={UserRole.BLGU_USER}>BLGU User</SelectItem>
                  <SelectItem value={UserRole.AREA_ASSESSOR}>Area Assessor</SelectItem>
                  <SelectItem value={UserRole.MLGOO_DILG}>MLGOO-DILG</SelectItem>
                  <SelectItem value={UserRole.SUPERADMIN}>Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
              <Input 
                id="phone_number" 
                name="phone_number" 
                value={form.phone_number} 
                onChange={handleInputChange} 
                className="mt-1"
              />
            </div>
            
            {/* Conditional dropdown for BLGU User role */}
            {form.role === UserRole.BLGU_USER && (
              <div>
                <Label htmlFor="barangay_id" className="text-sm font-medium">Assigned Barangay</Label>
                <Select 
                  value={form.barangay_id?.toString() || ''} 
                  onValueChange={(value) => handleSelectChange('barangay_id', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a barangay" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {isLoadingBarangays ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : barangays ? (
                      barangays.map((barangay) => (
                        <SelectItem key={barangay.id} value={barangay.id.toString()}>
                          {barangay.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No barangays available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Conditional dropdown for Area Assessor role */}
            {form.role === UserRole.AREA_ASSESSOR && (
              <div>
                <Label htmlFor="governance_area_id" className="text-sm font-medium">Assigned Governance Area</Label>
                <Select 
                  value={form.governance_area_id?.toString() || ''} 
                  onValueChange={(value) => handleSelectChange('governance_area_id', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a governance area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {isLoadingGovernanceAreas ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : governanceAreas ? (
                      governanceAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name} ({area.area_type})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No governance areas available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">User Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_active" className="text-sm">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_superuser"
                  name="is_superuser"
                  checked={form.is_superuser}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_superuser" className="text-sm">Super User</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="must_change_password"
                  name="must_change_password"
                  checked={form.must_change_password}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="must_change_password" className="text-sm">Must Change Password</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 