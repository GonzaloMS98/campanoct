/*
  # Initial Schema for Team Scoring System

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `total_points` (integer, default 0)
      - `created_at` (timestamp)
    
    - `bases`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `scores`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `base_id` (uuid, references bases)
      - `points` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bases table
CREATE TABLE IF NOT EXISTS bases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) NOT NULL,
  base_id uuid REFERENCES bases(id) NOT NULL,
  points integer NOT NULL CHECK (points IN (2, 5, 10)),
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, base_id)
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Policies for teams
CREATE POLICY "Anyone can read teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

-- Policies for bases
CREATE POLICY "Bases can read their own data"
  ON bases FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policies for scores
CREATE POLICY "Bases can insert their own scores"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = base_id);

CREATE POLICY "Anyone can read scores"
  ON scores FOR SELECT
  TO authenticated
  USING (true);

-- Function to update team points
CREATE OR REPLACE FUNCTION update_team_points(team_id uuid, points_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE teams
  SET total_points = total_points + points_to_add
  WHERE id = team_id;
END;
$$ LANGUAGE plpgsql;