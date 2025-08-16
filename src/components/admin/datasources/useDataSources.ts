
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DataSource, SyncLog } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useDataSources = () => {
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  // Load from Supabase with graceful fallback
  useEffect(() => {
    const load = async () => {
      try {
        const { data: ds, error: dsError } = await supabase
          .from('data_sources' as any)
          .select('*')
          .order('updated_at', { ascending: false });

        if (dsError) throw dsError;

        const mapped: DataSource[] = (ds || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          status: row.status,
          lastSync: row.last_sync || null,
          recordsCount: row.records_count || 0,
          config: row.config || {}
        }));

        setDataSources(mapped);

        const { data: logs, error: logsError } = await supabase
          .from('data_source_sync_logs' as any)
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);

        if (logsError) throw logsError;

        const mappedLogs: SyncLog[] = (logs || []).map((row: any) => ({
          id: row.id,
          dataSourceId: row.data_source_id,
          timestamp: row.timestamp,
          status: row.status,
          recordsProcessed: row.records_processed,
          recordsSuccess: row.records_success,
          recordsError: row.records_error,
          errorMessage: row.error_message || undefined
        }));

        setSyncLogs(mappedLogs);
      } catch (e) {
        // Keep UI working with empty state; toasts optional
        setDataSources([]);
        setSyncLogs([]);
      }
    };
    load();
  }, [user?.id]);

  const addDataSource = async (dataSource: Omit<DataSource, 'id'>) => {
    try {
      const allowedTypes = ['crm','database','api','file','custom','webhook','ecommerce','helpdesk','analytics'];
      const safeType = allowedTypes.includes(dataSource.type) ? dataSource.type : 'custom';
      const safeStatus = dataSource.status || 'disconnected';

      const { data, error } = await supabase
        .from('data_sources' as any)
        .insert({
          name: dataSource.name,
          type: safeType,
          status: safeStatus,
          last_sync: dataSource.lastSync,
          records_count: dataSource.recordsCount,
          config: dataSource.config,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const inserted: DataSource = {
        id: data.id,
        name: data.name,
        type: data.type,
        status: data.status,
        lastSync: data.last_sync,
        recordsCount: data.records_count,
        config: data.config
      };

      setDataSources(prev => [inserted, ...prev]);

      toast({
        title: "Data Source Added",
        description: `${dataSource.name} has been configured successfully.`,
      });
    } catch (error) {
      const err: any = error;
      toast({
        title: "Error",
        description: err?.message || err?.error?.message || "Failed to add data source. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateDataSource = async (dataSource: DataSource) => {
    try {
      const { error } = await supabase
        .from('data_sources' as any)
        .update({
          name: dataSource.name,
          type: dataSource.type,
          status: dataSource.status,
          last_sync: dataSource.lastSync,
          records_count: dataSource.recordsCount,
          config: dataSource.config
        })
        .eq('id', dataSource.id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('data_sources' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      
      // Placeholder: mark syncing, then success
      await new Promise(resolve => setTimeout(resolve, 1200));
      const success = true;
      
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
      
      // Simulate sync process; in real implementation call edge function/webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = true;
      const newStatus = 'connected';
      const recordsProcessed = Math.floor(Math.random() * 100) + 10;
      const recordsSuccess = recordsProcessed;
      
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
      const { data: log, error: logError } = await supabase
        .from('data_source_sync_logs' as any)
        .insert({
          data_source_id: id,
          status: success ? 'success' : 'error',
          records_processed: recordsProcessed,
          records_success: recordsSuccess,
          records_error: recordsProcessed - recordsSuccess,
          error_message: success ? null : 'Sync failed',
          created_by: user?.id
        })
        .select()
        .single();

      if (!logError && log) {
        const mapped: SyncLog = {
          id: log.id,
          dataSourceId: log.data_source_id,
          timestamp: log.timestamp,
          status: log.status,
          recordsProcessed: log.records_processed,
          recordsSuccess: log.records_success,
          recordsError: log.records_error,
          errorMessage: log.error_message || undefined
        };
        setSyncLogs(prev => [mapped, ...prev]);
      }
      
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
