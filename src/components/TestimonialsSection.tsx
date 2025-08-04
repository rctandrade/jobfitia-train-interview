import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Desenvolvedora Full Stack",
    company: "TechCorp",
    image: "👩‍💻",
    rating: 5,
    text: "Através da JobFit IA consegui me capacitar especificamente para uma vaga de React. Em 3 semanas estava na entrevista e hoje trabalho na empresa dos meus sonhos!"
  },
  {
    name: "Carlos Mendes",
    role: "Diretor de RH",
    company: "Inovação Digital",
    image: "👨‍💼",
    rating: 5,
    text: "Reduzimos o tempo de contratação em 70%. Os candidatos chegam às entrevistas muito mais preparados e alinhados com nossas necessidades."
  },
  {
    name: "Ana Oliveira",
    role: "Product Manager",
    company: "StartupXYZ",
    image: "👩‍💼",
    rating: 5,
    text: "A trilha personalizada me deu exatamente as habilidades que a empresa procurava. Consegui a vaga em uma das maiores startups do Brasil!"
  },
  {
    name: "João Santos",
    role: "CEO",
    company: "FinTech Plus",
    image: "👨‍💻",
    rating: 5,
    text: "Nossa equipe de RH economiza horas semanais. Os candidatos da JobFit IA têm um nível de preparação muito superior aos processos tradicionais."
  },
  {
    name: "Luciana Costa",
    role: "Data Scientist",
    company: "AI Solutions",
    image: "👩‍🔬",
    rating: 5,
    text: "Mudei completamente de carreira usando a plataforma. A IA criou uma trilha perfeita para transição de marketing para data science."
  },
  {
    name: "Roberto Lima",
    role: "Gerente de Talentos",
    company: "Enterprise Corp",
    image: "👨‍💼",
    rating: 5,
    text: "A qualidade dos candidatos aumentou drasticamente. Eles chegam com o conhecimento técnico e soft skills que realmente precisamos."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-jobfit-green text-jobfit-green">
            Casos de Sucesso
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-jobfit-navy mb-6">
            Histórias reais de
            <br />
            <span className="text-jobfit-blue">transformação profissional</span>
          </h2>
          <p className="text-xl text-jobfit-gray max-w-3xl mx-auto">
            Descubra como empresas e candidatos estão revolucionando seus processos 
            de recrutamento e desenvolvimento de carreira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-white relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-jobfit-blue/20">
                <Quote className="h-8 w-8" />
              </div>

              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-jobfit-gray leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-jobfit-navy">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-jobfit-gray">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-jobfit-blue font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-jobfit-navy mb-2">92%</div>
            <div className="text-jobfit-gray">Taxa de Satisfação</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-jobfit-navy mb-2">15 dias</div>
            <div className="text-jobfit-gray">Tempo Médio de Capacitação</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-jobfit-navy mb-2">85%</div>
            <div className="text-jobfit-gray">Taxa de Aprovação</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-jobfit-navy mb-2">70%</div>
            <div className="text-jobfit-gray">Redução no Tempo de Hiring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;