
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, ChevronRight } from 'lucide-react';
import { CustomerComplaintsPreviewProps, CustomerComplaint } from './complaints/types';
import { getMockComplaints } from './complaints/mockDataProvider';
import { ComplaintItem } from './complaints/ComplaintItem';
import { LoadingState } from './complaints/LoadingState';
import { EmptyState } from './complaints/EmptyState';

export const CustomerComplaintsPreview = ({ chatId, customerName, onViewFullProfile }: CustomerComplaintsPreviewProps) => {
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerComplaints = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setComplaints(getMockComplaints(chatId));
      setLoading(false);
    };

    fetchCustomerComplaints();
  }, [chatId]);

  if (loading) {
    return <LoadingState />;
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
          <EmptyState />
        ) : (
          <>
            {complaints.slice(0, 3).map((complaint) => (
              <ComplaintItem
                key={complaint.id}
                complaint={complaint}
                onClick={onViewFullProfile}
              />
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
