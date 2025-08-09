import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, Award } from "lucide-react";
import { useAIMatching } from "@/hooks/useAIMatching";

interface MatchingInsightsProps {
  jobId: string;
  onCalculateAll?: () => void;
}

export const MatchingInsights: React.FC<MatchingInsightsProps> = ({ 
  jobId, 
  onCalculateAll 
}) => {
  const { getMatchInsights, loading } = useAIMatching();
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    loadInsights();
  }, [jobId]);

  const loadInsights = async () => {
    const data = await getMatchInsights(jobId);
    setInsights(data);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (!insights) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando insights de compatibilidade...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{insights.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total de Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">{insights.highMatches}</p>
                <p className="text-xs text-muted-foreground">Alta Compatibilidade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">{insights.mediumMatches}</p>
                <p className="text-xs text-muted-foreground">Média Compatibilidade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{insights.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Score Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Candidatos
            </CardTitle>
            {onCalculateAll && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCalculateAll}
                disabled={loading}
              >
                <Brain className="h-4 w-4 mr-2" />
                Recalcular Todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.topCandidates.map((candidate: any, index: number) => (
              <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{candidate.profiles?.display_name || 'Candidato'}</p>
                    <p className="text-sm text-muted-foreground">
                      {candidate.profiles?.experience_years ? 
                        `${candidate.profiles.experience_years} anos de experiência` : 
                        'Experiência não informada'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={getScoreBadgeVariant(candidate.match_score || 0)}>
                      {candidate.match_score || 0}%
                    </Badge>
                  </div>
                  <div className="w-24">
                    <Progress 
                      value={candidate.match_score || 0} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            {insights.topCandidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum candidato com score calculado ainda.</p>
                <p className="text-sm">Use o botão "Recalcular Todos" para gerar scores.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Compatibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Alta (80-100%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${insights.totalApplications > 0 ? (insights.highMatches / insights.totalApplications) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{insights.highMatches}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Média (60-79%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${insights.totalApplications > 0 ? (insights.mediumMatches / insights.totalApplications) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{insights.mediumMatches}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Baixa (0-59%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${insights.totalApplications > 0 ? (insights.lowMatches / insights.totalApplications) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{insights.lowMatches}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};