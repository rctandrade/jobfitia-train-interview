import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSmartAuth = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const classifyAndCreateProfile = async (user: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-social-auth', {
        body: {
          userId: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
          provider: user.app_metadata?.provider || 'unknown',
          metadata: user.user_metadata,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to classify user');
      }

      if (data.aiClassified) {
        toast({
          title: "Login inteligente realizado!",
          description: `Você foi automaticamente classificado como ${data.userType === 'empresa' ? 'Empresa' : 'Candidato'} com base em suas informações.`,
        });
      } else {
        toast({
          title: "Bem-vindo de volta!",
          description: `Login realizado como ${data.userType === 'empresa' ? 'Empresa' : 'Candidato'}.`,
        });
      }

      return {
        userType: data.userType,
        isExisting: data.isExisting,
        displayName: data.displayName,
        aiClassified: data.aiClassified || false
      };
    } catch (error: any) {
      console.error('Error in smart auth:', error);
      toast({
        title: "Erro na classificação",
        description: "Não foi possível classificar automaticamente seu perfil. Você pode ajustar nas configurações.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    classifyAndCreateProfile,
  };
};