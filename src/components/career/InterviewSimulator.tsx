import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Mic, Send, BarChart3, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InterviewResponse {
  question: string;
  answer: string;
}

interface InterviewAnalysis {
  overall_score: number;
  strengths: string[];
  improvement_areas: string[];
  detailed_feedback: Array<{
    question: string;
    feedback: string;
    suggestions: string[];
  }>;
  next_steps: string[];
  summary: string;
}

interface InterviewSimulatorProps {
  userProfile: any;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ userProfile }) => {
  const { toast } = useToast();
  const [interviewType, setInterviewType] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
  const [interviewStep, setInterviewStep] = useState(0);

  const interviewTypes = {
    'technical': { 
      label: 'Técnica', 
      description: 'Foco em habilidades técnicas específicas',
      color: 'bg-blue-500/10 text-blue-700 border-blue-200'
    },
    'behavioral': { 
      label: 'Comportamental', 
      description: 'Soft skills e experiências passadas',
      color: 'bg-green-500/10 text-green-700 border-green-200'
    },
    'leadership': { 
      label: 'Liderança', 
      description: 'Para posições de gestão e liderança',
      color: 'bg-purple-500/10 text-purple-700 border-purple-200'
    },
    'general': { 
      label: 'Geral', 
      description: 'Entrevista geral de emprego',
      color: 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  };

  const startInterview = async () => {
    if (!interviewType) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de entrevista",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-coach', {
        body: {
          action: 'conduct_interview',
          interviewType,
          userProfile,
          previousResponses: []
        }
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setInterviewStep(data.interview_step);
      setIsActive(true);
      setResponses([]);
      setAnalysis(null);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a entrevista",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma resposta antes de continuar",
        variant: "destructive"
      });
      return;
    }

    const newResponse: InterviewResponse = {
      question: currentQuestion,
      answer: currentAnswer
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setCurrentAnswer('');

    // Se já temos 5 perguntas, finalizar
    if (updatedResponses.length >= 5) {
      await analyzeInterview(updatedResponses);
      return;
    }

    // Buscar próxima pergunta
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-coach', {
        body: {
          action: 'conduct_interview',
          interviewType,
          userProfile,
          previousResponses: updatedResponses
        }
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setInterviewStep(data.interview_step);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao obter próxima pergunta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeInterview = async (finalResponses: InterviewResponse[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-coach', {
        body: {
          action: 'analyze_interview',
          previousResponses: finalResponses,
          userProfile
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      setIsActive(false);
      toast({
        title: "Entrevista Finalizada!",
        description: "Sua análise detalhada está pronta."
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao analisar entrevista",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setIsActive(false);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setResponses([]);
    setAnalysis(null);
    setInterviewStep(0);
    setInterviewType('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Simulação de Entrevista com IA
          </CardTitle>
          <CardDescription>
            Pratique suas habilidades de entrevista com feedback personalizado da IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isActive && !analysis && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Entrevista</label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de entrevista" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(interviewTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={startInterview} 
                disabled={loading || !interviewType}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Iniciar Entrevista
                  </>
                )}
              </Button>
            </div>
          )}

          {isActive && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={interviewTypes[interviewType as keyof typeof interviewTypes]?.color}>
                  {interviewTypes[interviewType as keyof typeof interviewTypes]?.label}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Pergunta {interviewStep} de 5
                </div>
              </div>

              <Progress value={(interviewStep / 5) * 100} className="h-2" />

              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <p className="text-lg">{currentQuestion}</p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <label className="text-sm font-medium">Sua Resposta</label>
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  rows={4}
                />
                <Button 
                  onClick={submitAnswer} 
                  disabled={loading || !currentAnswer.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {responses.length >= 4 ? 'Finalizar Entrevista' : 'Próxima Pergunta'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Análise da Entrevista</h3>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Badge variant={getScoreBadgeVariant(analysis.overall_score)} className="text-lg px-4 py-2">
                    Score: {analysis.overall_score}/100
                  </Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysis.summary}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-base text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-base text-orange-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Áreas para Melhoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.improvement_areas.map((area, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button onClick={resetInterview} variant="outline" className="w-full">
                Nova Entrevista
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSimulator;