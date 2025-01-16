/*
  # Fix RLS policies for cards table

  1. Changes
    - Drop existing policies
    - Create new policies that properly restrict access:
      - Users can only see their own cards
      - Cards can only be accessed by share_id if not owned
      - Users can only create their own cards

  2. Security
    - Maintain RLS
    - Stricter policies for card visibility
    - Preserve share functionality while maintaining privacy
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read cards using share_id" ON cards;
DROP POLICY IF EXISTS "Authenticated users can create cards" ON cards;
DROP POLICY IF EXISTS "Users can read own cards" ON cards;

-- Create new, more restrictive policies
CREATE POLICY "Users can read own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read shared cards"
  ON cards
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM cards c
      WHERE c.id = cards.id
      AND c.share_id = current_setting('request.jwt.claims')::json->>'share_id'
    )
  );

CREATE POLICY "Users can create own cards"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);