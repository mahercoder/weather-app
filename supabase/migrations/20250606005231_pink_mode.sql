/*
  # Create search history table

  1. New Tables
    - `search_history`: Stores user search history for weather locations
      - `id` (uuid, primary key): Unique identifier for each search record
      - `created_at` (timestamptz): When the search was performed
      - `location` (text): The location that was searched
      - `user_id` (uuid, foreign key): References the user who made the search

  2. Security
    - Enable RLS on `search_history` table
    - Add policies for authenticated users to:
      - Read their own search history
      - Insert new search history records
*/

-- Create search history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  location text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own search history"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);