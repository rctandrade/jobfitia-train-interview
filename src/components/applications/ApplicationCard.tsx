import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApplications } from "@/hooks/useApplications";
import { MapPin, Calendar, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ApplicationCardProps {
  application: any;
  userType: 'empresa' | 'candidato';
  onStatusUpdate?: () => void;
}

export const ApplicationCard = ({ application, userType, onStatusUpdate }: ApplicationCardProps) => {
  const { updateApplicationStatus, loading } = useApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'reviewing':
        return 'Em Análise';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateApplicationStatus(application.id, newStatus);
    onStatusUpdate?.();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {userType === 'candidato' ? application.jobs.title : application.profiles.display_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              {userType === 'empresa' && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={application.profiles.avatar_url} />
                    <AvatarFallback>
                      {application.profiles.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{application.profiles.display_name}</span>
                </div>
              )}
              {application.profiles?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{application.profiles.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(application.applied_at), "dd 'de' MMM, yyyy", { 
                    locale: ptBR 
                  })}
                </span>
              </div>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)} variant="outline">
            {getStatusLabel(application.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {userType === 'candidato' && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{application.jobs.location}</span>
              <span>•</span>
              <span>{application.jobs.employment_type}</span>
            </div>
            {application.jobs.salary_min && (
              <div className="text-sm text-muted-foreground">
                {application.jobs.salary_currency} {application.jobs.salary_min.toLocaleString()} 
                {application.jobs.salary_max && ` - ${application.jobs.salary_max.toLocaleString()}`}
              </div>
            )}
          </div>
        )}

        {application.cover_letter && (
          <div className="bg-muted/50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Carta de Apresentação</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {application.cover_letter}
            </p>
          </div>
        )}

        {application.resume_url && (
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Currículo
              </a>
            </Button>
          </div>
        )}

        {application.match_score && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Score de Compatibilidade</span>
              <span className="font-medium">{application.match_score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${application.match_score}%` }}
              ></div>
            </div>
          </div>
        )}

        {userType === 'empresa' && application.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('reviewing')}
              disabled={loading}
            >
              Em Análise
            </Button>
            <Button
              size="sm"
              onClick={() => handleStatusChange('accepted')}
              disabled={loading}
            >
              Aceitar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusChange('rejected')}
              disabled={loading}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};