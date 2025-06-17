
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
    'admin_dashboard_basic',
    'user_management_basic',
    'access_control_basic',
    'system_settings_basic',
    
    // Web widget (basic floating only)
    'web_widget_basic',
    'web_widget_integration',
    
    // Agent features (restricted)
    'agent_chat_dashboard',
    'customer_contacts',
    'basic_reports',
    
    // Supervisor features (very limited)
    'supervisor_overview',
    'supervisor_team_settings'
  ],
  'growth': [
    // All Free features
    'admin_dashboard_basic',
    'user_management_basic',
    'access_control_basic',
    'system_settings_basic',
    'web_widget_basic',
    'web_widget_integration',
    'agent_chat_dashboard',
    'customer_contacts',
    'basic_reports',
    'supervisor_overview',
    'supervisor_team_settings',
    
    // Chatbot features (limited)
    'bot_training_view_deployed',
    'bot_training_studio',
    'sop_upload',
    'test_chat_interface',
    
    // API access
    'api_access',
    
    // SLA features (limited)
    'sla_create',
    'sla_overview',
    
    // Analytics (limited)
    'analytics_overview',
    'analytics_performance',
    'analytics_channels',
    'analytics_agents',
    
    // Widget variants (no messaging apps)
    'web_widget_variants',
    
    // Data sources (limited)
    'data_sources_basic',
    
    // Chat management
    'chat_management',
    'chat_rules',
    'bulk_operations',
    
    // Customization (limited)
    'customization_themes',
    'customization_forms',
    
    // Supervisor features (expanded)
    'supervisor_chat_supervision',
    'supervisor_reports',
    
    // Agent features (full access)
    'canned_responses',
    'customer_360',
    'agent_all_features'
  ],
  'pro': [
    // All Growth features
    'admin_dashboard_basic',
    'user_management_basic',
    'access_control_basic',
    'system_settings_basic',
    'web_widget_basic',
    'web_widget_integration',
    'agent_chat_dashboard',
    'customer_contacts',
    'basic_reports',
    'supervisor_overview',
    'supervisor_team_settings',
    'bot_training_view_deployed',
    'bot_training_studio',
    'sop_upload',
    'test_chat_interface',
    'api_access',
    'sla_create',
    'sla_overview',
    'analytics_overview',
    'analytics_performance',
    'analytics_channels',
    'analytics_agents',
    'web_widget_variants',
    'data_sources_basic',
    'chat_management',
    'chat_rules',
    'bulk_operations',
    'customization_themes',
    'customization_forms',
    'supervisor_chat_supervision',
    'supervisor_reports',
    'canned_responses',
    'customer_360',
    'agent_all_features',
    
    // Pro additional features
    'bot_training_llm_config',
    'bot_analytics',
    'sla_management',
    'sla_configuration',
    'sla_escalations',
    'sla_notifications',
    'sla_reporting',
    'csat_dashboard',
    'csat_management',
    'advanced_analytics',
    'custom_analytics',
    'messaging_apps',
    'data_sources',
    'crm_integrations',
    'ecommerce_integrations',
    'customization_advanced',
    'form_builder',
    'theme_editor',
    'business_rules',
    'sentiment_analysis',
    'escalation_management',
    'custom_fields',
    'custom_objects',
    
    // Supervisor full access
    'supervisor_queue_management',
    'supervisor_team_monitor',
    'supervisor_tools',
    'chat_monitoring'
  ],
  'enterprise': [
    // All Pro features plus Enterprise exclusives
    'admin_dashboard_basic',
    'user_management_basic',
    'access_control_basic',
    'system_settings_basic',
    'web_widget_basic',
    'web_widget_integration',
    'agent_chat_dashboard',
    'customer_contacts',
    'basic_reports',
    'supervisor_overview',
    'supervisor_team_settings',
    'bot_training_view_deployed',
    'bot_training_studio',
    'sop_upload',
    'test_chat_interface',
    'api_access',
    'sla_create',
    'sla_overview',
    'analytics_overview',
    'analytics_performance',
    'analytics_channels',
    'analytics_agents',
    'web_widget_variants',
    'data_sources_basic',
    'chat_management',
    'chat_rules',
    'bulk_operations',
    'customization_themes',
    'customization_forms',
    'supervisor_chat_supervision',
    'supervisor_reports',
    'canned_responses',
    'customer_360',
    'agent_all_features',
    'bot_training_llm_config',
    'bot_analytics',
    'sla_management',
    'sla_configuration',
    'sla_escalations',
    'sla_notifications',
    'sla_reporting',
    'csat_dashboard',
    'csat_management',
    'advanced_analytics',
    'custom_analytics',
    'messaging_apps',
    'data_sources',
    'crm_integrations',
    'ecommerce_integrations',
    'customization_advanced',
    'form_builder',
    'theme_editor',
    'business_rules',
    'sentiment_analysis',
    'escalation_management',
    'custom_fields',
    'custom_objects',
    'supervisor_queue_management',
    'supervisor_team_monitor',
    'supervisor_tools',
    'chat_monitoring',
    
    // Enterprise exclusive features
    'customization_code_editor',
    'sandbox_environment',
    'api_management_dedicated',
    'script_editor',
    'mobile_sdks',
    'messaging_whatsapp',
    'messaging_teams',
    'messaging_telegram',
    'messaging_apps_full',
    'data_security',
    'audit_logs',
    'platform_audit',
    'priority_support',
    'sla_breach_monitor',
    'workflow_automation',
    'advanced_automation',
    'customization_full',
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
