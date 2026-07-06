import { Link } from "react-router-dom";
import { Utensils, Wifi, Leaf, TreePine, Fish, Binoculars, ChevronDown, Star, MapPin, Phone, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import BookingModal from "@/components/BookingModal";
import { WhatsappIcon } from "@/components/WhatsappIcon";
import { photos } from "@/lib/photos";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Paran%C3%A1+do+Mamori+Careiro+Castanho+AM";
const accommodationImg = photos.quartoStandard;
const ecotourismImg    = "/00d47a7f-6c10-4e3a-b79d-625befed8282.jpg";
const fishingImg       = "/fotos_reais_amazon/home-pesca.jpg";
const restaurantImg    = "/3db69c3c-08ab-40d3-aac2-5f1d435fbcf8.jpg";

import heroVideoAsset from "@/assets/hero-drone.mp4.asset.json";
const HERO_VIDEO_URL = heroVideoAsset.url;

const testimonials = [
  {
    text: "Uma experiência transformadora. O contato com a natureza amazônica, a hospitalidade do Arlos e a estrutura do lodge superaram todas as expectativas.",
    author: "Carlos M.",
    from: "São Paulo, SP",
    stars: 5,
  },
  {
    text: "A pesca esportiva no Paraná do Mamori é incomparável. Guia experiente, barco bem equipado e tucunarés enormes. Voltarei com certeza!",
    author: "Ricardo S.",
    from: "Curitiba, PR",
    stars: 5,
  },
  {
    text: "O silêncio da floresta à noite, o som do rio ao amanhecer... a minha família saiu transformada. O lodge é um presente para a alma.",
    author: "Ana L.",
    from: "Brasília, DF",
    stars: 5,
  },
];

const Index = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [morphIndex, setMorphIndex] = useState(0);
  
  const morphWords = useMemo(() => [
    t("index.morphWords.0"),
    t("index.morphWords.1"),
    t("index.morphWords.2"),
    t("index.morphWords.3")
  ], [t]);

  const features = useMemo(() => [
    { icon: Utensils, title: t("index.features.cuisine"), desc: t("index.features.cuisineDesc") },
    { icon: Wifi, title: t("index.features.wifi"), desc: t("index.features.wifiDesc") },
    { icon: Leaf, title: t("index.features.sustainability"), desc: t("index.features.sustainabilityDesc") },
  ], [t]);

  const experiences = useMemo(() => [
    { img: ecotourismImg, title: t("index.experiences.ecotourism"), desc: t("index.experiences.ecotourismDesc"), link: "/ecoturismo", icon: TreePine, tag: t("index.experiences.ecotourismTag") },
    { img: fishingImg, title: t("index.experiences.fishing"), desc: t("index.experiences.fishingDesc"), link: "/pesca", icon: Fish, tag: t("index.experiences.fishingTag") },
    { img: restaurantImg, title: t("index.experiences.sunset"), desc: t("index.experiences.sunsetDesc"), link: "/contato", icon: Binoculars, tag: t("index.experiences.sunsetTag") },
  ], [t]);

  const stats = useMemo(() => [
    { value: "2", label: t("index.stats.floatingLodges") },
    { value: "100%", label: t("index.stats.boatAccess") },
    { value: "24h", label: t("index.stats.whatsappContact") },
    { value: "★ 5.0", label: t("index.stats.guestRating") },
  ], [t]);

  const faqs = useMemo(() => [
    { q: t("index.faq.q1"), a: t("index.faq.a1") },
    { q: t("index.faq.q2"), a: t("index.faq.a2") },
    { q: t("index.faq.q3"), a: t("index.faq.a3") },
    { q: t("index.faq.q4"), a: t("index.faq.a4") },
    { q: t("index.faq.q5"), a: t("index.faq.a5") },
    { q: t("index.faq.q6"), a: t("index.faq.a6") },
  ], [t]);

  // Depoimentos do banco (gerenciáveis no admin) — com fallback para os fixos
  const { data: dbTestimonials = [] } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("author_name, location, text, stars")
        .eq("is_active", true)
        .order("sort_order");
      if (error || !data) return [];
      return data.map((t) => ({
        text:   t.text,
        author: t.author_name,
        from:   t.location ?? "",
        stars:  t.stars ?? 5,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : testimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphIndex((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background">
      <SEOHead
        title="Amazon Samaúma Lodge | Hospedagem de Selva em Manaus"
        description="Excelente hospedagem de selva próxima a Manaus. Ecoturismo, pesca esportiva, trilhas na floresta amazônica e imersão cultural com guia local. Hospede-se conosco no Paraná do Mamori!"
        canonicalPath="/"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Amazon Samaúma Lodge | Hospedagem de Selva em Manaus",
          "description": "Excelente hospedagem de selva próxima a Manaus. Ecoturismo, pesca esportiva, trilhas na floresta amazônica e imersão cultural com guia local.",
          "url": "https://amazon-samauma-lodge.com.br",
          "publisher": {
            "@type": "LodgingBusiness",
            "name": "Amazon Samaúma Lodge",
            "image": "https://amazon-samauma-lodge.com.br/fotos_reais_amazon/lodge.webp"
          }
        }}
      />
      {/* Hero */}
      <section className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.webp"
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4"
          >
            {t("index.heroLocation")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-xl text-primary-foreground mb-6"
          >
            {t("index.heroTitle1")}
            <span className="inline-block">
              {t("index.heroTitle2")}
              <span className="relative inline-block min-w-[10rem] sm:min-w-[14rem]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={morphIndex}
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.5 }}
                    className="text-gold italic inline-block"
                  >
                    {morphWords[morphIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-body-lg text-primary-foreground/85 mb-10 max-w-2xl mx-auto"
          >
            {t("index.heroDesc")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <BookingModal>
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <WhatsappIcon size={18} className="shrink-0" />
                {t("header.bookNow")}
              </motion.button>
            </BookingModal>
            <Link
              to="/sobre"
              className="inline-block px-8 py-4 border-2 border-primary-foreground/50 text-primary-foreground font-body font-semibold text-sm tracking-widest uppercase rounded hover:border-gold hover:text-gold transition-colors duration-300"
            >
              {t("index.knowLodge")}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary border-t border-forest-light">
        <div className="container-lodge">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <SectionFadeIn key={i}>
                <div className="py-8 px-6 text-center border-r border-forest-light last:border-r-0 border-b md:border-b-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r">
                  <div className="font-heading text-3xl font-light text-gold mb-1">{s.value}</div>
                  <div className="text-body text-sm text-primary-foreground/60 uppercase tracking-widest">{s.label}</div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("index.aboutTeaser.label")}</span>
            <h2 className="heading-lg mt-2 mb-6">{t("index.aboutTeaser.title")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("index.aboutTeaser.p1")}
            </p>
            <p className="text-body text-muted-foreground mb-8">
              {t("index.aboutTeaser.p2")}
            </p>
            <Link
              to="/sobre"
              className="inline-block font-body font-semibold text-forest hover:text-gold transition-colors border-b-2 border-forest hover:border-gold pb-1"
            >
              {t("index.aboutTeaser.link")}
            </Link>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
               <img
                src={accommodationImg.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                alt="Estrutura flutuante do Amazon Samaúma Lodge no Paraná do Mamori"
                className="w-full h-[420px] object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={400}
                height={267}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-card">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">{t("index.features.title")}</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              {t("index.features.subtitle")}
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <SectionFadeIn key={f.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="text-center p-8 rounded-lg bg-background shadow-sm border border-border transition-shadow hover:shadow-md"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-sand-light flex items-center justify-center">
                    <f.icon className="text-forest" size={26} />
                  </div>
                  <h3 className="heading-md text-xl mb-3">{f.title}</h3>
                  <p className="text-body text-muted-foreground">{f.desc}</p>
                </motion.div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="section-padding bg-primary">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center text-primary-foreground mb-4">{t("index.experiences.title")}</h2>
            <p className="text-body text-center text-primary-foreground/70 max-w-xl mx-auto mb-16">
              {t("index.experiences.subtitle")}
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((e) => (
              <SectionFadeIn key={e.title}>
                <Link to={e.link} className="group block">
                  <div className="relative hover-zoom rounded-lg overflow-hidden mb-5">
                    <img
                      src={e.img.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                      alt={e.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      width={400}
                      height={267}
                    />
                    <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {e.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <e.icon className="text-gold" size={22} />
                    <h3 className="font-heading text-xl text-primary-foreground group-hover:text-gold transition-colors">
                      {e.title}
                    </h3>
                  </div>
                  <p className="text-body text-primary-foreground/70">{e.desc}</p>
                </Link>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How to get there */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("index.howToGetThere.label")}</span>
            <h2 className="heading-lg mt-2 mb-6">{t("index.howToGetThere.title")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("index.howToGetThere.p1")}
            </p>
            <p className="text-body text-muted-foreground mb-8">
              {t("index.howToGetThere.p2")}
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-gold transition-colors group"
              >
                <MapPin className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm">{t("index.howToGetThere.location")}</p>
                  <p className="text-sm text-muted-foreground">Paraná do Mamori, Careiro Castanho – AM, Brasil</p>
                  <span className="text-sm text-gold font-semibold group-hover:underline">{t("index.howToGetThere.viewOnMaps")}</span>
                </div>
              </a>
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <Phone className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-body font-semibold text-sm">{t("index.howToGetThere.reservations")}</p>
                  <p className="text-sm text-muted-foreground">{t("index.howToGetThere.reservationsDesc")}</p>
                </div>
              </div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={ecotourismImg.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/")}
                alt="Acesso de barco ao Amazon Samaúma Lodge"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
                width={400}
                height={267}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-sand-light">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">{t("index.testimonials.title")}</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              {t("index.testimonials.subtitle")}
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {displayTestimonials.map((t, i) => (
              <SectionFadeIn key={i}>
                <div className="bg-background p-8 rounded-lg shadow-sm border border-border h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={16} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-body text-muted-foreground italic mb-6 flex-1">"{t.text}"</p>
                  <div>
                    <p className="font-body font-semibold text-foreground">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.from}</p>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card">
        <div className="container-lodge max-w-3xl">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-4">{t("index.faq.title")}</h2>
            <p className="text-body text-center text-muted-foreground mb-16">
              {t("index.faq.subtitle")}
            </p>
          </SectionFadeIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <SectionFadeIn key={i}>
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-body font-semibold text-foreground hover:text-gold transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="text-gold shrink-0 ml-4" size={20} />
                    ) : (
                      <ChevronDown className="text-muted-foreground shrink-0 ml-4" size={20} />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-body text-muted-foreground border-t border-border pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg mb-6">{t("index.cta.title")}</h2>
            <p className="text-body-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              {t("index.cta.subtitle")}
            </p>
            <BookingModal>
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <WhatsappIcon size={18} className="shrink-0" />
                {t("header.bookNow")}
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>
    </div>
  );
};

export default Index;
