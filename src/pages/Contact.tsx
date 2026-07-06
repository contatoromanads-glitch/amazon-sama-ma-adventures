import { MapPin, Plane, Ship, MessageCircle, Instagram, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import heroImg from "@/assets/hero-lodge.webp";
import BookingModal from "@/components/BookingModal";

const WHATSAPP = "https://wa.me/5592993839110";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-background pt-20" id="contato">
      <SEOHead
        title={t("contact.title")}
        description={t("contact.description")}
        canonicalPath="/contato"
      />

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Amazon Samaúma Lodge"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4">
            {t("contact.heroLabel")}
          </span>
          <h1 className="heading-xl text-primary-foreground">{t("contact.heroTitle")}</h1>
          <p className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto">
            {t("contact.heroDesc")}
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
            <h2 className="heading-lg mb-4">{t("contact.whatsappTitle")}</h2>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              {t("contact.whatsappDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(t("contact.bookingQuery"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-[#1ebe5a] transition-colors duration-300 shadow-md"
              >
                <MessageCircle size={20} />
                {t("contact.buttonBook")}
              </a>
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(t("contact.faqQuery"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-[#25D366] text-[#1a7a3a] font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-[#25D366] hover:text-white transition-colors duration-300"
              >
                <MessageCircle size={20} />
                {t("contact.buttonQuestions")}
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              WhatsApp / Ligação: <a href="tel:+5592993839110" className="font-semibold text-foreground hover:text-gold transition-colors">+55 (92) 9 9383-9110</a> · {t("contact.whatsappHours")}
            </p>
          </SectionFadeIn>
        </div>
      </section>

      {/* Contato por tipo de interesse */}
      <section className="section-padding">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">{t("contact.sectionNeedTitle")}</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-12">
              {t("contact.sectionNeedDesc")}
            </p>
          </SectionFadeIn>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: t("contact.interestFishing"), interest: "Pesca Esportiva", emoji: "🎣" },
              { label: t("contact.interestEcotourism"), interest: "Ecoturismo", emoji: "🌿" },
              { label: t("contact.interestRelax"), interest: "Relaxar/Descansar", emoji: "🛌" },
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
            <h3 className="heading-md mb-6">{t("contact.infoTitle")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <MapPin className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm mb-1">{t("contact.infoLocationLabel")}</p>
                  <p className="text-sm text-muted-foreground">Paraná do Mamori, Careiro Castanho – AM, Brasil</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <MessageCircle className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm mb-1">{t("contact.infoPhoneLabel")}</p>
                  <a
                    href={`${WHATSAPP}?text=${encodeURIComponent(t("contact.bookingQuery"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:underline block"
                  >
                    +55 (92) 9 9383-9110 (WhatsApp)
                  </a>
                  <a
                    href="tel:+5592993839110"
                    className="text-sm text-gold hover:underline block mt-1"
                  >
                    +55 (92) 9 9383-9110 (Ligar)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <Instagram className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm mb-1">{t("contact.infoInstagramLabel")}</p>
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
                  <p className="font-body font-semibold text-sm mb-1">{t("contact.infoHoursLabel")}</p>
                  <p className="text-sm text-muted-foreground">{t("contact.infoHoursDesc")}</p>
                </div>
              </li>
            </ul>
          </SectionFadeIn>

          {/* Como chegar */}
          <SectionFadeIn>
            <h3 className="heading-md mb-4">{t("contact.howToGetTitle")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border">
                <Plane className="text-gold mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="font-body font-semibold mb-1">{t("contact.howToGetAirTitle")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.howToGetAirDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border">
                <Ship className="text-gold mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="font-body font-semibold mb-1">{t("contact.howToGetBoatTitle")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.howToGetBoatDesc")}
                  </p>
                </div>
              </div>
              <div className="p-5 bg-sand-light rounded-lg border-l-4 border-gold">
                <h4 className="font-body font-semibold mb-2">{t("contact.tipTitle")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("contact.tipDesc")}
                </p>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
};

export default Contact;
