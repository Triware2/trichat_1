
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, TrendingUp, Settings, Building } from 'lucide-react';

const useCases = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Reduce response times by 80% with intelligent ticket routing and automated workflows",
    metrics: ["80% faster response", "95% satisfaction", "60% cost reduction"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Sales Enablement",
    description: "Increase conversion rates with AI-powered lead qualification and real-time engagement",
    metrics: ["3x conversion rate", "50% more leads", "40% revenue growth"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Settings,
    title: "Technical Support",
    description: "Resolve complex issues with integrated knowledge base and expert routing",
    metrics: ["60% self-service", "45% faster resolution", "90% first-contact"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Building,
    title: "Enterprise Operations",
    description: "Scale customer operations with enterprise-grade security and compliance features",
    metrics: ["99.9% uptime", "SOC 2 compliant", "Global deployment"],
    color: "from-orange-500 to-red-500"
  }
];

export const UseCasesSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Results Across Industries</h2>
          <p className="text-xl text-gray-600">See how Trichat drives measurable business outcomes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{useCase.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-sm font-medium text-green-700">{metric}</span>
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
