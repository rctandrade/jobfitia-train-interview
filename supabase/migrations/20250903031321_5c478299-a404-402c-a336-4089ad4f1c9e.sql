-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_id uuid)
RETURNS TABLE(
  id uuid,
  display_name text,
  user_type text,
  company_name text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    profiles.id,
    profiles.display_name,
    profiles.user_type,
    profiles.company_name
  FROM profiles
  WHERE profiles.id = profile_id;
$$;