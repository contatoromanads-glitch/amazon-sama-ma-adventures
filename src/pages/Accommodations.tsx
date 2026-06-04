import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin, ArrowRight,
  AirVent, Droplets, Wifi, Sparkles, BedDouble, Utensils,
  UserCheck, Footprints, Sunrise, TreePine, Moon, Flower2,
  Ship, Compass, ShieldCheck, Leaf, ChevronDown, CalendarDays,
  Tent, Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import SectionFadeIn from "@/components/SectionFadeIn";
import BookingModal from "@/components/BookingModal";
import { WhatsappIcon } from "@/components/WhatsappIcon";
import { DynamicIcon } from "@/components/DynamicIcon";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselPrevious, CarouselNext, type CarouselApi,
} from "@/components/ui/carousel";

// ── Fallback images para o carrossel (quando não há banners no banco) ─────────
const carouselFallback = [
  "/fotos_reais_amazon/lodge.webp",
  "/4567450e-33c2-4ebd-9811-397b90d43bb7.png",
  "/hospitalidade-grupo-lodge.jpeg",
  "/restaurante-buffet-novo.jpeg",
  "/fotos_reais_amazon/home-pesca.jpg",
  "/fotos_reais_amazon/home-ecoturismo.jpg",
];

const accommodationImg = "/4567450e-33c2-4ebd-9811-397b90d43bb7.png";

const amenities = [
  { icon: BedDouble,  label: "Camas Confortáveis"  },
  { icon: AirVent,    label: "Ar-Condicionado"      },
  { icon: Sparkles,   label: "Limpeza Diária"       },
  { icon: Wifi,       label: "Wi-Fi Starlink"       },
  { icon: Droplets,   label: "Água Quente"          },
  { icon: Utensils,   label: "Restaurante Incluso"  },
];

type ItineraryDay = { day: string; text: string; icon: string };
type Highlight   = { text: string; icon: string };
type Package = {
  id?: string;
  num: string; name: string; emoji: string;
  days_text: string; nights_text: string; price: string; installments: string;
  interest: string;
  subtitle?: string;
  itinerary?: ItineraryDay[];
  description?: string;
  highlights?: Highlight[];
  is_active?: boolean;
};

const packageIncludes = [
  { icon: BedDouble,   label: "Hospedagem",  desc: "em acomodações confortáveis" },
  { icon: Utensils,    label: "Alimentação", desc: "comida típica regional" },
  { icon: Ship,        label: "Transporte",  desc: "fluvial durante todo o roteiro" },
  { icon: Compass,     label: "Guia Local",  desc: "especializado" },
  { icon: ShieldCheck, label: "Seguro",      desc: "aventura" },
];

// ── Fallback lodges (exibido quando banco não retorna dados) ──────────────────
const fallbackLodges = [
  {
    name: "Amazon Samaúma Lodge",
    slug: "amazon-samauma",
    img:  accommodationImg,
    desc: "Pousada flutuante no coração da Amazônia. Quartos privativos sobre o rio com ar-condicionado, Wi-Fi Starlink e restaurante incluso.",
  },
  {
    name: "Amazon Apuí Lodge",
    slug: "amazon-apui-lodge",
    img:  "/pousada-2/pousada-flutuante-amazonas-vista-externa-rio-por-do-sol.jpeg",
    desc: "Nossa segunda pousada flutuante com estrutura ampla, deck panorâmico e 6 quartos confortáveis à beira do rio.",
  },
];

type Banner = { image_url: string; is_active: boolean | null };
type Lodge  = {
  id: string; name: string; slug: string; description: string | null;
  location: string | null; hero_image: string | null;
  amenities: string[] | null; is_active: boolean | null;
};

