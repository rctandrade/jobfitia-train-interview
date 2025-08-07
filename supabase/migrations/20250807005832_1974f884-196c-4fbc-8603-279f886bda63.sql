-- Fix security issue by setting search_path for the function
CREATE OR REPLACE FUNCTION public.update_job_applications_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs 
    SET applications_count = applications_count + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs 
    SET applications_count = applications_count - 1 
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;