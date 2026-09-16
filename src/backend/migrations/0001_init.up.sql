-- Hold Database Schema Migration
-- Migration: 0001_init.up.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    privacy_mode_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'savings', 'checking', 'credit_card', 'investment', 'wallet'
    account_number_masked VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20),
    current_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    available_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    category_type VARCHAR(20) NOT NULL DEFAULT 'expense', -- 'expense', 'income'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(150) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'debit', 'credit'
    description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    receipt_url TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant_name);

-- 5. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    monthly_limit NUMERIC(14, 2) NOT NULL,
    current_spent NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    period_month VARCHAR(7) NOT NULL, -- YYYY-MM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_category_month UNIQUE (user_id, category_id, period_month)
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Categories
INSERT INTO categories (name, icon_name, color_hex, category_type) VALUES
('Food & Drinks', 'utensils', '#F59E0B', 'expense'),
('Shopping', 'shopping-bag', '#EC4899', 'expense'),
('Housing & Rent', 'home', '#8B5CF6', 'expense'),
('Travel & Transit', 'car', '#3B82F6', 'expense'),
('Utilities & Bills', 'zap', '#EAB308', 'expense'),
('Subscriptions', 'film', '#6366F1', 'expense'),
('Investments', 'trending-up', '#10B981', 'expense'),
('Salary & Income', 'briefcase', '#10B981', 'income'),
('Health & Wellness', 'activity', '#EF4444', 'expense'),
('Transfer', 'repeat', '#94A3B8', 'expense')
ON CONFLICT (name) DO NOTHING;

-- Seed Demo User for instant local development
INSERT INTO users (id, email, password_hash, full_name, currency, privacy_mode_default)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'garv@hold.money',
    '$2a$10$DEMO_PASSWORD_HASH_HOLD_WALLET_2026',
    'Garv Aditya Shandilya',
    'INR',
    false
) ON CONFLICT (email) DO NOTHING;

-- Seed Demo Accounts for Demo User
INSERT INTO accounts (id, user_id, institution_name, account_type, account_number_masked, ifsc_code, current_balance, available_balance, currency) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'HDFC Bank', 'savings', '•••• 4091', 'HDFC0001234', 184500.00, 184500.00, 'INR'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'State Bank of India', 'savings', '•••• 8920', 'SBIN0000542', 92350.00, 92350.00, 'INR'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ICICI Bank', 'checking', '•••• 1154', 'ICIC0000911', 145000.00, 145000.00, 'INR'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Cash & Emergency Wallet', 'wallet', 'Cash', 'N/A', 61100.00, 61100.00, 'INR')
ON CONFLICT (id) DO NOTHING;

-- Seed Representative Demo Transactions
INSERT INTO transactions (id, user_id, account_id, category_id, merchant_name, amount, transaction_type, description, tags, transaction_date) VALUES
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM categories WHERE name = 'Salary & Income' LIMIT 1),
    'Tech Corp Global',
    125000.00,
    'credit',
    'Monthly Salary Credit - September',
    ARRAY['Salary', 'DirectDeposit'],
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM categories WHERE name = 'Food & Drinks' LIMIT 1),
    'Starbucks Coffee',
    380.00,
    'debit',
    'Morning Cold Brew and Bagel',
    ARRAY['Coffee', 'Breakfast'],
    CURRENT_TIMESTAMP - INTERVAL '4 hours'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    (SELECT id FROM categories WHERE name = 'Travel & Transit' LIMIT 1),
    'Uber India',
    420.00,
    'debit',
    'Ride to Tech Hub Office',
    ARRAY['Commute', 'Work'],
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000003',
    (SELECT id FROM categories WHERE name = 'Food & Drinks' LIMIT 1),
    'Swiggy Gourmet',
    890.00,
    'debit',
    'Dinner delivery with team',
    ARRAY['Dinner', 'Team'],
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM categories WHERE name = 'Subscriptions' LIMIT 1),
    'Netflix Family',
    649.00,
    'debit',
    'Recurring Premium 4K plan',
    ARRAY['Recurring', 'Entertainment'],
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    (SELECT id FROM categories WHERE name = 'Shopping' LIMIT 1),
    'Blinkit Quick Mart',
    1150.00,
    'debit',
    'Household essentials & groceries',
    ARRAY['Groceries'],
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    uuid_generate_v4(),
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM categories WHERE name = 'Investments' LIMIT 1),
    'Zerodha Coin SIP',
    15000.00,
    'debit',
    'Nifty 50 Index Mutual Fund SIP',
    ARRAY['SIP', 'Wealth'],
    CURRENT_TIMESTAMP - INTERVAL '6 days'
);
