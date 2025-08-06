-- Create jobs table for job postings
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  location TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'BRL',
  remote_allowed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs access
CREATE POLICY "Anyone can view active jobs" 
ON public.jobs 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Companies can view their own jobs" 
ON public.jobs 
FOR SELECT 
USING (company_id = auth.uid());

CREATE POLICY "Companies can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (
  company_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'empresa'
  )
);

CREATE POLICY "Companies can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (
  company_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'empresa'
  )
);

CREATE POLICY "Companies can delete their own jobs" 
ON public.jobs 
FOR DELETE 
USING (
  company_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'empresa'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);