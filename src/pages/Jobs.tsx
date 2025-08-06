import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCard } from "@/components/jobs/JobCard";
import { JobForm } from "@/components/jobs/JobForm";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Search, Filter } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type JobWithProfile = Database['public']['Tables']['jobs']['Row'] & {
  profiles?: {
    display_name: string | null;
    company_name: string | null;
    location: string | null;
  } | null;
};

const Jobs = () => {
  const { user, session } = useAuth();
  const { jobs, loading, fetchJobs, deleteJob } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<JobWithProfile[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobWithProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [userType, setUserType] = useState<string>("");

  useEffect(() => {
    if (session) {
      // Get user type from session metadata
      const userType = session.user?.user_metadata?.user_type || 'candidato';
      setUserType(userType);
      fetchJobs(userType);
    }
  }, [session, fetchJobs]);

  useEffect(() => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.profiles?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        (job.remote_allowed && locationFilter.toLowerCase().includes('remoto'))
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(job => job.employment_type === typeFilter);
    }

    if (levelFilter) {
      filtered = filtered.filter(job => job.experience_level === levelFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, typeFilter, levelFilter]);

  const handleEdit = (job: JobWithProfile) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDelete = async (jobId: string) => {
    if (confirm("Tem certeza que deseja excluir esta vaga?")) {
      await deleteJob(jobId);
    }
  };

  const handleApply = (jobId: string) => {
    // TODO: Implement job application logic
    console.log("Apply to job:", jobId);
  };

  const handleFormSuccess = () => {
    fetchJobs(userType);
    setEditingJob(null);
  };

  const isCompany = userType === 'empresa';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando vagas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isCompany ? "Minhas Vagas" : "Buscar Vagas"}
          </h1>
          <p className="text-muted-foreground">
            {isCompany 
              ? "Gerencie suas vagas publicadas" 
              : "Encontre oportunidades que combinam com seu perfil"
            }
          </p>
        </div>
        
        {isCompany && (
          <Button onClick={() => setShowJobForm(true)} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Nova Vaga
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vagas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              placeholder="Localização..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="full-time">Tempo Integral</SelectItem>
                <SelectItem value="part-time">Meio Período</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="internship">Estágio</SelectItem>
                <SelectItem value="freelance">Freelancer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nível de experiência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os níveis</SelectItem>
                <SelectItem value="entry">Júnior</SelectItem>
                <SelectItem value="mid">Pleno</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
                <SelectItem value="executive">Executivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {isCompany ? "Nenhuma vaga encontrada" : "Nenhuma vaga disponível"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isCompany 
                ? "Você ainda não tem vagas publicadas. Crie sua primeira vaga para começar a atrair candidatos."
                : "Não encontramos vagas que correspondam aos seus filtros. Tente ajustar os critérios de busca."
              }
            </p>
            {isCompany && (
              <Button onClick={() => setShowJobForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Vaga
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isCompany={isCompany}
              onEdit={isCompany ? handleEdit : undefined}
              onDelete={isCompany ? handleDelete : undefined}
              onApply={!isCompany ? handleApply : undefined}
            />
          ))}
        </div>
      )}

      <JobForm
        open={showJobForm}
        onOpenChange={(open) => {
          setShowJobForm(open);
          if (!open) setEditingJob(null);
        }}
        job={editingJob}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Jobs;