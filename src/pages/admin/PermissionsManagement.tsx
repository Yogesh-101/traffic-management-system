import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Key, Plus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual API calls
const mockPermissions = [
  {
    id: 1,
    name: 'view_dashboard',
    description: 'Access to view the main dashboard',
    category: 'View',
    roles: ['Administrator', 'Manager', 'Operator'],
  },
  {
    id: 2,
    name: 'manage_users',
    description: 'Create, edit, and delete users',
    category: 'Administration',
    roles: ['Administrator'],
  },
  {
    id: 3,
    name: 'manage_traffic',
    description: 'Control traffic signals and manage flow',
    category: 'Traffic Control',
    roles: ['Administrator', 'Manager'],
  },
  {
    id: 4,
    name: 'report_incidents',
    description: 'Create and update traffic incidents',
    category: 'Incidents',
    roles: ['Administrator', 'Manager', 'Operator'],
  },
  {
    id: 5,
    name: 'view_reports',
    description: 'Access to traffic reports and analytics',
    category: 'Reports',
    roles: ['Administrator', 'Manager'],
  },
];

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [selectedRole, setSelectedRole] = useState('Administrator');

  const handlePermissionToggle = (permissionId: number, role: string) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission => {
        if (permission.id === permissionId) {
          const roles = permission.roles.includes(role)
            ? permission.roles.filter(r => r !== role)
            : [...permission.roles, role];
          return { ...permission, roles };
        }
        return permission;
      })
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Permissions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Role:</span>
              <select
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {permission.roles.map((role, index) => (
                        <Badge key={index} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={permission.roles.includes(selectedRole)}
                      onCheckedChange={() =>
                        handlePermissionToggle(permission.id, selectedRole)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManagement; 