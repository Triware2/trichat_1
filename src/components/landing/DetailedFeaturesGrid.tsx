
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, UserCheck, LineChart, Brain, Plug, Shield, CheckCircle } from 'lucide-react';

const platformFeatures = [
  {
    category: "Communication & Messaging",
    icon: MessageCircle,
    features: [
      { name: "Real-time Chat", description: "Instant messaging with typing indicators" },
      { name: "File Sharing", description: "Secure document and media sharing" },
      { name: "Canned Responses", description: "Pre-built response templates" },
      { name: "Message Threading", description: "Organized conversation threads" },
      { name: "Emoji & Reactions", description: "Rich messaging experience" },
      { name: "Message Encryption", description: "End-to-end encryption" }
    ]
  },
  {
    category: "Agent Management",
    icon: UserCheck,
    features: [
      { name: "Agent Routing", description: "Intelligent assignment algorithms" },
      { name: "Skill-based Routing", description: "Match agents to customer needs" },
      { name: "Queue Management", description: "Advanced queue handling" },
      { name: "Agent Status", description: "Real-time availability tracking" },
      { name: "Workload Balancing", description: "Automatic load distribution" },
      { name: "Performance Tracking", description: "Individual agent metrics" }
    ]
  },
  {
    category: "Analytics & Reporting",
    icon: LineChart,
    features: [
      { name: "Real-time Dashboards", description: "Live performance monitoring" },
      { name: "Custom Reports", description: "Tailored business intelligence" },
      { name: "CSAT Surveys", description: "Customer satisfaction tracking" },
      { name: "Response Time Analysis", description: "Performance optimization" },
      { name: "Conversation Analytics", description: "Deep chat insights" },
      { name: "Export & API", description: "Data integration capabilities" }
    ]
  },
  {
    category: "Automation & AI",
    icon: Brain,
    features: [
      { name: "Chatbot Builder", description: "Visual bot creation tools" },
      { name: "Intent Recognition", description: "AI-powered understanding" },
      { name: "Auto-escalation", description: "Smart handoff to agents" },
      { name: "Sentiment Analysis", description: "Emotion detection" },
      { name: "Predictive Routing", description: "ML-based assignments" },
      { name: "Smart Suggestions", description: "AI-powered responses" }
    ]
  },
  {
    category: "Integration & API",
    icon: Plug,
    features: [
      { name: "REST API", description: "Full platform API access" },
      { name: "Webhooks", description: "Real-time event notifications" },
      { name: "CRM Integration", description: "Connect with existing systems" },
      { name: "SSO Support", description: "Single sign-on capabilities" },
      { name: "Custom Fields", description: "Flexible data structures" },
      { name: "Third-party Apps", description: "Extensive app marketplace" }
    ]
  },
  {
    category: "Security & Compliance",
    icon: Shield,
    features: [
      { name: "SOC 2 Compliance", description: "Enterprise security standards" },
      { name: "GDPR Ready", description: "Data protection compliance" },
      { name: "Role-based Access", description: "Granular permissions" },
      { name: "Audit Trails", description: "Complete activity logs" },
      { name: "Data Encryption", description: "256-bit encryption" },
      { name: "IP Whitelisting", description: "Network security controls" }
    ]
  }
];

export const DetailedFeaturesGrid = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Feature Overview</h2>
          <p className="text-xl text-gray-600">Every tool you need for exceptional customer experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {platformFeatures.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{feature.name}</div>
                          <div className="text-sm text-gray-600">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
