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

interface SmartAuthRequest {
  userId: string;
  email: string;
  fullName: string;
  provider: string;
  metadata?: any;
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

    const { userId, email, fullName, provider, metadata }: SmartAuthRequest = await req.json();
    
    console.log('Smart social auth for user:', userId, 'from provider:', provider);

    // Check if user profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, display_name')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error('Error checking existing profile');
    }

    // If profile exists, return existing user type
    if (existingProfile) {
      return new Response(JSON.stringify({ 
        success: true, 
        userType: existingProfile.user_type,
        isExisting: true,
        displayName: existingProfile.display_name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI to determine user type based on available information
    const prompt = `
Analise as informações do usuário e determine se é mais provável que seja uma EMPRESA ou CANDIDATO.

INFORMAÇÕES DO USUÁRIO:
- Email: ${email}
- Nome completo: ${fullName}
- Provedor: ${provider}
- Metadados: ${JSON.stringify(metadata || {})}

CRITÉRIOS PARA EMPRESA:
1. Email com domínio corporativo (não gmail, hotmail, yahoo, etc.)
2. Nome que sugere empresa (Ltda, Inc, Corp, SA, ME, etc.)
3. Padrões de nomenclatura empresarial
4. Informações de trabalho que indicam posição de contratação/RH

CRITÉRIOS PARA CANDIDATO:
1. Email pessoal (gmail, hotmail, yahoo, outlook, etc.)
2. Nome que parece ser de pessoa física
3. Perfil típico de busca por emprego

Responda APENAS com uma palavra: "empresa" ou "candidato"
Seja conservador: em caso de dúvida, escolha "candidato"`;

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
            content: 'Você é um especialista em classificação de perfis profissionais. Seja preciso e conservador na análise.' 
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
    const userTypeResponse = aiResponse.choices[0].message.content.trim().toLowerCase();
    
    // Validate AI response
    const userType = (userTypeResponse === 'empresa' || userTypeResponse === 'candidato') 
      ? userTypeResponse 
      : 'candidato'; // Default fallback

    // Create profile with AI-determined user type
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: fullName,
        user_type: userType,
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw new Error('Failed to create user profile');
    }

    console.log(`Smart auth completed for user ${userId}: classified as ${userType}`);

    return new Response(JSON.stringify({ 
      success: true, 
      userType: userType,
      isExisting: false,
      displayName: fullName,
      aiClassified: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart social auth:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});