// ── Card de pacote interativo (roteiro expansível) ────────────────────────────
function PackageCard({ pkg, defaultOpen = false }: { pkg: Package; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const hasItinerary = !!pkg.itinerary?.length;
  const toggleLabel  = hasItinerary ? "Ver roteiro dia a dia" : "Ver detalhes da experiência";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-background rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 p-5 bg-primary text-primary-foreground">
        <div>
          <span className="text-xs font-body font-semibold tracking-[3px] uppercase text-gold">
            Pacote {pkg.num}
          </span>
          <h3 className="font-heading text-2xl leading-tight flex items-center gap-2">
            <span aria-hidden>{pkg.emoji}</span> {pkg.name}
          </h3>
          {pkg.subtitle && (
            <p className="text-xs text-primary-foreground/70 mt-1 italic">{pkg.subtitle}</p>
          )}
        </div>
        <div className="text-right shrink-0 bg-forest-light/40 rounded-lg px-3 py-2">
          <span className="block font-body font-bold text-sm">{pkg.days_text}</span>
          <span className="block text-xs text-primary-foreground/70">{pkg.nights_text}</span>
        </div>
      </div>

      {/* Preço */}
      <div className="flex items-end justify-between px-5 py-4 bg-card border-b border-border">
        <div>
          <span className="block text-[11px] text-muted-foreground uppercase tracking-widest">
            Valor por pessoa
          </span>
          <p className="font-heading text-3xl text-forest leading-none mt-1">
            R$ {pkg.price}<span className="text-base align-top">,00</span>
          </p>
        </div>
        <span className="text-xs text-muted-foreground text-right leading-tight">
          à vista ou<br />em até <strong className="text-forest">{pkg.installments}</strong>
        </span>
      </div>

      {/* Toggle conteúdo */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 px-5 py-3 text-sm font-body font-semibold text-forest hover:bg-sand-light/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          {hasItinerary ? <CalendarDays size={16} className="text-gold" /> : <Leaf size={16} className="text-gold" />}
          {toggleLabel}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>

      {/* Conteúdo expansível */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Descrição (pacotes temáticos) */}
            {pkg.description && (
              <p className="px-5 pt-1 pb-3 text-sm text-muted-foreground leading-relaxed">
                {pkg.description}
              </p>
            )}

            {/* Roteiro dia a dia */}
            {hasItinerary && (
              <ul className="px-5 pb-4 pt-1 space-y-3">
                {pkg.itinerary!.map((d) => (
                  <li key={d.day} className="flex gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-sand-light flex items-center justify-center mt-0.5">
                      <DynamicIcon name={d.icon} size={16} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">{d.day}</p>
                      <p className="text-sm text-muted-foreground leading-snug">{d.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Atividades / vivências (pacotes temáticos) */}
            {pkg.highlights && (
              <ul className="px-5 pb-4 pt-1 space-y-3">
                {pkg.highlights.map((h) => (
                  <li key={h.text} className="flex items-center gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-sand-light flex items-center justify-center">
                      <DynamicIcon name={h.icon} size={16} className="text-forest" />
                    </div>
                    <p className="text-sm text-foreground leading-snug">{h.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="mt-auto p-5 pt-3">
        <BookingModal defaultInterest={pkg.interest} className="w-full">
          <motion.button
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            <WhatsappIcon size={16} className="shrink-0" />
            Quero o Pacote {pkg.name}
          </motion.button>
        </BookingModal>
      </div>
    </motion.div>
  );
}

// ── Componente ────────────────────────────────────────────────────────────────
function Accommodations() {
  // Carrossel API para autoplay
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Banners do banco → imagens do carrossel
  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["banners-carousel"],
    queryFn: async () => {
      const { data } = await supabase
        .from("banners")
        .select("image_url, is_active")
        .eq("is_active", true)
        .order("sort_order");
      return (data ?? []) as Banner[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const carouselImages = banners.length > 0
    ? banners.map((b) => b.image_url)
    : carouselFallback;

  // Autoplay a cada 4 s
  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => carouselApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [carouselApi]);

  // Pousadas do banco
  const { data: lodges = [] } = useQuery<Lodge[]>({
    queryKey: ["lodges-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lodges" as any)
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) return [];
      return (data ?? []) as unknown as Lodge[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: roomCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ["lodges-room-counts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accommodations" as any)
        .select("lodge_id")
        .eq("is_active", true)
        .not("lodge_id", "is", null);
      if (error) return {};
      const counts: Record<string, number> = {};
      (data as unknown as { lodge_id: string }[]).forEach(({ lodge_id }) => {
        counts[lodge_id] = (counts[lodge_id] ?? 0) + 1;
      });
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["public-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) return [];
      return data as Package[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const showLodges = lodges.length > 0;

  return (
    <div className="bg-background pt-20">
      <SEOHead
        title="Acomodações | Amazon Samaúma Lodge"
        description="Pousadas flutuantes no Paraná do Mamori. Quartos privativos com ar-condicionado, Wi-Fi Starlink, água quente e restaurante incluso. Careiro Castanho – AM."
        canonicalPath="/acomodacoes"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={accommodationImg}
          alt="Acomodações do Amazon Samaúma Lodge"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200} height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4">
            Conforto na Amazônia
          </span>
          <h1 className="heading-xl text-primary-foreground">Acomodações</h1>
          <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            Pousadas flutuantes sobre o rio, com conforto e imersão total na natureza amazônica.
          </p>
        </div>
      </section>

      {/* ── Intro + Carrossel ─────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">
              Nossas Pousadas
            </span>
            <h2 className="heading-lg mt-2 mb-6">Seu Refúgio Flutuante na Amazônia</h2>
            <p className="text-body text-muted-foreground mb-4">
              Nossas pousadas foram projetadas para oferecer conforto e imersão na natureza. Acorde
              com a vista do rio, respire o ar puro da Amazônia e sinta que o tempo aqui funciona
              diferente.
            </p>
            <p className="text-body text-muted-foreground mb-4">
              Cada acomodação possui camas confortáveis, ar-condicionado, água quente, Wi-Fi
              Starlink e banheiro privativo. A estrutura flutuante proporciona uma experiência única
              de dormir sobre as águas do Paraná do Mamori.
            </p>
            <p className="text-body text-muted-foreground mb-8">
              Ao amanhecer, a paisagem do rio e da floresta é o seu despertador natural. Ao
              entardecer, o deck é o lugar perfeito para contemplar o pôr do sol amazônico.
            </p>
            <BookingModal defaultInterest="Relaxar/Descansar">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 min-h-[50px]"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                <WhatsappIcon size={18} className="shrink-0" />
                Consultar Disponibilidade
              </motion.button>
            </BookingModal>
          </SectionFadeIn>

          {/* Carrossel */}
          <SectionFadeIn>
            <div className="relative rounded-lg overflow-hidden">
              <Carousel
                setApi={setCarouselApi}
                opts={{ loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {carouselImages.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={img}
                          alt={`Amazon Samaúma Lodge – foto ${i + 1}`}
                          className="w-full h-[420px] object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                          width={1200} height={800}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
              </Carousel>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Cards das pousadas ───────────────────────────────────────────── */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Nossas Pousadas</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Escolha a pousada ideal para a sua estadia e conheça os quartos disponíveis.
            </p>
          </SectionFadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {showLodges
              ? lodges.map((lodge) => (
                  <SectionFadeIn key={lodge.id}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-background rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="hover-zoom overflow-hidden">
                        <img
                          src={lodge.hero_image || accommodationImg}
                          alt={lodge.name}
                          className="w-full h-56 object-cover"
                          loading="lazy" width={1200} height={800}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-heading text-xl">{lodge.name}</h3>
                          {(roomCounts[lodge.id] ?? 0) > 0 && (
                            <span className="text-xs font-body font-semibold uppercase tracking-widest bg-sand-light text-forest px-3 py-1 rounded-full">
                              {roomCounts[lodge.id]} quarto{roomCounts[lodge.id] !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        {lodge.description && (
                          <p className="text-body text-muted-foreground mb-4 line-clamp-3">
                            {lodge.description}
                          </p>
                        )}
                        {lodge.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                            <MapPin size={14} className="text-gold" />
                            <span>{lodge.location}</span>
                          </div>
                        )}
                        <Link to={`/acomodacoes/${lodge.slug}`}>
                          <motion.div
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 cursor-pointer"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          >
                            Ver Quartos <ArrowRight size={16} className="shrink-0" />
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  </SectionFadeIn>
                ))
              : fallbackLodges.map((lodge) => (
                  <SectionFadeIn key={lodge.slug}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-background rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="hover-zoom overflow-hidden">
                        <img
                          src={lodge.img}
                          alt={lodge.name}
                          className="w-full h-56 object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-xl mb-3">{lodge.name}</h3>
                        <p className="text-body text-muted-foreground mb-5">{lodge.desc}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                          <MapPin size={14} className="text-gold" />
                          <span>Paraná do Mamori, Careiro Castanho – AM</span>
                        </div>
                        <Link to={`/acomodacoes/${lodge.slug}`}>
                          <motion.div
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 cursor-pointer"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          >
                            Ver Quartos <ArrowRight size={16} className="shrink-0" />
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  </SectionFadeIn>
                ))}
          </div>
        </div>
      </section>

      {/* ── Comodidades ──────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Comodidades Incluídas</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-12">
              O que você encontra em todas as acomodações do Amazon Samaúma Lodge.
            </p>
          </SectionFadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {amenities.map((a) => (
              <SectionFadeIn key={a.label}>
                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 h-32 bg-card rounded-lg border border-border">
                  <a.icon className="text-gold shrink-0" size={32} />
                  <span className="font-body font-medium leading-tight text-sm sm:text-base">{a.label}</span>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pacotes de Ecoturismo ────────────────────────────────────────── */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <span className="block text-center text-sm font-body font-semibold tracking-[4px] uppercase text-gold mb-3">
              Natureza, aventura e experiências únicas
            </span>
            <h2 className="heading-lg text-center mb-4">Pacotes de Ecoturismo na Amazônia</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-12">
              Escolha o pacote ideal e toque para conhecer os detalhes de cada experiência.
              Todos com guia local, hospedagem e alimentação inclusos.
            </p>
          </SectionFadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {packages.map((pkg, i) => (
              <SectionFadeIn key={pkg.num}>
                <PackageCard pkg={pkg} defaultOpen={i === 0} />
              </SectionFadeIn>
            ))}

            {/* Incluso em todos os pacotes — ocupa a metade ao lado do último pacote no desktop */}
            <SectionFadeIn>
              <div className="bg-background rounded-xl border border-border p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Leaf size={20} className="text-gold" />
                  <h3 className="font-heading text-xl">Incluso em todos os pacotes</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[packageIncludes.slice(0, 3), packageIncludes.slice(3)].map((col, ci) => (
                    <ul key={ci} className="space-y-4">
                      {col.map((inc) => (
                        <li key={inc.label} className="flex items-center gap-4">
                          <div className="shrink-0 w-12 h-12 rounded-full bg-sand-light flex items-center justify-center">
                            <inc.icon size={22} className="text-forest" />
                          </div>
                          <div>
                            <span className="block font-body font-semibold text-sm text-foreground">{inc.label}</span>
                            <span className="text-xs text-muted-foreground leading-snug">{inc.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </SectionFadeIn>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-8">
            Valores por pessoa. Consulte condições de pagamento e disponibilidade.
          </p>
        </div>
      </section>

      {/* ── Restaurante ──────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">
              Restaurante
            </span>
            <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">
              Culinária Amazônica Autêntica
            </h2>
            <p className="text-body text-primary-foreground/80 mb-4">
              No Amazon Samaúma Lodge, a experiência gastronômica é parte da aventura. Nosso
              restaurante serve pratos típicos da culinária amazônica, com destaque para os peixes
              frescos pescados nas águas do Paraná do Mamori.
            </p>
            <p className="text-body text-primary-foreground/80 mb-8">
              Refeições caseiras, saborosas e preparadas com ingredientes locais — uma viagem pelos
              sabores autênticos da Amazônia.
            </p>
            <BookingModal defaultInterest="Relaxar/Descansar">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 min-h-[50px]"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                <WhatsappIcon size={18} className="shrink-0" />
                Reserve Sua Estadia
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src="/restaurante-buffet-novo.jpeg"
                alt="Restaurante do Amazon Samaúma Lodge"
                className="w-full h-[380px] object-cover"
                loading="lazy" width={1200} height={800}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
}

export default Accommodations;
