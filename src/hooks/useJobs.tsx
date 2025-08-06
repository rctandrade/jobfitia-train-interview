import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export const useJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async (userType?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('jobs').select(`
        *,
        profiles (
          display_name,
          company_name,
          location
        )
      `);

      if (userType === 'candidato') {
        query = query.eq('status', 'active');
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<JobInsert, 'company_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...jobData, company_id: user.id })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vaga criada com sucesso",
        description: "Sua vaga foi publicada e está ativa.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar vaga",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateJob = async (id: string, jobData: JobUpdate) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vaga atualizada",
        description: "As alterações foram salvas com sucesso.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar vaga",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Vaga excluída",
        description: "A vaga foi removida com sucesso.",
      });

      setJobs(jobs.filter(job => job.id !== id));
    } catch (error: any) {
      toast({
        title: "Erro ao excluir vaga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};