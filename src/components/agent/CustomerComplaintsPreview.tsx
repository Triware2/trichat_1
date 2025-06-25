import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Eye, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerComplaintsPreviewProps, CustomerComplaint } from './complaints/types';
import { LoadingState } from './complaints/LoadingState';
import { ComplaintItem } from './complaints/ComplaintItem';
import { EmptyState } from './complaints/EmptyState';
import { supabase } from '@/integrations/supabase/client';

export const CustomerComplaintsPreview = ({ 
  complaints, 
  isLoading, 
  onViewFullProfile 
}: { 
  complaints: CustomerComplaint[], 
  isLoading: boolean, 
  onViewFullProfile: () => void 
}) => {

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Previous Complaints ({complaints.length})
        </CardTitle>
      </CardHeader>
      <div className="space-y-3 p-4">
        {complaints.length === 0 ? (
          <>
          <EmptyState />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 justify-center"
              onClick={onViewFullProfile}
            >
              <Eye className="w-4 h-4 mr-2" />
              Open Customer 360
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </>
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
      </div>
    </>
  );
};
