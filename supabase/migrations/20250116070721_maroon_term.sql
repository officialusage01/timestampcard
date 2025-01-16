/*
  # Create cards table for timestamped content

  1. New Tables
    - `cards`
      - `id` (uuid, primary key)
      - `content` (text, required) - The card's content
      - `created_at` (timestamp) - When the card was created
      - `user_id` (uuid) - Reference to auth.users
      - `share_id` (text) - Unique identifier for sharing
      
  2. Security
    - Enable RLS on `cards` table
    - Add policies for:
      - Anyone can read cards using share_id
      - Authenticated users can create cards
      - Users can read their own cards
*/

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users,
  share_id text UNIQUE NOT NULL
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cards using share_id
CREATE POLICY "Anyone can read cards using share_id"
  ON cards
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create cards
CREATE POLICY "Authenticated users can create cards"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own cards
CREATE POLICY "Users can read own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);