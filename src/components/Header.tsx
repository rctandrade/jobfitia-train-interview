import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JF</span>
            </div>
            <span className="text-xl font-bold text-jobfit-navy">JobFit IA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
              Como Funciona
            </a>
            <a href="#empresas" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
              Para Empresas
            </a>
            <a href="#candidatos" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
              Para Candidatos
            </a>
            <a href="#precos" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
              Preços
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-jobfit-navy">
              Entrar
            </Button>
            <Button variant="hero" size="default">
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#como-funciona" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
                Como Funciona
              </a>
              <a href="#empresas" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
                Para Empresas
              </a>
              <a href="#candidatos" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
                Para Candidatos
              </a>
              <a href="#precos" className="text-jobfit-gray hover:text-jobfit-navy transition-colors">
                Preços
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="text-jobfit-navy justify-start">
                  Entrar
                </Button>
                <Button variant="hero" size="default">
                  Começar Agora
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;