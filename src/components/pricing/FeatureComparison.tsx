
import { Check, X } from 'lucide-react';
import { FeatureComparisonRow } from './types/pricing';

const featureComparison: FeatureComparisonRow[] = [
  // Basic Features
  { feature: "Admin Dashboard", free: "Basic", growth: "Basic", pro: "Basic", enterprise: "Basic" },
  { feature: "Agent Management", free: "5 agents", growth: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Agent Chat Dashboard", free: true, growth: true, pro: true, enterprise: true },
  { feature: "Customer Contacts", free: true, growth: true, pro: true, enterprise: true },
  { feature: "Basic Reports", free: true, growth: true, pro: true, enterprise: true },
  
  // Growth Features
  { feature: "Canned Responses", free: "Basic", growth: true, pro: true, enterprise: true },
  { feature: "Web Widget", free: "Basic floating", growth: "Variants + API", pro: "Variants + API", enterprise: "Variants + API" },
  { feature: "Supervisor Tools", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Chat Monitoring", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Access Control", free: false, growth: "Basic", pro: "Basic", enterprise: "Advanced" },
  { feature: "APIs & Webhooks", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Basic Integrations", free: false, growth: "Slack, WordPress, Shopify", pro: "Slack, WordPress, Shopify", enterprise: "All integrations" },
  { feature: "CSAT Dashboard", free: false, growth: true, pro: true, enterprise: true },
  { feature: "Analytics", free: "Basic", growth: "Basic", pro: "Advanced", enterprise: "Advanced" },
  { feature: "Chat Rules & Bulk Ops", free: false, growth: true, pro: true, enterprise: true },
  
  // Pro Features
  { feature: "Bot Training Studio", free: false, growth: false, pro: true, enterprise: true },
  { feature: "SOP Upload & LLM Config", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Sentiment Analysis", free: false, growth: false, pro: true, enterprise: true },
  { feature: "SLA Management", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Escalation Management", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Business Rule Engine", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Form Builder & Theme Editor", free: false, growth: false, pro: true, enterprise: true },
  { feature: "CRM Integrations", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Custom Fields & Objects", free: false, growth: false, pro: true, enterprise: true },
  { feature: "Customer 360 View", free: false, growth: false, pro: true, enterprise: true },
  
  // Enterprise Features
  { feature: "Sandbox Environment", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Script Editor", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Mobile SDKs", free: false, growth: false, pro: false, enterprise: true },
  { feature: "WhatsApp, Teams, Telegram", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Dedicated API Management", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Data Security & Audit Logs", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Priority Support", free: false, growth: false, pro: false, enterprise: true },
  { feature: "SLA Breach Monitoring", free: false, growth: false, pro: false, enterprise: true },
  { feature: "Workflow Automation", free: false, growth: false, pro: false, enterprise: true },
  { feature: "White Labeling & SSO", free: false, growth: false, pro: false, enterprise: true }
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
    return <span className="text-sm text-gray-600 font-medium">{value}</span>;
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
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Free<br/>
                    <span className="text-xs font-normal text-gray-600">(25% access)</span>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Growth<br/>
                    <span className="text-xs font-normal text-gray-600">(50% access)</span>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Pro<br/>
                    <span className="text-xs font-normal text-gray-600">(75% access)</span>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Enterprise<br/>
                    <span className="text-xs font-normal text-gray-600">(100% access)</span>
                  </th>
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
