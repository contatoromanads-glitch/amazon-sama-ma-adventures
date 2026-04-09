import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Acomodações", path: "/acomodacoes" },
  { label: "Ecoturismo", path: "/ecoturismo" },
  { label: "Pesca Esportiva", path: "/pesca" },
  { label: "Sobre Nós", path: "/sobre" },
  { label: "Contato", path: "/contato" },
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-header ${
        scrolled
          ? "bg-primary/95 shadow-lg"
          : "bg-gradient-to-b from-primary/60 to-transparent"
      }`}
    >
      <div className="container-lodge flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-heading text-xl md:text-2xl font-semibold tracking-wide text-primary-foreground">
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
          <Link
            to="/contato"
            className="ml-2 px-5 py-2 text-sm font-semibold rounded bg-accent text-accent-foreground hover:bg-gold-light transition-colors duration-300"
          >
            Reserve Agora
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
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
              <Link
                to="/contato"
                className="mt-2 px-5 py-3 text-center text-sm font-semibold rounded bg-accent text-accent-foreground"
              >
                Reserve Agora
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
