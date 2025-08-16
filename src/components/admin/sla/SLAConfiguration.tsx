
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react';
import { SLATier, SLATarget } from './types';
import { slaService } from '@/services/slaService';

export const SLAConfiguration = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState<SLATier | null>(null);
  const [slaData, setSlaData] = useState<SLATier[]>([]);
  const { toast } = useToast();

  // Form state for creating new SLA
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerSegments: '',
    contractTypes: '',
    supportPlans: '',
    status: 'active'
  });

  const mockSLAs: SLATier[] = [
    {
      id: '1',
      name: 'Enterprise VIP',
      description: 'Premium support for enterprise customers',
      customerSegments: ['Enterprise', 'VIP'],
      contractTypes: ['Premium', 'Enterprise'],
      supportPlans: ['24/7 Premium'],
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Business Standard',
      description: 'Standard support for business customers',
      customerSegments: ['Business', 'Professional'],
      contractTypes: ['Standard', 'Business'],
      supportPlans: ['Business Hours'],
      isActive: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Basic Support',
      description: 'Basic support for standard customers',
      customerSegments: ['Standard', 'Free'],
      contractTypes: ['Basic'],
      supportPlans: ['Standard'],
      isActive: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15'
    }
  ];

  const mockTargets: Record<string, SLATarget[]> = {
    '1': [
      { id: '1', slaId: '1', priority: 'critical', firstResponseTime: 15, resolutionTime: 240, businessHoursOnly: false },
      { id: '2', slaId: '1', priority: 'high', firstResponseTime: 30, resolutionTime: 480, businessHoursOnly: false },
      { id: '3', slaId: '1', priority: 'medium', firstResponseTime: 60, resolutionTime: 720, businessHoursOnly: false },
      { id: '4', slaId: '1', priority: 'low', firstResponseTime: 120, resolutionTime: 1440, businessHoursOnly: false }
    ],
    '2': [
      { id: '5', slaId: '2', priority: 'critical', firstResponseTime: 30, resolutionTime: 480, businessHoursOnly: true },
      { id: '6', slaId: '2', priority: 'high', firstResponseTime: 60, resolutionTime: 720, businessHoursOnly: true },
      { id: '7', slaId: '2', priority: 'medium', firstResponseTime: 120, resolutionTime: 1440, businessHoursOnly: true },
      { id: '8', slaId: '2', priority: 'low', firstResponseTime: 240, resolutionTime: 2880, businessHoursOnly: true }
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSLA = async () => {
    console.log('Creating SLA with data:', formData);
    
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new SLA object
    const newSLA: SLATier = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      customerSegments: formData.customerSegments.split(',').map(s => s.trim()).filter(s => s),
      contractTypes: formData.contractTypes.split(',').map(s => s.trim()).filter(s => s),
      supportPlans: formData.supportPlans.split(',').map(s => s.trim()).filter(s => s),
      isActive: formData.status === 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      const created = await slaService.createSLATier(newSLA);
      setSlaData(prev => [created, ...prev]);
    } catch (e) {
      // fallback to local state so UI keeps working
      setSlaData(prev => [newSLA, ...prev]);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      customerSegments: '',
      contractTypes: '',
      supportPlans: '',
      status: 'active'
    });

    // Close modal
    setIsCreateModalOpen(false);

    // Show success toast
    toast({
      title: "SLA Created",
      description: `SLA "${newSLA.name}" has been created successfully.`,
    });
  };

  const handleDeleteSLA = async (slaId: string, slaName: string) => {
    console.log('Deleting SLA:', slaId);
    try {
      await slaService.deleteSLATier(slaId);
    } finally {
      setSlaData(prev => prev.filter(sla => sla.id !== slaId));
    }

    toast({
      title: "SLA Deleted",
      description: `SLA "${slaName}" has been deleted successfully.`,
    });
  };

  const allSLAs = [...mockSLAs, ...slaData];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">SLA Configuration</h2>
          <p className="text-sm text-slate-600 mt-1">Create and manage SLA tiers with response and resolution targets</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create SLA Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New SLA Tier</DialogTitle>
              <DialogDescription>
                Define a new SLA tier with response and resolution targets
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">SLA Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Enterprise VIP" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe this SLA tier..." 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="segments">Customer Segments</Label>
                  <Input 
                    id="segments" 
                    placeholder="Enterprise, VIP" 
                    value={formData.customerSegments}
                    onChange={(e) => handleInputChange('customerSegments', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
                <div>
                  <Label htmlFor="contracts">Contract Types</Label>
                  <Input 
                    id="contracts" 
                    placeholder="Premium, Enterprise" 
                    value={formData.contractTypes}
                    onChange={(e) => handleInputChange('contractTypes', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
                <div>
                  <Label htmlFor="plans">Support Plans</Label>
                  <Input 
                    id="plans" 
                    placeholder="24/7 Premium" 
                    value={formData.supportPlans}
                    onChange={(e) => handleInputChange('supportPlans', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateSLA}>
                Create SLA
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SLA Tiers List */}
      <div className="grid gap-6">
        {allSLAs.map((sla) => (
          <Card key={sla.id} className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sla.name}</CardTitle>
                    <CardDescription className="mt-1">{sla.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={sla.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {sla.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteSLA(sla.id, sla.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Segments and Plans */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Customer Segments
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sla.customerSegments.map((segment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {segment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Contract Types
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sla.contractTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Support Plans
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sla.supportPlans.map((plan, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {plan}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SLA Targets */}
                <div>
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Response & Resolution Targets
                  </Label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Priority</TableHead>
                          <TableHead className="text-xs">First Response</TableHead>
                          <TableHead className="text-xs">Resolution Time</TableHead>
                          <TableHead className="text-xs">Business Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTargets[sla.id]?.map((target) => (
                          <TableRow key={target.id}>
                            <TableCell>
                              <Badge className={getPriorityColor(target.priority)}>
                                {target.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatTime(target.firstResponseTime)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatTime(target.resolutionTime)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={target.businessHoursOnly ? 'outline' : 'secondary'} className="text-xs">
                                {target.businessHoursOnly ? 'Yes' : '24/7'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
