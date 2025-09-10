-- Fix security vulnerability: Restrict access to training content
-- Remove public read access and implement proper access controls

-- Drop existing public read policies
DROP POLICY IF EXISTS "Public can view training plans" ON public.training_plans;
DROP POLICY IF EXISTS "Public can view training modules" ON public.training_modules;

-- Add secure policies for training_plans
-- Only allow candidates to view training plans for jobs they applied to or active jobs
CREATE POLICY "Candidates can view training plans for applied jobs" 
ON public.training_plans 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM applications a 
    WHERE a.job_id = training_plans.job_id 
    AND a.candidate_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM jobs j 
    WHERE j.id = training_plans.job_id 
    AND j.status = 'active'
  )
);

-- Add secure policies for training_modules  
-- Only allow candidates to view modules for training plans they have access to
CREATE POLICY "Candidates can view training modules for accessible plans" 
ON public.training_modules 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM training_plans tp
    JOIN jobs j ON j.id = tp.job_id
    LEFT JOIN applications a ON a.job_id = j.id AND a.candidate_id = auth.uid()
    WHERE tp.id = training_modules.plan_id 
    AND (a.candidate_id IS NOT NULL OR j.status = 'active')
  )
);