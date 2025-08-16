
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RefreshCw, Settings, Trash2, TestTube, Database, Globe, Webhook } from 'lucide-react';
import { DataSource } from './types';

interface DataSourceCardProps {
  dataSource: DataSource;
  onEdit: (dataSource: DataSource) => void;
  onDelete: (id: string) => void;
  onSync: (id: string) => void;
  onTest: (id: string) => void;
}

export const DataSourceCard = ({ dataSource, onEdit, onDelete, onSync, onTest }: DataSourceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'syncing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="w-4 h-4" />;
      case 'webhook': return <Webhook className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'crm': return <Database className="w-4 h-4" />;
      case 'ecommerce': return <Database className="w-4 h-4" />;
      case 'helpdesk': return <Database className="w-4 h-4" />;
      case 'analytics': return <Database className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const formatLastSync = (lastSync: string) => {
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow border border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(dataSource.type)}
            <CardTitle className="text-lg text-slate-900">{dataSource.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(dataSource)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTest(dataSource.id)}>
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSync(dataSource.id)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(dataSource.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge variant="outline" className={getStatusColor(dataSource.status)}>
          {dataSource.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-slate-600">
          <p>Type: <span className="font-medium">{dataSource.type.toUpperCase()}</span></p>
          <p>Records: <span className="font-medium">{dataSource.recordsCount.toLocaleString()}</span></p>
          <p>Last Sync: <span className="font-medium">{formatLastSync(dataSource.lastSync)}</span></p>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSync(dataSource.id)}
            disabled={dataSource.status === 'syncing'}
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${dataSource.status === 'syncing' ? 'animate-spin' : ''}`} />
            Sync
          </Button>
           <Button
            size="sm"
            variant="outline"
             onClick={() => onEdit(dataSource)}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
