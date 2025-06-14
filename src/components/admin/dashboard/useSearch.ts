
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  type: 'user' | 'setting' | 'log' | 'data-source' | 'api-key';
  description: string;
  url?: string;
}

export const useSearch = () => {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query: string): Promise<SearchResult[]> => {
    setIsSearching(true);
    
    // Simulate API search with mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'User Management',
        type: 'user',
        description: 'Manage user accounts, roles, and permissions',
        url: '#users'
      },
      {
        id: '2',
        title: 'System Settings',
        type: 'setting',
        description: 'Configure system preferences and integrations',
        url: '#settings'
      },
      {
        id: '3',
        title: 'API Keys',
        type: 'api-key',
        description: 'Manage API keys and access tokens',
        url: '#api-keys'
      },
      {
        id: '4',
        title: 'Data Sources',
        type: 'data-source',
        description: 'Connect and manage external data sources',
        url: '#datasources'
      },
      {
        id: '5',
        title: 'Sync Logs',
        type: 'log',
        description: 'View data synchronization logs and status',
        url: '#datasources'
      }
    ];

    // Filter results based on query
    const filtered = mockResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(false);
    
    return filtered;
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  };
};
