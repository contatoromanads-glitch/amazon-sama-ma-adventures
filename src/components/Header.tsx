import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "./BookingModal";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Acomodações", path: "/acomodacoes" },
  { label: "Ecoturismo", path: "/ecoturismo" },
  { label: "Pesca Esportiva", path: "/pesca" },
  { label: "Sobre Nós", path: "/sobre" },
  { label: "Dúvidas / Ajuda", path: "/contato" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  // Acessibilidade: fecha no Escape e trava o scroll do body quando o menu está aberto
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-header ${
        scrolled
          ? "bg-primary/95 shadow-lg"
          : "bg-gradient-to-b from-primary/60 to-transparent"
      }`}
    >
      <div className="container-lodge flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 md:gap-3 font-heading text-xl md:text-2xl font-semibold tracking-wide text-primary-foreground">
          <img
            src="/logo-amazon-samauma.png"
            alt="Amazon Samaúma Lodge"
            className="h-10 md:h-12 w-auto shrink-0"
            width={48}
            height={48}
          />
          Amazon Samaúma
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-body font-medium tracking-wide transition-colors duration-300 ${
                location.pathname === l.path
                  ? "text-gold"
                  : "text-primary-foreground/80 hover:text-gold-light"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <BookingModal className="ml-2">
            <button className="px-5 py-2 text-sm font-semibold rounded bg-accent text-accent-foreground hover:bg-gold-light transition-colors duration-300">
              Reserve Agora
            </button>
          </BookingModal>
        </nav>

        {/* Mobile: contato rápido + toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <a
            href="https://wa.me/5592993839110?text=Ol%C3%A1%2C%20vim%20do%20site.%20Quero%20conhecer%20as%20pousadas%20flutuantes%20e%20pacotes%20do%20Amazon%20Sama%C3%BAma."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="p-2 text-primary-foreground hover:text-gold transition-colors"
          >
            <MessageCircle size={22} />
          </a>
          <button
            className="p-2 text-primary-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary/95 overflow-hidden"
          >
            <div className="px-4 pb-6 pt-2 flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`text-base font-body py-2 border-b border-forest-light ${
                    location.pathname === l.path
                      ? "text-gold"
                      : "text-primary-foreground/80"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <BookingModal className="mt-2 w-full">
                <button className="w-full px-5 py-3 text-center text-sm font-semibold rounded bg-accent text-accent-foreground">
                  Reserve Agora
                </button>
              </BookingModal>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
