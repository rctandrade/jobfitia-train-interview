import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useApplications = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchApplications = async (userId: string, userType: 'empresa' | 'candidato') => {
    setLoading(true);
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(
            id,
            title,
            company_id,
            location,
            employment_type,
            salary_min,
            salary_max,
            salary_currency
          ),
          profiles!applications_candidate_id_fkey(
            id,
            display_name,
            avatar_url,
            location
          )
        `);

      if (userType === 'candidato') {
        query = query.eq('candidate_id', userId);
      } else {
        query = query.eq('jobs.company_id', userId);
      }

      const { data, error } = await query.order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as candidaturas.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData: {
    job_id: string;
    candidate_id: string;
    cover_letter?: string;
    resume_url?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi enviada com sucesso.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating application:', error);
      
      let errorMessage = "Não foi possível enviar a candidatura.";
      if (error.code === '23505') {
        errorMessage = "Você já se candidatou para esta vaga.";
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });

      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status da candidatura foi atualizado.",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationExists = async (jobId: string, candidateId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', candidateId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking application:', error);
      return false;
    }
  };

  return {
    loading,
    fetchApplications,
    createApplication,
    updateApplicationStatus,
    checkApplicationExists,
  };
};