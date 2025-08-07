-- Create applications table for job applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  resume_url TEXT,
  match_score INTEGER,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications
CREATE POLICY "Candidates can view their own applications" 
ON public.applications 
FOR SELECT 
USING (candidate_id = auth.uid());

CREATE POLICY "Companies can view applications to their jobs" 
ON public.applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM jobs 
  WHERE jobs.id = applications.job_id 
  AND jobs.company_id = auth.uid()
));

CREATE POLICY "Candidates can create applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  candidate_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'candidato'
  )
);

CREATE POLICY "Companies can update application status" 
ON public.applications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM jobs 
  WHERE jobs.id = applications.job_id 
  AND jobs.company_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update applications_count in jobs table
CREATE OR REPLACE FUNCTION public.update_job_applications_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update applications count
CREATE TRIGGER applications_count_trigger
AFTER INSERT OR DELETE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_job_applications_count();