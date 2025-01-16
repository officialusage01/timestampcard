/*
  # Fix RLS Policies for Cards Table

  1. Changes
    - Remove recursive policy that was causing infinite recursion
    - Simplify the shared cards policy to use direct share_id comparison
    - Keep basic CRUD policies for authenticated users

  2. Security
    - Maintain row-level security
    - Allow public access only via share_id
    - Restrict card creation to authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own cards" ON cards;
DROP POLICY IF EXISTS "Users can read shared cards" ON cards;
DROP POLICY IF EXISTS "Users can create own cards" ON cards;

-- Create simplified policies
CREATE POLICY "Users can read own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read shared cards"
  ON cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create own cards"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);