import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAIMatching = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const calculateMatchScore = async (applicationId: string, jobId: string, candidateId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: {
          applicationId,
          jobId,
          candidateId,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to calculate match score');
      }

      toast({
        title: "Compatibilidade calculada",
        description: `Score de compatibilidade: ${data.matchScore}%`,
      });

      return data.matchScore;
    } catch (error: any) {
      console.error('Error calculating match score:', error);
      toast({
        title: "Erro",
        description: "Não foi possível calcular a compatibilidade.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const bulkCalculateMatches = async (applications: any[]) => {
    setLoading(true);
    const results = [];

    try {
      for (const application of applications) {
        if (!application.match_score) {
          const score = await calculateMatchScore(
            application.id,
            application.job_id,
            application.candidate_id
          );
          results.push({ applicationId: application.id, score });
        }
      }

      toast({
        title: "Análises concluídas",
        description: `${results.length} compatibilidades calculadas.`,
      });

      return results;
    } catch (error) {
      console.error('Error in bulk matching:', error);
      toast({
        title: "Erro",
        description: "Erro durante o cálculo em massa.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMatchInsights = async (jobId: string) => {
    try {
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_candidate_id_fkey(
            display_name,
            skills,
            experience_years
          )
        `)
        .eq('job_id', jobId)
        .not('match_score', 'is', null)
        .order('match_score', { ascending: false });

      if (error) throw error;

      const totalApplications = applications?.length || 0;
      const highMatches = applications?.filter(app => (app.match_score || 0) >= 80).length || 0;
      const mediumMatches = applications?.filter(app => {
        const score = app.match_score || 0;
        return score >= 60 && score < 80;
      }).length || 0;
      const lowMatches = applications?.filter(app => (app.match_score || 0) < 60).length || 0;
      const averageScore = applications?.reduce((sum, app) => sum + (app.match_score || 0), 0) / totalApplications || 0;

      return {
        totalApplications,
        highMatches,
        mediumMatches,
        lowMatches,
        averageScore: Math.round(averageScore),
        topCandidates: applications?.slice(0, 5) || [],
      };
    } catch (error) {
      console.error('Error getting match insights:', error);
      return null;
    }
  };

  return {
    loading,
    calculateMatchScore,
    bulkCalculateMatches,
    getMatchInsights,
  };
};