-- Extended Payment Integration Database Schema
-- Run this to add new columns for different payment method types

-- =====================================================
-- EXTEND PAYMENT METHODS TABLE WITH NEW COLUMNS
-- =====================================================

-- Add new columns to payment_methods table for different payment types
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS wallet_name TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS emi_bank TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS emi_tenure INTEGER;

-- Update the type constraint to include new payment types
ALTER TABLE payment_methods DROP CONSTRAINT IF EXISTS payment_methods_type_check;
ALTER TABLE payment_methods ADD CONSTRAINT payment_methods_type_check 
  CHECK (type IN ('card', 'bank_account', 'upi', 'netbanking', 'wallet', 'emi'));

-- Add comments for new columns
COMMENT ON COLUMN payment_methods.upi_id IS 'UPI ID for UPI payments (e.g., username@upi)';
COMMENT ON COLUMN payment_methods.bank_name IS 'Bank name for net banking payments';
COMMENT ON COLUMN payment_methods.wallet_name IS 'Wallet name for digital wallet payments';
COMMENT ON COLUMN payment_methods.emi_bank IS 'Bank name for EMI payments';
COMMENT ON COLUMN payment_methods.emi_tenure IS 'EMI tenure in months';

-- =====================================================
-- CREATE INDEXES FOR NEW COLUMNS
-- =====================================================

-- Indexes for new payment method types
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_bank_name ON payment_methods(bank_name);
CREATE INDEX IF NOT EXISTS idx_payment_methods_wallet_name ON payment_methods(wallet_name);
CREATE INDEX IF NOT EXISTS idx_payment_methods_emi_bank ON payment_methods(emi_bank);

-- =====================================================
-- UPDATE EXISTING DATA (if needed)
-- =====================================================

-- Update existing payment methods to have proper type if needed
-- This is optional and depends on your existing data
-- UPDATE payment_methods SET type = 'card' WHERE type IS NULL AND last4 IS NOT NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if new columns were added successfully
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'payment_methods' 
AND column_name IN ('upi_id', 'bank_name', 'wallet_name', 'emi_bank', 'emi_tenure')
ORDER BY column_name;

-- Check if the type constraint was updated
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'payment_methods_type_check';

-- Check if new indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'payment_methods' 
AND indexname LIKE '%type%' OR indexname LIKE '%bank%' OR indexname LIKE '%wallet%' OR indexname LIKE '%emi%'; 