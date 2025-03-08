/*
  # Update scores points constraint

  1. Changes
    - Modify the points check constraint to allow values from 1 to 10
    
  2. Notes
    - Uses a DO block to safely modify the constraint
    - Ensures data integrity with the new range
*/

DO $$ 
BEGIN
  -- Drop the existing constraint if it exists
  ALTER TABLE scores DROP CONSTRAINT IF EXISTS scores_points_check;
  
  -- Add the new constraint for points between 1 and 10
  ALTER TABLE scores ADD CONSTRAINT scores_points_check 
    CHECK (points >= 1 AND points <= 10);
END $$;