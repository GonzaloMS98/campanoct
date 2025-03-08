/*
  # Insert Initial Data

  1. Data Insertion
    - Insert 10 bases (Base 1 through Base 10)
    - Insert 10 teams (Team 1 through Team 10)
    
  2. Notes
    - Each base has a unique email in the format base{n}@example.com
    - Teams are initialized with 0 points
*/

-- Insert bases
INSERT INTO bases (name, email) VALUES
  ('Base 1', 'base1@example.com'),
  ('Base 2', 'base2@example.com'),
  ('Base 3', 'base3@example.com'),
  ('Base 4', 'base4@example.com'),
  ('Base 5', 'base5@example.com'),
  ('Base 6', 'base6@example.com'),
  ('Base 7', 'base7@example.com'),
  ('Base 8', 'base8@example.com'),
  ('Base 9', 'base9@example.com'),
  ('Base 10', 'base10@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert teams
INSERT INTO teams (name, total_points) VALUES
  ('Team 1', 0),
  ('Team 2', 0),
  ('Team 3', 0),
  ('Team 4', 0),
  ('Team 5', 0),
  ('Team 6', 0),
  ('Team 7', 0),
  ('Team 8', 0),
  ('Team 9', 0),
  ('Team 10', 0)
ON CONFLICT (name) DO NOTHING;