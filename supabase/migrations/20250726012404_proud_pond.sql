/*
  # Add Tournament Stages Support

  1. Schema Changes
    - Add `stages` column to tournaments table
    - Add validation constraint for stage values
    - Update existing tournaments with default stage value

  2. Security
    - Maintain existing RLS policies
    - No changes to authentication requirements

  3. Backward Compatibility
    - Default existing tournaments to 1 stage
    - Ensure all queries remain functional
*/

-- Add stages column to tournaments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tournaments' AND column_name = 'stages'
  ) THEN
    ALTER TABLE tournaments ADD COLUMN stages integer NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add constraint to ensure valid stage values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'tournaments_stages_check'
  ) THEN
    ALTER TABLE tournaments ADD CONSTRAINT tournaments_stages_check CHECK (stages IN (1, 2, 3));
  END IF;
END $$;

-- Create index for stages column
CREATE INDEX IF NOT EXISTS idx_tournaments_stages ON tournaments(stages);

-- Update existing tournaments to have 1 stage by default
UPDATE tournaments SET stages = 1 WHERE stages IS NULL;