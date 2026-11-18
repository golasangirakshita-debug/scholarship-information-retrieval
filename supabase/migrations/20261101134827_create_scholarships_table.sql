/*
# Create scholarships table (single-tenant, no auth)

1. New Tables
- `scholarships`
  - `id` (uuid, primary key)
  - `name` (text, not null) — the scholarship's name
  - `provider` (text) — organisation offering the scholarship
  - `description` (text, not null) — full description used as the searchable document
  - `amount` (text) — award amount as a descriptive string (e.g. "$5,000")
  - `level` (text) — education level targeted (Undergraduate, Graduate, PhD, Postdoc, High School)
  - `field` (text) — academic field / discipline
  - `country` (text) — country where the scholarship applies
  - `deadline` (text) — application deadline as a descriptive string
  - `tags` (text[]) — keyword tags for extra matching signal
  - `url` (text) — link to official page
  - `created_at` (timestamp)

2. Security
- Enable RLS on `scholarships`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in).
*/

CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text,
  description text NOT NULL,
  amount text,
  level text,
  field text,
  country text,
  deadline text,
  tags text[] DEFAULT '{}',
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON scholarships TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_scholarships" ON scholarships;
CREATE POLICY "anon_select_scholarships" ON scholarships FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scholarships" ON scholarships;
CREATE POLICY "anon_insert_scholarships" ON scholarships FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scholarships" ON scholarships;
CREATE POLICY "anon_update_scholarships" ON scholarships FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scholarships" ON scholarships;
CREATE POLICY "anon_delete_scholarships" ON scholarships FOR DELETE
TO anon, authenticated USING (true);
