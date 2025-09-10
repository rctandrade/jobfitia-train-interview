-- Fix security warning: Set search_path for all functions to prevent SQL injection
-- This addresses the "Function Search Path Mutable" security warning

-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_id uuid)
 RETURNS TABLE(id uuid, display_name text, user_type text, company_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT 
    profiles.id,
    profiles.display_name,
    profiles.user_type,
    profiles.company_name
  FROM profiles
  WHERE profiles.id = profile_id;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, user_type)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'candidato')
  );
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_ai_matching()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Mark that this application needs AI matching
  NEW.match_score = NULL; -- Will be calculated by the AI system
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_job_applications_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;