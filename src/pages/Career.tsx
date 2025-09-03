import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, MessageCircle, Target, Sparkles } from 'lucide-react';
import LearningPathGenerator from '@/components/career/LearningPathGenerator';
import InterviewSimulator from '@/components/career/InterviewSimulator';

const Career = () => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchJobs();
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

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          company_id,
          description,
          requirements,
          experience_level,
          profiles!jobs_company_id_fkey(display_name, company_name)
        `)
        .eq('status', 'active')
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
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

  if (isEmpresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Restrito</CardTitle>
              <CardDescription>
                Esta seção é exclusiva para candidatos. Empresas podem acessar o painel principal.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">IA Career Coach</h1>
              <p className="text-muted-foreground">
                Desenvolvimento profissional personalizado com inteligência artificial
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="learning-path" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learning-path" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Trilha Personalizada
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Simulação de Entrevista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning-path" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Selecionar Vaga de Interesse
                </CardTitle>
                <CardDescription>
                  Escolha uma vaga para gerar uma trilha de aprendizado personalizada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma vaga" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.profiles?.company_name || job.profiles?.display_name}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <LearningPathGenerator 
              jobId={selectedJobId} 
              userProfile={userProfile} 
            />
          </TabsContent>

          <TabsContent value="interview">
            <InterviewSimulator userProfile={userProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Career;