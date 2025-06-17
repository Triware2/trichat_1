
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface PlanDetails {
  plan_type: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled' | 'free';
  agent_limit: number;
  current_agent_count: number;
  trial_days_remaining: number;
}

interface FeatureAccessContextType {
  planDetails: PlanDetails | null;
  hasFeatureAccess: (featureKey: string) => boolean;
  isLoading: boolean;
  refreshPlanDetails: () => Promise<void>;
  isPlatformCreator: boolean;
  functionalityPercent: number;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

// Define functionality percentages by plan
const PLAN_FUNCTIONALITY: Record<string, number> = {
  'free': 25,
  'growth': 50,
  'pro': 75,
  'enterprise': 100
};

// Define which features are available for each plan
const PLAN_FEATURES: Record<string, string[]> = {
  'free': [
    // Admin dashboard (basic)
    'basic_chat',
    'admin_dashboard_basic',
    
    // Add/remove agents
    'user_management_basic',
    
    // Agent chat dashboard
    'agent_chat_dashboard',
    
    // Canned responses
    'canned_responses',
    
    // Customer contacts
    'customer_contacts',
    
    // Web widget (basic floating)
    'web_widget_basic',
    
    // Basic system settings
    'system_settings_basic',
    
    // Basic reports
    'basic_reports'
  ],
  'growth': [
    // All Free features
    'basic_chat',
    'admin_dashboard_basic',
    'user_management_basic',
    'agent_chat_dashboard',
    'canned_responses',
    'customer_contacts',
    'web_widget_basic',
    'system_settings_basic',
    'basic_reports',
    
    // Supervisor tools (chat monitor, reports)
    'supervisor_tools',
    'chat_monitoring',
    'supervisor_reports',
    
    // Access control (basic)
    'access_control_basic',
    
    // Web widget variants + APIs/Webhooks
    'web_widget_variants',
    'api_access',
    'webhooks',
    
    // Slack, WordPress, Shopify integrations
    'integration_slack',
    'integration_wordpress',
    'integration_shopify',
    
    // CSAT dashboard
    'csat_dashboard',
    
    // Analytics (basic)
    'analytics_basic',
    
    // Chat rules & bulk ops
    'chat_rules',
    'bulk_operations',
    'chat_management'
  ],
  'pro': [
    // All Growth features
    'basic_chat',
    'admin_dashboard_basic',
    'user_management_basic',
    'agent_chat_dashboard',
    'canned_responses',
    'customer_contacts',
    'web_widget_basic',
    'system_settings_basic',
    'basic_reports',
    'supervisor_tools',
    'chat_monitoring',
    'supervisor_reports',
    'access_control_basic',
    'web_widget_variants',
    'api_access',
    'webhooks',
    'integration_slack',
    'integration_wordpress',
    'integration_shopify',
    'csat_dashboard',
    'analytics_basic',
    'chat_rules',
    'bulk_operations',
    'chat_management',
    
    // Bot training studio
    'bot_training',
    'bot_training_studio',
    
    // SOP upload, LLM config
    'sop_upload',
    'llm_configuration',
    
    // Sentiment analysis
    'sentiment_analysis',
    
    // SLA creation & notification
    'sla_management',
    'sla_notifications',
    
    // Escalation management
    'escalation_management',
    
    // Business rule engine
    'business_rules',
    
    // Form builder, theme editor
    'form_builder',
    'theme_editor',
    
    // CRM integrations
    'crm_integrations',
    
    // Custom fields, custom objects
    'custom_fields',
    'custom_objects',
    
    // Customer 360
    'customer_360',
    
    // Full analytics
    'advanced_analytics',
    
    // CSAT management
    'csat_management',
    
    // Data sources
    'data_sources'
  ],
  'enterprise': [
    // All Pro features
    'basic_chat',
    'admin_dashboard_basic',
    'user_management_basic',
    'agent_chat_dashboard',
    'canned_responses',
    'customer_contacts',
    'web_widget_basic',
    'system_settings_basic',
    'basic_reports',
    'supervisor_tools',
    'chat_monitoring',
    'supervisor_reports',
    'access_control_basic',
    'web_widget_variants',
    'api_access',
    'webhooks',
    'integration_slack',
    'integration_wordpress',
    'integration_shopify',
    'csat_dashboard',
    'analytics_basic',
    'chat_rules',
    'bulk_operations',
    'chat_management',
    'bot_training',
    'bot_training_studio',
    'sop_upload',
    'llm_configuration',
    'sentiment_analysis',
    'sla_management',
    'sla_notifications',
    'escalation_management',
    'business_rules',
    'form_builder',
    'theme_editor',
    'crm_integrations',
    'custom_fields',
    'custom_objects',
    'customer_360',
    'advanced_analytics',
    'csat_management',
    'data_sources',
    
    // Sandbox environment
    'sandbox_environment',
    
    // Script editor
    'script_editor',
    
    // Mobile SDKs
    'mobile_sdks',
    
    // Full access to messaging apps
    'messaging_whatsapp',
    'messaging_teams',
    'messaging_telegram',
    'messaging_apps_full',
    
    // Dedicated API management
    'api_management_dedicated',
    
    // Data security, audit logs
    'data_security',
    'audit_logs',
    'platform_audit',
    
    // Priority support
    'priority_support',
    
    // SLA breach monitor
    'sla_breach_monitor',
    
    // Workflow automation
    'workflow_automation',
    'advanced_automation',
    
    // Customization
    'customization',
    'white_labeling',
    'sso_integration',
    'custom_workflows'
  ]
};

export const FeatureAccessProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is the platform creator
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';

  const refreshPlanDetails = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_user_plan_details', { user_id: user.id });

      if (error) {
        console.error('Error fetching plan details:', error);
        return;
      }

      if (data && data.length > 0) {
        setPlanDetails(data[0]);
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const functionalityPercent = planDetails?.plan_type 
    ? PLAN_FUNCTIONALITY[planDetails.plan_type] || 25
    : 25;

  const hasFeatureAccess = (featureKey: string): boolean => {
    if (!user) return false;
    
    // Platform creator has access to everything without limitations
    if (isPlatformCreator) return true;
    
    // For regular users, check plan-based access and trial status
    if (!planDetails) return false;

    // Check if trial is active or subscription is active
    const hasActiveAccess = 
      (planDetails.status === 'trial' && planDetails.trial_days_remaining > 0) ||
      planDetails.status === 'active' ||
      planDetails.status === 'free';

    if (!hasActiveAccess) return false;

    // Get current plan type (default to free if not set)
    const currentPlan = planDetails.plan_type || 'free';
    
    // Check if the feature is available in the current plan
    const availableFeatures = PLAN_FEATURES[currentPlan] || PLAN_FEATURES['free'];
    
    return availableFeatures.includes(featureKey);
  };

  useEffect(() => {
    refreshPlanDetails();
  }, [user]);

  const value = {
    planDetails,
    hasFeatureAccess,
    isLoading,
    refreshPlanDetails,
    isPlatformCreator,
    functionalityPercent,
  };

  return (
    <FeatureAccessContext.Provider value={value}>
      {children}
    </FeatureAccessContext.Provider>
  );
};

export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  return context;
};
