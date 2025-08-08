import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JobFilters {
  search: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  remoteAllowed: boolean | null;
}

const initialFilters: JobFilters = {
  search: '',
  location: '',
  employmentType: '',
  experienceLevel: '',
  salaryMin: null,
  salaryMax: null,
  remoteAllowed: null,
};

export const useJobSearch = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);

  // Fetch all jobs and extract unique filter values
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters whenever jobs or filters change
  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_company_id_fkey (
            display_name,
            company_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
      
      // Extract unique values for filters
      const uniqueLocations = [...new Set(data?.map(job => job.location).filter(Boolean))];
      const uniqueEmploymentTypes = [...new Set(data?.map(job => job.employment_type).filter(Boolean))];
      const uniqueExperienceLevels = [...new Set(data?.map(job => job.experience_level).filter(Boolean))];
      
      setLocations(uniqueLocations);
      setEmploymentTypes(uniqueEmploymentTypes);
      setExperienceLevels(uniqueExperienceLevels);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Text search in title and description
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements?.some((req: string) => req.toLowerCase().includes(searchLower))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    // Employment type filter
    if (filters.employmentType) {
      filtered = filtered.filter(job => job.employment_type === filters.employmentType);
    }

    // Experience level filter
    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experience_level === filters.experienceLevel);
    }

    // Salary range filter
    if (filters.salaryMin !== null) {
      filtered = filtered.filter(job => 
        job.salary_min && job.salary_min >= filters.salaryMin!
      );
    }

    if (filters.salaryMax !== null) {
      filtered = filtered.filter(job => 
        job.salary_max && job.salary_max <= filters.salaryMax!
      );
    }

    // Remote work filter
    if (filters.remoteAllowed !== null) {
      filtered = filtered.filter(job => job.remote_allowed === filters.remoteAllowed);
    }

    setFilteredJobs(filtered);
  };

  const updateFilter = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'location') return value !== '';
      if (key === 'employmentType') return value !== '';
      if (key === 'experienceLevel') return value !== '';
      if (key === 'salaryMin' || key === 'salaryMax') return value !== null;
      if (key === 'remoteAllowed') return value !== null;
      return false;
    });
  }, [filters]);

  return {
    jobs: filteredJobs,
    filters,
    updateFilter,
    clearFilters,
    loading,
    hasActiveFilters,
    locations,
    employmentTypes,
    experienceLevels,
    totalJobs: jobs.length,
    filteredCount: filteredJobs.length,
  };
};