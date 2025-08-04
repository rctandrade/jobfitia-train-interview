import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Linkedin, 
  Instagram, 
  MapPin, 
  Phone,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-jobfit-navy text-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">JF</span>
                </div>
                <span className="text-2xl font-bold">JobFit IA</span>
              </div>
              <p className="text-white/80 mb-6 max-w-md leading-relaxed">
                A primeira plataforma de inteligência artificial que conecta empresas e candidatos 
                através de capacitação personalizada e entrevistas garantidas.
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#como-funciona" className="text-white/80 hover:text-white transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#empresas" className="text-white/80 hover:text-white transition-colors">
                    Para Empresas
                  </a>
                </li>
                <li>
                  <a href="#candidatos" className="text-white/80 hover:text-white transition-colors">
                    Para Candidatos
                  </a>
                </li>
                <li>
                  <a href="#precos" className="text-white/80 hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-jobfit-blue" />
                  <a 
                    href="mailto:contato@jobfitia.com" 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    contato@jobfitia.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-jobfit-blue" />
                  <span className="text-white/80">+55 (11) 9999-9999</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-jobfit-blue mt-1" />
                  <span className="text-white/80">
                    São Paulo, SP<br />
                    Brasil
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-white/80 text-sm">
              © 2024 JobFit IA. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Back to Top */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Voltar ao Topo
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pb-8">
          <div className="bg-white/5 rounded-2xl p-6 text-center">
            <p className="text-white/80 text-sm mb-4">
              🚀 <strong>Transforme sua carreira ou empresa hoje mesmo!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero-outline" size="sm">
                Começar como Empresa
              </Button>
              <Button variant="hero" size="sm">
                Começar como Candidato
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;