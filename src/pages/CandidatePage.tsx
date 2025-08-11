import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, User, Briefcase, Target, BookOpen, Award, MapPin } from "lucide-react";

const CandidatePage = () => {
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
                Perfil do Candidato
              </h1>
              <p className="text-muted-foreground">
                Gerencie seu perfil profissional e candidaturas
              </p>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Completude do Perfil
            </CardTitle>
            <CardDescription>
              Complete seu perfil para aumentar suas chances de contratação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso do perfil</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">✓</Badge>
                  <span className="text-sm">Informações básicas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">✓</Badge>
                  <span className="text-sm">Experiência profissional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">✓</Badge>
                  <span className="text-sm">Formação acadêmica</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">⚠</Badge>
                  <span className="text-sm">Habilidades e competências</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome Completo</label>
                <p className="text-foreground">{user.email?.split('@')[0] || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <p className="text-muted-foreground">Não informado</p>
              </div>
              <div>
                <label className="text-sm font-medium">Localização</label>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  Não informado
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Editar Informações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Experiência Profissional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-medium">Desenvolvedor Frontend</h4>
                <p className="text-sm text-muted-foreground">Empresa XYZ • 2022 - Atual</p>
                <p className="text-sm mt-2">
                  Desenvolvimento de interfaces web responsivas utilizando React e TypeScript.
                </p>
              </div>
              <div className="border-l-2 border-muted pl-4">
                <h4 className="font-medium">Estagiário de Desenvolvimento</h4>
                <p className="text-sm text-muted-foreground">Empresa ABC • 2021 - 2022</p>
                <p className="text-sm mt-2">
                  Suporte no desenvolvimento de aplicações web e mobile.
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Adicionar Experiência
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Education and Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Formação Acadêmica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-medium">Bacharelado em Ciência da Computação</h4>
                <p className="text-sm text-muted-foreground">Universidade Federal • 2019 - 2023</p>
                <p className="text-sm mt-2">
                  Formação completa em desenvolvimento de software e sistemas.
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Adicionar Formação
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Habilidades e Competências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tecnologias</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">Python</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Idiomas</label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Português</span>
                    <Badge variant="default">Nativo</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Inglês</span>
                    <Badge variant="secondary">Intermediário</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Editar Habilidades
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;