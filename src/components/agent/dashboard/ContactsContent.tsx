import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, Mail, Phone, User, Building, Calendar } from 'lucide-react';
import { AddContactModal } from './AddContactModal';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  lastContact: string;
  totalChats: number;
  satisfaction: number;
  tier: string;
  location: string;
}

export const ContactsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Corp',
      status: 'active',
      lastContact: '2024-01-12',
      totalChats: 15,
      satisfaction: 4.8,
      tier: 'Premium',
      location: 'New York, USA'
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1 (555) 234-5678',
      company: 'Design Studio',
      status: 'active',
      lastContact: '2024-01-11',
      totalChats: 8,
      satisfaction: 4.5,
      tier: 'Standard',
      location: 'California, USA'
    },
    {
      id: '3',
      name: 'Bob Williams',
      email: 'bob.williams@company.com',
      phone: '+1 (555) 345-6789',
      company: 'Marketing Inc',
      status: 'inactive',
      lastContact: '2024-01-05',
      totalChats: 3,
      satisfaction: 3.2,
      tier: 'Basic',
      location: 'Texas, USA'
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily.brown@business.net',
      phone: '+1 (555) 456-7890',
      company: 'Consulting Group',
      status: 'prospect',
      lastContact: '2024-01-10',
      totalChats: 1,
      satisfaction: 5.0,
      tier: 'Premium',
      location: 'Florida, USA'
    },
    {
      id: '5',
      name: 'Michael Davis',
      email: 'michael.davis@enterprise.com',
      phone: '+1 (555) 567-8901',
      company: 'Enterprise Solutions',
      status: 'active',
      lastContact: '2024-01-13',
      totalChats: 22,
      satisfaction: 4.9,
      tier: 'Enterprise',
      location: 'Illinois, USA'
    }
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      prospect: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      Basic: 'bg-slate-100 text-slate-800 border-slate-200',
      Standard: 'bg-amber-100 text-amber-800 border-amber-200',
      Premium: 'bg-purple-100 text-purple-800 border-purple-200',
      Enterprise: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return variants[tier as keyof typeof variants] || variants.Basic;
  };

  const handleContactClick = (contact: Contact) => {
    console.log('Opening contact details for:', contact.name);
  };

  const handleAddContact = () => {
    setIsAddContactOpen(true);
  };

  const handleContactAdded = (newContact: Contact) => {
    setContacts(prev => [...prev, newContact]);
  };

  return (
    <TabsContent value="contacts" className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your customer contact list</p>
          </div>
          <Button onClick={handleAddContact} className="bg-emerald-500 hover:bg-emerald-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                  className={filterStatus === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('inactive')}
                  className={filterStatus === 'inactive' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  Inactive
                </Button>
                <Button
                  variant={filterStatus === 'prospect' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('prospect')}
                  className={filterStatus === 'prospect' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  Prospects
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Showing {filteredContacts.length} of {contacts.length} contacts</span>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Contact List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Tier</TableHead>
                    <TableHead className="font-semibold">Last Contact</TableHead>
                    <TableHead className="font-semibold">Total Chats</TableHead>
                    <TableHead className="font-semibold">Satisfaction</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow 
                      key={contact.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleContactClick(contact)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {contact.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(contact.status)}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierBadge(contact.tier)}>
                          {contact.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {contact.lastContact}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{contact.totalChats}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{contact.satisfaction}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {contact.location}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onContactAdded={handleContactAdded}
      />
    </TabsContent>
  );
};
