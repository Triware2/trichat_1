
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { SyncLog, DataSource } from './types';

interface SyncLogsPanelProps {
  logs: SyncLog[];
  dataSources: DataSource[];
}

export const SyncLogsPanel = ({ logs, dataSources }: SyncLogsPanelProps) => {
  const getDataSourceName = (id: string) => {
    return dataSources.find(ds => ds.id === id)?.name || 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sync Logs</h3>
          <p className="text-gray-600">
            Sync logs will appear here once you start syncing data sources
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {getDataSourceName(log.dataSourceId)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    {getStatusBadge(log.status)}
                  </div>
                </TableCell>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>
                  {log.recordsProcessed.toLocaleString()}
                </TableCell>
                <TableCell>
                  {log.recordsProcessed > 0 
                    ? `${Math.round((log.recordsSuccess / log.recordsProcessed) * 100)}%`
                    : '0%'
                  }
                </TableCell>
                <TableCell>
                  {log.errorMessage && (
                    <Button variant="ghost" size="sm" className="text-red-600">
                      View Error
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
