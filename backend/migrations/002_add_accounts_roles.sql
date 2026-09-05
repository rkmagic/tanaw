-- Accounts table: one row per user, stores role (candidate | agency | employer | admin)
CREATE TABLE IF NOT EXISTS accounts (
  user_id TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'agency', 'employer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accounts_role ON accounts(role);

-- Backfill: existing profiles become candidate accounts
INSERT INTO accounts (user_id, role)
  SELECT user_id, 'candidate' FROM profiles
  ON CONFLICT (user_id) DO NOTHING;
