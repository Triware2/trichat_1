import { supabase } from '@/integrations/supabase/client';
import { SLATier, SLATarget, EscalationRule, SLABreach, SLAMetrics } from '@/components/admin/sla/types';

class SLAService {
  private async getUserId() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
  }

  async listSLATiers(): Promise<SLATier[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('sla_tiers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        customerSegments: row.customer_segments || [],
        contractTypes: row.contract_types || [],
        supportPlans: row.support_plans || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return [];
    }
  }

  async createSLATier(payload: Omit<SLATier, 'id' | 'createdAt' | 'updatedAt'>): Promise<SLATier> {
    const userId = await this.getUserId();
    const { data, error } = await (supabase as any)
      .from('sla_tiers')
      .insert({
        name: payload.name,
        description: payload.description,
        customer_segments: payload.customerSegments,
        contract_types: payload.contractTypes,
        support_plans: payload.supportPlans,
        is_active: payload.isActive,
        created_by: userId
      })
      .select('*')
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      customerSegments: data.customer_segments || [],
      contractTypes: data.contract_types || [],
      supportPlans: data.support_plans || [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteSLATier(id: string) {
    await (supabase as any).from('sla_tiers').delete().eq('id', id);
  }

  async listTargets(slaId: string): Promise<SLATarget[]> {
    const { data, error } = await (supabase as any)
      .from('sla_targets')
      .select('*')
      .eq('sla_id', slaId);
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      slaId: row.sla_id,
      priority: row.priority,
      firstResponseTime: row.first_response_time,
      resolutionTime: row.resolution_time,
      followUpTime: row.follow_up_time || undefined,
      businessHoursOnly: row.business_hours_only,
    }));
  }

  async listEscalationRules(): Promise<EscalationRule[]> {
    const { data, error } = await (supabase as any)
      .from('escalation_rules')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      slaId: row.sla_id,
      name: row.name,
      triggerType: row.trigger_type,
      triggerCondition: row.trigger_condition,
      escalationLevel: row.escalation_level,
      escalateTo: row.escalate_to,
      notificationMethods: row.notification_methods || [],
      isActive: row.is_active,
    }));
  }

  async createEscalationRule(rule: Omit<EscalationRule, 'id'>): Promise<EscalationRule> {
    const userId = await this.getUserId();
    const { data, error } = await (supabase as any)
      .from('escalation_rules')
      .insert({
        sla_id: rule.slaId,
        name: rule.name,
        trigger_type: rule.triggerType,
        trigger_condition: rule.triggerCondition,
        escalation_level: rule.escalationLevel,
        escalate_to: rule.escalateTo,
        notification_methods: rule.notificationMethods,
        is_active: rule.isActive,
        created_by: userId
      })
      .select('*')
      .single();
    if (error) throw error;
    return {
      id: data.id,
      slaId: data.sla_id,
      name: data.name,
      triggerType: data.trigger_type,
      triggerCondition: data.trigger_condition,
      escalationLevel: data.escalation_level,
      escalateTo: data.escalate_to,
      notificationMethods: data.notification_methods || [],
      isActive: data.is_active,
    };
  }

  async updateEscalationRule(id: string, updates: Partial<EscalationRule>) {
    const payload: any = {};
    if (updates.slaId !== undefined) payload.sla_id = updates.slaId;
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.triggerType !== undefined) payload.trigger_type = updates.triggerType;
    if (updates.triggerCondition !== undefined) payload.trigger_condition = updates.triggerCondition;
    if (updates.escalationLevel !== undefined) payload.escalation_level = updates.escalationLevel;
    if (updates.escalateTo !== undefined) payload.escalate_to = updates.escalateTo;
    if (updates.notificationMethods !== undefined) payload.notification_methods = updates.notificationMethods;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    await (supabase as any).from('escalation_rules').update(payload).eq('id', id);
  }

  async deleteEscalationRule(id: string) {
    await (supabase as any).from('escalation_rules').delete().eq('id', id);
  }

  async listBreaches(slaId?: string, unresolvedOnly: boolean = false): Promise<SLABreach[]> {
    let query = (supabase as any).from('sla_breaches').select('*').order('created_at', { ascending: false });
    if (slaId && slaId !== 'all') query = query.eq('sla_id', slaId);
    if (unresolvedOnly) query = query.eq('is_resolved', false);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      caseId: row.case_id,
      slaId: row.sla_id,
      breachType: row.breach_type,
      expectedTime: row.expected_time,
      actualTime: row.actual_time,
      severity: row.severity,
      rootCause: row.root_cause || undefined,
      isResolved: row.is_resolved,
      createdAt: row.created_at,
    }));
  }

  async recordBreach(breach: Omit<SLABreach, 'id' | 'createdAt'>) {
    const userId = await this.getUserId();
    await (supabase as any)
      .from('sla_breaches')
      .insert({
        case_id: breach.caseId,
        sla_id: breach.slaId,
        breach_type: breach.breachType,
        expected_time: breach.expectedTime,
        actual_time: breach.actualTime,
        severity: breach.severity,
        root_cause: breach.rootCause,
        is_resolved: breach.isResolved,
        created_by: userId,
      });
  }

  async listMetrics(slaId: string, period: SLAMetrics['period']): Promise<SLAMetrics[]> {
    const { data, error } = await (supabase as any)
      .from('sla_metrics')
      .select('*')
      .eq('sla_id', slaId)
      .eq('period', period)
      .order('created_at', { ascending: false })
      .limit(90);
    if (error) throw error;
    return (data || []).map((row: any) => ({
      slaId: row.sla_id,
      period: row.period,
      totalCases: row.total_cases,
      breachedCases: row.breached_cases,
      complianceRate: Number(row.compliance_rate),
      avgResponseTime: row.avg_response_time,
      avgResolutionTime: row.avg_resolution_time,
      escalatedCases: row.escalated_cases,
    }));
  }
}

export const slaService = new SLAService();

