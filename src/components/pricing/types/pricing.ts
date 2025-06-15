
export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
  color: string;
  agentLimit: number | null;
  functionalityPercent: number;
}

export interface FeatureComparisonRow {
  feature: string;
  free: boolean | string;
  growth: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}
