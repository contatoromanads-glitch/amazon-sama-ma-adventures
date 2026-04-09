import SectionFadeIn from "@/components/SectionFadeIn";
import heroImg from "@/assets/hero-lodge.jpg";
import restaurantImg from "@/assets/restaurant.jpg";
import { Leaf, Heart, Shield } from "lucide-react";

const values = [
  { icon: Leaf, title: "Sustentabilidade", desc: "Preservar a Amazônia é a nossa missão. Operamos com práticas de baixo impacto ambiental." },
  { icon: Heart, title: "Comunidade", desc: "Trabalhamos com comunidades ribeirinhas, valorizando a cultura e o conhecimento local." },
  { icon: Shield, title: "Segurança", desc: "Guias certificados, equipamentos de qualidade e protocolos rigorosos de segurança." },
];

const About = () => (
  <div className="bg-background pt-20">
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <img src={heroImg} alt="Amazon Samaúma Lodge" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="heading-xl text-primary-foreground">Sobre Nós</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          A história por trás do Amazon Samaúma Lodge.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
        <SectionFadeIn>
          <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Nossa História</span>
          <h2 className="heading-lg mt-2 mb-6">Nascido da Paixão pela Amazônia</h2>
          <p className="text-body text-muted-foreground mb-4">
            O Amazon Samaúma Lodge nasceu do sonho de criar um espaço onde viajantes do mundo inteiro pudessem viver a Amazônia de forma autêntica, sem abrir mão do conforto e da segurança.
          </p>
          <p className="text-body text-muted-foreground">
            Localizado às margens do Rio Juma, no Paraná do Murmuri, nosso lodge foi construído com materiais sustentáveis e técnicas que respeitam o ecossistema local. Cada detalhe foi pensado para integrar arquitetura e natureza.
          </p>
        </SectionFadeIn>
        <SectionFadeIn>
          <div className="hover-zoom rounded-lg overflow-hidden">
            <img src={restaurantImg} alt="Estrutura do Lodge" className="w-full h-[400px] object-cover" loading="lazy" width={1200} height={800} />
          </div>
        </SectionFadeIn>
      </div>
    </section>

    <section className="section-padding bg-card">
      <div className="container-lodge">
        <SectionFadeIn>
          <h2 className="heading-lg text-center mb-12">Nossos Valores</h2>
        </SectionFadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <SectionFadeIn key={v.title}>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sand-light flex items-center justify-center">
                  <v.icon className="text-forest" size={30} />
                </div>
                <h3 className="heading-md text-xl mb-3">{v.title}</h3>
                <p className="text-body text-muted-foreground">{v.desc}</p>
              </div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
