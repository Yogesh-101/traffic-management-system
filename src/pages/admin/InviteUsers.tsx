import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Mail, Shield, Send, Clock, Check, X, RefreshCw, Users, FileText, Copy, Trash2, Plus, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Mock data for invitations
const mockInvitations = [
  {
    id: 1,
    email: 'traffic@example.com',
    role: 'Manager',
    status: 'pending',
    sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    customMessage: 'Welcome to our traffic management team!',
    permissions: ['view_reports', 'manage_traffic'],
    department: 'Traffic Operations',
    location: 'Headquarters',
  },
  {
    id: 2,
    email: 'operator@example.com',
    role: 'Operator',
    status: 'accepted',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    customMessage: 'Looking forward to working with you!',
    permissions: ['monitor_traffic', 'report_incidents'],
    department: 'Traffic Control',
    location: 'Regional Office',
  },
  {
    id: 3,
    email: 'analyst@example.com',
    role: 'Analyst',
    status: 'expired',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    customMessage: 'Join our data analysis team!',
    permissions: ['view_reports', 'analyze_data'],
    department: 'Data Analysis',
    location: 'Research Center',
  },
];

const InviteUsers = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    message: '',
    sendEmail: true,
    customExpiry: false,
    expiryDays: 7,
    department: '',
    location: '',
    bulkInvite: false,
    bulkEmails: '',
  });
  const [invitations, setInvitations] = useState(mockInvitations);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('send');
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSending(true);
      // Here you would typically make an API call to send the invitation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newInvitation = {
        id: invitations.length + 1,
        email: formData.email,
        role: formData.role,
        status: 'pending',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * formData.expiryDays),
        customMessage: formData.message,
        permissions: getDefaultPermissions(formData.role),
        department: formData.department,
        location: formData.location,
      };
      
      setInvitations([newInvitation, ...invitations]);
      setFormData({ ...formData, email: '', role: '', message: '', department: '', location: '' });
      toast.success('Invitation sent successfully!');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsSending(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSending(true);
      const emails = formData.bulkEmails.split('\n').filter(email => email.trim());
      
      // Here you would typically make an API call to send bulk invitations
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newInvitations = emails.map((email, index) => ({
        id: invitations.length + index + 1,
        email: email.trim(),
        role: formData.role,
        status: 'pending',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * formData.expiryDays),
        customMessage: formData.message,
        permissions: getDefaultPermissions(formData.role),
        department: formData.department,
        location: formData.location,
      }));
      
      setInvitations([...newInvitations, ...invitations]);
      setFormData({ ...formData, bulkEmails: '' });
      toast.success(`${emails.length} invitations sent successfully!`);
    } catch (error) {
      toast.error('Failed to send bulk invitations');
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async (id: number) => {
    try {
      // Here you would typically make an API call to resend the invitation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Invitation resent successfully!');
    } catch (error) {
      toast.error('Failed to resend invitation');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Here you would typically make an API call to delete the invitation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast.success('Invitation deleted successfully!');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete invitation');
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      message: template,
    });
  };

  const handleExportInvitations = () => {
    // Here you would typically generate and download a CSV file
    const csvContent = invitations.map(inv => 
      `${inv.email},${inv.role},${inv.status},${inv.sentAt},${inv.expiresAt}`
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Invitations exported successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary">Accepted</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case 'Administrator':
        return ['all'];
      case 'Manager':
        return ['view_reports', 'manage_traffic', 'view_users'];
      case 'Operator':
        return ['monitor_traffic', 'report_incidents'];
      case 'Analyst':
        return ['view_reports', 'analyze_data'];
      default:
        return [];
    }
  };

  const copyInvitationLink = (id: number) => {
    // Here you would typically generate a unique invitation link
    const link = `https://smartflow.com/invite/${id}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invite Users</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportInvitations}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsBulkUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Invitation</TabsTrigger>
          <TabsTrigger value="history">Invitation History</TabsTrigger>
          <TabsTrigger value="templates">Invitation Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send New Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formData.bulkInvite ? handleBulkSubmit : handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bulkInvite">Bulk Invite</Label>
                  <Switch
                    id="bulkInvite"
                    checked={formData.bulkInvite}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, bulkInvite: checked })
                    }
                  />
                </div>

                {formData.bulkInvite ? (
                  <div className="space-y-2">
                    <Label htmlFor="bulkEmails">Email Addresses (one per line)</Label>
                    <Textarea
                      id="bulkEmails"
                      placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                      value={formData.bulkEmails}
                      onChange={(e) =>
                        setFormData({ ...formData, bulkEmails: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        className="pl-8"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Administrator
                        </div>
                      </SelectItem>
                      <SelectItem value="Manager">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Manager
                        </div>
                      </SelectItem>
                      <SelectItem value="Operator">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Operator
                        </div>
                      </SelectItem>
                      <SelectItem value="Analyst">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Analyst
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message to the invitation"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sendEmail">Send Email Notification</Label>
                    <Switch
                      id="sendEmail"
                      checked={formData.sendEmail}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, sendEmail: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="customExpiry">Custom Expiry Date</Label>
                    <Switch
                      id="customExpiry"
                      checked={formData.customExpiry}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, customExpiry: checked })
                      }
                    />
                  </div>

                  {formData.customExpiry && (
                    <div className="space-y-2">
                      <Label htmlFor="expiryDays">Expiry in Days</Label>
                      <Input
                        id="expiryDays"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.expiryDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expiryDays: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {formData.bulkInvite ? 'Send Bulk Invitations' : 'Send Invitation'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Invitation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-traffic-primary/10 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-traffic-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Invited as {invitation.role}
                          </p>
                          {getStatusBadge(invitation.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sent {formatDistanceToNow(invitation.sentAt)} ago
                        </p>
                        {invitation.status === 'pending' && (
                          <p className="text-xs text-muted-foreground">
                            Expires {formatDistanceToNow(invitation.expiresAt)} from now
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {invitation.department} - {invitation.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {invitation.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyInvitationLink(invitation.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResend(invitation.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Resend
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvitation(invitation);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      {getStatusIcon(invitation.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <h3 className="font-medium">Default Manager Template</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Welcome to our traffic management team! We're excited to have you join us as a Manager. You'll have access to traffic reports, user management, and system configuration.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTemplateSelect("Welcome to our traffic management team! We're excited to have you join us as a Manager. You'll have access to traffic reports, user management, and system configuration.")}
                  >
                    Use Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <h3 className="font-medium">Default Operator Template</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Welcome to our traffic management team! As an Operator, you'll be responsible for monitoring traffic conditions and reporting incidents in real-time.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTemplateSelect("Welcome to our traffic management team! As an Operator, you'll be responsible for monitoring traffic conditions and reporting incidents in real-time.")}
                  >
                    Use Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <h3 className="font-medium">Default Analyst Template</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Welcome to our data analysis team! As an Analyst, you'll be working with traffic data to identify patterns, generate reports, and provide insights for traffic management decisions.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTemplateSelect("Welcome to our data analysis team! As an Analyst, you'll be working with traffic data to identify patterns, generate reports, and provide insights for traffic management decisions.")}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Invitation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invitation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Email: {selectedInvitation?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Role: {selectedInvitation?.role}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(selectedInvitation?.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Invitations</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing email addresses and other details for bulk invitations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop your CSV file here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                CSV format: email,role,department,location
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Here you would typically handle the file upload
              toast.success('File uploaded successfully!');
              setIsBulkUploadDialogOpen(false);
            }}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteUsers; 