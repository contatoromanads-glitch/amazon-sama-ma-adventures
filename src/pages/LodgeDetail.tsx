import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, ChevronLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import SectionFadeIn from "@/components/SectionFadeIn";
import BookingModal from "@/components/BookingModal";

type Lodge = {
  id: string; name: string; slug: string; description: string | null;
  location: string | null; hero_image: string | null;
  images: string[] | null; amenities: string[] | null; is_active: boolean | null;
};

type Room = {
  id: string; name: string; description: string; capacity: string;
  price_info: string | null; amenities: string[] | null; images: string[] | null;
};

const fallbackHero = "/4567450e-33c2-4ebd-9811-397b90d43bb7.png";

export default function LodgeDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: lodge, isLoading: loadingLodge } = useQuery<Lodge | null>({
    queryKey: ["lodge-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lodges" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) return null;
      return data as Lodge;
    },
    enabled: !!slug,
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["lodge-rooms", lodge?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accommodations" as any)
        .select("*")
        .eq("lodge_id", lodge!.id)
        .eq("is_active", true)
        .order("sort_order");
      if (error) return [];
      return (data ?? []) as Room[];
    },
    enabled: !!lodge?.id,
  });

  if (loadingLodge) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lodge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <h1 className="text-2xl font-serif">Pousada não encontrada</h1>
        <Link to="/acomodacoes" className="text-gold underline">← Ver todas as acomodações</Link>
      </div>
    );
  }

  const heroImg = lodge.hero_image || fallbackHero;

  return (
    <div className="bg-background pt-20">
      <SEOHead
        title={`${lodge.name} | Amazon Samaúma Lodge`}
        description={lodge.description ?? `Conheça a ${lodge.name} — hospedagem flutuante na Amazônia com quartos privativos, vista para o rio e experiência única na natureza.`}
        canonicalPath={`/acomodacoes/${slug}`}
        ogImage={heroImg}
      />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt={lodge.name} className="absolute inset-0 w-full h-full object-cover" width={1200} height={800} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="relative z-10 text-center px-4">
          <Link to="/acomodacoes" className="inline-flex items-center gap-1 text-primary-foreground/70 text-sm mb-4 hover:text-primary-foreground transition-colors">
            <ChevronLeft size={16} /> Todas as acomodações
          </Link>
          <h1 className="heading-xl text-primary-foreground">{lodge.name}</h1>
          {lodge.location && (
            <div className="flex items-center justify-center gap-2 mt-3 text-primary-foreground/80">
              <MapPin size={16} className="text-gold" />
              <span className="text-sm">{lodge.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* Descrição + galeria */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Sobre a Pousada</span>
            <h2 className="heading-lg mt-2 mb-6">{lodge.name}</h2>
            {lodge.description && (
              <p className="text-body text-muted-foreground mb-8">{lodge.description}</p>
            )}
            {/* Comodidades da pousada */}
            {(lodge.amenities ?? []).length > 0 && (
              <ul className="grid grid-cols-2 gap-2 mb-8">
                {(lodge.amenities ?? []).map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-gold shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
            <BookingModal defaultInterest="Relaxar/Descansar">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 min-h-[50px]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={18} className="shrink-0" />
                Consultar Disponibilidade
              </motion.button>
            </BookingModal>
          </SectionFadeIn>

          {/* Galeria de fotos */}
          <SectionFadeIn>
            {(lodge.images ?? []).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {(lodge.images ?? []).slice(0, 4).map((img, i) => (
                  <div key={i} className={`hover-zoom rounded-lg overflow-hidden ${i === 0 ? "col-span-2" : ""}`}>
                    <img
                      src={img}
                      alt={`${lodge.name} - foto ${i + 1}`}
                      className={`w-full object-cover ${i === 0 ? "h-52" : "h-36"}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="hover-zoom rounded-lg overflow-hidden">
                <img src={heroImg} alt={lodge.name} className="w-full h-[420px] object-cover" loading="lazy" />
              </div>
            )}
          </SectionFadeIn>
        </div>
      </section>

      {/* Quartos */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Tipos de Quarto</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              {rooms.length > 0
                ? "Escolha o quarto ideal para a sua estadia e entre em contato para verificar disponibilidade."
                : "Entre em contato para verificar disponibilidade e detalhes dos quartos."}
            </p>
          </SectionFadeIn>

          {rooms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {rooms.map((room) => (
                <SectionFadeIn key={room.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-background rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="hover-zoom overflow-hidden">
                      <img
                        src={(room.images ?? [])[0] || fallbackHero}
                        alt={room.name}
                        className="w-full h-56 object-cover"
                        loading="lazy"
                        width={1200} height={800}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading text-xl">{room.name}</h3>
                        <span className="text-xs font-body font-semibold uppercase tracking-widest bg-sand-light text-forest px-3 py-1 rounded-full">
                          {room.capacity}
                        </span>
                      </div>
                      {room.price_info && (
                        <p className="text-gold font-body font-semibold text-sm mb-3">{room.price_info}</p>
                      )}
                      <p className="text-body text-muted-foreground mb-4">{room.description}</p>
                      {(room.amenities ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(room.amenities ?? []).slice(0, 4).map((a) => (
                            <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{a}</span>
                          ))}
                          {(room.amenities ?? []).length > 4 && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">+{(room.amenities ?? []).length - 4}</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                        <MapPin size={14} className="text-gold" />
                        <span>{lodge.location ?? "Vista para o rio"}</span>
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
          ) : (
            <div className="text-center py-8">
              <BookingModal defaultInterest="Relaxar/Descansar">
                <motion.button
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MessageCircle size={18} className="shrink-0" />
                  Consultar Disponibilidade
                </motion.button>
              </BookingModal>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
