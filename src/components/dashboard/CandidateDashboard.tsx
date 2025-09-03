import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Target, 
  User, 
  Users, 
  TrendingUp, 
  Eye,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_type: string;
  display_name: string;
  skills: string[];
  experience_years?: number;
  location: string;
  bio: string;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  company_name?: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  job: {
    title: string;
    company_name?: string;
  } | null;
}

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    profileCompletion: 0,
    viewedByCompanies: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRecommendedJobs();
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
      calculateProfileCompletion(data);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('applications')
      .select('id, status, applied_at, job_id')
      .eq('candidate_id', user.id)
      .order('applied_at', { ascending: false });
    
    if (data) {
      // Buscar informações dos jobs separadamente
      const jobIds = data.map(app => app.job_id);
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, title')
        .in('id', jobIds);
      
      const transformedApplications = data.map(app => {
        const job = jobsData?.find(job => job.id === app.job_id);
        return {
          id: app.id,
          status: app.status,
          created_at: app.applied_at,
          job: job ? {
            title: job.title,
            company_name: 'Empresa'
          } : null
        };
      });
      setApplications(transformedApplications);
    }
  };

  const fetchRecommendedJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (data) {
      const transformedJobs = data.map(job => ({
        id: job.id,
        title: job.title,
        company_name: 'Empresa',
        location: job.location,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        created_at: job.created_at
      }));
      setRecommendedJobs(transformedJobs);
    }
  };

  const calculateStats = () => {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
    
    setStats(prev => ({
      ...prev,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      viewedByCompanies: Math.floor(totalApplications * 0.7) // Simulação
    }));
  };

  const calculateProfileCompletion = (profileData: Profile) => {
    let completion = 0;
    const fields = [
      profileData.display_name,
      profileData.bio,
      profileData.location,
      profileData.experience_years,
      profileData.skills?.length > 0
    ];
    
    completion = (fields.filter(Boolean).length / fields.length) * 100;
    setStats(prev => ({ ...prev, profileCompletion: Math.round(completion) }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'interviewing': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Rejeitada';
      case 'interviewing': return 'Entrevista';
      default: return 'Pendente';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-foreground rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {profile?.display_name || 'Candidato'}!
        </h1>
        <p className="text-primary-foreground/80">
          Gerencie suas candidaturas e descubra novas oportunidades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Candidaturas</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats.totalApplications}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.pendingApplications} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Aceitas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.acceptedApplications}</div>
            <p className="text-xs text-green-600">Candidaturas aceitas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Perfil</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.profileCompletion}%</div>
            <Progress value={stats.profileCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{stats.viewedByCompanies}</div>
            <p className="text-xs text-orange-600">Empresas visualizaram</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Candidaturas Recentes
            </CardTitle>
            <CardDescription>
              Acompanhe o status das suas últimas candidaturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{application.job?.title}</h4>
                    <p className="text-sm text-muted-foreground">{application.job?.company_name}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(application.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/applications'}>
                  Ver Todas as Candidaturas
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma candidatura ainda</p>
                <Button className="mt-4" onClick={() => window.location.href = '/jobs'}>
                  Explorar Vagas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Vagas Recomendadas
            </CardTitle>
            <CardDescription>
              Vagas que combinam com seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company_name}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </div>
                      {(job.salary_min || job.salary_max) && (
                        <div className="text-sm font-medium text-green-600 mt-1">
                          R$ {job.salary_min?.toLocaleString()} - R$ {job.salary_max?.toLocaleString()}
                        </div>
                      )}
                    </div>
                      <Badge variant="secondary" className="ml-2">
                        <Star className="w-3 h-3 mr-1" />
                        95% Match
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => window.location.href = '/jobs'}>
                  Ver Mais Vagas
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Complete seu perfil para receber recomendações</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/profile'}>
                  Completar Perfil
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Career Coach */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Target className="w-5 h-5 mr-2" />
            IA Career Coach
          </CardTitle>
          <CardDescription>
            Trilhas personalizadas e simulação de entrevistas com inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                🚀 Acelere seu desenvolvimento profissional
              </p>
              <p className="text-sm text-muted-foreground">
                ✨ Trilhas personalizadas baseadas em IA
              </p>
              <p className="text-sm text-muted-foreground">
                🎯 Simulação de entrevistas com feedback
              </p>
            </div>
            <Button onClick={() => window.location.href = '/career'} className="ml-4">
              Acessar Coach
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Prompt */}
      {stats.profileCompletion < 80 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <User className="w-5 h-5 mr-2" />
              Complete seu Perfil
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Perfis completos recebem 3x mais visualizações de empresas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Progress value={stats.profileCompletion} className="w-32 h-2 mb-2" />
                <p className="text-sm text-yellow-700">{stats.profileCompletion}% completo</p>
              </div>
              <Button onClick={() => window.location.href = '/profile'}>
                Completar Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};