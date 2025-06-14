
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, ChevronRight, Eye } from 'lucide-react';

interface CustomerComplaint {
  id: string;
  date: string;
  subject: string;
  category: string;
  status: 'open' | 'resolved' | 'pending';
  priority: 'high' | 'medium' | 'low';
  lastUpdate: string;
}

interface CustomerComplaintsPreviewProps {
  chatId: number;
  customerName: string;
  onViewFullProfile: () => void;
}

export const CustomerComplaintsPreview = ({ chatId, customerName, onViewFullProfile }: CustomerComplaintsPreviewProps) => {
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerComplaints = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data based on chatId - this would come from your actual API
      const mockComplaints: { [key: number]: CustomerComplaint[] } = {
        1: [
          {
            id: "C001",
            date: "2024-01-08",
            subject: "Delayed shipment notification",
            category: "Shipping",
            status: "resolved",
            priority: "medium",
            lastUpdate: "2024-01-09"
          },
          {
            id: "C002",
            date: "2024-01-05",
            subject: "Product quality issue",
            category: "Product",
            status: "resolved",
            priority: "high",
            lastUpdate: "2024-01-06"
          },
          {
            id: "C003",
            date: "2023-12-28",
            subject: "Billing discrepancy",
            category: "Billing",
            status: "resolved",
            priority: "low",
            lastUpdate: "2023-12-30"
          }
        ],
        2: [
          {
            id: "C004",
            date: "2024-01-06",
            subject: "Account access issue",
            category: "Account",
            status: "resolved",
            priority: "medium",
            lastUpdate: "2024-01-07"
          }
        ],
        3: [
          {
            id: "C005",
            date: "2024-01-10",
            subject: "Subscription cancellation",
            category: "Billing",
            status: "pending",
            priority: "medium",
            lastUpdate: "2024-01-11"
          },
          {
            id: "C006",
            date: "2024-01-07",
            subject: "Feature request",
            category: "Product",
            status: "open",
            priority: "low",
            lastUpdate: "2024-01-08"
          }
        ],
        4: [
          {
            id: "C007",
            date: "2024-01-09",
            subject: "Technical support needed",
            category: "Technical",
            status: "open",
            priority: "high",
            lastUpdate: "2024-01-10"
          }
        ]
      };

      setComplaints(mockComplaints[chatId] || []);
      setLoading(false);
    };

    fetchCustomerComplaints();
  }, [chatId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="w-80 h-fit border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700">Previous Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-fit border-slate-200 shadow-sm mb-4">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Previous Complaints ({complaints.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {complaints.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No previous complaints found</p>
          </div>
        ) : (
          <>
            {complaints.slice(0, 3).map((complaint) => (
              <div 
                key={complaint.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={onViewFullProfile}
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
            ))}
            
            {complaints.length > 3 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center mb-2">
                  +{complaints.length - 3} more complaints
                </p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 justify-center"
              onClick={onViewFullProfile}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Complete Customer Profile
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
