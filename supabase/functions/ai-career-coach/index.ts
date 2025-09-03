import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, jobId, userProfile, interviewType, previousResponses } = await req.json();
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    switch (action) {
      case 'generate_learning_path':
        return await generateLearningPath(userId, jobId, userProfile);
      
      case 'conduct_interview':
        return await conductInterview(interviewType, userProfile, previousResponses);
      
      case 'analyze_interview':
        return await analyzeInterview(previousResponses, userProfile);
      
      default:
        throw new Error('Ação não suportada');
    }

  } catch (error) {
    console.error('Erro na AI Career Coach:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateLearningPath(userId: string, jobId: string, userProfile: any) {
  // Buscar detalhes da vaga
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  const prompt = `
    Baseado no perfil do candidato e na vaga desejada, crie uma trilha personalizada de aprendizado.
    
    Perfil do candidato:
    - Experiência: ${userProfile.experience_level || 'Não informado'}
    - Habilidades atuais: ${userProfile.skills?.join(', ') || 'Não informado'}
    - Bio: ${userProfile.bio || 'Não informado'}
    
    Vaga desejada:
    - Título: ${job?.title}
    - Descrição: ${job?.description}
    - Requisitos: ${job?.requirements?.join(', ') || 'Não informado'}
    - Nível de experiência: ${job?.experience_level}
    
    Crie uma trilha com 5-8 módulos de aprendizado que ajudem o candidato a se qualificar para essa vaga.
    
    Responda em formato JSON:
    {
      "title": "Título da trilha",
      "description": "Descrição da trilha",
      "estimated_weeks": número_de_semanas,
      "modules": [
        {
          "title": "Título do módulo",
          "description": "Descrição detalhada",
          "type": "theory|practice|project",
          "estimated_hours": horas_estimadas,
          "resources": ["recurso1", "recurso2"],
          "skills_developed": ["skill1", "skill2"]
        }
      ]
    }
  `;

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
          content: 'Você é um especialista em desenvolvimento de carreira e educação profissional. Crie trilhas de aprendizado personalizadas e práticas.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }),
  });

  const aiResponse = await response.json();
  const learningPath = JSON.parse(aiResponse.choices[0].message.content);

  // Salvar trilha no banco
  const { data: plan } = await supabase
    .from('training_plans')
    .insert({
      title: learningPath.title,
      description: learningPath.description,
      job_id: jobId
    })
    .select('id')
    .single();

  // Salvar módulos
  const modules = learningPath.modules.map((module: any, index: number) => ({
    plan_id: plan.id,
    title: module.title,
    module_type: module.type,
    module_order: index + 1,
    content: {
      description: module.description,
      estimated_hours: module.estimated_hours,
      resources: module.resources,
      skills_developed: module.skills_developed
    }
  }));

  await supabase
    .from('training_modules')
    .insert(modules);

  return new Response(
    JSON.stringify({ 
      success: true, 
      plan_id: plan.id,
      learning_path: learningPath 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function conductInterview(interviewType: string, userProfile: any, previousResponses: any[] = []) {
  const interviewTypes = {
    'technical': 'entrevista técnica focada em habilidades específicas',
    'behavioral': 'entrevista comportamental focada em soft skills e experiências',
    'leadership': 'entrevista para posições de liderança',
    'general': 'entrevista geral de emprego'
  };

  let context = `
    Você é um entrevistador experiente conduzindo uma ${interviewTypes[interviewType as keyof typeof interviewTypes]}.
    
    Perfil do candidato:
    - Experiência: ${userProfile.experience_level || 'Não informado'}
    - Habilidades: ${userProfile.skills?.join(', ') || 'Não informado'}
    - Bio: ${userProfile.bio || 'Não informado'}
  `;

  if (previousResponses.length > 0) {
    context += `\n\nHistórico da conversa:\n`;
    previousResponses.forEach((response, index) => {
      context += `Pergunta ${index + 1}: ${response.question}\n`;
      context += `Resposta: ${response.answer}\n\n`;
    });
    context += `Baseado nas respostas anteriores, faça a próxima pergunta apropriada.`;
  } else {
    context += `\n\nEsta é a primeira pergunta da entrevista. Comece com uma pergunta de aquecimento adequada para o tipo de entrevista.`;
  }

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
          content: `Você é um entrevistador profissional experiente. Faça perguntas relevantes, dê feedback construtivo e seja empático. Mantenha um tom profissional mas amigável. Responda sempre em português brasileiro.`
        },
        { role: 'user', content: context }
      ],
      max_tokens: 300,
      temperature: 0.8
    }),
  });

  const aiResponse = await response.json();
  const question = aiResponse.choices[0].message.content;

  return new Response(
    JSON.stringify({ 
      success: true,
      question,
      interview_step: previousResponses.length + 1
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeInterview(responses: any[], userProfile: any) {
  const prompt = `
    Analise esta simulação de entrevista e forneça feedback detalhado.
    
    Perfil do candidato:
    - Experiência: ${userProfile.experience_level || 'Não informado'}
    - Habilidades: ${userProfile.skills?.join(', ') || 'Não informado'}
    
    Perguntas e respostas da entrevista:
    ${responses.map((r, i) => `
    Pergunta ${i + 1}: ${r.question}
    Resposta: ${r.answer}
    `).join('\n')}
    
    Forneça uma análise completa incluindo:
    1. Pontos fortes demonstrados
    2. Áreas para melhoria
    3. Sugestões específicas para cada resposta
    4. Score geral (0-100)
    5. Próximos passos para desenvolvimento
    
    Responda em formato JSON:
    {
      "overall_score": número_0_a_100,
      "strengths": ["ponto_forte_1", "ponto_forte_2"],
      "improvement_areas": ["area_1", "area_2"],
      "detailed_feedback": [
        {
          "question": "pergunta",
          "feedback": "feedback específico",
          "suggestions": ["sugestão_1", "sugestão_2"]
        }
      ],
      "next_steps": ["próximo_passo_1", "próximo_passo_2"],
      "summary": "resumo geral da performance"
    }
  `;

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
          content: 'Você é um especialista em recursos humanos e desenvolvimento profissional. Forneça feedback construtivo e acionável.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    }),
  });

  const aiResponse = await response.json();
  const analysis = JSON.parse(aiResponse.choices[0].message.content);

  return new Response(
    JSON.stringify({ 
      success: true,
      analysis
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}