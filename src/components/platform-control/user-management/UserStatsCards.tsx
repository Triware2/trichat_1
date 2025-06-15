
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Shield, Building } from 'lucide-react';

interface User {
  id: number;
  role: string;
  organization: string;
  status: string;
}

interface UserStatsCardsProps {
  users: User[];
}

export const UserStatsCards = ({ users }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
          <Users className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          <p className="text-sm text-green-600 font-medium">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Active Users</CardTitle>
          <Activity className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</div>
          <p className="text-sm text-green-600 font-medium">98.5% active rate</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Admins</CardTitle>
          <Shield className="h-5 w-5 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'Admin').length}</div>
          <p className="text-sm text-orange-600 font-medium">Elevated access</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Organizations</CardTitle>
          <Building className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{new Set(users.map(u => u.organization)).size}</div>
          <p className="text-sm text-blue-600 font-medium">Unique organizations</p>
        </CardContent>
      </Card>
    </div>
  );
};
