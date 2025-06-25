import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export const AgentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{user?.user_metadata?.name || 'Agent Name'}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user?.user_metadata?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={user?.user_metadata?.phone || ''} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user?.user_metadata?.role || 'agent'} disabled />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 