import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface MatchingRequest {
  applicationId: string;
  jobId: string;
  candidateId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { applicationId, jobId, candidateId }: MatchingRequest = await req.json();
    
    console.log('Starting AI matching for application:', applicationId);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('title, description, requirements, employment_type, experience_level, salary_min, salary_max, location')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    // Fetch candidate profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, bio, location, skills, experience_years, preferred_salary_min, preferred_salary_max')
      .eq('id', candidateId)
      .single();

    if (profileError || !profile) {
      throw new Error('Candidate profile not found');
    }

    // Create prompt for AI matching
    const prompt = `
Analise a compatibilidade entre este candidato e esta vaga de emprego. Retorne APENAS um número de 0 a 100 representando a porcentagem de compatibilidade.

VAGA:
- Título: ${job.title}
- Descrição: ${job.description}
- Requisitos: ${job.requirements?.join(', ') || 'Não especificado'}
- Tipo de emprego: ${job.employment_type || 'Não especificado'}
- Nível de experiência: ${job.experience_level || 'Não especificado'}
- Salário: ${job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : 'Não especificado'}
- Localização: ${job.location || 'Não especificado'}

CANDIDATO:
- Nome: ${profile.display_name || 'Não informado'}
- Bio: ${profile.bio || 'Não informado'}
- Localização: ${profile.location || 'Não informado'}
- Habilidades: ${profile.skills?.join(', ') || 'Não informado'}
- Anos de experiência: ${profile.experience_years || 'Não informado'}
- Faixa salarial preferida: ${profile.preferred_salary_min && profile.preferred_salary_max ? `${profile.preferred_salary_min} - ${profile.preferred_salary_max}` : 'Não informado'}

Considere os seguintes critérios para a pontuação:
1. Compatibilidade de habilidades (40%)
2. Experiência adequada ao nível solicitado (25%)
3. Localização compatível (15%)
4. Expectativa salarial alinhada (10%)
5. Adequação geral do perfil à descrição da vaga (10%)

Responda APENAS com o número da pontuação (0-100), sem texto adicional.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em RH que avalia compatibilidade entre candidatos e vagas. Seja preciso e objetivo na análise.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const scoreText = aiResponse.choices[0].message.content.trim();
    const matchScore = parseInt(scoreText);

    if (isNaN(matchScore) || matchScore < 0 || matchScore > 100) {
      console.error('Invalid AI response:', scoreText);
      throw new Error('Invalid match score from AI');
    }

    // Update application with match score
    const { error: updateError } = await supabase
      .from('applications')
      .update({ match_score: matchScore })
      .eq('id', applicationId);

    if (updateError) {
      throw new Error('Failed to update application with match score');
    }

    console.log(`AI matching completed for application ${applicationId}: ${matchScore}%`);

    return new Response(JSON.stringify({ 
      success: true, 
      matchScore,
      applicationId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI matching:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});