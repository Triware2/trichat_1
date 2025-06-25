export interface CustomerComplaint {
  id: string;
  date: string;
  subject: string;
  category: string;
  status: 'open' | 'resolved' | 'pending';
  priority: 'high' | 'medium' | 'low';
  lastUpdate: string;
}

export interface CustomerComplaintsPreviewProps {
  chatId: string | null;
  customerName: string;
  onViewFullProfile: () => void;
}
