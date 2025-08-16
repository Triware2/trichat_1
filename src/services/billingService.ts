import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  agentLimit: number | null;
  features: string[];
  functionalityPercent: number;
  stripePriceId?: string;
  razorpayPlanId?: string;
  popular?: boolean;
}

export interface BillingInfo {
  id: string;
  customerId: string;
  subscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  planType: string;
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'upi' | 'netbanking' | 'wallet' | 'emi';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  gateway: 'stripe' | 'razorpay';
  gatewayPaymentMethodId?: string;
  upiId?: string;
  bankName?: string;
  walletName?: string;
  emiBank?: string;
  emiTenure?: number;
  created: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible' | 'unpaid' | 'draft';
  created: string;
  dueDate: string;
  pdfUrl?: string;
}

export interface PaymentGatewayConfig {
  stripe: {
    publishableKey: string;
    secretKey: string;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
  };
}

// Add new interface for payment method options
export interface PaymentMethodOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  fields: PaymentField[];
}

export interface PaymentField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number';
  placeholder: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export class BillingService {
  private static instance: BillingService;
  private config: PaymentGatewayConfig;
  
  constructor() {
    this.config = {
      stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
        secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
      },
      razorpay: {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || ''
      }
    };
  }
  
  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  // Available subscription plans
  public readonly plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      agentLimit: 5,
      features: [
        'Up to 5 agents',
        'Basic chat functionality',
        'Basic reports',
        'Email support',
        'Basic system settings'
      ],
      functionalityPercent: 25,
      stripePriceId: undefined,
      razorpayPlanId: undefined
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 5,
      currency: 'USD',
      interval: 'monthly',
      agentLimit: null,
      features: [
        'Unlimited agents',
        'Supervisor tools',
        'Access control',
        'Web widget variants',
        'Slack, WordPress, Shopify integrations',
        'CSAT dashboard',
        'Analytics (basic)',
        'Chat rules & bulk operations',
        'API access',
        'Priority support'
      ],
      functionalityPercent: 50,
      stripePriceId: 'price_growth_monthly',
      razorpayPlanId: 'plan_growth_monthly',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 10,
      currency: 'USD',
      interval: 'monthly',
      agentLimit: null,
      features: [
        'All Growth features',
        'Advanced analytics',
        'Custom fields',
        'Integrations',
        'White labeling',
        'Advanced automation',
        'Custom workflows',
        'Dedicated support'
      ],
      functionalityPercent: 75,
      stripePriceId: 'price_pro_monthly',
      razorpayPlanId: 'plan_pro_monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 15,
      currency: 'USD',
      interval: 'monthly',
      agentLimit: null,
      features: [
        'All Pro features',
        'SSO integration',
        'Advanced security',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Custom training',
        '24/7 phone support'
      ],
      functionalityPercent: 100,
      stripePriceId: 'price_enterprise_monthly',
      razorpayPlanId: 'plan_enterprise_monthly'
    }
  ];

  // Initialize Stripe
  private async initializeStripe() {
    if (typeof window !== 'undefined' && this.config.stripe.publishableKey) {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        return await loadStripe(this.config.stripe.publishableKey);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        return null;
      }
    }
    return null;
  }

  // Initialize Razorpay
  private async initializeRazorpay() {
    if (typeof window !== 'undefined' && this.config.razorpay.keyId) {
      // Load Razorpay script dynamically
      return new Promise((resolve) => {
        if ((window as any).Razorpay) {
          resolve((window as any).Razorpay);
        } else {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve((window as any).Razorpay);
          document.head.appendChild(script);
        }
      });
    }
    return null;
  }

  // Get user's current subscription
  async getCurrentSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  // Get user's billing information
  async getBillingInfo(userId: string): Promise<BillingInfo | null> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      
      if (!subscription) return null;

      return {
        id: subscription.id,
        customerId: `cus_${userId.slice(0, 8)}`,
        subscriptionId: `sub_${subscription.id.slice(0, 8)}`,
        status: subscription.status === 'active' ? 'active' : 'canceled',
        currentPeriodStart: subscription.subscription_start_date || new Date().toISOString(),
        currentPeriodEnd: subscription.subscription_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        planType: subscription.plan_type || 'free',
        amount: this.getPlanPrice(subscription.plan_type || 'free'),
        currency: 'USD'
      };
    } catch (error) {
      console.error('Error fetching billing info:', error);
      return null;
    }
  }

  // Get payment methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;

      return data?.map(pm => ({
        id: pm.id,
        type: pm.type as 'card' | 'bank_account' | 'upi' | 'netbanking' | 'wallet' | 'emi',
        last4: pm.last4,
        brand: pm.brand,
        expMonth: pm.exp_month,
        expYear: pm.exp_year,
        isDefault: pm.is_default,
        gateway: pm.gateway as 'stripe' | 'razorpay',
        gatewayPaymentMethodId: pm.gateway_payment_method_id,
        upiId: pm.upi_id,
        bankName: pm.bank_name,
        walletName: pm.wallet_name,
        emiBank: pm.emi_bank,
        emiTenure: pm.emi_tenure,
        created: pm.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Get invoices
  async getInvoices(userId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status as 'paid' | 'open' | 'void' | 'uncollectible' | 'unpaid' | 'draft',
        created: invoice.created_at,
        dueDate: invoice.due_date,
        pdfUrl: invoice.pdf_url
      })) || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  // Create checkout session for subscription upgrade
  async createCheckoutSession(userId: string, planId: string, successUrl: string, cancelUrl: string, gateway: 'stripe' | 'razorpay' = 'stripe') {
    try {
      const plan = this.plans.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan');

      if (gateway === 'stripe') {
        return await this.createStripeCheckoutSession(userId, plan, successUrl, cancelUrl);
      } else if (gateway === 'razorpay') {
        return await this.createRazorpayCheckoutSession(userId, plan, successUrl, cancelUrl);
      }

      throw new Error('Invalid payment gateway');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Create Stripe checkout session
  private async createStripeCheckoutSession(userId: string, plan: SubscriptionPlan, successUrl: string, cancelUrl: string) {
    try {
      const stripe = await this.initializeStripe();
      if (!stripe) throw new Error('Stripe not initialized');

      // Create checkout session via your backend API
      const response = await fetch('/api/create-stripe-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: plan.id,
          successUrl,
          cancelUrl,
          priceId: plan.stripePriceId
        }),
      });

      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return session;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  }

  // Create Razorpay checkout session
  private async createRazorpayCheckoutSession(userId: string, plan: SubscriptionPlan, successUrl: string, cancelUrl: string) {
    try {
      const Razorpay = await this.initializeRazorpay();
      if (!Razorpay) throw new Error('Razorpay not initialized');

      // Create order via your backend API
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: plan.id,
          amount: plan.price * 100, // Razorpay expects amount in paise
          currency: plan.currency,
          razorpayPlanId: plan.razorpayPlanId
        }),
      });

      const order = await response.json();

      // Open Razorpay checkout
      const options = {
        key: this.config.razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Trichat',
        description: `${plan.name} Plan`,
        order_id: order.id,
        handler: function (response: any) {
          // Handle successful payment
          window.location.href = `${successUrl}?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
        },
        prefill: {
          email: '', // You can prefill user email here
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new (Razorpay as any)(options);
      rzp.open();

      return order;
    } catch (error) {
      console.error('Error creating Razorpay checkout session:', error);
      throw error;
    }
  }

  // Add payment method
  async addPaymentMethod(userId: string, paymentMethodData: any, gateway: 'stripe' | 'razorpay' = 'stripe') {
    try {
      if (gateway === 'stripe') {
        return await this.addStripePaymentMethod(userId, paymentMethodData);
      } else if (gateway === 'razorpay') {
        return await this.addRazorpayPaymentMethod(userId, paymentMethodData);
      }

      throw new Error('Invalid payment gateway');
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  // Add Stripe payment method
  private async addStripePaymentMethod(userId: string, paymentMethodData: any) {
    try {
      const stripe = await this.initializeStripe();
      if (!stripe) throw new Error('Stripe not initialized');

      // Create payment method via your backend API
      const response = await fetch('/api/add-stripe-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          paymentMethodData
        }),
      });

      const result = await response.json();

      // Store in database
      await supabase
        .from('payment_methods')
        .insert({
          id: result.id,
          user_id: userId,
          type: paymentMethodData.type,
          last4: paymentMethodData.last4,
          brand: paymentMethodData.brand,
          exp_month: paymentMethodData.expMonth,
          exp_year: paymentMethodData.expYear,
          is_default: paymentMethodData.isDefault,
          gateway: 'stripe',
          created_at: new Date().toISOString()
        });

      return result;
    } catch (error) {
      console.error('Error adding Stripe payment method:', error);
      throw error;
    }
  }

  // Add Razorpay payment method
  private async addRazorpayPaymentMethod(userId: string, paymentMethodData: any) {
    try {
      // For Razorpay, we typically store cards after successful payment
      // This is a simplified implementation
      const paymentMethodId = `pm_razorpay_${Date.now()}`;
      
      await supabase
        .from('payment_methods')
        .insert({
          id: paymentMethodId,
          user_id: userId,
          type: paymentMethodData.type,
          last4: paymentMethodData.last4,
          brand: paymentMethodData.brand,
          exp_month: paymentMethodData.expMonth,
          exp_year: paymentMethodData.expYear,
          is_default: paymentMethodData.isDefault,
          gateway: 'razorpay',
          created_at: new Date().toISOString()
        });

      return { id: paymentMethodId };
    } catch (error) {
      console.error('Error adding Razorpay payment method:', error);
      throw error;
    }
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId: string, gateway: 'stripe' | 'razorpay' = 'stripe') {
    try {
      if (gateway === 'stripe') {
        // Remove from Stripe via backend API
        await fetch('/api/remove-stripe-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId
          }),
        });
      }

      // Remove from database
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    try {
      // First, unset all default payment methods for this user
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then, set the specified payment method as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  // Update subscription plan
  async updateSubscription(userId: string, planId: string) {
    try {
      const plan = this.plans.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan');

      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: planId,
          status: planId === 'free' ? 'free' : 'active',
          agent_limit: plan.agentLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(userId: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Check if user has access to a specific feature
  async hasFeatureAccess(userId: string, featureKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('user_has_feature_access', {
          user_id: userId,
          feature_key: featureKey
        });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  // Get user's plan details
  async getPlanDetails(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_plan_details', {
          user_id: userId
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching plan details:', error);
      return null;
    }
  }

  // Get plan price
  getPlanPrice(planId: string): number {
    const plan = this.plans.find(p => p.id === planId);
    return plan?.price || 0;
  }

  // Get plan by ID
  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(p => p.id === planId);
  }

  // Check if trial is active
  async isTrialActive(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('is_trial_active', {
          user_id: userId
        });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  }

  // Get trial days remaining
  async getTrialDaysRemaining(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_trial_days_remaining', {
          user_id: userId
        });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting trial days remaining:', error);
      return 0;
    }
  }

  // Get payment gateway configuration
  getPaymentGatewayConfig(): PaymentGatewayConfig {
    return this.config;
  }

  // Get available payment methods for a gateway
  getPaymentMethodOptions(gateway: 'stripe' | 'razorpay'): PaymentMethodOption[] {
    if (gateway === 'stripe') {
      return [
        {
          value: 'card',
          label: 'Credit/Debit Card',
          icon: 'credit-card',
          description: 'Pay with Visa, Mastercard, American Express, or Discover',
          fields: [
            {
              name: 'cardNumber',
              label: 'Card Number',
              type: 'text',
              placeholder: '1234 5678 9012 3456',
              required: true,
              validation: {
                pattern: '^[0-9\\s]{13,19}$',
                minLength: 13,
                maxLength: 19
              }
            },
            {
              name: 'expiryDate',
              label: 'Expiry Date',
              type: 'text',
              placeholder: 'MM/YY',
              required: true,
              validation: {
                pattern: '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
              }
            },
            {
              name: 'cvv',
              label: 'CVV',
              type: 'text',
              placeholder: '123',
              required: true,
              validation: {
                pattern: '^[0-9]{3,4}$',
                minLength: 3,
                maxLength: 4
              }
            },
            {
              name: 'cardholderName',
              label: 'Cardholder Name',
              type: 'text',
              placeholder: 'John Doe',
              required: true
            }
          ]
        }
      ];
    } else if (gateway === 'razorpay') {
      return [
        {
          value: 'card',
          label: 'Credit/Debit Card',
          icon: 'credit-card',
          description: 'Pay with Visa, Mastercard, RuPay, or other cards',
          fields: [
            {
              name: 'cardNumber',
              label: 'Card Number',
              type: 'text',
              placeholder: '1234 5678 9012 3456',
              required: true,
              validation: {
                pattern: '^[0-9\\s]{13,19}$',
                minLength: 13,
                maxLength: 19
              }
            },
            {
              name: 'expiryDate',
              label: 'Expiry Date',
              type: 'text',
              placeholder: 'MM/YY',
              required: true,
              validation: {
                pattern: '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
              }
            },
            {
              name: 'cvv',
              label: 'CVV',
              type: 'text',
              placeholder: '123',
              required: true,
              validation: {
                pattern: '^[0-9]{3,4}$',
                minLength: 3,
                maxLength: 4
              }
            },
            {
              name: 'cardholderName',
              label: 'Cardholder Name',
              type: 'text',
              placeholder: 'John Doe',
              required: true
            }
          ]
        },
        {
          value: 'upi',
          label: 'UPI',
          icon: 'smartphone',
          description: 'Pay using UPI ID or QR code',
          fields: [
            {
              name: 'upiId',
              label: 'UPI ID',
              type: 'text',
              placeholder: 'username@upi',
              required: true,
              validation: {
                pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$'
              }
            }
          ]
        },
        {
          value: 'netbanking',
          label: 'Net Banking',
          icon: 'building',
          description: 'Pay using your bank account',
          fields: [
            {
              name: 'bankName',
              label: 'Select Bank',
              type: 'select',
              placeholder: 'Choose your bank',
              required: true,
              options: [
                { value: 'HDFC', label: 'HDFC Bank' },
                { value: 'ICICI', label: 'ICICI Bank' },
                { value: 'SBI', label: 'State Bank of India' },
                { value: 'AXIS', label: 'Axis Bank' },
                { value: 'KOTAK', label: 'Kotak Mahindra Bank' },
                { value: 'YES', label: 'Yes Bank' },
                { value: 'PNB', label: 'Punjab National Bank' },
                { value: 'BOB', label: 'Bank of Baroda' },
                { value: 'CANARA', label: 'Canara Bank' },
                { value: 'UNION', label: 'Union Bank of India' }
              ]
            }
          ]
        },
        {
          value: 'wallet',
          label: 'Digital Wallets',
          icon: 'wallet',
          description: 'Pay using Paytm, PhonePe, or other wallets',
          fields: [
            {
              name: 'walletName',
              label: 'Select Wallet',
              type: 'select',
              placeholder: 'Choose your wallet',
              required: true,
              options: [
                { value: 'paytm', label: 'Paytm' },
                { value: 'phonepe', label: 'PhonePe' },
                { value: 'amazonpay', label: 'Amazon Pay' },
                { value: 'freecharge', label: 'FreeCharge' },
                { value: 'mobikwik', label: 'MobiKwik' },
                { value: 'airtelpay', label: 'Airtel Payments Bank' }
              ]
            }
          ]
        },
        {
          value: 'emi',
          label: 'EMI',
          icon: 'calendar',
          description: 'Pay in easy monthly installments',
          fields: [
            {
              name: 'emiBank',
              label: 'Select Bank for EMI',
              type: 'select',
              placeholder: 'Choose your bank',
              required: true,
              options: [
                { value: 'HDFC', label: 'HDFC Bank' },
                { value: 'ICICI', label: 'ICICI Bank' },
                { value: 'SBI', label: 'State Bank of India' },
                { value: 'AXIS', label: 'Axis Bank' },
                { value: 'KOTAK', label: 'Kotak Mahindra Bank' },
                { value: 'YES', label: 'Yes Bank' }
              ]
            },
            {
              name: 'emiTenure',
              label: 'EMI Tenure (months)',
              type: 'select',
              placeholder: 'Select tenure',
              required: true,
              options: [
                { value: '3', label: '3 months' },
                { value: '6', label: '6 months' },
                { value: '9', label: '9 months' },
                { value: '12', label: '12 months' },
                { value: '18', label: '18 months' },
                { value: '24', label: '24 months' }
              ]
            }
          ]
        }
      ];
    }
    return [];
  }
}

export const billingService = BillingService.getInstance(); 