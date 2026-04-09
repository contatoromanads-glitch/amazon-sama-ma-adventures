import { AirVent, Droplets, Wifi, Sparkles, BedDouble, BedSingle } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import accommodationImg from "@/assets/accommodation.jpg";
import restaurantImg from "@/assets/restaurant.jpg";

const amenities = [
  { icon: BedDouble, label: "Camas de Casal" },
  { icon: BedSingle, label: "Camas de Solteiro" },
  { icon: AirVent, label: "Ar-Condicionado" },
  { icon: Sparkles, label: "Limpeza Diária" },
  { icon: Wifi, label: "Wi-Fi Starlink" },
  { icon: Droplets, label: "Água Quente" },
];

const Accommodations = () => (
  <div className="bg-background pt-20">
    {/* Hero */}
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <img src={accommodationImg} alt="Chalé do Lodge" className="absolute inset-0 w-full h-full object-cover" width={1200} height={800} />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="heading-xl text-primary-foreground">Acomodações</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          Conforto e natureza em perfeita harmonia.
        </p>
      </div>
    </section>

    {/* Details */}
    <section className="section-padding">
      <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
        <SectionFadeIn>
          <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Chalés Privativos</span>
          <h2 className="heading-lg mt-2 mb-6">Seu Refúgio na Floresta</h2>
          <p className="text-body text-muted-foreground mb-4">
            Cada chalé foi projetado para oferecer o máximo conforto sem abrir mão da conexão com a natureza. Estrutura completa com ar-condicionado, roupa de cama premium e vista panorâmica para a floresta e o rio.
          </p>
          <p className="text-body text-muted-foreground">
            O restaurante panorâmico serve café da manhã, almoço e jantar com o melhor da culinária amazônica, utilizando ingredientes frescos e locais.
          </p>
        </SectionFadeIn>
        <SectionFadeIn>
          <div className="hover-zoom rounded-lg overflow-hidden">
            <img src={restaurantImg} alt="Restaurante panorâmico" className="w-full h-[350px] object-cover" loading="lazy" width={1200} height={800} />
          </div>
        </SectionFadeIn>
      </div>
    </section>

    {/* Amenities */}
    <section className="section-padding bg-card">
      <div className="container-lodge">
        <SectionFadeIn>
          <h2 className="heading-lg text-center mb-12">Comodidades</h2>
        </SectionFadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {amenities.map((a) => (
            <SectionFadeIn key={a.label}>
              <div className="flex items-center gap-4 p-6 bg-background rounded-lg border border-border">
                <a.icon className="text-gold shrink-0" size={28} />
                <span className="font-body font-medium">{a.label}</span>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Accommodations;
