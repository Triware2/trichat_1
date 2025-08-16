import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { adminDashboardService, QuickAction } from '@/services/adminDashboardService';
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
  Zap,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  FileUp
} from 'lucide-react';

export const QuickActions = () => {
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isImportingUsers, setIsImportingUsers] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [notificationData, setNotificationData] = useState({ title: '', message: '', type: 'info', recipients: 'all' });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    const loadQuickActions = async () => {
      try {
        setIsLoading(true);
        const actions = await adminDashboardService.getQuickActions();
        setQuickActions(actions);
      } catch (error) {
        console.error('Error loading quick actions:', error);
        toast({
          title: "Error",
          description: "Failed to load quick actions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuickActions();
  }, [toast]);

  const getActionIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      UserPlus,
      Download,
      Upload,
      Database,
      Bell,
      Shield,
      FileText,
      RefreshCw
    };
    return iconMap[iconName] || Zap;
  };

  const handleAction = async (action: string) => {
    if (isExecuting) return;

    try {
      setIsExecuting(action);
      
      let result;
      
      switch (action) {
        case 'add-user':
          // This will be handled by the dialog
          return;
        case 'import':
          // This will be handled by the import dialog
          return;
        case 'notify':
          // This will be handled by the notification dialog
          return;
        default:
          result = await adminDashboardService.executeQuickAction(action);
      }
      
      if (result?.success) {
        setActionResults(prev => ({ ...prev, [action]: result }));
        toast({
          title: "Success",
          description: result.message,
        });
      } else if (result) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Error",
        description: "Failed to execute action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(null);
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
    
    try {
      const result = await adminDashboardService.executeQuickAction('add-user', newUser);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setNewUser({ name: '', email: '', role: '' });
        setActionResults(prev => ({ ...prev, 'add-user': result }));
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleImportUsers = async () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }

    setIsImportingUsers(true);
    
    try {
      // Simulate file reading
      const fileData = {
        users: [
          { name: 'John Doe', email: 'john@example.com', role: 'agent' },
          { name: 'Jane Smith', email: 'jane@example.com', role: 'supervisor' },
          { name: 'Bob Wilson', email: 'bob@example.com', role: 'agent' }
        ]
      };

      const result = await adminDashboardService.executeQuickAction('import', fileData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setImportFile(null);
        setActionResults(prev => ({ ...prev, 'import': result }));
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error importing users:', error);
      toast({
        title: "Error",
        description: "Failed to import users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImportingUsers(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      toast({
        title: "Error",
        description: "Please fill in title and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingNotification(true);
    
    try {
      const result = await adminDashboardService.executeQuickAction('notify', notificationData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setNotificationData({ title: '', message: '', type: 'info', recipients: 'all' });
        setActionResults(prev => ({ ...prev, 'notify': result }));
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="border-b border-slate-100/60 bg-slate-50/30 p-4 lg:p-6 flex-shrink-0">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
            <Zap className="h-5 w-5 text-orange-600" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 mt-1">
            Frequently used administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 gap-3 h-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200/80 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-100/60 bg-slate-50/30 p-4 lg:p-6 flex-shrink-0">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <Zap className="h-5 w-5 text-orange-600" />
          Quick Actions
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 mt-1">
          Frequently used administrative tasks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 lg:p-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-3 flex-1 justify-start pb-0">
          {quickActions.map((action, index) => {
            const Icon = getActionIcon(action.icon);
            const result = actionResults[action.action];
            const isPrimary = action.action === 'add-user';
            const baseButtonClasses =
              'flex flex-col items-start justify-center w-full h-14 rounded-lg transition-all duration-200 px-4 py-3 text-left gap-1 border';
            const primaryClasses =
              'bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-sm';
            const outlineClasses =
              'bg-white hover:bg-orange-50 text-slate-900 border-slate-200';
            const destructiveClasses =
              'bg-red-600 hover:bg-red-700 text-white border-red-600';
            const buttonClasses =
              baseButtonClasses +
              ' ' +
              (isPrimary
                ? primaryClasses
                : action.variant === 'destructive'
                ? destructiveClasses
                : outlineClasses);

            // Dialogs for add-user, import, notify remain unchanged
            if (action.action === 'add-user') {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      disabled={isExecuting === action.action}
                      className={buttonClasses}
                    >
                      <div className="flex items-center gap-2">
                        {isExecuting === action.action ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">{action.title}</span>
                        {result && <CheckCircle className="h-3 w-3 text-green-300" />}
                      </div>
                      <span className="text-xs opacity-90 mt-1">{action.description}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm border border-slate-200/60 max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold text-slate-900">Add New User</DialogTitle>
                      <DialogDescription className="text-sm text-slate-600">
                        Create a new user account with specified role and permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-name" className="text-sm font-medium text-slate-700">Full Name</Label>
                        <Input
                          id="user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Enter full name"
                          className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-email" className="text-sm font-medium text-slate-700">Email Address</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="Enter email address"
                          className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-role" className="text-sm font-medium text-slate-700">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm">
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setNewUser({ name: '', email: '', role: '' })}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAddUser} 
                          disabled={isAddingUser}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          {isAddingUser ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            'Add User'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            if (action.action === 'import') {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      disabled={isExecuting === action.action}
                      className={buttonClasses}
                    >
                      <div className="flex items-center gap-2">
                        {isExecuting === action.action ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">{action.title}</span>
                        {result && <CheckCircle className="h-3 w-3 text-green-600" />}
                      </div>
                      <span className="text-xs opacity-70 mt-1">{action.description}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm border border-slate-200/60 max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold text-slate-900">Import Users</DialogTitle>
                      <DialogDescription className="text-sm text-slate-600">
                        Upload a CSV or JSON file to bulk import users.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="import-file" className="text-sm font-medium text-slate-700">File Upload</Label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                          <FileUp className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <input
                            id="import-file"
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="import-file" className="cursor-pointer text-sm text-slate-600 hover:text-slate-800">
                            {importFile ? importFile.name : 'Click to select file'}
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setImportFile(null)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleImportUsers} 
                          disabled={isImportingUsers || !importFile}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          {isImportingUsers ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            'Import Users'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            if (action.action === 'notify') {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      disabled={isExecuting === action.action}
                      className={buttonClasses}
                    >
                      <div className="flex items-center gap-2">
                        {isExecuting === action.action ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">{action.title}</span>
                        {result && <CheckCircle className="h-3 w-3 text-green-600" />}
                      </div>
                      <span className="text-xs opacity-70 mt-1">{action.description}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm border border-slate-200/60 max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold text-slate-900">Send Notification</DialogTitle>
                      <DialogDescription className="text-sm text-slate-600">
                        Send a notification to selected user groups.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notif-title" className="text-sm font-medium text-slate-700">Title</Label>
                        <Input
                          id="notif-title"
                          value={notificationData.title}
                          onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                          placeholder="Notification title"
                          className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notif-message" className="text-sm font-medium text-slate-700">Message</Label>
                        <Textarea
                          id="notif-message"
                          value={notificationData.message}
                          onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                          placeholder="Notification message"
                          className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notif-type" className="text-sm font-medium text-slate-700">Type</Label>
                        <Select value={notificationData.type} onValueChange={(value) => setNotificationData({...notificationData, type: value as any})}>
                          <SelectTrigger className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm">
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notif-recipients" className="text-sm font-medium text-slate-700">Recipients</Label>
                        <Select value={notificationData.recipients} onValueChange={(value) => setNotificationData({...notificationData, recipients: value as any})}>
                          <SelectTrigger className="border-slate-300 focus:border-orange-500 focus:ring-orange-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm">
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="admins">Administrators</SelectItem>
                            <SelectItem value="supervisors">Supervisors</SelectItem>
                            <SelectItem value="agents">Agents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setNotificationData({ title: '', message: '', type: 'info', recipients: 'all' })}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendNotification} 
                          disabled={isSendingNotification}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          {isSendingNotification ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Notification'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            return (
              <button
                key={index}
                type="button"
                disabled={isExecuting === action.action}
                onClick={() => handleAction(action.action)}
                className={buttonClasses}
              >
                <div className="flex items-center gap-2">
                  {isExecuting === action.action ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{action.title}</span>
                  {action.requiresConfirmation && (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  )}
                  {result && <CheckCircle className="h-3 w-3 text-green-300" />}
                </div>
                <span className="text-xs opacity-70 mt-1">{action.description}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
