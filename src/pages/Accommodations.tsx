import { AirVent, Droplets, Wifi, Sparkles, BedDouble, BedSingle, Utensils, MapPin, MessageCircle } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import { photos } from "@/lib/photos";
const accommodationImg = "/4567450e-33c2-4ebd-9811-397b90d43bb7.png";
const restaurantImg    = "/c025ccc9-c4d1-458f-a73d-3891e2a48101.png";
const heroImg          = photos.lodge;
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookingModal from "@/components/BookingModal";

const amenities = [
  { icon: BedDouble, label: "Camas Confortáveis" },
  { icon: AirVent, label: "Ar-Condicionado" },
  { icon: Sparkles, label: "Limpeza Diária" },
  { icon: Wifi, label: "Wi-Fi Starlink" },
  { icon: Droplets, label: "Água Quente" },
  { icon: Utensils, label: "Restaurante Incluso" },
];

const rooms = [
  {
    name: "Quarto Standard",
    desc: "Acomodação confortável com vista para o rio, cama de casal, ar-condicionado e banheiro privativo. Perfeito para casais em busca de uma experiência amazônica autêntica.",
    capacity: "2 pessoas",
    img: accommodationImg,
  },
  {
    name: "Quarto Família",
    desc: "Espaço amplo para famílias, com camas adicionais, ar-condicionado e banheiro privativo. Uma experiência inesquecível para toda a família na Amazônia.",
    capacity: "Até 4 pessoas",
    img: photos.quartoFamilia,
  },
];

const Accommodations = () => (
  <div className="bg-background pt-20">
    {/* Hero */}
    <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <img
        src={accommodationImg}
        alt="Acomodações do Amazon Samaúma Lodge"
        className="absolute inset-0 w-full h-full object-cover"
        width={1200}
        height={800}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
      <div className="relative z-10 text-center px-4">
        <span className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4">
          Conforto na Amazônia
        </span>
        <h1 className="heading-xl text-primary-foreground">Acomodações</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          5 quartos privativos sobre o rio, com conforto e integração total com a natureza.
        </p>
      </div>
    </section>

    {/* Intro */}
    <section className="section-padding">
      <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
        <SectionFadeIn>
          <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Nossos Quartos</span>
          <h2 className="heading-lg mt-2 mb-6">Seu Refúgio Flutuante na Amazônia</h2>
          <p className="text-body text-muted-foreground mb-4">
            Nossos 5 quartos foram projetados para oferecer conforto e imersão na natureza. Acorde com a vista do rio, respire o ar puro da Amazônia e sinta que o tempo aqui funciona diferente.
          </p>
          <p className="text-body text-muted-foreground mb-4">
            Cada acomodação possui camas confortáveis, ar-condicionado, água quente, Wi-Fi Starlink e banheiro privativo. A estrutura flutuante proporciona uma experiência única de dormir sobre as águas do Paraná do Mamori.
          </p>
          <p className="text-body text-muted-foreground mb-8">
            Ao amanhecer, a paisagem do rio e da floresta é o seu despertador natural. Ao entardecer, o deck é o lugar perfeito para contemplar o pôr do sol amazônico.
          </p>
          <BookingModal defaultInterest="Relaxar/Descansar">
            <motion.button
              className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={18} className="shrink-0" />
              Consultar Disponibilidade
            </motion.button>
          </BookingModal>
        </SectionFadeIn>
        <SectionFadeIn>
          <div className="hover-zoom rounded-lg overflow-hidden">
            <img
              src={restaurantImg}
              alt="Área de convivência e restaurante do lodge"
              className="w-full h-[420px] object-cover"
              loading="lazy"
              width={1200}
              height={800}
            />
          </div>
        </SectionFadeIn>
      </div>
    </section>

    {/* Room types */}
    <section className="section-padding bg-card">
      <div className="container-lodge">
        <SectionFadeIn>
          <h2 className="heading-lg text-center mb-4">Tipos de Acomodação</h2>
          <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
            Entre em contato para verificar disponibilidade e detalhes de cada quarto, incluindo preços e pacotes disponíveis.
          </p>
        </SectionFadeIn>
        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <SectionFadeIn key={room.name}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-background rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="hover-zoom overflow-hidden">
                  <img
                    src={room.img}
                    alt={room.name}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                    width={1200}
                    height={800}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-xl">{room.name}</h3>
                    <span className="text-xs font-body font-semibold uppercase tracking-widest bg-sand-light text-forest px-3 py-1 rounded-full">
                      {room.capacity}
                    </span>
                  </div>
                  <p className="text-body text-muted-foreground mb-4">{room.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                    <MapPin size={14} className="text-gold" />
                    <span>Vista para o Paraná do Mamori</span>
                  </div>
                  <BookingModal defaultRoom={room.name}>
                    <motion.button
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MessageCircle size={16} className="shrink-0" />
                      Reservar Este Quarto
                    </motion.button>
                  </BookingModal>
                </div>
              </motion.div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* Amenities */}
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
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border">
                <a.icon className="text-gold shrink-0" size={28} />
                <span className="font-body font-medium">{a.label}</span>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* Restaurant section */}
    <section className="section-padding bg-primary">
      <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
        <SectionFadeIn>
          <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Restaurante</span>
          <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">Culinária Amazônica Autêntica</h2>
          <p className="text-body text-primary-foreground/80 mb-4">
            No Amazon Samaúma Lodge, a experiência gastronômica é parte da aventura. Nosso restaurante serve pratos típicos da culinária amazônica, com destaque para os peixes frescos pescados nas águas do Paraná do Mamori.
          </p>
          <p className="text-body text-primary-foreground/80 mb-8">
            Refeições caseiras, saborosas e preparadas com ingredientes locais — uma viagem pelos sabores autênticos da Amazônia. Do café da manhã animado ao jantar tranquilo sobre o rio.
          </p>
          <BookingModal defaultInterest="Relaxar/Descansar">
            <motion.button
              className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={18} className="shrink-0" />
              Reserve Sua Estadia
            </motion.button>
          </BookingModal>
        </SectionFadeIn>
        <SectionFadeIn>
          <div className="hover-zoom rounded-lg overflow-hidden">
            <img
              src={restaurantImg}
              alt="Restaurante do Amazon Samaúma Lodge"
              className="w-full h-[380px] object-cover"
              loading="lazy"
              width={1200}
              height={800}
            />
          </div>
        </SectionFadeIn>
      </div>
    </section>
  </div>
);

export default Accommodations;
