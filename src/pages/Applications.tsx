import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { useApplications } from "@/hooks/useApplications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

const Applications = () => {
  const { user, loading } = useAuth();
  const { fetchApplications } = useApplications();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      loadApplications();
    }
  }, [userProfile]);

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

  const loadApplications = async () => {
    if (!userProfile) return;
    
    setApplicationsLoading(true);
    const data = await fetchApplications(userProfile.id, userProfile.user_type);
    setApplications(data);
    setApplicationsLoading(false);
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

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewingApplications = applications.filter(app => app.status === 'reviewing');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const isEmpresa = userProfile?.user_type === 'empresa';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEmpresa ? 'Candidaturas Recebidas' : 'Minhas Candidaturas'}
            </h1>
            <p className="text-muted-foreground">
              {isEmpresa 
                ? 'Gerencie as candidaturas para suas vagas' 
                : 'Acompanhe o status de suas candidaturas'
              }
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceitas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedApplications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              Todas
              <Badge variant="secondary" className="ml-2">
                {applications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes
              <Badge variant="secondary" className="ml-2">
                {pendingApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewing">
              Em Análise
              <Badge variant="secondary" className="ml-2">
                {reviewingApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Aceitas
              <Badge variant="secondary" className="ml-2">
                {acceptedApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitadas
              <Badge variant="secondary" className="ml-2">
                {rejectedApplications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applicationsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando candidaturas...</p>
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isEmpresa 
                      ? 'Nenhuma candidatura recebida ainda.' 
                      : 'Você ainda não se candidatou para nenhuma vaga.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={userProfile.user_type}
                  onStatusUpdate={loadApplications}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma candidatura pendente.</p>
                </CardContent>
              </Card>
            ) : (
              pendingApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={userProfile.user_type}
                  onStatusUpdate={loadApplications}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="reviewing" className="space-y-4">
            {reviewingApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma candidatura em análise.</p>
                </CardContent>
              </Card>
            ) : (
              reviewingApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={userProfile.user_type}
                  onStatusUpdate={loadApplications}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma candidatura aceita.</p>
                </CardContent>
              </Card>
            ) : (
              acceptedApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={userProfile.user_type}
                  onStatusUpdate={loadApplications}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma candidatura rejeitada.</p>
                </CardContent>
              </Card>
            ) : (
              rejectedApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType={userProfile.user_type}
                  onStatusUpdate={loadApplications}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Applications;