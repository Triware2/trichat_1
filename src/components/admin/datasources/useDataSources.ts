
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DataSource, SyncLog } from './types';

export const useDataSources = () => {
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockDataSources: DataSource[] = [
      {
        id: '1',
        name: 'Customer CRM',
        type: 'crm',
        status: 'connected',
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        recordsCount: 1250,
        config: {
          apiUrl: 'https://api.salesforce.com/v1/customers',
          apiKey: '***hidden***',
          mapping: [
            { sourceField: 'firstName', targetField: 'name', dataType: 'string', required: true },
            { sourceField: 'email', targetField: 'email', dataType: 'email', required: true },
            { sourceField: 'phone', targetField: 'phone', dataType: 'phone', required: false },
          ],
          syncInterval: 60,
          autoSync: true
        }
      },
      {
        id: '2',
        name: 'E-commerce Database',
        type: 'database',
        status: 'error',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        recordsCount: 3420,
        config: {
          database: {
            host: 'db.example.com',
            port: 5432,
            database: 'ecommerce',
            username: 'readonly_user',
            password: '***hidden***'
          },
          mapping: [
            { sourceField: 'customer_name', targetField: 'name', dataType: 'string', required: true },
            { sourceField: 'email_address', targetField: 'email', dataType: 'email', required: true },
          ],
          syncInterval: 240,
          autoSync: true
        }
      },
      {
        id: '3',
        name: 'Support Tickets API',
        type: 'api',
        status: 'syncing',
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        recordsCount: 890,
        config: {
          apiUrl: 'https://support.example.com/api/tickets',
          apiKey: '***hidden***',
          mapping: [
            { sourceField: 'customer_name', targetField: 'name', dataType: 'string', required: true },
            { sourceField: 'email', targetField: 'email', dataType: 'email', required: true },
          ],
          syncInterval: 30,
          autoSync: true
        }
      }
    ];

    const mockSyncLogs: SyncLog[] = [
      {
        id: '1',
        dataSourceId: '1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'success',
        recordsProcessed: 45,
        recordsSuccess: 45,
        recordsError: 0
      },
      {
        id: '2',
        dataSourceId: '2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'error',
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsError: 0,
        errorMessage: 'Connection timeout to database'
      },
      {
        id: '3',
        dataSourceId: '3',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        status: 'partial',
        recordsProcessed: 25,
        recordsSuccess: 20,
        recordsError: 5
      }
    ];

    setDataSources(mockDataSources);
    setSyncLogs(mockSyncLogs);
  }, []);

  const addDataSource = async (dataSource: Omit<DataSource, 'id'>) => {
    try {
      const newDataSource: DataSource = {
        ...dataSource,
        id: Date.now().toString()
      };
      
      setDataSources(prev => [...prev, newDataSource]);
      
      toast({
        title: "Data Source Added",
        description: `${dataSource.name} has been configured successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add data source. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateDataSource = async (dataSource: DataSource) => {
    try {
      setDataSources(prev => prev.map(ds => ds.id === dataSource.id ? dataSource : ds));
      
      toast({
        title: "Data Source Updated",
        description: `${dataSource.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update data source. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteDataSource = async (id: string) => {
    try {
      setDataSources(prev => prev.filter(ds => ds.id !== id));
      setSyncLogs(prev => prev.filter(log => log.dataSourceId !== id));
      
      toast({
        title: "Data Source Deleted",
        description: "Data source has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data source. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testConnection = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Data source connection is working correctly.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to data source. Please check your configuration.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncDataSource = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Update status to syncing
      setDataSources(prev => prev.map(ds => 
        ds.id === id ? { ...ds, status: 'syncing' } : ds
      ));
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const success = Math.random() > 0.2; // 80% success rate for demo
      const newStatus = success ? 'connected' : 'error';
      const recordsProcessed = Math.floor(Math.random() * 100) + 10;
      const recordsSuccess = success ? recordsProcessed : Math.floor(recordsProcessed * 0.7);
      
      // Update data source status
      setDataSources(prev => prev.map(ds => 
        ds.id === id ? { 
          ...ds, 
          status: newStatus,
          lastSync: new Date().toISOString(),
          recordsCount: ds.recordsCount + recordsSuccess
        } : ds
      ));
      
      // Add sync log
      const newLog: SyncLog = {
        id: Date.now().toString(),
        dataSourceId: id,
        timestamp: new Date().toISOString(),
        status: success ? 'success' : 'error',
        recordsProcessed,
        recordsSuccess,
        recordsError: recordsProcessed - recordsSuccess,
        errorMessage: success ? undefined : 'Sync failed due to network error'
      };
      
      setSyncLogs(prev => [newLog, ...prev]);
      
      toast({
        title: success ? "Sync Completed" : "Sync Failed",
        description: success 
          ? `Successfully synced ${recordsSuccess} records.`
          : "Sync failed. Please check the logs for details.",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data source. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncAllDataSources = async () => {
    try {
      setIsLoading(true);
      
      const connectedSources = dataSources.filter(ds => ds.status === 'connected');
      
      for (const source of connectedSources) {
        await syncDataSource(source.id);
      }
      
      toast({
        title: "Bulk Sync Completed",
        description: `Synced ${connectedSources.length} data sources.`,
      });
    } catch (error) {
      toast({
        title: "Bulk Sync Failed",
        description: "Some data sources failed to sync. Please check individual logs.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dataSources,
    syncLogs,
    isLoading,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    syncDataSource,
    syncAllDataSources
  };
};
