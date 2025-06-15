
import { FeatureGuard } from '@/components/FeatureGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, BarChart, Zap } from 'lucide-react';

export const FeatureExample = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Basic Chat - Available in all plans */}
      <FeatureGuard feature="basic_chat">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Basic Chat</span>
            </CardTitle>
            <CardDescription>Core chat functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Access Chat</Button>
          </CardContent>
        </Card>
      </FeatureGuard>

      {/* Canned Responses - Growth+ only */}
      <FeatureGuard feature="canned_responses">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Canned Responses</span>
            </CardTitle>
            <CardDescription>Pre-written response templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Responses</Button>
          </CardContent>
        </Card>
      </FeatureGuard>

      {/* Advanced Analytics - Pro+ only */}
      <FeatureGuard feature="advanced_analytics">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5" />
              <span>Advanced Analytics</span>
            </CardTitle>
            <CardDescription>Detailed performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </FeatureGuard>

      {/* Advanced Automation - Enterprise only */}
      <FeatureGuard feature="advanced_automation">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Advanced Automation</span>
            </CardTitle>
            <CardDescription>AI-powered workflow automation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Setup Automation</Button>
          </CardContent>
        </Card>
      </FeatureGuard>
    </div>
  );
};
