import { Link } from "react-router-dom";
import { MapPin, Instagram, MessageCircle } from "lucide-react";
import BookingModal from "@/components/BookingModal";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-lodge section-padding grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="font-heading text-2xl font-semibold mb-2 text-gold">Amazon Samaúma Lodge</h3>
        <p className="text-sm text-primary-foreground/60 uppercase tracking-widest mb-4 font-body">Paraná do Mamori · Amazônia</p>
        <p className="text-body text-primary-foreground/70 leading-relaxed mb-6">
          Pousada flutuante no coração da Amazônia. Pesca esportiva, ecoturismo e imersão total na floresta amazônica com conforto e autenticidade.
        </p>
        <div className="flex gap-4">
          <a
            href="https://instagram.com/amazon_samauma_lodge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/60 hover:text-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
          <a
            href="https://wa.me/559293839110?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Amazon%20Sama%C3%BAma%20Lodge%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/60 hover:text-gold transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle size={22} />
          </a>
        </div>
      </div>

      <div>
        <h4 className="font-heading text-xl font-medium mb-4">Explore</h4>
        <ul className="space-y-2 text-primary-foreground/70">
          {[
            { label: "Início", path: "/" },
            { label: "Acomodações", path: "/acomodacoes" },
            { label: "Ecoturismo", path: "/ecoturismo" },
            { label: "Pesca Esportiva", path: "/pesca" },
            { label: "Sobre Nós", path: "/sobre" },
            { label: "Dúvidas & Ajuda", path: "/contato" },
          ].map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className="text-sm hover:text-gold transition-colors duration-300 font-body"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-heading text-xl font-medium mb-4">Contato</h4>
        <ul className="space-y-4 text-primary-foreground/70">
          <li className="flex items-start gap-2">
            <MapPin size={16} className="mt-1 shrink-0 text-gold" />
            <span className="text-sm">Paraná do Mamori, Careiro Castanho – AM, Brasil</span>
          </li>
          <li className="flex items-center gap-2">
            <MessageCircle size={16} className="text-gold shrink-0" />
            <a
              href="https://wa.me/5592991163391?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Amazon%20Sama%C3%BAma%20Lodge%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gold transition-colors"
            >
              +55 (92) 99116-3391 (WhatsApp)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Instagram size={16} className="text-gold shrink-0" />
            <a
              href="https://instagram.com/amazon_samauma_lodge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gold transition-colors"
            >
              @amazon_samauma_lodge
            </a>
          </li>
        </ul>
        <div className="mt-6 p-4 bg-forest-light/30 rounded-lg">
          <p className="text-xs text-primary-foreground/60 font-body">
            <strong className="text-gold">Melhor época para pesca:</strong> Setembro a Janeiro<br />
            <strong className="text-gold">Ecoturismo:</strong> Disponível o ano todo
          </p>
        </div>
      </div>
    </div>

    <div className="border-t border-forest-light">
      <div className="container-lodge px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center gap-4">
        <span className="text-xs text-primary-foreground/50 shrink-0 uppercase tracking-widest">Formas de Pagamento:</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Visa */}
          <span className="flex items-center justify-center bg-white rounded px-2 py-1 h-7">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 16" height="14" aria-label="Visa">
              <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
            </svg>
          </span>
          {/* Mastercard */}
          <span className="flex items-center justify-center bg-white rounded px-2 py-1 h-7 gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 20" height="16" aria-label="Mastercard">
              <circle cx="11" cy="10" r="9" fill="#EB001B"/>
              <circle cx="21" cy="10" r="9" fill="#F79E1B"/>
              <path d="M16 3.8a9 9 0 0 1 0 12.4A9 9 0 0 1 16 3.8z" fill="#FF5F00"/>
            </svg>
          </span>
          {/* Elo */}
          <span className="flex items-center justify-center bg-black rounded px-2 py-1 h-7">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 16" height="12" aria-label="Elo">
              <text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#FFCB05">elo</text>
            </svg>
          </span>
          {/* Pix */}
          <span className="flex items-center justify-center bg-white rounded px-2 py-1 h-7 gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="14" aria-label="Pix">
              <path d="M9.5 2L13 5.5 9.5 9 6 5.5z" fill="#32BCAD"/>
              <path d="M13 5.5L16.5 9 13 12.5 9.5 9z" fill="#32BCAD"/>
              <path d="M9.5 9L13 12.5 9.5 16 6 12.5z" fill="#32BCAD"/>
              <path d="M6 5.5L9.5 9 6 12.5 2.5 9z" fill="#32BCAD"/>
            </svg>
            <span style={{fontFamily:"Arial,sans-serif",fontWeight:"bold",fontSize:"11px",color:"#32BCAD"}}>PIX</span>
          </span>
          {/* Hipercard */}
          <span className="flex items-center justify-center rounded px-2 py-1 h-7" style={{background:"#B3131B"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 16" height="12" aria-label="Hipercard">
              <text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="white">hiper</text>
            </svg>
          </span>
          {/* American Express */}
          <span className="flex items-center justify-center rounded px-2 py-1 h-7" style={{background:"#2E77BC"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 16" height="11" aria-label="American Express">
              <text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="white">AMEX</text>
            </svg>
          </span>
          {/* Boleto */}
          <span className="flex items-center justify-center bg-white rounded px-2 py-1 h-7 gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 16" height="14" aria-label="Boleto">
              {[0,2,4,5,7,9,11,12,14,16,18,19,21,23,25].map((x) => (
                <rect key={x} x={x} y="0" width={x % 3 === 0 ? 2 : 1} height="14" fill="#222"/>
              ))}
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div className="border-t border-forest-light/40">
      <div className="container-lodge px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
        <span>© {new Date().getFullYear()} Amazon Samaúma Lodge. Todos os direitos reservados.</span>
        <span className="text-xs">Paraná do Mamori · Careiro Castanho · Amazonas · Brasil</span>
      </div>
    </div>
  </footer>
);

export default Footer;
