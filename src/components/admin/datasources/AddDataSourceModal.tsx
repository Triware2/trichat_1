
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSource, DataSourceType, DataSourceConfig } from './types';
import { Database, Globe, Webhook, Zap } from 'lucide-react';

interface AddDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (dataSource: Omit<DataSource, 'id'>) => void;
  onUpdate?: (dataSource: DataSource) => void;
  editingDataSource?: DataSource | null;
  onClose: () => void;
}

export const AddDataSourceModal = ({ 
  open, 
  onOpenChange, 
  onAdd, 
  onUpdate, 
  editingDataSource, 
  onClose 
}: AddDataSourceModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DataSourceType>('api');
  const [config, setConfig] = useState<Partial<DataSourceConfig>>({
    mapping: [],
    syncInterval: 60,
    autoSync: true
  });

  useEffect(() => {
    if (editingDataSource) {
      setName(editingDataSource.name);
      setType(editingDataSource.type);
      setConfig(editingDataSource.config);
    } else {
      setName('');
      setType('api');
      setConfig({
        mapping: [],
        syncInterval: 60,
        autoSync: true
      });
    }
  }, [editingDataSource]);

  const handleSubmit = () => {
    const dataSourceData = {
      name,
      type,
      status: 'disconnected' as const,
      lastSync: new Date().toISOString(),
      recordsCount: 0,
      config: config as DataSourceConfig
    };

    if (editingDataSource && onUpdate) {
      onUpdate({ ...editingDataSource, ...dataSourceData });
    } else {
      onAdd(dataSourceData);
    }
    
    onClose();
  };

  const dataSourceTypes = [
    { value: 'api', label: 'REST API', icon: Globe, description: 'Connect via REST API endpoints' },
    { value: 'webhook', label: 'Webhook', icon: Webhook, description: 'Receive real-time data updates' },
    { value: 'database', label: 'Database', icon: Database, description: 'Direct database connection' },
    { value: 'crm', label: 'CRM Integration', icon: Zap, description: 'Salesforce, HubSpot, etc.' },
    { value: 'ecommerce', label: 'E-commerce', icon: Zap, description: 'Shopify, WooCommerce, etc.' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDataSource ? 'Edit Data Source' : 'Add New Data Source'}
          </DialogTitle>
          <DialogDescription>
            Configure a data source to sync customer information automatically
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Data Source Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Customer Database"
                />
              </div>

              <div className="space-y-3">
                <Label>Data Source Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dataSourceTypes.map((sourceType) => {
                    const Icon = sourceType.icon;
                    return (
                      <Card
                        key={sourceType.value}
                        className={`cursor-pointer transition-all ${
                          type === sourceType.value 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setType(sourceType.value as DataSourceType)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{sourceType.label}</h4>
                              <p className="text-sm text-gray-600">{sourceType.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connection" className="space-y-4">
            {type === 'api' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API Endpoint URL</Label>
                  <Input
                    id="apiUrl"
                    value={config.apiUrl || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                    placeholder="https://api.example.com/customers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Your API key"
                  />
                </div>
              </div>
            )}

            {type === 'webhook' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://your-app.com/webhook"
                  />
                  <p className="text-sm text-gray-600">
                    This URL will receive data from your application
                  </p>
                </div>
              </div>
            )}

            {type === 'database' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dbHost">Host</Label>
                    <Input
                      id="dbHost"
                      value={config.database?.host || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        database: { ...prev.database, host: e.target.value } as any
                      }))}
                      placeholder="localhost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbPort">Port</Label>
                    <Input
                      id="dbPort"
                      type="number"
                      value={config.database?.port || 5432}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        database: { ...prev.database, port: parseInt(e.target.value) } as any
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input
                    id="dbName"
                    value={config.database?.database || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      database: { ...prev.database, database: e.target.value } as any
                    }))}
                    placeholder="customer_db"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dbUser">Username</Label>
                    <Input
                      id="dbUser"
                      value={config.database?.username || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        database: { ...prev.database, username: e.target.value } as any
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbPassword">Password</Label>
                    <Input
                      id="dbPassword"
                      type="password"
                      value={config.database?.password || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        database: { ...prev.database, password: e.target.value } as any
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Map fields from your data source to our contact properties
              </p>
              <div className="space-y-3">
                {['name', 'email', 'phone', 'company', 'location'].map((field) => (
                  <div key={field} className="grid grid-cols-3 gap-4 items-center">
                    <Label className="capitalize">{field}</Label>
                    <Input placeholder={`source_${field}_field`} />
                    <Select defaultValue="string">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                <Select 
                  value={config.syncInterval?.toString() || '60'}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, syncInterval: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="1440">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={config.autoSync}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoSync: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="autoSync">Enable automatic syncing</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {editingDataSource ? 'Update' : 'Add'} Data Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
