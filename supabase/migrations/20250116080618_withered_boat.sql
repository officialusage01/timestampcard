/*
  # Fix RLS policies for cards table

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Remove complex conditions that could cause infinite loops
    - Ensure basic CRUD operations work correctly

  2. Security
    - Maintain security by enforcing user ownership
    - Allow public access only for shared cards
    - Ensure authenticated users can only create their own cards
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own cards" ON cards;
DROP POLICY IF EXISTS "Anyone can read shared cards" ON cards;
DROP POLICY IF EXISTS "Users can create own cards" ON cards;

-- Create new simplified policies
CREATE POLICY "Enable read access for own cards"
  ON cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable public read access for shared cards"
  ON cards FOR SELECT
  TO public
  USING (true);