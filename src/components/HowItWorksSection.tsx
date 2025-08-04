import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, BrainCircuit, GraduationCap, Video, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Building,
    title: "Empresa cadastra vaga",
    description: "A empresa define os requisitos, habilidades e competências necessárias para a posição.",
    step: "01"
  },
  {
    icon: BrainCircuit,
    title: "IA gera trilha personalizada",
    description: "Nossa inteligência artificial cria um programa de capacitação específico para cada vaga.",
    step: "02"
  },
  {
    icon: GraduationCap,
    title: "Candidato faz os treinamentos",
    description: "Treinamento 100% online com conteúdo prático e exercícios baseados na vaga real.",
    step: "03"
  },
  {
    icon: Video,
    title: "Simulação de entrevista com IA",
    description: "Candidato pratica em entrevistas simuladas com feedback inteligente e personalizado.",
    step: "04"
  },
  {
    icon: CheckCircle,
    title: "Liberação automática para entrevista real",
    description: "Candidatos aprovados ganham acesso direto à entrevista com a empresa contratante.",
    step: "05"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-jobfit-light-blue">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-jobfit-navy mb-6">
            5 passos para transformar<br />
            <span className="text-jobfit-blue">o recrutamento</span>
          </h2>
          <p className="text-xl text-jobfit-gray max-w-3xl mx-auto">
            Um processo inteligente que conecta empresas e candidatos de forma eficiente, 
            garantindo o melhor match para ambos os lados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index} 
                className="relative bg-white shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-0"
              >
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-button">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-jobfit-navy mb-4">
                    {step.title}
                  </h3>
                  <p className="text-jobfit-gray leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-card">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-jobfit-blue rounded-full"></div>
              <span className="text-sm text-jobfit-gray">Processo Automatizado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-jobfit-green rounded-full"></div>
              <span className="text-sm text-jobfit-gray">IA Personalizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-jobfit-navy rounded-full"></div>
              <span className="text-sm text-jobfit-gray">Resultados Garantidos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;