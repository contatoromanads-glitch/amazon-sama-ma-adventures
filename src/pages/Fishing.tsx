import SectionFadeIn from "@/components/SectionFadeIn";
import fishingImg from "@/assets/fishing.jpg";
import { Fish, Calendar, Anchor, Award } from "lucide-react";

const seasons = [
  { period: "Cheia (Jan–Jun)", level: "Alto", species: "Tucunaré, Pirarucu", best: "Fly Fishing" },
  { period: "Vazante (Jun–Set)", level: "Médio", species: "Tucunaré, Peacock Bass", best: "Isca Artificial" },
  { period: "Seca (Set–Dez)", level: "Excelente", species: "Tucunaré Açu, Cachorra", best: "Todas as modalidades" },
];

const Fishing = () => (
  <div className="bg-background pt-20">
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <img src={fishingImg} alt="Pesca esportiva na Amazônia" className="absolute inset-0 w-full h-full object-cover" width={1200} height={800} />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="heading-xl text-primary-foreground">Pesca Esportiva</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          A emoção de pescar nos rios mais preservados da Amazônia.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-lodge grid lg:grid-cols-2 gap-12 items-start">
        <SectionFadeIn>
          <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Rio Juma</span>
          <h2 className="heading-lg mt-2 mb-6">Pesca de Troféu</h2>
          <p className="text-body text-muted-foreground mb-4">
            O Rio Juma e seus afluentes oferecem algumas das melhores condições do Brasil para pesca esportiva. Com barcos equipados e guias experientes, você terá acesso a pesqueiros exclusivos.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: Fish, label: "Tucunaré Açu" },
              { icon: Anchor, label: "Barcos Equipados" },
              { icon: Calendar, label: "Melhor: Set-Dez" },
              { icon: Award, label: "Pesque & Solte" },
            ].map((i) => (
              <div key={i.label} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                <i.icon className="text-gold shrink-0" size={22} />
                <span className="font-body text-sm font-medium">{i.label}</span>
              </div>
            ))}
          </div>
        </SectionFadeIn>

        <SectionFadeIn>
          <h3 className="heading-md mb-6">Períodos de Pesca</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-body font-semibold text-sm">Período</th>
                  <th className="py-3 pr-4 font-body font-semibold text-sm">Nível</th>
                  <th className="py-3 pr-4 font-body font-semibold text-sm">Espécies</th>
                  <th className="py-3 font-body font-semibold text-sm">Modalidade</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.period} className="border-b border-border/50">
                    <td className="py-4 pr-4 text-body font-medium">{s.period}</td>
                    <td className="py-4 pr-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        s.level === "Excelente" ? "bg-gold/20 text-gold" : "bg-sand-light text-muted-foreground"
                      }`}>
                        {s.level}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-body text-muted-foreground">{s.species}</td>
                    <td className="py-4 text-body text-muted-foreground">{s.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  </div>
);

export default Fishing;
