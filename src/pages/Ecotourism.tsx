import { TreePine, Bird, Moon, Users, Map, Footprints } from "lucide-react";
import { motion } from "framer-motion";
import SectionFadeIn from "@/components/SectionFadeIn";
import ecotourismImg from "@/assets/ecotourism.jpg";

const activities = [
  { icon: Footprints, title: "16 Trilhas", desc: "22.800m de trilhas na floresta primária com diferentes níveis de dificuldade." },
  { icon: Bird, title: "Birdwatching", desc: "Observação de centenas de espécies de aves com guias especializados." },
  { icon: Moon, title: "Focagem Noturna", desc: "Expedições noturnas para observar jacarés, corujas e a fauna noturna." },
  { icon: Users, title: "Comunidades Locais", desc: "Visite comunidades ribeirinhas e conheça a cultura amazônica." },
  { icon: Map, title: "Passeios de Barco", desc: "Navegue pelos rios e igarapés descobrindo paisagens únicas." },
  { icon: TreePine, title: "Sobrevivência na Selva", desc: "Aprenda técnicas de sobrevivência com guias nativos da região." },
];

const Ecotourism = () => (
  <div className="bg-background pt-20">
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <img src={ecotourismImg} alt="Trilha na floresta" className="absolute inset-0 w-full h-full object-cover" width={1200} height={800} />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="heading-xl text-primary-foreground">Ecoturismo</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          Aventuras guiadas pelo coração da Amazônia.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-lodge">
        <SectionFadeIn>
          <h2 className="heading-lg text-center mb-4">Atividades e Passeios</h2>
          <p className="text-body text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            Todos os passeios estão inclusos na sua estadia e são conduzidos por guias locais experientes que conhecem cada segredo da floresta.
          </p>
        </SectionFadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((a) => (
            <SectionFadeIn key={a.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-8 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
              >
                <a.icon className="text-gold mb-4" size={32} />
                <h3 className="font-heading text-xl mb-3">{a.title}</h3>
                <p className="text-body text-muted-foreground">{a.desc}</p>
              </motion.div>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Ecotourism;
