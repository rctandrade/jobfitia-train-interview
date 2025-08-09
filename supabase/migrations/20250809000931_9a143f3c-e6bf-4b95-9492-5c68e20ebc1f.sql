-- Add match_score column to applications table if not exists
-- This will store the AI-calculated compatibility score (0-100)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' 
        AND column_name = 'match_score'
    ) THEN
        ALTER TABLE public.applications 
        ADD COLUMN match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100);
    END IF;
END $$;

-- Add skills columns to profiles table for better matching
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS preferred_salary_min INTEGER,
ADD COLUMN IF NOT EXISTS preferred_salary_max INTEGER;

-- Add index for better performance on match scores
CREATE INDEX IF NOT EXISTS idx_applications_match_score ON public.applications(match_score DESC);

-- Create function to trigger AI matching when application is created
CREATE OR REPLACE FUNCTION public.trigger_ai_matching()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark that this application needs AI matching
  NEW.match_score = NULL; -- Will be calculated by the AI system
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically trigger matching on new applications
DROP TRIGGER IF EXISTS on_application_created ON public.applications;
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_ai_matching();