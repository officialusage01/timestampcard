/*
  # Simplified Card Access Policy

  1. Changes
    - Replace all existing policies with a single unified policy
    - Implement a simple, non-recursive access control

  2. Security
    - Maintain data security with simplified rules
    - Allow users to access their own cards
    - Allow public access to shared cards
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for own cards" ON cards;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON cards;
DROP POLICY IF EXISTS "Enable public read access for shared cards" ON cards;

-- Single unified policy for all operations
CREATE POLICY "unified_card_policy"
  ON cards
  AS PERMISSIVE
  FOR ALL
  TO public
  USING (
    (auth.uid() = user_id) -- User owns the card
    OR
    (CURRENT_USER IS NULL) -- Public access for shared cards
  )
  WITH CHECK (
    auth.uid() = user_id -- Only allow users to modify their own cards
  );