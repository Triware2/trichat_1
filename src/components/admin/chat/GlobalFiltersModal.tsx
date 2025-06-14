
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Plus,
  Calendar,
  Users,
  MessageSquare,
  Clock,
  Tag,
  Target
} from 'lucide-react';

interface GlobalFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalFiltersModal = ({ open, onOpenChange }: GlobalFiltersModalProps) => {
  const [filters, setFilters] = useState({
    channels: [] as string[],
    status: [] as string[],
    priority: [] as string[],
    agents: [] as string[],
    dateRange: {
      start: '',
      end: ''
    },
    tags: [] as string[],
    customerType: '',
    responseTime: {
      min: '',
      max: ''
    },
    sentiment: '',
    escalated: false,
    resolved: null as boolean | null
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const channelOptions = ['website', 'whatsapp', 'facebook', 'instagram', 'email', 'sms'];
  const statusOptions = ['active', 'waiting', 'closed', 'escalated'];
  const priorityOptions = ['high', 'medium', 'low'];
  const agentOptions = ['Agent Sarah', 'Agent Mike', 'Agent Lisa', 'Agent John'];
  const customerTypes = ['new', 'returning', 'vip', 'premium'];
  const sentimentOptions = ['positive', 'neutral', 'negative'];

  const toggleFilter = (filterName: string) => {
    setActiveFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const addToArrayFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: [...(prev[filterType] as string[]), value]
    }));
  };

  const removeFromArrayFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      channels: [],
      status: [],
      priority: [],
      agents: [],
      dateRange: { start: '', end: '' },
      tags: [],
      customerType: '',
      responseTime: { min: '', max: '' },
      sentiment: '',
      escalated: false,
      resolved: null
    });
    setActiveFilters([]);
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.channels.length;
    count += filters.status.length;
    count += filters.priority.length;
    count += filters.agents.length;
    count += filters.tags.length;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.customerType) count++;
    if (filters.responseTime.min || filters.responseTime.max) count++;
    if (filters.sentiment) count++;
    if (filters.escalated) count++;
    if (filters.resolved !== null) count++;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Global Chat Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {/* Channels Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {channelOptions.map((channel) => (
                <label key={channel} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.channels.includes(channel)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('channels', channel);
                      } else {
                        removeFromArrayFilter('channels', channel);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize text-sm">{channel}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Status Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('status', status);
                      } else {
                        removeFromArrayFilter('status', status);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize text-sm">{status}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Priority Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityOptions.map((priority) => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.priority.includes(priority)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('priority', priority);
                      } else {
                        removeFromArrayFilter('priority', priority);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize text-sm">{priority}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Agents Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {agentOptions.map((agent) => (
                <label key={agent} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.agents.includes(agent)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('agents', agent);
                      } else {
                        removeFromArrayFilter('agents', agent);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{agent}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Date Range Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input 
                  type="date" 
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input 
                  type="date" 
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Response Time Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Response Time (min)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Min</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  value={filters.responseTime.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    responseTime: { ...prev.responseTime, min: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label className="text-xs">Max</Label>
                <Input 
                  type="number" 
                  placeholder="60"
                  value={filters.responseTime.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    responseTime: { ...prev.responseTime, max: e.target.value }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Customer Type</Label>
            <Select 
              value={filters.customerType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, customerType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                {customerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sentiment</Label>
            <Select 
              value={filters.sentiment}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sentiment: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any sentiment</SelectItem>
                {sentimentOptions.map((sentiment) => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Escalated Only</Label>
              <Switch 
                checked={filters.escalated}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, escalated: checked }))}
              />
            </div>
            <div>
              <Label>Resolution Status</Label>
              <Select 
                value={filters.resolved === null ? '' : filters.resolved.toString()}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  resolved: value === '' ? null : value === 'true' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="true">Resolved</SelectItem>
                  <SelectItem value="false">Unresolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.channels.map((channel) => (
                <Badge key={`channel-${channel}`} variant="secondary" className="gap-1">
                  Channel: {channel}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArrayFilter('channels', channel)}
                  />
                </Badge>
              ))}
              {filters.status.map((status) => (
                <Badge key={`status-${status}`} variant="secondary" className="gap-1">
                  Status: {status}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArrayFilter('status', status)}
                  />
                </Badge>
              ))}
              {filters.priority.map((priority) => (
                <Badge key={`priority-${priority}`} variant="secondary" className="gap-1">
                  Priority: {priority}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArrayFilter('priority', priority)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters ({getActiveFilterCount()})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
