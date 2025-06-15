
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const ManualAssignmentSettings = () => {
  const [manualAssignmentEnabled, setManualAssignmentEnabled] = useState(true);
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true);
  const [reassignmentAllowed, setReassignmentAllowed] = useState(true);

  const handleSaveSettings = () => {
    console.log('Saving manual assignment settings:', {
      manualAssignmentEnabled,
      autoAssignmentEnabled,
      reassignmentAllowed
    });
    // In real app, this would make an API call to save settings
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Chat Assignment Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Control how chats are assigned to agents
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Assignment Control */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="manual-assignment" className="text-base font-medium">
              Enable Manual Assignment
            </Label>
            <p className="text-sm text-gray-600">
              Allow agents to manually assign chats from the All Chats section
            </p>
          </div>
          <div className="flex items-center gap-3">
            {manualAssignmentEnabled ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Disabled
              </Badge>
            )}
            <Switch
              id="manual-assignment"
              checked={manualAssignmentEnabled}
              onCheckedChange={setManualAssignmentEnabled}
            />
          </div>
        </div>

        {/* Auto Assignment Control */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="auto-assignment" className="text-base font-medium">
              Auto Assignment
            </Label>
            <p className="text-sm text-gray-600">
              Automatically assign new chats to available agents
            </p>
          </div>
          <div className="flex items-center gap-3">
            {autoAssignmentEnabled ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Paused
              </Badge>
            )}
            <Switch
              id="auto-assignment"
              checked={autoAssignmentEnabled}
              onCheckedChange={setAutoAssignmentEnabled}
            />
          </div>
        </div>

        {/* Reassignment Control */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="reassignment" className="text-base font-medium">
              Allow Reassignment
            </Label>
            <p className="text-sm text-gray-600">
              Allow agents to reassign chats that are already assigned
            </p>
          </div>
          <div className="flex items-center gap-3">
            {reassignmentAllowed ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Allowed
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Blocked
              </Badge>
            )}
            <Switch
              id="reassignment"
              checked={reassignmentAllowed}
              onCheckedChange={setReassignmentAllowed}
            />
          </div>
        </div>

        {/* Assignment Rules */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Assignment Rules
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Agents can only assign chats when manual assignment is enabled</li>
            <li>• High and Critical priority chats require immediate assignment</li>
            <li>• Agents cannot exceed their maximum chat limit</li>
            <li>• Away/offline agents are not available for assignment</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
