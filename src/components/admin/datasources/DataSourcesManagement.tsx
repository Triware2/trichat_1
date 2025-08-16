
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Database, RefreshCw, Settings, AlertCircle } from 'lucide-react';
import { DataSource } from './types';
import { DataSourceCard } from './DataSourceCard';
import { AddDataSourceModal } from './AddDataSourceModal';
import { SyncLogsPanel } from './SyncLogsPanel';
import { useDataSources } from './useDataSources';

export const DataSourcesManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  
  const {
    dataSources,
    syncLogs,
    isLoading,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    syncDataSource,
    syncAllDataSources
  } = useDataSources();

  const getStatusCount = (status: string) => {
    return dataSources.filter(ds => ds.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Data Sources Management</h1>
          </div>
          <p className="text-sm text-slate-600">
            Configure and manage data sources for analytics and reporting
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Total Sources</p>
                <p className="text-2xl font-bold text-slate-900">{dataSources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-slate-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('connected')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Syncing</p>
                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('syncing')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-slate-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{getStatusCount('error')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          {dataSources.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Data Sources</h3>
                <p className="text-slate-600 mb-4">
                  Connect your first data source to start syncing customer information
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Data Source
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((dataSource) => (
                <DataSourceCard
                  key={dataSource.id}
                  dataSource={dataSource}
                  onEdit={(ds) => { setSelectedDataSource(ds); setShowAddModal(true); }}
                  onDelete={deleteDataSource}
                  onSync={syncDataSource}
                  onTest={testConnection}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <SyncLogsPanel logs={syncLogs} dataSources={dataSources} />
        </TabsContent>
      </Tabs>

      <AddDataSourceModal
        open={showAddModal}
        onOpenChange={(open) => { setShowAddModal(open); if (!open) setSelectedDataSource(null); }}
        onAdd={addDataSource}
        editingDataSource={selectedDataSource}
        onUpdate={updateDataSource}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDataSource(null);
        }}
      />
    </div>
  );
};
