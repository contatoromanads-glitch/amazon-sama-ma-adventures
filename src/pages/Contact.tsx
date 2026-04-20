import { useState } from "react";
import { MapPin, Plane, Ship, MessageCircle, Instagram, Clock, Send } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";
import heroImg from "@/assets/hero-lodge.webp";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* <!-- Booking system removed and replaced with WhatsApp link --> */
    const text = encodeURIComponent(
      `Olá! Meu nome é ${form.name || "(não informado)"}.${form.email ? `\nE-mail: ${form.email}` : ""}${form.phone ? `\nTelefone: ${form.phone}` : ""}\n\nVim pelo site do Amazon Samaúma Lodge e gostaria de tirar dúvidas.${form.message ? `\n\nMensagem: ${form.message}` : ""}`
    );
    window.open(`https://wa.me/5592991163391?text=${text}`, '_blank');
    setForm(emptyForm);
  };

  return (
    <div className="bg-background pt-20" id="contato">
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

      {/* Main contact section */}
      <section className="section-padding">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">Envie uma Mensagem</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Preencha o formulário abaixo e sua solicitação será direcionada ao nosso WhatsApp.
            </p>
          </SectionFadeIn>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <SectionFadeIn>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">
                      Nome Completo *
                    </label>
                    <input
                      required
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">E-mail</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">
                      WhatsApp / Telefone
                    </label>
                    <input
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Informações extras, dúvidas ou pedidos especiais..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Enviar via WhatsApp
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Prefere contato imediato?{" "}
                  <a
                    href={`https://wa.me/5592991163391?text=${encodeURIComponent(`Olá! Meu nome é ${form.name || "..."} e gostaria de tirar algumas dúvidas sobre o Amazon Samaúma Lodge.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle size={14} />
                    Fale pelo WhatsApp
                  </a>
                </p>
              </form>
            </SectionFadeIn>

            {/* Info */}
            <SectionFadeIn>
              <div className="space-y-8">
                {/* Contact info */}
                <div>
                  <h3 className="heading-md mb-6">Informações de Contato</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                      <MapPin className="text-gold mt-1 shrink-0" size={20} />
                      <div>
                        <p className="font-body font-semibold text-sm mb-1">Localização</p>
                        <p className="text-sm text-muted-foreground">
                          Paraná do Mamori, Careiro Castanho – AM, Brasil
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                      <MessageCircle className="text-gold mt-1 shrink-0" size={20} />
                      <div>
                        <p className="font-body font-semibold text-sm mb-1">WhatsApp (Reservas)</p>
                        <a
                          href="https://wa.me/5592991163391?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Amazon%20Sama%C3%BAma%20Lodge%20e%20gostaria%20de%20fazer%20uma%20reserva."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gold hover:underline"
                        >
                          +55 (92) 99116-3391
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
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
                    <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                      <Clock className="text-gold mt-1 shrink-0" size={20} />
                      <div>
                        <p className="font-body font-semibold text-sm mb-1">Atendimento</p>
                        <p className="text-sm text-muted-foreground">
                          WhatsApp disponível todos os dias
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* How to get there */}
                <div>
                  <h3 className="heading-md mb-4">Como Chegar</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-card rounded-lg border border-border">
                      <Plane className="text-gold mt-1 shrink-0" size={22} />
                      <div>
                        <h4 className="font-body font-semibold mb-1">Via Aérea até Manaus</h4>
                        <p className="text-sm text-muted-foreground">
                          Voe até o Aeroporto Eduardo Gomes (Manaus – MAO). De lá, siga até Careiro Castanho de carro, balsa ou ônibus.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-card rounded-lg border border-border">
                      <Ship className="text-gold mt-1 shrink-0" size={22} />
                      <div>
                        <h4 className="font-body font-semibold mb-1">De Barco até o Lodge</h4>
                        <p className="text-sm text-muted-foreground">
                          A partir de Careiro Castanho, acesso exclusivo por barco. Ao confirmar a reserva, enviamos as instruções completas pelo WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important note */}
                <div className="p-5 bg-sand-light rounded-lg border-l-4 border-gold">
                  <h4 className="font-body font-semibold mb-2">📍 Dica Importante</h4>
                  <p className="text-sm text-muted-foreground">
                    Ao confirmar sua reserva, enviamos todas as informações de acesso detalhadas diretamente pelo WhatsApp — incluindo ponto de embarque exato em Careiro Castanho e todas as instruções para chegar ao lodge.
                  </p>
                </div>
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;