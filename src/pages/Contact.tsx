import { useState } from "react";
import { MapPin, Phone, Mail, Plane, Car } from "lucide-react";
import SectionFadeIn from "@/components/SectionFadeIn";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dates: "", guests: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${form.name}. Gostaria de fazer uma reserva para ${form.guests} pessoas nas datas ${form.dates}. ${form.message}`;
    window.open(`https://wa.me/5592999990000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="bg-background pt-20">
      <section className="section-padding">
        <div className="container-lodge">
          <SectionFadeIn>
            <h1 className="heading-xl text-center mb-4">Entre em Contato</h1>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Planeje sua estadia no Amazon Samaúma Lodge. Nossa equipe está pronta para atendê-lo.
            </p>
          </SectionFadeIn>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <SectionFadeIn>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">Nome Completo</label>
                    <input
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">E-mail</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">Telefone</label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">Datas Desejadas</label>
                    <input
                      placeholder="Ex: 15-20 Mar"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.dates}
                      onChange={(e) => setForm({ ...form, dates: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-semibold mb-2">Hóspedes</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold mb-2">Mensagem</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body focus:ring-2 focus:ring-gold focus:border-gold outline-none transition resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300"
                >
                  Enviar via WhatsApp
                </button>
              </form>
            </SectionFadeIn>

            {/* Info */}
            <SectionFadeIn>
              <div className="space-y-8">
                <div>
                  <h3 className="heading-md mb-4">Informações</h3>
                  <ul className="space-y-4 text-body text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <MapPin className="text-gold mt-1 shrink-0" size={20} />
                      Rio Juma – Paraná do Murmuri, Careiro – AM, 69250-000
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="text-gold shrink-0" size={20} />
                      +55 (92) 99999-0000
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="text-gold shrink-0" size={20} />
                      contato@amazonsamauma.com.br
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="heading-md mb-4">Como Chegar</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-5 bg-card rounded-lg border border-border">
                      <Plane className="text-gold mt-1 shrink-0" size={22} />
                      <div>
                        <h4 className="font-body font-semibold mb-1">Via Aérea</h4>
                        <p className="text-sm text-muted-foreground">Voo até Manaus (MAO). Nosso transfer inclui traslado do aeroporto até o lodge.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-5 bg-card rounded-lg border border-border">
                      <Car className="text-gold mt-1 shrink-0" size={22} />
                      <div>
                        <h4 className="font-body font-semibold mb-1">Via Terrestre / Fluvial</h4>
                        <p className="text-sm text-muted-foreground">Saída de Manaus via balsa e estrada até o ponto de embarque no Rio Juma.</p>
                      </div>
                    </div>
                  </div>
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
