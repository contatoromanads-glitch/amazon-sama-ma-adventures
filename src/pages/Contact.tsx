import { MapPin, Plane, Ship, MessageCircle, Instagram, Clock } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import heroImg from "@/assets/hero-lodge.webp";
import BookingModal from "@/components/BookingModal";

const WHATSAPP = "https://wa.me/559293839110";

const Contact = () => (
  <div className="bg-background pt-20" id="contato">
    <SEOHead
      title="Dúvidas e Contato | Amazon Samaúma Lodge"
      description="Fale com a equipe do Amazon Samaúma Lodge. Tire dúvidas sobre reservas, acomodações, ecoturismo e pesca esportiva no Paraná do Mamori, Careiro Castanho – AM."
      canonicalPath="/contato"
    />

    {/* Hero */}
    <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Amazon Samaúma Lodge — Entre em Contato"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
      <div className="relative z-10 text-center px-4">
        <span className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4">
          Fale Conosco
        </span>
        <h1 className="heading-xl text-primary-foreground">Dúvidas e Ajuda</h1>
        <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
          Tem alguma dúvida ou precisa de ajuda? Estamos aqui para você.
        </p>
      </div>
    </section>

    {/* WhatsApp CTA principal */}
    <section className="section-padding bg-sand-light">
      <div className="container-lodge max-w-3xl text-center">
        <SectionFadeIn>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
            <MessageCircle className="text-white" size={36} />
          </div>
          <h2 className="heading-lg mb-4">Fale Direto pelo WhatsApp</h2>
          <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
            A forma mais rápida de tirar dúvidas, consultar disponibilidade e fazer sua reserva. Nossa equipe responde todos os dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Olá! Vim pelo site do Amazon Samaúma Lodge e gostaria de fazer uma reserva.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-[#1ebe5a] transition-colors duration-300 shadow-md"
            >
              <MessageCircle size={20} />
              Fazer Reserva
            </a>
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Olá! Vim pelo site do Amazon Samaúma Lodge e gostaria de tirar algumas dúvidas.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-[#25D366] text-[#1a7a3a] font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-[#25D366] hover:text-white transition-colors duration-300"
            >
              <MessageCircle size={20} />
              Tirar Dúvidas
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            WhatsApp: <strong className="text-foreground">+55 (92) 9383-9110</strong> · Atendimento todos os dias
          </p>
        </SectionFadeIn>
      </div>
    </section>

    {/* Contato por tipo de interesse */}
    <section className="section-padding">
      <div className="container-lodge">
        <SectionFadeIn>
          <h2 className="heading-lg text-center mb-4">O que você precisa?</h2>
          <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-12">
            Clique no botão correspondente e já iniciamos a conversa no WhatsApp com a mensagem certa.
          </p>
        </SectionFadeIn>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Pesca Esportiva", interest: "Pesca Esportiva", emoji: "🎣" },
            { label: "Ecoturismo", interest: "Ecoturismo", emoji: "🌿" },
            { label: "Acomodação / Descanso", interest: "Relaxar/Descansar", emoji: "🛌" },
          ].map((item) => (
            <SectionFadeIn key={item.label}>
              <BookingModal defaultInterest={item.interest}>
                <button className="w-full p-6 bg-card border border-border rounded-lg hover:border-gold hover:shadow-md transition-all duration-300 text-center group">
                  <span className="text-4xl block mb-3">{item.emoji}</span>
                  <span className="font-body font-semibold text-foreground group-hover:text-gold transition-colors">
                    {item.label}
                  </span>
                </button>
              </BookingModal>
            </SectionFadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* Informações de contato + Como Chegar */}
    <section className="section-padding bg-card">
      <div className="container-lodge grid lg:grid-cols-2 gap-16">
        {/* Info */}
        <SectionFadeIn>
          <h3 className="heading-md mb-6">Informações de Contato</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <MapPin className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-body font-semibold text-sm mb-1">Localização</p>
                <p className="text-sm text-muted-foreground">Paraná do Mamori, Careiro Castanho – AM, Brasil</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <MessageCircle className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-body font-semibold text-sm mb-1">WhatsApp (Reservas)</p>
                <a
                  href={`${WHATSAPP}?text=${encodeURIComponent("Olá! Vim pelo site do Amazon Samaúma Lodge e gostaria de fazer uma reserva.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  +55 (92) 9383-9110
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <Instagram className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-body font-semibold text-sm mb-1">Instagram</p>
                <a
                  href="https://instagram.com/amazon_samauma_lodge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  @amazon_samauma_lodge
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <Clock className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-body font-semibold text-sm mb-1">Atendimento</p>
                <p className="text-sm text-muted-foreground">WhatsApp disponível todos os dias</p>
              </div>
            </li>
          </ul>
        </SectionFadeIn>

        {/* Como chegar */}
        <SectionFadeIn>
          <h3 className="heading-md mb-4">Como Chegar</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border">
              <Plane className="text-gold mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-body font-semibold mb-1">Via Aérea até Manaus</h4>
                <p className="text-sm text-muted-foreground">
                  Voe até o Aeroporto Eduardo Gomes (Manaus – MAO). De lá, siga até Careiro Castanho de carro, balsa ou ônibus.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border">
              <Ship className="text-gold mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-body font-semibold mb-1">De Barco até o Lodge</h4>
                <p className="text-sm text-muted-foreground">
                  A partir de Careiro Castanho, acesso exclusivo por barco. Ao confirmar a reserva, enviamos as instruções completas pelo WhatsApp.
                </p>
              </div>
            </div>
            <div className="p-5 bg-sand-light rounded-lg border-l-4 border-gold">
              <h4 className="font-body font-semibold mb-2">📍 Dica Importante</h4>
              <p className="text-sm text-muted-foreground">
                Ao confirmar sua reserva, enviamos todas as informações de acesso detalhadas diretamente pelo WhatsApp — incluindo ponto de embarque exato em Careiro Castanho.
              </p>
            </div>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  </div>
);

export default Contact;
