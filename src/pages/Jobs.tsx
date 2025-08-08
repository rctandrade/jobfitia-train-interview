import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/jobs/JobCard";
import { JobForm } from "@/components/jobs/JobForm";
import { JobSearchFilters } from "@/components/jobs/JobSearchFilters";
import { useJobSearch } from "@/hooks/useJobSearch";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type JobWithProfile = Database['public']['Tables']['jobs']['Row'] & {
  profiles?: {
    display_name: string | null;
    company_name: string | null;
    location: string | null;
  } | null;
};

const Jobs = () => {
  const { user, loading } = useAuth();
  const {
    jobs,
    filters,
    updateFilter,
    clearFilters,
    loading: jobsLoading,
    hasActiveFilters,
    locations,
    employmentTypes,
    experienceLevels,
    totalJobs,
    filteredCount,
  } = useJobSearch();
  const [showJobForm, setShowJobForm] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleJobCreated = () => {
    setShowJobForm(false);
    // The useJobSearch hook will automatically refetch data
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isEmpresa = userProfile?.user_type === 'empresa';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEmpresa ? 'Gerenciar Vagas' : 'Vagas Disponíveis'}
            </h1>
            <p className="text-muted-foreground">
              {isEmpresa 
                ? 'Crie e gerencie suas oportunidades de trabalho' 
                : 'Encontre sua próxima oportunidade profissional'
              }
            </p>
          </div>
          {isEmpresa && (
            <Button onClick={() => setShowJobForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Vaga
            </Button>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {!isEmpresa && (
            <div className="lg:col-span-1">
              <JobSearchFilters
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                locations={locations}
                employmentTypes={employmentTypes}
                experienceLevels={experienceLevels}
                totalJobs={totalJobs}
                filteredCount={filteredCount}
              />
            </div>
          )}

          {/* Jobs List */}
          <div className={isEmpresa ? "lg:col-span-4" : "lg:col-span-3"}>
            <div className="space-y-6">
              {jobsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando vagas...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      {isEmpresa 
                        ? 'Nenhuma vaga criada ainda. Clique em "Nova Vaga" para começar.' 
                        : hasActiveFilters
                          ? 'Nenhuma vaga encontrada com os filtros aplicados. Tente ajustar os critérios de busca.'
                          : 'Nenhuma vaga disponível no momento.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isCompany={isEmpresa}
                    userProfile={userProfile}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Criar Nova Vaga</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJobForm(false)}
                >
                  ✕
                </Button>
              </div>
              <JobForm 
                open={showJobForm}
                onOpenChange={setShowJobForm}
                onSuccess={handleJobCreated} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;