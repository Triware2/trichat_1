
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
  Calendar,
  Users,
  MessageSquare,
  Clock,
  Activity,
  Target
} from 'lucide-react';

interface AdvancedFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

export const AdvancedFiltersModal = ({ open, onOpenChange, onApplyFilters }: AdvancedFiltersModalProps) => {
  const [filters, setFilters] = useState({
    departments: [] as string[],
    statuses: [] as string[],
    performanceRange: {
      satisfactionMin: '',
      satisfactionMax: '',
      responseTimeMin: '',
      responseTimeMax: ''
    },
    workload: {
      activeChatMin: '',
      activeChatMax: '',
      queueMin: '',
      queueMax: ''
    },
    dateRange: {
      start: '',
      end: ''
    },
    lastActivityRange: '',
    showOnlineOnly: false,
    showHighPerformers: false,
    showOverloaded: false
  });

  const departmentOptions = ['Technical Support', 'Billing Support', 'General Support', 'Sales'];
  const statusOptions = ['Online', 'Busy', 'Away', 'Break'];
  const activityRanges = ['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours'];

  const addToArrayFilter = (filterType: 'departments' | 'statuses', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: [...prev[filterType], value]
    }));
  };

  const removeFromArrayFilter = (filterType: 'departments' | 'statuses', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      departments: [],
      statuses: [],
      performanceRange: {
        satisfactionMin: '',
        satisfactionMax: '',
        responseTimeMin: '',
        responseTimeMax: ''
      },
      workload: {
        activeChatMin: '',
        activeChatMax: '',
        queueMin: '',
        queueMax: ''
      },
      dateRange: {
        start: '',
        end: ''
      },
      lastActivityRange: '',
      showOnlineOnly: false,
      showHighPerformers: false,
      showOverloaded: false
    });
  };

  const applyFilters = () => {
    console.log('Applying advanced filters:', filters);
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.departments.length;
    count += filters.statuses.length;
    if (filters.performanceRange.satisfactionMin || filters.performanceRange.satisfactionMax) count++;
    if (filters.performanceRange.responseTimeMin || filters.performanceRange.responseTimeMax) count++;
    if (filters.workload.activeChatMin || filters.workload.activeChatMax) count++;
    if (filters.workload.queueMin || filters.workload.queueMax) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.lastActivityRange) count++;
    if (filters.showOnlineOnly) count++;
    if (filters.showHighPerformers) count++;
    if (filters.showOverloaded) count++;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Advanced Team Filters
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
          {/* Departments Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {departmentOptions.map((dept) => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.departments.includes(dept)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('departments', dept);
                      } else {
                        removeFromArrayFilter('departments', dept);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Status Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addToArrayFilter('statuses', status);
                      } else {
                        removeFromArrayFilter('statuses', status);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Performance Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Performance Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Satisfaction (%)</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.performanceRange.satisfactionMin}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      performanceRange: { ...prev.performanceRange, satisfactionMin: e.target.value }
                    }))}
                  />
                  <Input 
                    placeholder="Max"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.performanceRange.satisfactionMax}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      performanceRange: { ...prev.performanceRange, satisfactionMax: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Response Time (min)</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min"
                    type="number"
                    min="0"
                    value={filters.performanceRange.responseTimeMin}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      performanceRange: { ...prev.performanceRange, responseTimeMin: e.target.value }
                    }))}
                  />
                  <Input 
                    placeholder="Max"
                    type="number"
                    min="0"
                    value={filters.performanceRange.responseTimeMax}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      performanceRange: { ...prev.performanceRange, responseTimeMax: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workload Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Active Chats</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min"
                    type="number"
                    min="0"
                    value={filters.workload.activeChatMin}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      workload: { ...prev.workload, activeChatMin: e.target.value }
                    }))}
                  />
                  <Input 
                    placeholder="Max"
                    type="number"
                    min="0"
                    value={filters.workload.activeChatMax}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      workload: { ...prev.workload, activeChatMax: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Queue Length</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min"
                    type="number"
                    min="0"
                    value={filters.workload.queueMin}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      workload: { ...prev.workload, queueMin: e.target.value }
                    }))}
                  />
                  <Input 
                    placeholder="Max"
                    type="number"
                    min="0"
                    value={filters.workload.queueMax}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      workload: { ...prev.workload, queueMax: e.target.value }
                    }))}
                  />
                </div>
              </div>
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

          {/* Last Activity Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={filters.lastActivityRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, lastActivityRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  {activityRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      Within {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Online Only</Label>
            <Switch 
              checked={filters.showOnlineOnly}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlineOnly: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">High Performers (95%+)</Label>
            <Switch 
              checked={filters.showHighPerformers}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showHighPerformers: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Overloaded (5+ chats)</Label>
            <Switch 
              checked={filters.showOverloaded}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOverloaded: checked }))}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.departments.map((dept) => (
                <Badge key={`dept-${dept}`} variant="secondary" className="gap-1">
                  Dept: {dept}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArrayFilter('departments', dept)}
                  />
                </Badge>
              ))}
              {filters.statuses.map((status) => (
                <Badge key={`status-${status}`} variant="secondary" className="gap-1">
                  Status: {status}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArrayFilter('statuses', status)}
                  />
                </Badge>
              ))}
              {filters.showOnlineOnly && (
                <Badge variant="secondary" className="gap-1">
                  Online Only
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, showOnlineOnly: false }))}
                  />
                </Badge>
              )}
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
