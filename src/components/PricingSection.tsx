import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Candidato",
    price: "Gratuito",
    period: "sempre",
    description: "Perfeito para quem quer se capacitar e conseguir oportunidades",
    popular: false,
    features: [
      "Acesso a trilhas personalizadas",
      "Treinamento com IA",
      "Simulação de entrevistas",
      "Certificado de conclusão",
      "Entrevista garantida",
      "Suporte via chat"
    ],
    cta: "Começar Gratuitamente",
    ctaVariant: "accent" as const
  },
  {
    name: "Plano Trilha Profissional",
    price: "R$ 997",
    period: "/mês",
    description: "Ideal para empresas que buscam candidatos qualificados constantemente",
    popular: true,
    features: [
      "Até 50 vagas ativas",
      "Candidatos pré-qualificados",
      "Dashboard de métricas",
      "Integração com ATS",
      "Suporte prioritário",
      "Relatórios detalhados",
      "Onboarding personalizado"
    ],
    cta: "Experimentar Grátis",
    ctaVariant: "hero" as const
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Solução completa para grandes empresas com alto volume",
    popular: false,
    features: [
      "Vagas ilimitadas",
      "IA personalizada",
      "Integração completa",
      "Gerente de sucesso dedicado",
      "SLA garantido",
      "White label disponível",
      "Customizações especiais"
    ],
    cta: "Falar com Vendas",
    ctaVariant: "outline" as const
  }
];

const PricingSection = () => {
  return (
    <section id="precos" className="py-20 bg-jobfit-light-blue">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Planos e Preços
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-jobfit-navy mb-6">
            Escolha o plano ideal para
            <br />
            <span className="text-jobfit-blue">seu objetivo</span>
          </h2>
          <p className="text-xl text-jobfit-gray max-w-3xl mx-auto">
            Soluções flexíveis para candidatos que buscam oportunidades e empresas 
            que querem otimizar seus processos de recrutamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-white ${
                plan.popular ? 'ring-2 ring-jobfit-blue scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-accent text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-jobfit-navy mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-jobfit-navy">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-jobfit-gray ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-jobfit-gray text-sm leading-relaxed">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-jobfit-green mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-jobfit-gray text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.ctaVariant} 
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-jobfit-navy mb-4">
              🎯 Garantia de Resultado
            </h3>
            <p className="text-jobfit-gray mb-6">
              Para candidatos: Se você não conseguir a entrevista após completar a trilha, 
              oferecemos uma nova capacitação gratuita.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-jobfit-blue mb-2">30 dias</div>
                <div className="text-sm text-jobfit-gray">Teste grátis para empresas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-jobfit-blue mb-2">24/7</div>
                <div className="text-sm text-jobfit-gray">Suporte disponível</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-jobfit-blue mb-2">100%</div>
                <div className="text-sm text-jobfit-gray">Satisfação garantida</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;