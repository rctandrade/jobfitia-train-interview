import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Target, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LearningModule {
  title: string;
  description: string;
  type: 'theory' | 'practice' | 'project';
  estimated_hours: number;
  resources: string[];
  skills_developed: string[];
}

interface LearningPath {
  title: string;
  description: string;
  estimated_weeks: number;
  modules: LearningModule[];
}

interface LearningPathGeneratorProps {
  jobId?: string;
  userProfile: any;
}

const LearningPathGenerator: React.FC<LearningPathGeneratorProps> = ({ jobId, userProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());

  const generateLearningPath = async () => {
    if (!jobId) {
      toast({
        title: "Erro",
        description: "Selecione uma vaga para gerar trilha personalizada",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-coach', {
        body: {
          action: 'generate_learning_path',
          userId: user?.id,
          jobId,
          userProfile
        }
      });

      if (error) throw error;

      setLearningPath(data.learning_path);
      toast({
        title: "Trilha Gerada!",
        description: "Sua trilha personalizada foi criada com sucesso."
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a trilha personalizada",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleModuleCompletion = (moduleIndex: number) => {
    const newCompleted = new Set(completedModules);
    if (newCompleted.has(moduleIndex)) {
      newCompleted.delete(moduleIndex);
    } else {
      newCompleted.add(moduleIndex);
    }
    setCompletedModules(newCompleted);
  };

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-4 h-4" />;
      case 'practice':
        return <Target className="w-4 h-4" />;
      case 'project':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'theory':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'practice':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'project':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const completionPercentage = learningPath 
    ? (completedModules.size / learningPath.modules.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Trilha de Aprendizado com IA
          </CardTitle>
          <CardDescription>
            Gere uma trilha personalizada baseada no seu perfil e na vaga desejada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!learningPath ? (
            <Button 
              onClick={generateLearningPath} 
              disabled={generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Gerando Trilha...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Trilha Personalizada
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{learningPath.title}</h3>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {learningPath.estimated_weeks} semanas
                </Badge>
              </div>
              
              <p className="text-muted-foreground">{learningPath.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progresso</span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {learningPath && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Módulos da Trilha</h3>
          {learningPath.modules.map((module, index) => (
            <Card key={index} className={`transition-all ${completedModules.has(index) ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModuleCompletion(index)}
                      className="p-1 h-auto"
                    >
                      {completedModules.has(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </Button>
                    {module.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getModuleTypeColor(module.type)}>
                      {getModuleTypeIcon(module.type)}
                      <span className="ml-1 capitalize">{module.type}</span>
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {module.estimated_hours}h
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Habilidades Desenvolvidas</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.skills_developed.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recursos Recomendados</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {module.resources.map((resource, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPathGenerator;