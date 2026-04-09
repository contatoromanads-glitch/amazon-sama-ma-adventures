import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-lodge section-padding grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="font-heading text-2xl font-semibold mb-4 text-gold">Amazon Samaúma Lodge</h3>
        <p className="text-body text-primary-foreground/70 leading-relaxed">
          Uma imersão completa na Floresta Amazônica com o conforto e a exclusividade que você merece.
        </p>
      </div>

      <div>
        <h4 className="font-heading text-xl font-medium mb-4">Navegação</h4>
        <ul className="space-y-2 text-primary-foreground/70">
          {[
            { label: "Início", path: "/" },
            { label: "Acomodações", path: "/acomodacoes" },
            { label: "Ecoturismo", path: "/ecoturismo" },
            { label: "Pesca Esportiva", path: "/pesca" },
            { label: "Sobre Nós", path: "/sobre" },
            { label: "Contato", path: "/contato" },
          ].map((l) => (
            <li key={l.path}>
              <Link to={l.path} className="hover:text-gold transition-colors duration-300">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-heading text-xl font-medium mb-4">Contato</h4>
        <ul className="space-y-3 text-primary-foreground/70">
          <li className="flex items-start gap-2">
            <MapPin size={18} className="mt-1 shrink-0 text-gold" />
            Rio Juma – Paraná do Murmuri, Careiro – AM, 69250-000
          </li>
          <li className="flex items-center gap-2">
            <Phone size={18} className="text-gold" />
            +55 (92) 99999-0000
          </li>
          <li className="flex items-center gap-2">
            <Mail size={18} className="text-gold" />
            contato@amazonsamauma.com.br
          </li>
        </ul>
        <div className="flex gap-4 mt-6">
          <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors" aria-label="Instagram">
            <Instagram size={22} />
          </a>
          <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors" aria-label="Facebook">
            <Facebook size={22} />
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-forest-light">
      <div className="container-lodge px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} Amazon Samaúma Lodge. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
