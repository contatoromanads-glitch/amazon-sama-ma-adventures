import { Link } from "react-router-dom";
import { Utensils, Wifi, Leaf, TreePine, Fish, Binoculars, ChevronDown, Star, MapPin, Phone, MessageCircle, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SectionFadeIn from "@/components/SectionFadeIn";
import BookingModal from "@/components/BookingModal";
import { photos } from "@/lib/photos";
const accommodationImg = photos.quartoStandard;
const ecotourismImg    = "/fotos_reais_amazon/home-ecoturismo.jpg";
const fishingImg       = "/fotos_reais_amazon/home-pesca.jpg";
const restaurantImg    = photos.restaurante;

const HERO_VIDEO_URL = "/hero-drone.mp4";

const morphWords = ["selvagem", "luxuosa", "inesquecível", "autêntica"];

const features = [
  {
    icon: Utensils,
    title: "Culinária Amazônica",
    desc: "Restaurante com pratos típicos regionais, feitos com peixes frescos pescados nas águas do Paraná do Mamori e ingredientes locais.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Starlink",
    desc: "Conexão de alta velocidade em plena Amazônia, para compartilhar suas experiências com quem você ama.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    desc: "Operamos com práticas de baixo impacto ambiental, em harmonia com a floresta e as comunidades ribeirinhas.",
  },
];

const experiences = [
  {
    img: ecotourismImg,
    title: "Ecoturismo",
    desc: "Expedições guiadas pelos igarapés, fauna e flora amazônica. Botos, jacarés, macacos e centenas de espécies de aves.",
    link: "/ecoturismo",
    icon: TreePine,
    tag: "Todo o ano",
  },
  {
    img: fishingImg,
    title: "Pesca Esportiva",
    desc: "Saídas guiadas no Paraná do Mamori para a captura do lendário Tucunaré e outras espécies. Modalidade Pesque & Solte.",
    link: "/pesca",
    icon: Fish,
    tag: "Set – Jan",
  },
  {
    img: restaurantImg,
    title: "Pôr do Sol no Rio",
    desc: "Um dos momentos mais especiais: saia de barco no entardecer e contemple o pôr do sol sobre o rio Amazonas.",
    link: "/contato",
    icon: Binoculars,
    tag: "Imperdível",
  },
];

const stats = [
  { value: "5", label: "Quartos Privativos" },
  { value: "100%", label: "Acesso por Barco" },
  { value: "24h", label: "Contato WhatsApp" },
  { value: "★ 5.0", label: "Avaliação dos Hóspedes" },
];

const testimonials = [
  {
    text: "Uma experiência transformadora. O contato com a natureza amazônica, a hospitalidade do Arlos e a estrutura do lodge superaram todas as expectativas.",
    author: "Carlos M.",
    from: "São Paulo, SP",
    stars: 5,
  },
  {
    text: "A pesca esportiva no Paraná do Mamori é incomparável. Guia experiente, barco bem equipado e tucunarés enormes. Voltarei com certeza!",
    author: "Ricardo S.",
    from: "Curitiba, PR",
    stars: 5,
  },
  {
    text: "O silêncio da floresta à noite, o som do rio ao amanhecer... a minha família saiu transformada. O lodge é um presente para a alma.",
    author: "Ana L.",
    from: "Brasília, DF",
    stars: 5,
  },
];

const faqs = [
  {
    q: "Como funciona o acesso ao lodge?",
    a: "O acesso é feito exclusivamente de barco, saindo de Careiro Castanho — e essa já é parte da experiência! Ao confirmar sua reserva, enviamos todas as instruções detalhadas de acesso pelo WhatsApp.",
  },
  {
    q: "Tem sinal de celular ou internet no lodge?",
    a: "O lodge utiliza internet via Starlink, garantindo boa conexão Wi-Fi. Porém, sinal de operadoras de celular não chega ao local. Consideramos isso uma vantagem: é uma desconexão real com a vida corrida das cidades.",
  },
  {
    q: "A pesca esportiva é para qualquer nível?",
    a: "Sim! Atendemos tanto iniciantes quanto pescadores experientes. Nosso proprietário também atua como guia, adaptando a experiência conforme o perfil do hóspede. Equipamentos básicos estão disponíveis.",
  },
  {
    q: "As refeições estão inclusas na estadia?",
    a: "Entre em contato via WhatsApp para confirmar os detalhes do pacote atual, incluindo refeições, translado e atividades.",
  },
  {
    q: "Qual é a melhor época para visitar?",
    a: "Para pesca esportiva, a temporada é de setembro a janeiro (período de seca). Para ecoturismo, observação de fauna e passeios de barco, o lodge recebe visitantes durante todo o ano.",
  },
  {
    q: "Vocês atendem grupos e famílias?",
    a: "Sim! O lodge tem capacidade para grupos e é excelente para famílias que buscam uma experiência autêntica e segura na Amazônia. Entre em contato para verificar disponibilidade e montar um pacote especial.",
  },
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [morphIndex, setMorphIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphIndex((prev) => (prev + 1) % morphWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.webp"
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4"
          >
            Paraná do Mamori · Careiro Castanho · AM
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-xl text-primary-foreground mb-6"
          >
            Viva a Amazônia de Verdade —{" "}
            <span className="inline-block">
              Uma experiência{" "}
              <span className="relative inline-block min-w-[14rem]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={morphIndex}
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.5 }}
                    className="text-gold italic inline-block"
                  >
                    {morphWords[morphIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-body-lg text-primary-foreground/85 mb-10 max-w-2xl mx-auto"
          >
            Pousada flutuante no Paraná do Mamori, a poucos minutos de Careiro Castanho.
            Natureza, silêncio e aventura — em um só lugar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <BookingModal>
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={18} className="shrink-0" />
                Reserve Agora
              </motion.button>
            </BookingModal>
            <Link
              to="/sobre"
              className="inline-block px-8 py-4 border-2 border-primary-foreground/50 text-primary-foreground font-body font-semibold text-sm tracking-widest uppercase rounded hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Conheça o Lodge
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

      {/* Stats bar */}
      <section className="bg-primary border-t border-forest-light">
        <div className="container-lodge">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <SectionFadeIn key={i}>
                <div className="py-8 px-6 text-center border-r border-forest-light last:border-r-0 border-b md:border-b-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r">
                  <div className="font-heading text-3xl font-light text-gold mb-1">{s.value}</div>
                  <div className="text-body text-sm text-primary-foreground/60 uppercase tracking-widest">{s.label}</div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Sobre o Lodge</span>
            <h2 className="heading-lg mt-2 mb-6">Uma Pousada Flutuante no Coração da Amazônia</h2>
            <p className="text-body text-muted-foreground mb-4">
              O Amazon Samaúma Lodge é uma pousada flutuante localizada no Paraná do Mamori, região de Careiro Castanho, no coração do Amazonas. Aqui, o acesso é feito exclusivamente de barco — e esse já é o começo da experiência.
            </p>
            <p className="text-body text-muted-foreground mb-8">
              Com 5 acomodações aconchegantes, restaurante com culinária regional amazônica e guias especializados, oferecemos o contato mais autêntico possível com a floresta amazônica. Seja para pesca esportiva, explorar a fauna local, ou simplesmente descansar ao som do rio — o Samaúma é o seu destino.
            </p>
            <Link
              to="/sobre"
              className="inline-block font-body font-semibold text-forest hover:text-gold transition-colors border-b-2 border-forest hover:border-gold pb-1"
            >
              Nossa História →
            </Link>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
               <img
                src={accommodationImg.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                alt="Estrutura flutuante do Amazon Samaúma Lodge no Paraná do Mamori"
                className="w-full h-[420px] object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={400}
                height={267}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Uma Experiência Completa</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              No Amazon Samaúma Lodge, cada detalhe foi pensado para que você viva a Amazônia com conforto e autenticidade.
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
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

      {/* Experiences */}
      <section className="section-padding bg-primary">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center text-primary-foreground mb-4">Experiências Inesquecíveis</h2>
            <p className="text-body text-center text-primary-foreground/70 max-w-xl mx-auto mb-16">
              Aventure-se pelo coração da Amazônia com nossos guias especializados e crie memórias para a vida toda.
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((e) => (
              <SectionFadeIn key={e.title}>
                <Link to={e.link} className="group block">
                  <div className="relative hover-zoom rounded-lg overflow-hidden mb-5">
                    <img
                      src={e.img.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                      alt={e.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      width={400}
                      height={267}
                    />
                    <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {e.tag}
                    </span>
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

      {/* How to get there */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Como Chegar</span>
            <h2 className="heading-lg mt-2 mb-6">Acesso Exclusivo por Barco</h2>
            <p className="text-body text-muted-foreground mb-4">
              Estamos localizados no Paraná do Mamori, em Careiro Castanho — AM. O acesso é feito por barco, saindo da cidade de Careiro Castanho.
            </p>
            <p className="text-body text-muted-foreground mb-8">
              Ao confirmar sua reserva, enviamos todas as instruções de acesso diretamente pelo WhatsApp — incluindo como chegar a Careiro Castanho a partir de Manaus.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <MapPin className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm">Localização</p>
                  <p className="text-sm text-muted-foreground">Paraná do Mamori, Careiro Castanho – AM, Brasil</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <Phone className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm">Reservas & Informações</p>
                  <p className="text-sm text-muted-foreground">Atendimento via WhatsApp — rápido e fácil</p>
                </div>
              </div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={ecotourismImg.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                alt="Acesso de barco ao Amazon Samaúma Lodge"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={400}
                height={267}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-sand-light">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">O Que Dizem Nossos Hóspedes</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Experiências reais de pessoas que viveram a Amazônia com o Amazon Samaúma Lodge.
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <SectionFadeIn key={i}>
                <div className="bg-background p-8 rounded-lg shadow-sm border border-border h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={16} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-body text-muted-foreground italic mb-6 flex-1">"{t.text}"</p>
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

      {/* FAQ */}
      <section className="section-padding bg-card">
        <div className="container-lodge max-w-3xl">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Perguntas Frequentes</h2>
            <p className="text-body text-center text-muted-foreground mb-16">
              Tire suas dúvidas sobre o lodge, acesso, passeios e reservas.
            </p>
          </SectionFadeIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <SectionFadeIn key={i}>
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-body font-semibold text-foreground hover:text-gold transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="text-gold shrink-0 ml-4" size={20} />
                    ) : (
                      <ChevronDown className="text-muted-foreground shrink-0 ml-4" size={20} />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-body text-muted-foreground border-t border-border pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg mb-6">Pronto para Viver a Amazônia de Verdade?</h2>
            <p className="text-body-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Entre em contato agora e planeje sua estadia no Amazon Samaúma Lodge. A Floresta Amazônica espera por você.
            </p>
            <BookingModal>
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={18} className="shrink-0" />
                Reserve Agora
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
};

export default Index;
