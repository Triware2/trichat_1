# Payment Integration Setup Guide

This guide will help you set up Stripe and Razorpay payment gateways for the Trichat billing system.

## Overview

The billing system now supports two major payment gateways:
- **Stripe** - Global payment processing
- **Razorpay** - Popular in India and other Asian markets

## Prerequisites

1. Node.js and npm installed
2. Supabase project set up
3. Stripe account (for Stripe integration)
4. Razorpay account (for Razorpay integration)

## Installation

### 1. Install Dependencies

```bash
npm install @stripe/stripe-js
```

### 2. Environment Configuration

Copy the `env.example` file to `.env` and configure your credentials:

```bash
cp env.example .env
```

#### Required Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Stripe Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a new account
3. Complete the account verification process

### 2. Get API Keys

1. Navigate to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Webhooks (Optional)

For production, set up webhooks to handle payment events:

1. Go to **Developers > Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 4. Test Cards

Use these test card numbers for development:

- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`
- **Declined**: `4000000000000002`

## Razorpay Setup

### 1. Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up for a new account
3. Complete the account verification process

### 2. Get API Keys

1. Navigate to **Settings > API Keys**
2. Copy your **Key ID** (starts with `rzp_test_` or `rzp_live_`)
3. Copy your **Key Secret**

### 3. Configure Webhooks (Optional)

For production, set up webhooks:

1. Go to **Settings > Webhooks**
2. Add endpoint: `https://your-domain.com/api/razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`

### 4. Test Cards

Use these test card numbers for development:

- **Visa**: `4111111111111111`
- **Mastercard**: `5555555555554444`
- **RuPay**: `6073849700004347`
- **Declined**: `4000000000000002`

## Database Schema

The payment integration requires these tables in your Supabase database:

### Payment Methods Table

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account')),
  last4 TEXT NOT NULL,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_gateway ON payment_methods(gateway);
```

### Invoices Table

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents/paise
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('paid', 'open', 'void', 'uncollectible', 'unpaid', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay'))
);

-- Indexes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

### Checkout Sessions Table

```sql
CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  success_url TEXT NOT NULL,
  cancel_url TEXT NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX idx_checkout_sessions_status ON checkout_sessions(status);
```

## Features

### Payment Method Management

- ✅ Add new payment methods (credit/debit cards)
- ✅ Remove existing payment methods
- ✅ Set default payment method
- ✅ Support for multiple payment gateways
- ✅ Card brand detection (Visa, Mastercard, Amex, etc.)

### Subscription Management

- ✅ Upgrade subscription plans
- ✅ Cancel subscriptions
- ✅ Reactivate subscriptions
- ✅ Trial period management
- ✅ Automatic billing

### Invoice Management

- ✅ View billing history
- ✅ Download invoices (PDF)
- ✅ Payment status tracking
- ✅ Multiple currency support

## Usage

### Adding a Payment Method

1. Navigate to **Billing & Subscription > Payment Methods**
2. Click **"Add Payment Method"**
3. Select payment gateway (Stripe or Razorpay)
4. Enter card details
5. Choose whether to set as default
6. Click **"Add Payment Method"**

### Upgrading Subscription

1. Navigate to **Billing & Subscription > Plans & Pricing**
2. Select desired plan
3. Click **"Upgrade to [Plan Name]"**
4. Complete payment through selected gateway
5. Subscription will be activated automatically

## Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly

### API Keys

- **Publishable keys** are safe for frontend use
- **Secret keys** should only be used in backend APIs
- Use test keys for development, live keys for production

### Data Protection

- Card details are never stored in your database
- Only last 4 digits and metadata are stored
- All sensitive data is handled by payment gateways

## Troubleshooting

### Common Issues

1. **"Stripe not initialized"**
   - Check if `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
   - Ensure you're using the correct key (test vs live)

2. **"Razorpay not initialized"**
   - Check if `VITE_RAZORPAY_KEY_ID` is set correctly
   - Verify the Razorpay script is loading

3. **Payment method not saving**
   - Check database connection
   - Verify table schema is correct
   - Check for validation errors

4. **Subscription upgrade failing**
   - Verify plan configuration
   - Check payment gateway credentials
   - Ensure user has valid payment method

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_DEBUG_PAYMENTS=true
```

## Production Deployment

### 1. Update Environment Variables

Replace test keys with live keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_STRIPE_SECRET_KEY=sk_live_your_live_key
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
VITE_RAZORPAY_KEY_SECRET=your_live_secret
```

### 2. Set Up Webhooks

Configure webhooks for real-time payment updates:

- **Stripe**: `https://your-domain.com/api/stripe-webhook`
- **Razorpay**: `https://your-domain.com/api/razorpay-webhook`

### 3. SSL Certificate

Ensure your domain has a valid SSL certificate for secure payment processing.

### 4. Compliance

- Ensure PCI DSS compliance if handling card data
- Follow local payment regulations
- Implement proper error handling and logging

## Support

For issues related to:

- **Stripe**: [Stripe Support](https://support.stripe.com)
- **Razorpay**: [Razorpay Support](https://razorpay.com/support)
- **Application**: Check the troubleshooting section above

## Changelog

### v1.0.0
- Initial payment integration
- Stripe support
- Razorpay support
- Payment method management
- Subscription management
- Invoice management 