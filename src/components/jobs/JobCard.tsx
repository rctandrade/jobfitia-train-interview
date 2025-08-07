import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplyJobModal } from "@/components/applications/ApplyJobModal";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";

import { MapPin, Clock, DollarSign, Users, MoreHorizontal, Send } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Database } from "@/integrations/supabase/types";

type JobWithProfile = Database['public']['Tables']['jobs']['Row'] & {
  profiles?: {
    display_name: string | null;
    company_name: string | null;
    location: string | null;
  } | null;
};

interface JobCardProps {
  job: JobWithProfile;
  isCompany?: boolean;
  onEdit?: (job: JobWithProfile) => void;
  onDelete?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  userProfile?: any;
}

const getEmploymentTypeLabel = (type: string) => {
  const labels = {
    'full-time': 'Tempo Integral',
    'part-time': 'Meio Período',
    'contract': 'Contrato',
    'internship': 'Estágio',
    'freelance': 'Freelancer'
  };
  return labels[type as keyof typeof labels] || type;
};

const getExperienceLevelLabel = (level: string) => {
  const labels = {
    'entry': 'Júnior',
    'mid': 'Pleno',
    'senior': 'Sênior',
    'executive': 'Executivo'
  };
  return labels[level as keyof typeof labels] || level;
};

const getStatusColor = (status: string) => {
  const colors = {
    'active': 'bg-green-500',
    'paused': 'bg-yellow-500',
    'closed': 'bg-red-500'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500';
};

export const JobCard = ({ job, isCompany = false, onEdit, onDelete, onApply, userProfile }: JobCardProps) => {
  const { user } = useAuth();
  const { checkApplicationExists } = useApplications();
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    if (user && userProfile?.user_type === 'candidato') {
      checkApplication();
    }
  }, [user, job.id, userProfile]);

  const checkApplication = async () => {
    if (!user) return;
    setCheckingApplication(true);
    const exists = await checkApplicationExists(job.id, user.id);
    setHasApplied(exists);
    setCheckingApplication(false);
  };

  const handleApplicationSent = () => {
    setHasApplied(true);
  };
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    
    if (job.salary_min && job.salary_max) {
      return `R$ ${job.salary_min.toLocaleString()} - R$ ${job.salary_max.toLocaleString()}`;
    }
    
    if (job.salary_min) {
      return `A partir de R$ ${job.salary_min.toLocaleString()}`;
    }
    
    return `Até R$ ${job.salary_max?.toLocaleString()}`;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
            {!isCompany && job.profiles && (
              <p className="text-sm text-muted-foreground">
                {job.profiles.company_name || job.profiles.display_name}
              </p>
            )}
          </div>
          
          {isCompany && onEdit && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(job.id)} className="text-destructive">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {isCompany && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`} />
              <span className="text-xs text-muted-foreground capitalize">{job.status}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {job.employment_type && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {getEmploymentTypeLabel(job.employment_type)}
            </Badge>
          )}
          {job.experience_level && (
            <Badge variant="outline" className="text-xs">
              {getExperienceLevelLabel(job.experience_level)}
            </Badge>
          )}
          {job.remote_allowed && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Remoto
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="space-y-2">
          {job.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
          )}
          
          {formatSalary() && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              {formatSalary()}
            </div>
          )}

          {isCompany && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              {job.applications_count} candidaturas
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {!isCompany && userProfile?.user_type === 'candidato' && (
          <div className="w-full">
            {hasApplied ? (
              <Button variant="outline" className="w-full" disabled>
                Já Candidatado
              </Button>
            ) : (
              <ApplyJobModal 
                jobId={job.id} 
                jobTitle={job.title}
                onApplicationSent={handleApplicationSent}
              >
                <Button className="w-full" disabled={checkingApplication}>
                  <Send className="w-4 h-4 mr-2" />
                  {checkingApplication ? 'Verificando...' : 'Candidatar-se'}
                </Button>
              </ApplyJobModal>
            )}
          </div>
        )}
        
        {isCompany && (
          <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
            <span>Criada em {new Date(job.created_at).toLocaleDateString('pt-BR')}</span>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
                Editar
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};