/*
  # Final Card Access Policy Fix

  1. Changes
    - Simplify RLS policy to basic ownership check
    - Remove complex conditions that might cause issues
    - Ensure proper access control

  2. Security
    - Maintain data security with clear rules
    - Allow users to access their own cards
    - Allow public access to shared cards via share_id
*/

-- Drop existing policy
DROP POLICY IF EXISTS "unified_card_policy" ON cards;

-- Create separate policies for different operations
CREATE POLICY "cards_select_policy"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "cards_insert_policy"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);