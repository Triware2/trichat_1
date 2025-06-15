
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Save, 
  Play, 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp,
  Database,
  Code,
  Eye,
  Settings
} from 'lucide-react';

interface CustomModel {
  id: string;
  name: string;
  type: 'visualization' | 'model' | 'report';
  status: 'draft' | 'active' | 'archived';
  lastModified: string;
}

export const CustomAnalyticsBuilder = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [isCreating, setIsCreating] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'visualization',
    dataSource: '',
    query: '',
    description: ''
  });

  const [customModels] = useState<CustomModel[]>([
    {
      id: '1',
      name: 'Customer Satisfaction Trends',
      type: 'visualization',
      status: 'active',
      lastModified: '2024-06-14'
    },
    {
      id: '2',
      name: 'Agent Performance Predictor',
      type: 'model',
      status: 'active',
      lastModified: '2024-06-13'
    },
    {
      id: '3',
      name: 'Monthly Revenue Report',
      type: 'report',
      status: 'draft',
      lastModified: '2024-06-12'
    }
  ]);

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  const handleSaveModel = () => {
    console.log('Saving model:', newModel);
    setIsCreating(false);
    setNewModel({
      name: '',
      type: 'visualization',
      dataSource: '',
      query: '',
      description: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visualization':
        return <BarChart3 className="w-4 h-4" />;
      case 'model':
        return <TrendingUp className="w-4 h-4" />;
      case 'report':
        return <PieChart className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Custom Analytics & BI</h2>
          <p className="text-gray-600 mt-1">Create and manage your own analytical models and visualizations</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {isCreating && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="border-b border-blue-200/50 bg-blue-50/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Create New Analytics Asset
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newModel.name}
                  onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                  placeholder="Enter model name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newModel.type} onValueChange={(value) => setNewModel({...newModel, type: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visualization">Visualization</SelectItem>
                    <SelectItem value="model">Predictive Model</SelectItem>
                    <SelectItem value="report">Business Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dataSource">Data Source</Label>
              <Select value={newModel.dataSource} onValueChange={(value) => setNewModel({...newModel, dataSource: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chats">Chat Data</SelectItem>
                  <SelectItem value="agents">Agent Performance</SelectItem>
                  <SelectItem value="customers">Customer Data</SelectItem>
                  <SelectItem value="tickets">Ticket System</SelectItem>
                  <SelectItem value="external">External API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newModel.description}
                onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                placeholder="Describe the purpose and functionality"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="query">Query/Configuration</Label>
              <Textarea
                id="query"
                value={newModel.query}
                onChange={(e) => setNewModel({...newModel, query: e.target.value})}
                placeholder="SELECT * FROM chats WHERE created_at >= '2024-01-01'"
                className="mt-1 font-mono text-sm"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveModel} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save & Deploy
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white border shadow-sm rounded-xl p-1 h-auto">
          <TabsTrigger 
            value="models" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <Database className="w-4 h-4" />
            My Models
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <LineChart className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="marketplace" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <PieChart className="w-4 h-4" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {customModels.map((model) => (
              <Card key={model.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(model.type)}
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {model.type === 'visualization' && 'Interactive chart for data visualization'}
                    {model.type === 'model' && 'Predictive analytics model'}
                    {model.type === 'report' && 'Automated business intelligence report'}
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Last modified: {model.lastModified}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { name: 'Customer Journey Analytics', type: 'visualization', description: 'Track customer interactions across touchpoints' },
              { name: 'Agent Workload Predictor', type: 'model', description: 'Predict optimal agent scheduling' },
              { name: 'Revenue Impact Analysis', type: 'report', description: 'Analyze support impact on revenue' }
            ].map((template, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(template.type)}
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="text-center py-8">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Marketplace</h3>
            <p className="text-gray-600 mb-4">Discover and install analytics models from the community</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Marketplace
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
