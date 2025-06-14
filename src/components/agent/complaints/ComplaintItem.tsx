
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { CustomerComplaint } from './types';
import { getStatusColor, getPriorityColor } from './complaintsUtils';

interface ComplaintItemProps {
  complaint: CustomerComplaint;
  onClick: () => void;
}

export const ComplaintItem = ({ complaint, onClick }: ComplaintItemProps) => {
  return (
    <div 
      className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-600">#{complaint.id}</span>
        <div className="flex gap-1">
          <Badge variant="outline" className={getStatusColor(complaint.status)}>
            {complaint.status}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
            {complaint.priority}
          </Badge>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-900 mb-1 line-clamp-1">
        {complaint.subject}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {complaint.date}
        </span>
        <span>{complaint.category}</span>
      </div>
    </div>
  );
};
