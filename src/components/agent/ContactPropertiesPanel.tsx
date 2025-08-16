import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, Calendar, DollarSign, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { customizationService } from '@/services/customizationService';

interface ContactProperties {
  orderId: string;
  orderStatus: string;
  orderDate: string;
  orderAmount: string;
  productName: string;
  issueType: string;
  priority: string;
  customerTier: string;
  lastPurchase: string;
  totalSpent: string;
  location: string;
  phone: string;
  email: string;
  customerId?: string;
}

interface ContactPropertiesPanelProps {
  chatId: string | null;
  customerName: string;
}

export const ContactPropertiesPanel = ({ chatId, customerName }: ContactPropertiesPanelProps) => {
  const [properties, setProperties] = useState<ContactProperties | null>(null);
  const [loading, setLoading] = useState(true);
  const [customCustomerFields, setCustomCustomerFields] = useState<any[]>([]);
  const [customCustomerValues, setCustomCustomerValues] = useState<Record<string, any>>({});
  const [mountedSections, setMountedSections] = useState<Array<{ label: string; fields: any[]; record: any }>>([]);

  // Simulate API call to fetch contact properties based on chat context
  useEffect(() => {
    const fetchContactProperties = async () => {
      if (!chatId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      try {
        const studioFields = await customizationService.listFieldsForObject('customers');
        setCustomCustomerFields(studioFields || []);
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('*, customers(*)')
          .eq('id', chatId)
          .single();

        if (chatError) throw chatError;

        if (chatData && chatData.customers) {
          const customer = chatData.customers as any; // The relationship returns an object, not an array for single()
          const metadata = chatData.metadata as any; // For easier access
          const customerMeta = (customer?.metadata || {}) as Record<string, any>;
          const values: Record<string, any> = {};
          (studioFields || []).forEach((f: any) => {
            values[f.name] = customerMeta[f.name] ?? '';
          });
          setCustomCustomerValues(values);

          setProperties({
            orderId: chatData.id.toString(),
            orderStatus: chatData.status,
            orderDate: new Date(chatData.created_at).toLocaleDateString(),
            orderAmount: metadata?.orderAmount || 'N/A',
            productName: metadata?.productName || 'N/A',
            issueType: metadata?.issueType || 'Inquiry',
            priority: chatData.priority || 'Medium',
            customerTier: customer.metadata?.tier || 'Standard',
            lastPurchase: customer.metadata?.last_purchase_date || 'N/A',
            totalSpent: customer.metadata?.total_spent ? `$${customer.metadata.total_spent.toFixed(2)}` : '$0.00',
            location: customer.location || 'Unknown',
            phone: customer.phone || 'N/A',
            email: customer.email,
            customerId: customer.id
          });
        }
      } catch (error) {
        console.error("Error fetching contact properties:", error);
      } finally {
      setLoading(false);
      }
    };

    fetchContactProperties();
  }, [chatId]);

  useEffect(() => {
	(async () => {
		try {
			if (!properties) return;
			const placements = await customizationService.listObjectPlacements({ destination: 'contact_panel' });
			const active = (placements || []).filter((p: any) => p.is_active);
			const sections: Array<{ label: string; fields: any[]; record: any }> = [];
			for (const p of active) {
				const objectId = p.object_id;
				const fields = await customizationService.listObjectFields(objectId);
				let records: any[] = [];
				if (p.link_key === 'email' && properties.email) {
					records = await customizationService.listObjectRecords(objectId, { from: 0, to: 0, search: undefined });
					records = (records || []).filter(r => (r.data?.email || '').toLowerCase() === (properties.email || '').toLowerCase());
				} else if (p.link_key === 'customer_id' && properties.customerId) {
					records = await customizationService.listObjectRecordsForCustomer(objectId, properties.customerId);
				}
				const record = records?.[0] || null;
				if (!record) continue;
				const includeSet = new Set<string>((p.include_fields || []) as string[]);
				const visibleFields = includeSet.size > 0 ? fields.filter((f: any) => includeSet.has(f.name)) : fields;
				sections.push({ label: p.section_label, fields: visibleFields, record });
			}
			setMountedSections(sections);
		} catch (e) { /* noop */ }
	})();
}, [properties?.customerId, properties?.email]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="w-80 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700">Contact Properties</CardTitle>
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

  if (!properties) {
    return null;
  }

  return (
    <>
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-t-2xl">
        <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Properties
        </CardTitle>
      </CardHeader>
      <div className="space-y-6 p-4">
        {/* Order Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Package className="w-4 h-4" />
            ORDER DETAILS
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Order ID:</span>
              <span className="font-medium text-slate-900 break-words min-w-0">{properties.orderId}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Status:</span>
              <Badge variant="outline" className={getStatusColor(properties.orderStatus) + ' break-words min-w-0'}>
                {properties.orderStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Amount:</span>
              <span className="font-medium text-slate-900 break-words min-w-0">{properties.orderAmount}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Product:</span>
              <span className="font-medium text-slate-900 text-right break-words min-w-0">{properties.productName}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issue Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <AlertCircle className="w-4 h-4" />
            ISSUE DETAILS
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Type:</span>
              <span className="font-medium text-slate-900 break-words min-w-0">{properties.issueType}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Priority:</span>
              <Badge variant="outline" className={getPriorityColor(properties.priority)}>
                {properties.priority}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Customer Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <DollarSign className="w-4 h-4" />
            CUSTOMER INFO
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Tier:</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 break-words min-w-0">
                {properties.customerTier}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Total Spent:</span>
              <span className="font-medium text-slate-900 break-words min-w-0">{properties.totalSpent}</span>
            </div>
            {customCustomerFields && customCustomerFields.length > 0 && (
              <div className="pt-2">
                {customCustomerFields.map((f: any) => (
                  <div key={f.id} className="flex flex-wrap justify-between items-center min-w-0">
                    <span className="text-slate-600 min-w-0">{f.label}:</span>
                    <span className="font-medium text-slate-900 break-words min-w-0">{String(customCustomerValues[f.name] ?? '')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Phone className="w-4 h-4" />
            CONTACT INFO
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Email:</span>
              <span className="text-slate-900 text-xs break-words min-w-0">{properties.email}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Phone:</span>
              <span className="text-slate-900 text-xs break-words min-w-0">{properties.phone}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center min-w-0">
              <span className="text-slate-600 min-w-0">Location:</span>
              <span className="text-slate-900 text-xs break-words min-w-0">{properties.location}</span>
            </div>
          </div>
        </div>
        {mountedSections.map((sec, idx) => (
	<div key={`mounted-${idx}`} className="mt-6">
		<div className="text-xs font-semibold text-slate-500 mb-2">{sec.label}</div>
		<div className="space-y-2">
			{sec.fields.map((f: any) => (
				<div key={f.id} className="flex items-center justify-between">
					<span className="text-slate-500 text-sm">{f.label}</span>
					<span className="text-slate-900 text-sm">{sec.record?.data?.[f.name] ?? '—'}</span>
				</div>
			))}
		</div>
	</div>
))}
      </div>
    </>
  );
};
