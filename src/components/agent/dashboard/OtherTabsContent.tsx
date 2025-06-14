
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  BarChart3, 
  Bell, 
  Star,
  Calendar,
  Download,
  Filter,
  Lightbulb,
  Target
} from 'lucide-react';

interface Customer {
  name: string;
  email: string;
  phone: string;
  location: string;
  customerSince: string;
  tier: string;
  previousChats: number;
  satisfaction: number;
  lastContact: string;
  totalOrders: number;
  totalSpent: string;
}

interface OtherTabsContentProps {
  customer: Customer;
}

export const OtherTabsContent = ({ customer }: OtherTabsContentProps) => {
  const handleSettingsSave = () => {
    console.log('Settings saved');
  };

  return (
    <>
      <TabsContent value="analytics" className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Analytics</h2>
            <p className="text-gray-600">Track your daily and weekly performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chats Today</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                  <p className="text-xs text-green-600 mt-1">+3 from yesterday</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-gray-900">1.8m</p>
                  <p className="text-xs text-green-600 mt-1">-0.3m faster</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-xs text-green-600 mt-1">+2% improvement</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Hours</p>
                  <p className="text-2xl font-bold text-gray-900">7.2h</p>
                  <p className="text-xs text-gray-600 mt-1">of 8h shift</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Trend</CardTitle>
            <CardDescription>Your performance metrics over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Agent Settings</h2>
          <p className="text-gray-600">Configure your personal preferences and notifications</p>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Chat Notifications</h4>
                <p className="text-sm text-gray-600">Get notified when new chats are assigned</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive daily performance summaries</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sound Alerts</h4>
                <p className="text-sm text-gray-600">Play sound for urgent messages</p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Quick Settings
            </CardTitle>
            <CardDescription>Frequently used configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-response delay
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>Immediate</option>
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>2 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default status
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>Available</option>
                  <option>Busy</option>
                  <option>Away</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSettingsSave} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </div>
      </TabsContent>
    </>
  );
};
