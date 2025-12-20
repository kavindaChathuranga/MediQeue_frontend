import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable';
import { UserRole } from '@/types';
import {
  Plus,
  Shield,
  User,
  Mail,
  Lock,
  Trash2,
  Edit,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

const mockUsers: SystemUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@mediqueue.com', role: 'admin', status: 'active', lastLogin: new Date() },
  { id: '2', name: 'Dr. Emily Chen', email: 'emily@mediqueue.com', role: 'doctor', status: 'active', lastLogin: new Date() },
  { id: '3', name: 'Sarah Reception', email: 'sarah@mediqueue.com', role: 'receptionist', status: 'active', lastLogin: new Date() },
  { id: '4', name: 'Mike Pharma', email: 'mike@mediqueue.com', role: 'pharmacist', status: 'active', lastLogin: new Date() },
  { id: '5', name: 'Jane Manager', email: 'jane@mediqueue.com', role: 'manager', status: 'inactive', lastLogin: new Date('2024-11-15') },
];

const roleColors: Record<UserRole, string> = {
  admin: 'bg-medical-violet/20 text-medical-violet border-medical-violet/30',
  doctor: 'bg-medical-blue/20 text-medical-blue border-medical-blue/30',
  receptionist: 'bg-medical-green/20 text-medical-green border-medical-green/30',
  pharmacist: 'bg-medical-orange/20 text-medical-orange border-medical-orange/30',
  manager: 'bg-medical-indigo/20 text-medical-indigo border-medical-indigo/30',
  patient: 'bg-muted text-muted-foreground',
};

export default function AdminUsers() {
  const [users] = useState<SystemUser[]>(mockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (item: SystemUser) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: SystemUser) => (
        <Badge variant="outline" className={roleColors[item.role]}>
          {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: SystemUser) => (
        <Badge
          variant="outline"
          className={
            item.status === 'active'
              ? 'bg-medical-green/20 text-medical-green border-medical-green/30'
              : 'bg-muted text-muted-foreground'
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (item: SystemUser) => (
        <span className="text-muted-foreground">
          {new Date(item.lastLogin).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: SystemUser) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new system user account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Temporary Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  toast({ title: 'User Created', description: 'New user account created successfully' });
                  setIsAddDialogOpen(false);
                }}
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(['admin', 'doctor', 'receptionist', 'pharmacist', 'manager'] as UserRole[]).map(
          (role) => {
            const count = users.filter((u) => u.role === role).length;
            return (
              <Card key={role}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      roleColors[role].split(' ')[0]
                    }`}
                  >
                    <Shield className={`h-5 w-5 ${roleColors[role].split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{role}s</p>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{users.length} total users</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users as unknown as Record<string, unknown>[]}
            columns={columns as any}
            searchKey="name"
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
