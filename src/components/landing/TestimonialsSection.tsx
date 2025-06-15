
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechCorp Inc.",
    content: "Trichat transformed our customer support operations. We've seen a 70% reduction in response times and 95% customer satisfaction.",
    rating: 5,
    metrics: "70% faster responses"
  },
  {
    name: "Michael Rodriguez",
    role: "VP of Operations",
    company: "Global Retail Ltd.",
    content: "The AI-powered routing and analytics have been game-changers. Our team efficiency has improved dramatically.",
    rating: 5,
    metrics: "3x team efficiency"
  },
  {
    name: "Dr. Emily Watson",
    role: "CTO",
    company: "HealthTech Solutions",
    content: "Security and compliance features are outstanding. HIPAA compliance made our healthcare deployment seamless.",
    rating: 5,
    metrics: "100% compliance"
  }
];

export const TestimonialsSection = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-gray-600">Real results from real customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-lg text-gray-700 mb-4">
                  "{testimonial.content}"
                </CardDescription>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">{testimonial.metrics}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
