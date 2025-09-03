-- Fix security vulnerability: Restrict profile visibility
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public can view basic display info only" ON public.profiles;

-- Create more restrictive policies
-- 1. Users can view their own profile (full access)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Companies can view basic info of candidates who applied to their jobs
CREATE POLICY "Companies can view applicant profiles"
ON public.profiles
FOR SELECT
USING (
  user_type = 'candidato' AND
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = profiles.id
    AND j.company_id = auth.uid()
  )
);

-- Create a security definer function for safe public profile access
-- This allows controlled access to basic profile info without exposing sensitive data
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