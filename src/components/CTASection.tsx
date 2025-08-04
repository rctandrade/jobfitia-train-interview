import { Button } from "@/components/ui/button";
import { ArrowRight, Building, User, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-jobfit-green/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="h-10 w-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Comece hoje a revolução
            <br />
            <span className="text-jobfit-green">no recrutamento</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Junte-se a milhares de empresas e candidatos que já estão transformando 
            suas carreiras e processos de contratação.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button variant="hero-outline" size="xl" className="group min-w-[280px]">
              <Building className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Cadastre-se como Empresa</div>
                <div className="text-sm opacity-90">30 dias grátis para testar</div>
              </div>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button variant="hero" size="xl" className="group min-w-[280px]">
              <User className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Cadastre-se como Candidato</div>
                <div className="text-sm opacity-90">Sempre gratuito</div>
              </div>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🚀</div>
              <div className="text-sm">Setup em 5 minutos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🔒</div>
              <div className="text-sm">Dados 100% seguros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">💎</div>
              <div className="text-sm">Sem taxas ocultas</div>
            </div>
          </div>

          {/* Additional CTA Text */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <p className="text-white/90 text-lg leading-relaxed">
              💡 <strong>Dica:</strong> Empresas que usam nossa plataforma reduzem o tempo de contratação 
              em até 70% e candidatos aumentam suas chances de aprovação em 300%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;