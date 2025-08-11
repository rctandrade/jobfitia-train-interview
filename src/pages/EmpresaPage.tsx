import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Users, Briefcase, Settings, MapPin, Globe, Phone } from "lucide-react";

const EmpresaPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Perfil da Empresa
              </h1>
              <p className="text-muted-foreground">
                Gerencie o perfil da sua empresa e vagas
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Company Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Mantenha as informações da sua empresa atualizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome da Empresa</label>
                  <p className="text-foreground">{user.email?.split('@')[0] || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Corporativo</label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">CNPJ</label>
                  <p className="text-muted-foreground">Não informado</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Setor de Atuação</label>
                  <Badge variant="secondary">Tecnologia</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    Não informado
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    Não informado
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="w-4 h-4 mr-2" />
                    Não informado
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Número de Funcionários</label>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    1-10 funcionários
                  </div>
                </div>
              </div>
            </div>
            <Button className="mt-6">
              Editar Informações
            </Button>
          </CardContent>
        </Card>

        {/* Company Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sobre a Empresa</CardTitle>
            <CardDescription>
              Descreva sua empresa para atrair os melhores candidatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Descrição da Empresa</label>
                <p className="text-muted-foreground mt-2">
                  Adicione uma descrição sobre sua empresa, cultura, valores e o que a torna única no mercado.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Missão</label>
                <p className="text-muted-foreground mt-2">
                  Não informado
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Visão</label>
                <p className="text-muted-foreground mt-2">
                  Não informado
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Valores</label>
                <p className="text-muted-foreground mt-2">
                  Não informado
                </p>
              </div>
              <Button variant="outline">
                Adicionar Descrição
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Vagas Ativas
              </CardTitle>
              <CardDescription>
                Gerencie suas vagas publicadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma vaga publicada</p>
                <Button className="mt-4" onClick={() => window.location.href = '/jobs'}>
                  Publicar Primera Vaga
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Candidatos
              </CardTitle>
              <CardDescription>
                Veja candidatos interessados em suas vagas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma candidatura recebida</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/applications'}>
                  Ver Candidaturas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Benefícios Oferecidos</CardTitle>
            <CardDescription>
              Configure os benefícios que sua empresa oferece
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">💼</Badge>
                <span className="text-sm">Vale Refeição</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">🏥</Badge>
                <span className="text-sm">Plano de Saúde</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">🦷</Badge>
                <span className="text-sm">Plano Odontológico</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">🏠</Badge>
                <span className="text-sm">Home Office</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">📚</Badge>
                <span className="text-sm">Capacitação</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">🎯</Badge>
                <span className="text-sm">PLR</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">⏰</Badge>
                <span className="text-sm">Horário Flexível</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">➕</Badge>
                <span className="text-sm">Outros</span>
              </div>
            </div>
            <Button variant="outline" className="mt-6">
              Configurar Benefícios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaPage;