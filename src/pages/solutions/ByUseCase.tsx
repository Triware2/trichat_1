
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, HeadphonesIcon, TrendingUp, UserCheck, Zap, Clock, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ByUseCase = () => {
  const navigate = useNavigate();

  const useCases = [
    {
      title: "Customer Support",
      description: "Transform your customer service with AI-powered support automation",
      icon: HeadphonesIcon,
      color: "from-blue-500 to-cyan-500",
      metrics: ["80% faster response", "95% satisfaction", "60% cost reduction"],
      features: [
        "Intelligent ticket routing",
        "24/7 AI assistance",
        "Knowledge base integration",
        "Escalation management",
        "Multi-channel support"
      ],
      challenges: [
        "High response times",
        "Agent overload",
        "Inconsistent service quality",
        "Limited availability"
      ]
    },
    {
      title: "Sales Enablement",
      description: "Accelerate your sales process with intelligent lead qualification and nurturing",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      metrics: ["3x conversion rate", "50% shorter sales cycle", "40% more qualified leads"],
      features: [
        "Lead qualification automation",
        "Real-time visitor insights",
        "CRM integration",
        "Sales handoff workflows",
        "Performance analytics"
      ],
      challenges: [
        "Low lead conversion",
        "Manual qualification process",
        "Missed opportunities",
        "Poor lead quality"
      ]
    },
    {
      title: "Technical Support",
      description: "Provide expert technical assistance with AI-enhanced troubleshooting",
      icon: Zap,
      color: "from-purple-500 to-indigo-500",
      metrics: ["70% self-service", "50% faster resolution", "90% first-contact resolution"],
      features: [
        "Diagnostic automation",
        "Technical knowledge base",
        "Screen sharing & co-browsing",
        "Expert escalation",
        "Solution tracking"
      ],
      challenges: [
        "Complex technical issues",
        "Long resolution times",
        "Knowledge silos",
        "Skill gaps"
      ]
    },
    {
      title: "Lead Generation",
      description: "Capture and convert more leads with proactive engagement strategies",
      icon: Target,
      color: "from-orange-500 to-red-500",
      metrics: ["200% more leads", "35% higher engagement", "25% improved conversion"],
      features: [
        "Proactive chat triggers",
        "Behavioral targeting",
        "Form optimization",
        "Lead scoring",
        "Follow-up automation"
      ],
      challenges: [
        "Low website engagement",
        "High bounce rates",
        "Poor lead capture",
        "Manual follow-up"
      ]
    },
    {
      title: "Customer Onboarding",
      description: "Deliver seamless onboarding experiences that drive user adoption",
      icon: UserCheck,
      color: "from-teal-500 to-cyan-500",
      metrics: ["60% faster onboarding", "85% completion rate", "40% reduced churn"],
      features: [
        "Guided onboarding flows",
        "Progress tracking",
        "Interactive tutorials",
        "Success milestones",
        "Proactive assistance"
      ],
      challenges: [
        "Complex onboarding process",
        "User confusion",
        "High drop-off rates",
        "Limited guidance"
      ]
    },
    {
      title: "Customer Retention",
      description: "Reduce churn and increase loyalty with proactive customer success",
      icon: Clock,
      color: "from-pink-500 to-purple-500",
      metrics: ["30% reduced churn", "50% higher NPS", "25% increased LTV"],
      features: [
        "Churn prediction",
        "Proactive outreach",
        "Health score monitoring",
        "Renewal automation",
        "Success tracking"
      ],
      challenges: [
        "Customer churn",
        "Reactive support",
        "Limited visibility",
        "Poor retention"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trichat
                </span>
              </div>
              
              <div className="hidden md:flex space-x-8">
                <Button variant="ghost" onClick={() => navigate('/solutions')} className="text-blue-600">Solutions</Button>
                <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
                <Button variant="ghost" onClick={() => navigate('/documentation')}>Documentation</Button>
                <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">Solutions by Use Case</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Tailored Solutions for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Every Use Case</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Trichat addresses specific business challenges with proven solutions and measurable results across different use cases.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{useCase.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">
                      {useCase.description}
                    </CardDescription>
                    
                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {useCase.metrics.map((metric, metricIndex) => (
                        <Badge key={metricIndex} className="bg-green-100 text-green-700">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Challenges */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Challenges We Solve</h4>
                        <div className="space-y-2">
                          {useCase.challenges.map((challenge, challengeIndex) => (
                            <div key={challengeIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="space-y-2">
                          {useCase.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to solve your specific challenge?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our experts design a custom solution tailored to your use case and business requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByUseCase;
