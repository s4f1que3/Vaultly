-- Vaultly initial schema
-- Reconstructed from application code (backend/src/**) since the original
-- database and migration history were lost. Reviewed against every
-- .from()/.select()/.insert()/.update() call site in the NestJS backend.
--
-- Notes:
--   * There is no local Users/profiles table — every user_id references
--     Supabase Auth's built-in auth.users(id). The backend talks to Postgres
--     with the service-role key, so no RLS policies are defined here; add
--     them if you ever expose these tables to the anon/authenticated roles.
--   * gen_random_uuid() is native to Postgres 13+ (Supabase runs 15+), no
--     extension needed.

-- =========================================================================
-- households
-- =========================================================================
create table households (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create index idx_households_owner_id on households(owner_id);

-- =========================================================================
-- Categories
-- =========================================================================
create table "Categories" (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  icon       text not null,
  color      text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  constraint uq_categories_user_name unique (user_id, name)
);

create index idx_categories_user_id on "Categories"(user_id);

-- =========================================================================
-- savings_pots
-- =========================================================================
create table savings_pots (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  emoji      text not null,
  amount     numeric(12,2) not null default 0,
  notes      text,
  created_at timestamptz not null default now()
);

create index idx_savings_pots_user_id on savings_pots(user_id);

-- =========================================================================
-- Cards
-- =========================================================================
create table "Cards" (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  card_holder    text not null,
  last_four      integer not null,
  expiry_month   integer not null,
  expiry_year    integer not null,
  card_type      text not null check (card_type in ('visa', 'mastercard', 'amex')),
  card_kind      text not null check (card_kind in ('credit', 'debit')),
  color_theme    text not null check (color_theme in ('green', 'dark', 'brown', 'purple', 'gold')),
  balance        numeric(12,2) not null default 0,
  credit_limit   numeric(12,2) not null default 0,
  savings_pot_id uuid references savings_pots(id) on delete set null,
  is_default     boolean not null default false,
  created_at     timestamptz not null default now()
);

create index idx_cards_user_id on "Cards"(user_id);
create index idx_cards_savings_pot_id on "Cards"(savings_pot_id);

-- =========================================================================
-- Budgets
-- =========================================================================
create table "Budgets" (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  category_id       uuid not null references "Categories"(id) on delete restrict,
  limit_amount      numeric(12,2) not null,
  alert_threshold   integer not null,
  month             integer not null,
  year              integer not null,
  spent_amount      numeric(12,2) not null default 0,
  income_amount     numeric(12,2),
  rollover_enabled  boolean not null default false,
  rollover_amount   numeric(12,2),
  created_at        timestamptz not null default now(),
  constraint uq_budgets_user_category_month_year unique (user_id, category_id, month, year)
);

create index idx_budgets_user_id on "Budgets"(user_id);
create index idx_budgets_category_id on "Budgets"(category_id);

-- =========================================================================
-- Transactions
-- =========================================================================
create table "Transactions" (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  amount        numeric(12,2) not null,
  type          text not null check (type in ('income', 'expense', 'transfer')),
  category_id   uuid not null references "Categories"(id) on delete restrict,
  budget_impact text check (budget_impact in ('increase', 'decrease', 'none')),
  description   text not null,
  merchant      text,
  date          date not null,
  card_id       uuid references "Cards"(id) on delete set null,
  is_split      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index idx_transactions_user_id on "Transactions"(user_id);
create index idx_transactions_category_id on "Transactions"(category_id);
create index idx_transactions_card_id on "Transactions"(card_id);
create index idx_transactions_date on "Transactions"(date);

-- =========================================================================
-- transaction_splits
-- =========================================================================
create table transaction_splits (
  id             uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references "Transactions"(id) on delete cascade,
  category_id    uuid not null references "Categories"(id) on delete restrict,
  amount         numeric(12,2) not null,
  note           text,
  created_at     timestamptz not null default now()
);

create index idx_transaction_splits_transaction_id on transaction_splits(transaction_id);
create index idx_transaction_splits_category_id on transaction_splits(category_id);

-- =========================================================================
-- Subscriptions
-- =========================================================================
create table "Subscriptions" (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  company              text not null,
  amount               numeric(12,2) not null,
  card_id              uuid references "Cards"(id) on delete set null,
  period               text not null check (period in ('monthly', 'yearly')),
  billing_day          integer not null,
  billing_month        integer,
  icon                 text,
  color                text,
  next_due_date        date not null,
  last_processed_date  date,
  is_active            boolean not null default true,
  created_at           timestamptz not null default now()
);

create index idx_subscriptions_user_id on "Subscriptions"(user_id);
create index idx_subscriptions_card_id on "Subscriptions"(card_id);

-- =========================================================================
-- recurring_transactions
-- =========================================================================
create table recurring_transactions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  name                   text not null,
  amount                 numeric(12,2) not null,
  type                   text not null check (type in ('income', 'expense', 'transfer')),
  category_id            uuid not null references "Categories"(id) on delete restrict,
  card_id                uuid references "Cards"(id) on delete set null,
  description            text,
  merchant               text,
  frequency              text not null check (frequency in ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
  day_of_month           integer,
  day_of_week            integer,
  start_date             date not null,
  end_date               date,
  next_due_date          date not null,
  last_processed_date    date,
  is_active              boolean not null default true,
  linked_category        text,
  linked_type            text check (linked_type in ('income', 'expense', 'transfer')),
  linked_budget_impact   text check (linked_budget_impact in ('increase', 'decrease', 'none')),
  created_at             timestamptz not null default now()
);

create index idx_recurring_transactions_user_id on recurring_transactions(user_id);
create index idx_recurring_transactions_category_id on recurring_transactions(category_id);
create index idx_recurring_transactions_card_id on recurring_transactions(card_id);
create index idx_recurring_transactions_next_due_date on recurring_transactions(next_due_date);

-- =========================================================================
-- savings_rules
-- =========================================================================
create table savings_rules (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  pot_id        uuid not null references savings_pots(id) on delete cascade,
  name          text not null,
  trigger_type  text not null check (trigger_type in ('monthly', 'on_income', 'percentage_of_income')),
  amount        numeric(12,2),
  percentage    numeric(5,2),
  day_of_month  integer,
  is_active     boolean not null default true,
  last_run_date date,
  created_at    timestamptz not null default now()
);

create index idx_savings_rules_user_id on savings_rules(user_id);
create index idx_savings_rules_pot_id on savings_rules(pot_id);

-- =========================================================================
-- household_members
-- =========================================================================
create table household_members (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('owner', 'member')),
  joined_at    timestamptz not null default now(),
  constraint uq_household_members_user unique (user_id)
);

create index idx_household_members_household_id on household_members(household_id);

-- =========================================================================
-- household_invites
-- =========================================================================
create table household_invites (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references households(id) on delete cascade,
  invited_email text not null,
  invited_by    uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at    timestamptz not null default now(),
  constraint uq_household_invites_household_email unique (household_id, invited_email)
);

create index idx_household_invites_household_id on household_invites(household_id);

-- =========================================================================
-- liabilities
-- =========================================================================
create table liabilities (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  name                    text not null,
  type                    text not null check (type in ('mortgage', 'auto_loan', 'student_loan', 'credit_card', 'personal_loan', 'other')),
  balance                 numeric(12,2) not null,
  interest_rate           numeric(5,2) not null,
  minimum_payment         numeric(12,2) not null,
  original_amount         numeric(12,2),
  down_payment            numeric(12,2),
  term_years              integer,
  start_date              date,
  budget_category         text,
  recurring_transaction_id uuid references recurring_transactions(id) on delete set null,
  created_at              timestamptz not null default now()
);

create index idx_liabilities_user_id on liabilities(user_id);
create index idx_liabilities_recurring_transaction_id on liabilities(recurring_transaction_id);

-- =========================================================================
-- licenses
-- =========================================================================
create table licenses (
  id              uuid primary key default gen_random_uuid(),
  license_key     text not null unique,
  buyer_email     text not null,
  paypal_order_id text unique,
  status          text not null default 'unused' check (status in ('unused', 'used')),
  used_by         uuid references auth.users(id) on delete set null,
  used_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- =========================================================================
-- payment_history
-- =========================================================================
create table payment_history (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  amount                 numeric(12,2) not null,
  currency               text not null default 'USD',
  status                 text not null check (status in ('succeeded', 'failed')),
  plan                   text not null check (plan in ('monthly', 'yearly')),
  paypal_subscription_id text not null,
  paypal_capture_id      text,
  billing_date           date not null,
  description            text,
  created_at             timestamptz not null default now()
);

create index idx_payment_history_user_id on payment_history(user_id);

-- =========================================================================
-- app_subscriptions
-- =========================================================================
create table app_subscriptions (
  id                                uuid primary key default gen_random_uuid(),
  user_id                           uuid not null references auth.users(id) on delete cascade,
  plan                              text not null check (plan in ('monthly', 'yearly')),
  status                            text not null check (status in ('pending', 'active', 'past_due', 'frozen', 'cancelled')),
  billing_day                       integer not null,
  current_period_start             timestamptz not null,
  current_period_end               timestamptz not null,
  next_billing_date                timestamptz not null,
  grace_period_end                 timestamptz,
  paypal_subscription_id            text,
  pending_paypal_subscription_id    text,
  pending_plan                      text check (pending_plan in ('monthly', 'yearly')),
  payment_method_last4              text,
  payment_method_brand             text,
  cancelled_at                      timestamptz,
  created_at                        timestamptz not null default now(),
  updated_at                        timestamptz not null default now(),
  constraint uq_app_subscriptions_user unique (user_id)
);

-- =========================================================================
-- device_tokens
-- =========================================================================
create table device_tokens (
  id                            uuid primary key default gen_random_uuid(),
  user_id                       uuid not null references auth.users(id) on delete cascade,
  expo_push_token               text not null,
  device_type                   text not null check (device_type in ('ios', 'android')),
  push_notifications_enabled    boolean not null default true,
  updated_at                    timestamptz not null default now(),
  constraint uq_device_tokens_user_token unique (user_id, expo_push_token)
);

create index idx_device_tokens_user_id on device_tokens(user_id);

-- =========================================================================
-- Notifications
-- =========================================================================
create table "Notifications" (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_id on "Notifications"(user_id);
create index idx_notifications_created_at on "Notifications"(created_at);

-- =========================================================================
-- Push_Subscriptions
-- =========================================================================
create table "Push_Subscriptions" (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now(),
  constraint uq_push_subscriptions_user unique (user_id)
);

-- =========================================================================
-- User_settings
-- =========================================================================
create table "User_settings" (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  currency                 text not null default 'USD',
  notifications_enabled    boolean not null default true,
  budget_alerts            boolean not null default true,
  goal_reminders           boolean not null default true,
  weekly_summary           boolean not null default true,
  theme                    text not null default 'dark',
  language                 text not null default 'en',
  created_at               timestamptz not null default now(),
  constraint uq_user_settings_user unique (user_id)
);

-- =========================================================================
-- Merchant_Rules
-- =========================================================================
create table "Merchant_Rules" (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  merchant      text not null,
  category_slug text not null,
  created_at    timestamptz not null default now(),
  constraint uq_merchant_rules_user_merchant unique (user_id, merchant)
);

-- =========================================================================
-- Savings (savings goals)
-- =========================================================================
create table "Savings" (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  name           text not null,
  target_amount  numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  deadline       date,
  icon           text,
  color          text,
  status         text not null default 'active' check (status in ('active', 'completed')),
  created_at     timestamptz not null default now()
);

create index idx_savings_user_id on "Savings"(user_id);
