import { Link } from "react-router-dom";
import { MapPin, Instagram, MessageCircle } from "lucide-react";
import BookingModal from "@/components/BookingModal";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-lodge section-padding grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <img
          src="/logo-amazon-samauma.png"
          alt="Amazon Samaúma Lodge"
          className="h-24 w-auto mb-4"
          width={96}
          height={96}
          loading="lazy"
        />
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
            href="https://wa.me/5592993839110?text=Ol%C3%A1%2C%20vim%20do%20site.%20Quero%20conhecer%20as%20pousadas%20flutuantes%20e%20pacotes%20do%20Amazon%20Sama%C3%BAma."
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
            <a
              href="https://www.google.com/maps/search/?api=1&query=Paran%C3%A1+do+Mamori+Careiro+Castanho+AM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gold transition-colors"
            >
              Paraná do Mamori, Careiro Castanho – AM, Brasil
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MessageCircle size={16} className="text-gold shrink-0" />
            <a
              href="https://wa.me/5592993839110?text=Ol%C3%A1%2C%20vim%20do%20site.%20Quero%20conhecer%20as%20pousadas%20flutuantes%20e%20pacotes%20do%20Amazon%20Sama%C3%BAma."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gold transition-colors"
            >
              +55 (92) 9 9383-9110 (WhatsApp)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.72 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.29 6.29l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a
              href="tel:+5592993839110"
              className="text-sm hover:text-gold transition-colors"
            >
              +55 (92) 9 9383-9110 (Ligação)
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
          {[
            { src: "/pagamentos/elo.svg",        alt: "Elo" },
            { src: "/pagamentos/mastercard.svg", alt: "Mastercard" },
            { src: "/pagamentos/visa.svg",       alt: "Visa" },
            { src: "/pagamentos/hipercard.svg",  alt: "Hipercard" },
            { src: "/pagamentos/amex.svg",       alt: "American Express" },
            { src: "/pagamentos/pix.svg",        alt: "Pix" },
          ].map((b) => (
            <img
              key={b.alt}
              src={b.src}
              alt={`Pagamento ${b.alt}`}
              className="h-8 w-auto rounded shadow-sm"
              loading="lazy"
              width={50} height={32}
            />
          ))}
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
