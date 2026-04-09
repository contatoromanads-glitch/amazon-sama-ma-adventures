import { Link } from "react-router-dom";
import { Utensils, Wifi, Leaf, TreePine, Fish, Binoculars } from "lucide-react";
import { motion } from "framer-motion";
import SectionFadeIn from "@/components/SectionFadeIn";
import heroImg from "@/assets/hero-lodge.jpg";
import accommodationImg from "@/assets/accommodation.jpg";
import ecotourismImg from "@/assets/ecotourism.jpg";
import fishingImg from "@/assets/fishing.jpg";
import restaurantImg from "@/assets/restaurant.jpg";

const features = [
  {
    icon: Utensils,
    title: "Tudo Incluso",
    desc: "Pensão completa com o melhor da culinária regional amazônica.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Starlink",
    desc: "Conexão de alta velocidade para compartilhar seus momentos.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    desc: "Operamos com práticas de baixo impacto para preservar a Amazônia.",
  },
];

const experiences = [
  {
    img: ecotourismImg,
    title: "Ecoturismo",
    desc: "16 trilhas com 22.800m de imersão na floresta.",
    link: "/ecoturismo",
    icon: TreePine,
  },
  {
    img: fishingImg,
    title: "Pesca Esportiva",
    desc: "Tucunaré e outras espécies em rios preservados.",
    link: "/pesca",
    icon: Fish,
  },
  {
    img: restaurantImg,
    title: "Gastronomia",
    desc: "Restaurante panorâmico com culinária regional.",
    link: "/acomodacoes",
    icon: Binoculars,
  },
];

const testimonials = [
  {
    text: "Uma experiência transformadora. O contato com a natureza e o conforto do lodge superaram todas as expectativas.",
    author: "Carlos M.",
    from: "São Paulo, SP",
  },
  {
    text: "A pesca esportiva no Rio Juma é incomparável. Voltarei com certeza!",
    author: "Ricardo S.",
    from: "Curitiba, PR",
  },
  {
    text: "Os guias são excepcionais, conhecem cada canto da floresta. Minha família amou.",
    author: "Ana L.",
    from: "Brasília, DF",
  },
];

const Index = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Amazon Samaúma Lodge vista aérea"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-xl text-primary-foreground mb-6"
          >
            Sua Próxima Grande Aventura Começa no Coração do Rio Juma.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-body-lg text-primary-foreground/85 mb-10 max-w-2xl mx-auto"
          >
            Uma imersão completa na Floresta Amazônica com o conforto e a exclusividade que você merece. O Amazon Samaúma Lodge é o seu portal para o inexplorado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to="/contato"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
            >
              Reserve Sua Experiência Agora
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Uma Experiência Completa</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Sua única preocupação será apreciar a natureza.
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <SectionFadeIn key={f.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="text-center p-8 rounded-lg bg-background shadow-sm border border-border transition-shadow hover:shadow-md"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-sand-light flex items-center justify-center">
                    <f.icon className="text-forest" size={26} />
                  </div>
                  <h3 className="heading-md text-xl mb-3">{f.title}</h3>
                  <p className="text-body text-muted-foreground">{f.desc}</p>
                </motion.div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation highlight */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={accommodationImg}
                alt="Chalé privativo do Amazon Samaúma Lodge"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={1200}
                height={800}
              />
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Acomodações</span>
            <h2 className="heading-lg mt-2 mb-6">Chalés Privativos na Floresta</h2>
            <p className="text-body text-muted-foreground mb-4">
              Nossos chalés oferecem o equilíbrio perfeito entre rústico e luxuoso. Camas confortáveis, ar-condicionado, limpeza diária e Wi-Fi Starlink — tudo com vista para a floresta e o rio.
            </p>
            <Link
              to="/acomodacoes"
              className="inline-block mt-4 font-body font-semibold text-forest hover:text-gold transition-colors border-b-2 border-forest hover:border-gold pb-1"
            >
              Conheça os Chalés →
            </Link>
          </SectionFadeIn>
        </div>
      </section>

      {/* Experiences */}
      <section className="section-padding bg-primary">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center text-primary-foreground mb-4">Experiências Inesquecíveis</h2>
            <p className="text-body text-center text-primary-foreground/70 max-w-xl mx-auto mb-16">
              Aventure-se pelo coração da Amazônia com nossos guias especializados.
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((e) => (
              <SectionFadeIn key={e.title}>
                <Link to={e.link} className="group block">
                  <div className="hover-zoom rounded-lg overflow-hidden mb-5">
                    <img
                      src={e.img}
                      alt={e.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                      width={1200}
                      height={800}
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <e.icon className="text-gold" size={22} />
                    <h3 className="font-heading text-xl text-primary-foreground group-hover:text-gold transition-colors">
                      {e.title}
                    </h3>
                  </div>
                  <p className="text-body text-primary-foreground/70">{e.desc}</p>
                </Link>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-sand-light">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-16">O Que Dizem Nossos Hóspedes</h2>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <SectionFadeIn key={i}>
                <div className="bg-background p-8 rounded-lg shadow-sm">
                  <p className="text-body text-muted-foreground italic mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-body font-semibold text-foreground">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.from}</p>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-forest text-primary-foreground text-center">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg mb-6">Pronto Para Sua Aventura Amazônica?</h2>
            <p className="text-body-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Entre em contato e planeje a experiência mais marcante da sua vida.
            </p>
            <Link
              to="/contato"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
            >
              Fale Conosco
            </Link>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
};

export default Index;
