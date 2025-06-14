
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Settings, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw, 
  Bell, 
  Shield,
  Database,
  Zap
} from 'lucide-react';

export const QuickActions = () => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: UserPlus,
      action: 'add-user',
      variant: 'default' as const
    },
    {
      title: 'Export Data',
      description: 'Download system reports',
      icon: Download,
      action: 'export',
      variant: 'outline' as const
    },
    {
      title: 'Import Users',
      description: 'Bulk upload user data',
      icon: Upload,
      action: 'import',
      variant: 'outline' as const
    },
    {
      title: 'System Backup',
      description: 'Create full system backup',
      icon: Database,
      action: 'backup',
      variant: 'outline' as const
    },
    {
      title: 'Send Notification',
      description: 'Broadcast to all users',
      icon: Bell,
      action: 'notify',
      variant: 'outline' as const
    },
    {
      title: 'Security Scan',
      description: 'Run vulnerability check',
      icon: Shield,
      action: 'security',
      variant: 'outline' as const
    },
    {
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: FileText,
      action: 'report',
      variant: 'outline' as const
    },
    {
      title: 'Restart Services',
      description: 'Restart system services',
      icon: RefreshCw,
      action: 'restart',
      variant: 'destructive' as const
    }
  ];

  const handleAction = async (action: string) => {
    switch (action) {
      case 'export':
        toast({
          title: "Export Started",
          description: "Your data export is being prepared. You'll receive a download link via email.",
        });
        break;
      
      case 'import':
        // Trigger file upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            toast({
              title: "Import Started",
              description: `Processing ${file.name}. This may take a few minutes.`,
            });
          }
        };
        input.click();
        break;
      
      case 'backup':
        toast({
          title: "Backup Initiated",
          description: "System backup is running in the background. Estimated completion: 10 minutes.",
        });
        break;
      
      case 'notify':
        toast({
          title: "Notification Sent",
          description: "Broadcast notification has been sent to all active users.",
        });
        break;
      
      case 'security':
        toast({
          title: "Security Scan Started",
          description: "Running comprehensive security audit. Results will be available in 5 minutes.",
        });
        break;
      
      case 'report':
        toast({
          title: "Report Generated",
          description: "Analytics report has been generated and saved to your dashboard.",
        });
        break;
      
      case 'restart':
        toast({
          title: "Services Restarted",
          description: "All system services have been successfully restarted.",
          variant: "destructive"
        });
        break;
      
      default:
        break;
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingUser(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "User Added Successfully",
      description: `${newUser.name} has been added with ${newUser.role} role.`,
    });
    
    setNewUser({ name: '', email: '', role: '' });
    setIsAddingUser(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Frequently used administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            if (action.action === 'add-user') {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={action.variant}
                      className="h-auto p-4 justify-start flex-col items-start gap-2 text-left"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <span className="text-xs opacity-70">{action.description}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with specific role and permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleAddUser} 
                        disabled={isAddingUser}
                        className="w-full"
                      >
                        {isAddingUser ? 'Adding User...' : 'Add User'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={() => handleAction(action.action)}
                className="h-auto p-4 justify-start flex-col items-start gap-2 text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs opacity-70">{action.description}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
