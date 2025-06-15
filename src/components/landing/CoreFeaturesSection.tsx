
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, BarChart3, Bot, CheckCircle } from 'lucide-react';

const coreFeatures = [
  {
    icon: MessageSquare,
    title: "AI-Powered Chat Engine",
    description: "Advanced natural language processing with multi-language support and intelligent routing",
    features: ["Real-time messaging", "Auto-translation", "Smart routing", "Context awareness"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Omnichannel Support",
    description: "Unified platform supporting web chat, mobile apps, social media, and voice channels",
    features: ["Web chat widget", "Mobile SDK", "Social media integration", "Voice support"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time reporting with custom dashboards, KPI tracking, and predictive insights",
    features: ["Custom dashboards", "Performance metrics", "Predictive analytics", "Export capabilities"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Bot,
    title: "Intelligent Chatbots",
    description: "AI-powered chatbots with machine learning capabilities and workflow automation",
    features: ["NLP processing", "Learning algorithms", "Workflow automation", "Custom training"],
    color: "from-orange-500 to-red-500"
  }
];

export const CoreFeaturesSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Core Platform Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive suite of tools designed to transform your customer interactions and drive business growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-gray-600">{item}</span>
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
