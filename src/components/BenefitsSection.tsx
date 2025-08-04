import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Target, 
  BarChart3, 
  Users,
  GraduationCap,
  Award,
  CheckCircle,
  Laptop,
  ArrowRight
} from "lucide-react";

const enterpriseBenefits = [
  {
    icon: Clock,
    title: "Redução no tempo de triagem",
    description: "Elimine 80% do tempo gasto na triagem inicial de candidatos com nossa IA inteligente."
  },
  {
    icon: Target,
    title: "Entrevistas com candidatos já treinados",
    description: "Todos os candidatos chegam às entrevistas preparados e alinhados com os requisitos da vaga."
  },
  {
    icon: BarChart3,
    title: "Indicadores de desempenho individual",
    description: "Métricas detalhadas de cada candidato durante o processo de capacitação."
  },
  {
    icon: Users,
    title: "Melhores contratações",
    description: "Aumente a qualidade dos profissionais contratados com nosso processo de seleção inteligente."
  }
];

const candidateBenefits = [
  {
    icon: Laptop,
    title: "Treinamento 100% online e prático",
    description: "Aprenda no seu ritmo, de qualquer lugar, com conteúdo hands-on e atualizado."
  },
  {
    icon: Target,
    title: "Trilha feita com base nos requisitos da vaga",
    description: "Cada curso é personalizado especificamente para a vaga que você quer conquistar."
  },
  {
    icon: CheckCircle,
    title: "Entrevista garantida ao final do processo",
    description: "Complete a trilha com sucesso e garanta sua vaga na entrevista com a empresa."
  },
  {
    icon: Award,
    title: "Certificado de conclusão",
    description: "Receba certificação reconhecida no mercado para comprovar suas novas competências."
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Enterprise Benefits */}
        <div id="empresas" className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-jobfit-navy text-jobfit-navy">
              Para Empresas
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-jobfit-navy mb-6">
              Revolucione seu processo de
              <br />
              <span className="text-jobfit-blue">recrutamento</span>
            </h2>
            <p className="text-xl text-jobfit-gray max-w-3xl mx-auto">
              Transforme a forma como sua empresa encontra e seleciona talentos, 
              com candidatos pré-qualificados e prontos para o sucesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {enterpriseBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-jobfit-navy">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-jobfit-gray leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="hero" size="xl" className="group">
              Começar como Empresa
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Candidate Benefits */}
        <div id="candidatos" className="bg-jobfit-light-blue rounded-3xl p-8 md:p-16">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Para Candidatos
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-jobfit-navy mb-6">
              Desenvolva suas habilidades e
              <br />
              <span className="text-jobfit-green">garanta sua entrevista</span>
            </h2>
            <p className="text-xl text-jobfit-gray max-w-3xl mx-auto">
              Capacite-se com trilhas personalizadas baseadas em vagas reais 
              e tenha a garantia de chegar à entrevista preparado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {candidateBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-jobfit-navy">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-jobfit-gray leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="accent" size="xl" className="group">
              <GraduationCap className="mr-2 h-5 w-5" />
              Começar Minha Trilha Gratuita
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;