
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  CheckCircle, 
  UserCheck,
  Clock,
  MessageSquare,
  Bell,
  Shield
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  status: string;
  department: string;
  statusColor: string;
}

export const TeamSettings = () => {
  const { toast } = useToast();
  
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [settings, setSettings] = useState({
    maxConcurrentChats: '5',
    autoAssignChats: true,
    notificationsEnabled: true,
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    priority: 'normal',
    allowManualAssignment: true,
    breakDuration: '15',
    awayTimeout: '15'
  });

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      status: "Online",
      department: "Technical Support",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.c@company.com",
      status: "Busy",
      department: "Billing Support",
      statusColor: "bg-yellow-500"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@company.com",
      status: "Online",
      department: "General Support",
      statusColor: "bg-green-500"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.k@company.com",
      status: "Away",
      department: "Technical Support",
      statusColor: "bg-gray-500"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.w@company.com",
      status: "Break",
      department: "Billing Support",
      statusColor: "bg-orange-500"
    }
  ];

  const handleMemberSelect = (memberId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map(member => member.id));
    }
  };

  const handleApplySettings = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select at least one team member to apply settings.",
        variant: "destructive"
      });
      return;
    }

    const selectedNames = teamMembers
      .filter(member => selectedMembers.includes(member.id))
      .map(member => member.name)
      .join(', ');

    toast({
      title: "Settings Applied",
      description: `Settings have been applied to ${selectedMembers.length} team member(s): ${selectedNames}`,
    });

    console.log('Applying settings to members:', selectedMembers, settings);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateWorkingHours = (type: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [type]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Team Settings Management
        </h2>
        <p className="text-gray-600 mt-1">Select team members and apply settings to them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Member Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Select Team Members ({selectedMembers.length} selected)
            </CardTitle>
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
              >
                {selectedMembers.length === teamMembers.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Badge variant="secondary">
                {selectedMembers.length} of {teamMembers.length} selected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleMemberSelect(member.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.statusColor}`}></div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">{member.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Team Settings Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chat Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Management
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="max-chats" className="text-sm font-medium">
                    Maximum Concurrent Chats
                  </Label>
                  <Input
                    id="max-chats"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxConcurrentChats}
                    onChange={(e) => updateSetting('maxConcurrentChats', e.target.value)}
                    className="w-24 mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-Assign Chats</Label>
                    <p className="text-xs text-gray-600">Automatically assign new chats</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignChats}
                    onCheckedChange={(checked) => updateSetting('autoAssignChats', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Manual Assignment</Label>
                    <p className="text-xs text-gray-600">Allow manual chat assignment</p>
                  </div>
                  <Switch
                    checked={settings.allowManualAssignment}
                    onCheckedChange={(checked) => updateSetting('allowManualAssignment', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Notifications</Label>
                  <p className="text-xs text-gray-600">Desktop and sound notifications</p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
                />
              </div>
            </div>

            {/* Work Schedule */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Work Schedule
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Start Time</Label>
                  <Input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => updateWorkingHours('start', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">End Time</Label>
                  <Input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => updateWorkingHours('end', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Away Timeout (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="60"
                  value={settings.awayTimeout}
                  onChange={(e) => updateSetting('awayTimeout', e.target.value)}
                  className="w-24 mt-1"
                />
              </div>
            </div>

            {/* Priority Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Priority Settings
              </h4>
              
              <div>
                <Label className="text-sm font-medium">Assignment Priority</Label>
                <Select 
                  value={settings.priority} 
                  onValueChange={(value) => updateSetting('priority', value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apply Settings Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleApplySettings}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          disabled={selectedMembers.length === 0}
        >
          <CheckCircle className="w-4 h-4" />
          Apply Settings to Selected Members
        </Button>
      </div>

      {/* Selected Members Summary */}
      {selectedMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teamMembers
                .filter(member => selectedMembers.includes(member.id))
                .map(member => (
                  <Badge key={member.id} variant="secondary" className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${member.statusColor}`}></div>
                    {member.name}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
