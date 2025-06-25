import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, Phone, Mail, MessageSquare, User, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { supabase } from '@/integrations/supabase/client';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  tier: 'Basic' | 'Premium' | 'Enterprise' | 'Standard';
  lastContact: string;
  totalChats: number;
  satisfaction: number;
}

interface ContactsContentProps {
  onCustomerSelect: (customerId: string) => void;
}

const mockContact: Contact = {
  id: 'mock-contact-1',
  name: 'John Doe (Mock)',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  company: 'Mock Industries',
    status: 'active',
    tier: 'Premium',
  lastContact: new Date().toISOString(),
  totalChats: 5,
  satisfaction: 4.5,
};

export const ContactsContent = ({ onCustomerSelect }: ContactsContentProps) => {
  const [contacts, setContacts] = useState<Contact[]>([mockContact]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) {
        console.error('Error fetching contacts:', error);
        setContacts([]);
      } else if (data) {
        const formattedContacts: Contact[] = data.map((customer: any) => ({
          id: customer.id,
          name: customer.name || 'N/A',
          email: customer.email || 'N/A',
          phone: customer.phone || 'N/A',
          company: customer.metadata?.company || 'N/A',
          status: customer.metadata?.status || 'inactive',
          tier: customer.metadata?.tier || 'Basic',
          lastContact: customer.updated_at,
          totalChats: customer.metadata?.totalChats || 0,
          satisfaction: customer.metadata?.satisfaction || 0
        }));
        setContacts([mockContact, ...formattedContacts]);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesTier = tierFilter === 'all' || contact.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });
  }, [contacts, searchTerm, statusFilter, tierFilter]);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800', 
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      Basic: 'bg-blue-100 text-blue-800',
      Premium: 'bg-purple-100 text-purple-800',
      Enterprise: 'bg-orange-100 text-orange-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTierFilter('all');
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Contacts</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-full overflow-hidden">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>

            {/* Contacts Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Total Chats</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                        <User className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                        <p>Loading contacts...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <TableRow 
                        key={contact.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onCustomerSelect(contact.id)}
                      >
                      <TableCell>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                              {contact.phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierBadge(contact.tier)}>
                          {contact.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                            {contact.lastContact ? new Date(contact.lastContact).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{contact.satisfaction > 0 ? contact.satisfaction.toFixed(1) : 'N/A'}</span>
                          {contact.satisfaction > 0 && <span className="text-yellow-500">★</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <User className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                        <User className="w-12 h-12 mx-auto mb-2" />
                        <p>No contacts found.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
