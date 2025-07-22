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

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  onSubmit?: (values: { name: string; email: string; password: string; role: string }) => void;
}

export function UserForm({ open, onOpenChange, initialValues, onSubmit }: UserFormProps) {
  const [form, setForm] = React.useState({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    password: initialValues?.password || '',
    role: initialValues?.role || '',
  });

  React.useEffect(() => {
    setForm({
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      password: initialValues?.password || '',
      role: initialValues?.role || '',
    });
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required={!initialValues} />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" value={form.role} onChange={handleChange} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 