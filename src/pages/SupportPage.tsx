import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Headphones, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  FileText, 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Users,
  Settings,
  Globe,
  Database,
  Cpu,
  Network,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Send,
  Plus,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Rocket,
  Lightbulb,
  Bot,
  Code,
  Palette,
  Workflow,
  Key,
  Bell,
  CreditCard,
  Mail as MailIcon,
  MessageSquare as MessageSquareIcon,
  Phone as PhoneIcon,
  Video as VideoIcon,
  FileText as FileTextIcon,
  BookOpen as BookOpenIcon,
  Search as SearchIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Globe as GlobeIcon,
  Database as DatabaseIcon,
  Cpu as CpuIcon,
  Network as NetworkIcon,
  Layers as LayersIcon,
  Sparkles as SparklesIcon,
  HelpCircle as HelpCircleIcon,
  ExternalLink as ExternalLinkIcon,
  Send as SendIcon,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  Rocket as RocketIcon,
  Lightbulb as LightbulbIcon,
  Bot as BotIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Workflow as WorkflowIcon,
  Key as KeyIcon,
  Bell as BellIcon,
  ChevronRight,
  ArrowRight,
  Sparkles as SparklesIcon2,
  Activity
} from 'lucide-react';

const SupportPage = () => {
  const { user } = useAuth();
  const { planDetails, functionalityPercent, isPlatformCreator } = useFeatureAccess();
  const { toast } = useToast();
  
  console.log('SupportPage rendering', { user, planDetails, functionalityPercent, isPlatformCreator });
  
  // Add a visible indicator for testing
  useEffect(() => {
    console.log('SupportPage mounted successfully');
  }, []);
  
  // State management
  const [activeTab, setActiveTab] = useState('contact');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: '',
    message: ''
  });

  const handleContactSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support Request Submitted",
        description: "We've received your request and will respond within 24 hours.",
      });
      
      setShowContactDialog(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Live Chat Functions
  const handleStartChat = async () => {
    setIsConnecting(true);
    try {
      // Simulate connecting to chat service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add welcome message
      const welcomeMessage = {
        id: '1',
        message: 'Hello! Welcome to Trichat Support. My name is Sarah, and I\'m here to help you today. How can I assist you?',
        sender: 'agent' as const,
        timestamp: new Date()
      };
      
      setChatHistory([welcomeMessage]);
      setIsConnecting(false);
    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: chatMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        message: 'Thank you for your message. I\'m looking into this for you. Please give me a moment to check our systems.',
        sender: 'agent' as const,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, agentResponse]);
    }, 1000);
  };

  // Phone Support Functions
  const handlePhoneCall = async (option: string) => {
    try {
      let phoneNumber = '';
      let action = '';

      switch (option) {
        case 'urgent':
          phoneNumber = '+1 (555) 123-4567';
          action = 'Connecting to urgent support line...';
          break;
        case 'general':
          phoneNumber = '+1 (555) 987-6543';
          action = 'Connecting to general support...';
          break;
        case 'callback':
          action = 'We\'ll call you back within 15 minutes';
          break;
        default:
          phoneNumber = '+1 (555) 123-4567';
          action = 'Connecting to support...';
      }

      toast({
        title: "Phone Support",
        description: action,
      });

      if (option !== 'callback' && phoneNumber) {
        // In a real app, this would integrate with a telephony service
        window.open(`tel:${phoneNumber}`, '_blank');
      }

      setShowPhoneDialog(false);
      setSelectedPhoneOption('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Video Consultation Functions
  const handleScheduleVideoCall = async () => {
    if (!selectedVideoDate || !selectedVideoTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your consultation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate scheduling API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Video Call Scheduled",
        description: `Your consultation has been scheduled for ${selectedVideoDate} at ${selectedVideoTime}. You'll receive a confirmation email with the meeting link.`,
      });

      setShowVideoDialog(false);
      setSelectedVideoDate('');
      setSelectedVideoTime('');
    } catch (error) {
      toast({
        title: "Scheduling Error",
        description: "Failed to schedule video call. Please try again.",
        variant: "destructive",
      });
    }
  };

  // State for different support channels
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, message: string, sender: 'user' | 'agent', timestamp: Date}>>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPhoneOption, setSelectedPhoneOption] = useState('');
  const [selectedVideoTime, setSelectedVideoTime] = useState('');
  const [selectedVideoDate, setSelectedVideoDate] = useState('');

  const supportChannels = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message and get a response within 24 hours',
      icon: Mail,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      features: ['24-hour response time', 'Detailed documentation', 'File attachments'],
      buttonText: 'Send Email',
      action: () => setShowContactDialog(true)
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Get instant help from our support team during business hours',
      icon: MessageSquare,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-emerald-600',
      features: ['Instant response', 'Real-time assistance', 'Screen sharing available'],
      buttonText: 'Start Chat',
      action: () => setShowLiveChat(true)
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our support team for urgent issues',
      icon: Phone,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      features: ['Direct conversation', 'Immediate resolution', 'Priority handling'],
      buttonText: 'Call Now',
      action: () => setShowPhoneDialog(true)
    },
    {
      id: 'video',
      title: 'Video Consultation',
      description: 'Schedule a video consultation for complex issues',
      icon: Video,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      features: ['Face-to-face support', 'Screen sharing', 'Personalized assistance'],
      buttonText: 'Schedule Call',
      action: () => setShowVideoDialog(true)
    }
  ];

  const quickActions = [
    {
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => window.open('/documentation', '_blank')
    },
    {
      title: 'FAQ',
      description: 'Find answers to commonly asked questions',
      icon: HelpCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: () => setActiveTab('faq')
    },
    {
      title: 'System Status',
      description: 'Check the current status of our services',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => setActiveTab('status')
    },
    {
      title: 'Community',
      description: 'Connect with other users and share solutions',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => window.open('/community', '_blank')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <Headphones className="w-10 h-10 text-white" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Support & Help Center
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                Get the assistance you need through multiple support channels. Our team is here to help you succeed.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl"
                onClick={() => setShowContactDialog(true)}
              >
                <Plus className="w-5 h-5 mr-3" />
                Submit Request
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
              >
                <Search className="w-5 h-5 mr-3" />
                Search Help
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">&lt;24h</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Support Channels Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your Support Channel
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the most convenient way to get help. Each channel is optimized for different types of inquiries.
            </p>
          </div>
          
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportChannels.map((channel) => (
                <Card key={channel.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${channel.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        <channel.icon className="w-7 h-7 text-white" />
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {channel.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-base">
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="space-y-3">
                      {channel.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r ${channel.gradient} hover:shadow-xl transition-all duration-300 text-white border-0 py-3 text-base font-semibold rounded-xl`}
                      onClick={channel.action}
                    >
                      {channel.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access helpful resources and tools to resolve issues faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@trichat.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">All Systems Operational</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-0">Online</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">API Services</span>
                    <span className="text-emerald-600">✓ Operational</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Database</span>
                    <span className="text-emerald-600">✓ Operational</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Chat Services</span>
                    <span className="text-emerald-600">✓ Operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-blue-600" />
              Submit Support Request
            </DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={contactForm.category} onValueChange={(value) => setContactForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Subscription</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={contactForm.priority} onValueChange={(value) => setContactForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Please provide detailed information about your issue..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowContactDialog(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={handleContactSubmit}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={showLiveChat} onOpenChange={setShowLiveChat}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Live Chat Support
            </DialogTitle>
            <DialogDescription>
              Chat with our support team in real-time. Average response time: 2 minutes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            {chatHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="text-gray-600">Connecting to support team...</p>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-16 h-16 text-emerald-400 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Chat?</h3>
                        <p className="text-gray-600 mb-4">Click the button below to start a conversation with our support team.</p>
                        <Button 
                          onClick={handleStartChat}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="flex gap-2 pt-4">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendChatMessage}
                    disabled={!chatMessage.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Support Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              Phone Support
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to connect with our support team over the phone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPhoneOption === 'urgent'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedPhoneOption('urgent')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Urgent Support</h4>
                    <p className="text-sm text-gray-600">For critical issues requiring immediate attention</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPhoneOption === 'general'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedPhoneOption('general')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">General Support</h4>
                    <p className="text-sm text-gray-600">For general questions and assistance</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPhoneOption === 'callback'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedPhoneOption('callback')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Request Callback</h4>
                    <p className="text-sm text-gray-600">We'll call you back within 15 minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handlePhoneCall(selectedPhoneOption)}
                disabled={!selectedPhoneOption}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                {selectedPhoneOption === 'callback' ? 'Request Callback' : 'Call Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Consultation Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-orange-600" />
              Schedule Video Consultation
            </DialogTitle>
            <DialogDescription>
              Book a video consultation with our support team for complex issues.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoDate">Preferred Date</Label>
                <Input
                  id="videoDate"
                  type="date"
                  value={selectedVideoDate}
                  onChange={(e) => setSelectedVideoDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoTime">Preferred Time</Label>
                <Select value={selectedVideoTime} onValueChange={setSelectedVideoTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">What to expect:</p>
                  <ul className="space-y-1">
                    <li>• 30-minute consultation session</li>
                    <li>• Screen sharing capabilities</li>
                    <li>• Meeting link sent via email</li>
                    <li>• Technical specialist assigned</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleVideoCall}
                disabled={!selectedVideoDate || !selectedVideoTime}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportPage; 