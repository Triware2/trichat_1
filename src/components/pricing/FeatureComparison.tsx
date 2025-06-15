
import { Check, X } from 'lucide-react';
import { FeatureComparisonRow } from './types/pricing';

const featureComparison: FeatureComparisonRow[] = [
  { feature: "Basic Chat", free: true, growth: true, pro: true, enterprise: true },
  { feature: "Agent Management", free: "5 agents", growth: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Basic Reports", free: true, growth: true, pro: true, enterprise: true },
  { feature: "Email Support", free: true, growth: true, pro: true, enterprise: true },
  { feature: "Canned Responses", free: false, growth: true, pro: true, enterprise: true },
  { feature: "File Sharing", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Advanced Routing", free: false, growth: true, pro: true, enterprise: true },
  { feature: "API Access", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Custom Fields", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Integrations", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Advanced Analytics", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Priority Support", free: false, growth: false, pro: true, enterprise: true },
  { feature: "White Labeling", free: false, growth: false, pro: false, enterprise: true },
  { feature: "SSO", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Advanced Automation", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Custom Workflows", free: false, growth: false, pro: false, enterprise: true }
];

export const FeatureComparison = () => {
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      );
    }
    return <span className="text-sm text-gray-600">{value}</span>;
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Feature Comparison</h2>
          <p className="text-xl text-gray-600">See exactly what's included in each plan</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Growth</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featureComparison.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center">{renderFeatureValue(row.free)}</td>
                    <td className="px-6 py-4 text-center">{renderFeatureValue(row.growth)}</td>
                    <td className="px-6 py-4 text-center">{renderFeatureValue(row.pro)}</td>
                    <td className="px-6 py-4 text-center">{renderFeatureValue(row.enterprise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
