
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { billingService, type SubscriptionPlan, type BillingInfo, type PaymentMethod, type Invoice, type PaymentMethodOption } from '@/services/billingService';
import { 
  CreditCard, 
  Clock, 
  Receipt, 
  Calendar, 
  Users, 
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Settings,
  FileText,
  Shield,
  Zap,
  AlertTriangle,
  Star,
  Download,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CreditCard as CreditCardIcon,
  Building,
  Globe,
  Lock,
  Headphones,
  BarChart3,
  Palette,
  Workflow,
  Key,
  Bell,
  Mail,
  MessageSquare,
  Database,
  Cpu,
  Network,
  Layers,
  Sparkles,
  Smartphone,
  Wallet
} from 'lucide-react';

const BillingPage = () => {
  const { user } = useAuth();
  const { 
    planDetails, 
    functionalityPercent, 
    isPlatformCreator, 
    isLoading, 
    refreshPlanDetails 
  } = useFeatureAccess();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Add Payment Method Dialog State
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('card');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isDefault, setIsDefault] = useState(false);
  const [addingPaymentMethod, setAddingPaymentMethod] = useState(false);

  // Get payment method options
  const paymentMethodOptions = billingService.getPaymentMethodOptions(paymentGateway);
  const selectedPaymentOption = paymentMethodOptions.find(option => option.value === selectedPaymentType);

  // Load billing data
  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  // Reset form when gateway changes
  useEffect(() => {
    setSelectedPaymentType('card');
    setFormData({});
    setIsDefault(false);
  }, [paymentGateway]);

  const loadBillingData = async () => {
    if (!user) return;
    
    try {
      const [billingData, paymentMethodsData, invoicesData] = await Promise.all([
        billingService.getBillingInfo(user.id),
        billingService.getPaymentMethods(user.id),
        billingService.getInvoices(user.id)
      ]);
      
      setBillingInfo(billingData);
      setPaymentMethods(paymentMethodsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing information",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadBillingData(),
        refreshPlanDetails()
      ]);
      toast({
        title: "Success",
        description: "Billing information refreshed",
      });
    } catch (error) {
      console.error('Error refreshing:', error);
      toast({
        title: "Error",
        description: "Failed to refresh billing information",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const handlePaymentProcessing = async () => {
    if (!selectedPlan || !user) return;

    setProcessingPayment(true);
    try {
      const session = await billingService.createCheckoutSession(
        user.id,
        selectedPlan.id,
        `${window.location.origin}/billing`,
        `${window.location.origin}/billing`,
        paymentGateway
      );

      if (session.successUrl) {
        window.location.href = session.successUrl;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    try {
      await billingService.cancelSubscription(user.id);
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
      await loadBillingData();
      refreshPlanDetails();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user || !selectedPaymentOption) return;

    // Validate form
    const requiredFields = selectedPaymentOption.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setAddingPaymentMethod(true);
    try {
      let paymentMethodData: any = {
        type: selectedPaymentType as any,
        isDefault
      };

      // Add specific fields based on payment type
      if (selectedPaymentType === 'card') {
        const cardNumber = formData.cardNumber || '';
        const last4 = cardNumber.slice(-4);
        const [expMonth, expYear] = (formData.expiryDate || '').split('/');
        
        paymentMethodData = {
          ...paymentMethodData,
          last4,
          brand: getCardBrand(cardNumber),
          expMonth: parseInt(expMonth),
          expYear: parseInt(expYear)
        };
      } else if (selectedPaymentType === 'upi') {
        paymentMethodData.upiId = formData.upiId;
      } else if (selectedPaymentType === 'netbanking') {
        paymentMethodData.bankName = formData.bankName;
      } else if (selectedPaymentType === 'wallet') {
        paymentMethodData.walletName = formData.walletName;
      } else if (selectedPaymentType === 'emi') {
        paymentMethodData.emiBank = formData.emiBank;
        paymentMethodData.emiTenure = parseInt(formData.emiTenure || '0');
      }

      await billingService.addPaymentMethod(user.id, paymentMethodData, paymentGateway);
      
      toast({
        title: "Success",
        description: "Payment method added successfully",
      });

      // Reset form
      setFormData({});
      setIsDefault(false);
      setShowAddPaymentMethod(false);

      // Reload payment methods
      await loadBillingData();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingPaymentMethod(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string, gateway: 'stripe' | 'razorpay') => {
    if (!user) return;

    try {
      await billingService.removePaymentMethod(paymentMethodId, gateway);
      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
      await loadBillingData();
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method",
        variant: "destructive"
      });
    }
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('34') || number.startsWith('37')) return 'amex';
    if (number.startsWith('6')) return 'discover';
    return 'unknown';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleFormDataChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'upi':
        return <Smartphone className="w-5 h-5" />;
      case 'netbanking':
        return <Building className="w-5 h-5" />;
      case 'wallet':
        return <Wallet className="w-5 h-5" />;
      case 'emi':
        return <Calendar className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodDisplayName = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.brand?.toUpperCase() || 'Card'} •••• ${method.last4}`;
      case 'upi':
        return `UPI • ${method.upiId}`;
      case 'netbanking':
        return `Net Banking • ${method.bankName}`;
      case 'wallet':
        return `Wallet • ${method.walletName}`;
      case 'emi':
        return `EMI • ${method.emiBank} (${method.emiTenure} months)`;
      default:
        return 'Payment Method';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'free':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return 'from-slate-500 to-slate-600';
      case 'growth':
        return 'from-blue-500 to-cyan-500';
      case 'pro':
        return 'from-purple-500 to-indigo-500';
      case 'enterprise':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getFeatureIcon = (feature: string) => {
    const iconMap: { [key: string]: any } = {
      'Up to 5 agents': Users,
      'Unlimited agents': Users,
      'Basic chat functionality': MessageSquare,
      'Supervisor tools': Shield,
      'Access control': Lock,
      'Web widget variants': Globe,
      'Slack, WordPress, Shopify integrations': Network,
      'CSAT dashboard': BarChart3,
      'Analytics': BarChart3,
      'Advanced analytics': BarChart3,
      'Chat rules & bulk operations': Workflow,
      'API access': Key,
      'Priority support': Headphones,
      'Custom fields': Database,
      'Integrations': Network,
      'White labeling': Palette,
      'Advanced automation': Cpu,
      'Custom workflows': Workflow,
      'Dedicated support': Headphones,
      'SSO integration': Lock,
      'Advanced security': Shield,
      'Custom integrations': Network,
      'Dedicated account manager': Users,
      'SLA guarantees': Shield,
      'Custom training': Users,
      '24/7 phone support': Headphones,
      'Basic reports': FileText,
      'Email support': Mail,
      'Basic system settings': Settings
    };
    return iconMap[feature] || CheckCircle;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <NavigationHeader title="Billing & Subscription" />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <NavigationHeader title="Billing & Subscription" />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section - Updated to match Dashboard Overview style */}
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-300/10 to-cyan-300/10 rounded-full blur-2xl"></div>
          
          {/* Content */}
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                             {/* Icon Container */}
               <div className="flex-shrink-0">
                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                   <Receipt className="w-8 h-8 text-white" />
                 </div>
               </div>
              
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h1 className="text-heading-1 font-bold text-slate-900 mb-2">
                  Billing & Subscription
                </h1>
                <p className="text-body-large text-slate-600">
                  Manage your subscription, payment methods, and billing history
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                                 <Button
                   onClick={() => setShowAddPaymentMethod(true)}
                   className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                 >
                   <Plus className="w-4 h-4" />
                   Add Payment Method
                 </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Plans & Pricing
            </TabsTrigger>
            <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Billing History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan Overview */}
            <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-indigo-50/20 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getPlanColor(planDetails?.plan_type || 'free')} flex items-center justify-center shadow-lg`}>
                      {isPlatformCreator ? (
                        <Receipt className="w-6 h-6 text-white" />
                      ) : (
                        <CreditCard className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-heading-2 font-semibold text-slate-900">
                        {isPlatformCreator ? 'Platform Creator' : `${planDetails?.plan_type?.charAt(0).toUpperCase()}${planDetails?.plan_type?.slice(1)} Plan`}
                      </CardTitle>
                      <CardDescription className="text-body text-slate-600">
                        {isPlatformCreator ? 'Unlimited access to all features' : `${functionalityPercent}% platform access`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(planDetails?.status || 'free')} px-4 py-2 text-sm font-semibold`}>
                    {planDetails?.status === 'trial' ? 'Free Trial' : planDetails?.status?.charAt(0).toUpperCase() + planDetails?.status?.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {/* Progress Bar */}
                {!isPlatformCreator && (
                  <div>
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span className="font-medium">Platform Access</span>
                      <span className="font-semibold">{functionalityPercent}%</span>
                    </div>
                    <Progress value={functionalityPercent} className="h-3 bg-slate-100" />
                  </div>
                )}

                {/* Trial Information */}
                {planDetails?.status === 'trial' && planDetails.trial_days_remaining > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl border border-blue-200/30 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">
                          {planDetails.trial_days_remaining} day{planDetails.trial_days_remaining === 1 ? '' : 's'} left in your free trial
                        </p>
                        <p className="text-sm text-blue-600">
                          Upgrade now to continue accessing all features after your trial ends
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm rounded-xl border border-slate-200/30 p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Agent Limit</span>
                    </div>
                    <p className="stat-value text-slate-900">
                      {isPlatformCreator ? '∞' : planDetails?.agent_limit || 5}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm rounded-xl border border-slate-200/30 p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Current Agents</span>
                    </div>
                    <p className="stat-value text-slate-900">
                      {planDetails?.current_agent_count || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm rounded-xl border border-slate-200/30 p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Features</span>
                    </div>
                    <p className="stat-value text-slate-900">
                      {isPlatformCreator ? '100%' : `${functionalityPercent}%`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Plan Features */}
            <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-green-500/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white/20 to-emerald-50/20 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-heading-3 font-semibold text-slate-900">Your Plan Includes</CardTitle>
                <CardDescription className="text-body text-slate-600">
                  {isPlatformCreator ? 'Full platform access with all features' : `Features available in your ${planDetails?.plan_type || 'free'} plan`}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {billingService.getPlan(planDetails?.plan_type || 'free')?.features.map((feature, index) => {
                    const Icon = getFeatureIcon(feature);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-green-200/30">
                        <div className="p-1.5 bg-green-500/10 rounded-lg">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Section */}
            {!isPlatformCreator && planDetails?.plan_type !== 'enterprise' && (
              <Card className="backdrop-blur-md bg-gradient-to-r from-blue-50/70 to-purple-50/70 border border-blue-200/30 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white/10 to-purple-50/20 pointer-events-none"></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-heading-3 font-semibold text-blue-900">Unlock More Features</CardTitle>
                  <CardDescription className="text-body text-blue-700">
                    Upgrade your plan to get access to more powerful features and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <p className="text-sm text-blue-800 mb-3">
                        Get access to more features and increase your platform capabilities
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• More agent capacity</li>
                        <li>• Advanced analytics</li>
                        <li>• Priority support</li>
                        <li>• Custom integrations</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('plans')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      View Pricing Plans
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Information */}
            <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-slate-500/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-white/20 to-gray-50/20 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-heading-3 font-semibold text-slate-900">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/30">
                  <span className="text-slate-600 font-medium">Email</span>
                  <span className="font-semibold text-slate-900">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/30">
                  <span className="text-slate-600 font-medium">Account Type</span>
                  <span className="font-semibold text-slate-900">
                    {isPlatformCreator ? 'Platform Creator' : 'Admin'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/30">
                  <span className="text-slate-600 font-medium">Current Plan</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {planDetails?.plan_type || 'Free'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/30">
                  <span className="text-slate-600 font-medium">Status</span>
                  <Badge variant="outline" className={getStatusColor(planDetails?.status || 'free')}>
                    {planDetails?.status?.charAt(0).toUpperCase() + planDetails?.status?.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans & Pricing Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {billingService.plans.map((plan) => {
                const isCurrentPlan = plan.id === planDetails?.plan_type;
                const isUpgrade = !isCurrentPlan && plan.functionalityPercent > (functionalityPercent || 0);
                
                return (
                  <Card 
                    key={plan.id}
                    className={`backdrop-blur-md bg-white/70 border border-white/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      plan.popular ? 'ring-2 ring-blue-500/50 shadow-blue-500/20' : ''
                    } ${isCurrentPlan ? 'ring-2 ring-green-500/50 shadow-green-500/20' : ''}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      plan.popular ? 'from-blue-50/30 via-white/20 to-indigo-50/20' :
                      isCurrentPlan ? 'from-green-50/30 via-white/20 to-emerald-50/20' :
                      'from-slate-50/30 via-white/20 to-gray-50/20'
                    } pointer-events-none`}></div>
                    
                    <CardHeader className="pb-4 relative z-10">
                      {plan.popular && (
                        <Badge className="w-fit mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge className="w-fit mb-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Current Plan
                        </Badge>
                      )}
                      <CardTitle className="text-heading-3 font-semibold text-slate-900">{plan.name}</CardTitle>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold text-slate-900">
                          ${plan.price}
                        </span>
                        <span className="text-slate-600">
                          {plan.price === 0 ? 'forever' : `/${plan.interval}`}
                        </span>
                      </div>
                      <CardDescription className="text-body text-slate-600">
                        {plan.agentLimit ? `Up to ${plan.agentLimit} agents` : 'Unlimited agents'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 space-y-4">
                      <div className="space-y-3">
                        {plan.features.slice(0, 5).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 5 && (
                          <div className="text-sm text-slate-500">
                            +{plan.features.length - 5} more features
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        {isCurrentPlan ? (
                          <Button 
                            variant="outline" 
                            className="w-full border-green-300 text-green-700 hover:bg-green-50"
                            disabled
                          >
                            Current Plan
                          </Button>
                        ) : isUpgrade ? (
                          <Button 
                            onClick={() => handleUpgrade(plan)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          >
                            Upgrade to {plan.name}
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            Downgrade
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-purple-500/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white/20 to-violet-50/20 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-heading-3 font-semibold text-slate-900">Payment Methods</CardTitle>
                    <CardDescription className="text-body text-slate-600">
                      Manage your payment methods for subscription billing
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowAddPaymentMethod(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCardIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No payment methods added yet</p>
                    <p className="text-sm text-slate-500">Add a payment method to manage your subscription</p>
                  </div>
                ) : (
                  paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <CreditCardIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {getPaymentMethodDisplayName(method)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {method.isDefault && 'Default'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Default
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemovePaymentMethod(method.id, method.gateway)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-orange-500/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white/20 to-amber-50/20 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-heading-3 font-semibold text-slate-900">Billing History</CardTitle>
                <CardDescription className="text-body text-slate-600">
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No invoices found</p>
                    <p className="text-sm text-slate-500">Invoices will appear here once you have billing activity</p>
                  </div>
                ) : (
                  invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-orange-200/30">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{invoice.number}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(invoice.created).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                          </p>
                          <Badge 
                            className={
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                              invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </div>
                        {invoice.pdfUrl && (
                          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Payment Method Dialog - Updated for Dynamic Payment Methods */}
        <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account for subscription billing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Payment Gateway Selection */}
              <div className="space-y-2">
                <Label htmlFor="gateway">Payment Gateway</Label>
                <Select value={paymentGateway} onValueChange={(value: 'stripe' | 'razorpay') => setPaymentGateway(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Type Selection - Only show for Razorpay */}
              {paymentGateway === 'razorpay' && (
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Payment Method</Label>
                  <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon === 'credit-card' && <CreditCard className="w-4 h-4" />}
                            {option.icon === 'smartphone' && <Smartphone className="w-4 h-4" />}
                            {option.icon === 'building' && <Building className="w-4 h-4" />}
                            {option.icon === 'wallet' && <Wallet className="w-4 h-4" />}
                            {option.icon === 'calendar' && <Calendar className="w-4 h-4" />}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPaymentOption && (
                    <p className="text-sm text-slate-600">{selectedPaymentOption.description}</p>
                  )}
                </div>
              )}

              {/* Show description for Stripe */}
              {paymentGateway === 'stripe' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Credit/Debit Card</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Pay with Visa, Mastercard, American Express, or Discover
                  </p>
                </div>
              )}

              {/* Dynamic Form Fields */}
              {selectedPaymentOption && (
                <div className="space-y-4">
                  {selectedPaymentOption.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === 'select' ? (
                        <Select 
                          value={formData[field.name] || ''} 
                          onValueChange={(value) => handleFormDataChange(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (field.name === 'cardNumber') {
                              value = formatCardNumber(value);
                            } else if (field.name === 'expiryDate') {
                              value = formatExpiryDate(value);
                            } else if (field.name === 'cvv') {
                              value = value.replace(/\D/g, '');
                            }
                            handleFormDataChange(field.name, value);
                          }}
                          maxLength={field.validation?.maxLength}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="isDefault">Set as default payment method</Label>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddPaymentMethod}
                  disabled={addingPaymentMethod}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  {addingPaymentMethod ? 'Adding...' : 'Add Payment Method'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
              <DialogDescription>
                You're about to upgrade to the {selectedPlan?.name} plan for ${selectedPlan?.price}/{selectedPlan?.interval}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What's included:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {selectedPlan?.features.slice(0, 5).map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePaymentProcessing}
                  disabled={processingPayment}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {processingPayment ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BillingPage;
