import { useState, useEffect, useCallback } from "react";
import { TreePine, Bird, Moon, Users, Map, Footprints, Sunrise, X, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import BookingModal from "@/components/BookingModal";
import { WhatsappIcon } from "@/components/WhatsappIcon";

// ─── Images ──────────────────────────────────────────────────────────────────
import { photos } from "@/lib/photos";
const ecotourismImg = "/fotos_reais_amazon/eco-new-11.webp";
const fishingImg    = "/fotos_reais_amazon/eco-new-28.webp";
const heroImg       = "/fotos_reais_amazon/eco-new-38.webp";
const tourSafari    = "/fotos_reais_amazon/eco-new-16.webp";
const tourSafari2   = "/fotos_reais_amazon/eco-new-18.webp";
const tourTrilhas   = "/fotos_reais_amazon/eco-new-10.webp";
const tourTrilhas2  = "/fotos_reais_amazon/eco-new-41.webp";
const tourPorDoSol  = "/fotos_reais_amazon/eco-new-30.webp";
const tourNoturna   = "/fotos_reais_amazon/eco-new-17.webp";
const tourNoturna2  = "/fotos_reais_amazon/eco-new-6.webp";
const tourCultura   = "/fotos_reais_amazon/eco-new-14.webp";
const tourRoteiro   = "/fotos_reais_amazon/eco-new-2.webp";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tour {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  tagColor: string;
  preview: string;
  duration: string;
  difficulty: string;
  rating: number;
  longDesc: string;
  highlights: string[];
  gallery: string[];
}

// Metadata configuration mapping for merging with i18n content
const tourMetadata = [
  {
    icon: Bird,
    tagColor: "from-emerald-400/90 to-teal-500/90",
    preview: tourSafari,
    durationKey: "ecotourism.duration.safari",
    difficultyKey: "ecotourism.difficulty.easy",
    tagKey: "ecotourism.tag.family",
    rating: 5,
    gallery: [tourSafari, tourSafari2, ecotourismImg, "/fotos_reais_amazon/eco-victoria-regia.webp", "/fotos_reais_amazon/eco-orquidea.webp", "/fotos_reais_amazon/eco-orquidario.webp"],
  },
  {
    icon: Footprints,
    tagColor: "from-amber-400/90 to-orange-500/90",
    preview: tourTrilhas,
    durationKey: "ecotourism.duration.trails",
    difficultyKey: "ecotourism.difficulty.moderate",
    tagKey: "ecotourism.tag.adventure",
    rating: 5,
    gallery: [tourTrilhas, tourTrilhas2, heroImg, "/fotos_reais_amazon/eco-larvas-tronco.webp", "/fotos_reais_amazon/eco-peixe-floresta.webp"],
  },
  {
    icon: Sunrise,
    tagColor: "from-rose-400/90 to-orange-400/90",
    preview: tourPorDoSol,
    durationKey: "ecotourism.duration.sunset",
    difficultyKey: "ecotourism.difficulty.none",
    tagKey: "ecotourism.tag.mustSee",
    rating: 5,
    gallery: [tourPorDoSol, ecotourismImg, heroImg],
  },
  {
    icon: Moon,
    tagColor: "from-purple-500/90 to-indigo-600/90",
    preview: tourNoturna,
    durationKey: "ecotourism.duration.night",
    difficultyKey: "ecotourism.difficulty.medMod",
    tagKey: "ecotourism.tag.exciting",
    rating: 5,
    gallery: [tourNoturna, tourNoturna2, fishingImg, "/fotos_reais_amazon/eco-banquete-noturno.webp"],
  },
  {
    icon: Users,
    tagColor: "from-blue-400/90 to-cyan-500/90",
    preview: tourCultura,
    durationKey: "ecotourism.duration.culture",
    difficultyKey: "ecotourism.difficulty.easy",
    tagKey: "ecotourism.tag.cultural",
    rating: 4.8,
    gallery: [tourCultura, "/fotos_reais_amazon/eco-artesanato-loja.webp", "/fotos_reais_amazon/eco-artesanato-madeira.webp", ecotourismImg],
  },
  {
    icon: Map,
    tagColor: "from-gold/80 to-amber-600/90",
    preview: tourRoteiro,
    durationKey: "ecotourism.duration.custom",
    difficultyKey: "ecotourism.difficulty.custom",
    tagKey: "ecotourism.tag.exclusive",
    rating: 5,
    gallery: [tourRoteiro, heroImg, ecotourismImg],
  },
];

// ─── Animal Gallery Data ──────────────────────────────────────────────────────
const animalPhotos = [
  { src: "/fotos_reais_amazon/eco-new-12.webp", alt: "Aranha" },
  { src: "/fotos_reais_amazon/eco-new-13.webp", alt: "Caranguejeira" },
  { src: "/fotos_reais_amazon/eco-new-15.webp", alt: "Ave Amazônica" },
  { src: "/fotos_reais_amazon/eco-new-19.webp", alt: "Papagaio" },
  { src: "/fotos_reais_amazon/eco-new-20.webp", alt: "Garça" },
  { src: "/fotos_reais_amazon/eco-new-21.webp", alt: "Gavião em Voo" },
  { src: "/fotos_reais_amazon/eco-new-22.webp", alt: "Macaco Prego" },
  { src: "/fotos_reais_amazon/eco-new-23.webp", alt: "Águia Pescadora" },
  { src: "/fotos_reais_amazon/eco-new-24.webp", alt: "Macaco de Cheiro" },
  { src: "/fotos_reais_amazon/eco-new-25.webp", alt: "Ave Colorida" },
  { src: "/fotos_reais_amazon/eco-new-26.webp", alt: "Andorinha" },
  { src: "/fotos_reais_amazon/eco-new-29.webp", alt: "Ave Silvestre" },
  { src: "/fotos_reais_amazon/eco-new-31.webp", alt: "Pássaro no Galho" },
  { src: "/fotos_reais_amazon/eco-new-32.webp", alt: "Bicho-Preguiça" },
  { src: "/fotos_reais_amazon/eco-new-33.webp", alt: "Garça Branca" },
  { src: "/fotos_reais_amazon/eco-new-34.webp", alt: "Garça Moura" },
  { src: "/fotos_reais_amazon/eco-new-35.webp", alt: "Macaco" },
  { src: "/fotos_reais_amazon/eco-new-36.webp", alt: "Pica-Pau" },
  { src: "/fotos_reais_amazon/eco-new-39.webp", alt: "Tarântulas" },
  { src: "/fotos_reais_amazon/eco-new-40.webp", alt: "Iguana" },
];

// ─── iOS Spring config ────────────────────────────────────────────────────────
const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };
const modalSpring = { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.9 };

// ─── Modal Component ──────────────────────────────────────────────────────────
function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const { t } = useTranslation();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = useCallback(() =>
    setActiveImg(i => (i - 1 + tour.gallery.length) % tour.gallery.length), [tour.gallery.length]);
  const next = useCallback(() =>
    setActiveImg(i => (i + 1) % tour.gallery.length), [tour.gallery.length]);

  return (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />

      {/* Modal panel — liquid glass */}
      <motion.div
        className="relative z-10 w-full sm:max-w-2xl max-h-[94vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl flex flex-col"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 100%)",
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={modalSpring}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag pill */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-white/40" />
        </div>

        {/* Gallery */}
        <div className="relative overflow-hidden shrink-0">
          <div className="relative w-full" style={{ height: 300 }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={tour.gallery[activeImg]}
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Nav arrows */}
            {tour.gallery.length > 1 && (
              <>
                <motion.button
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springConfig}
                  onClick={prev}
                >
                  <ChevronLeft size={18} className="text-white" />
                </motion.button>
                <motion.button
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springConfig}
                  onClick={next}
                >
                  <ChevronRight size={18} className="text-white" />
                </motion.button>
              </>
            )}

            {/* Close */}
            <motion.button
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              whileHover={{ scale: 1.12, background: "rgba(0,0,0,0.55)" }}
              whileTap={{ scale: 0.88 }}
              transition={springConfig}
              onClick={onClose}
            >
              <X size={16} className="text-white" />
            </motion.button>

            {/* Tag on gallery */}
            <div
              className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${tour.tagColor} text-white text-xs font-bold uppercase tracking-wider`}
              style={{ backdropFilter: "blur(8px)" }}
            >
              {tour.tag}
            </div>

            {/* Counter */}
            {tour.gallery.length > 1 && (
              <div
                className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] text-white font-semibold"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {activeImg + 1}/{tour.gallery.length}
              </div>
            )}
          </div>

          {/* Thumbnails + dots below image for mobile-first layout */}
          {tour.gallery.length > 1 && (
            <div className="px-4 sm:px-5 pt-3 pb-1 bg-black/10">
              <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tour.gallery.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="rounded-lg overflow-hidden shrink-0"
                    style={{
                      width: i === activeImg ? 68 : 56,
                      height: i === activeImg ? 46 : 40,
                      border: i === activeImg ? "2px solid rgba(255,255,255,0.95)" : "1px solid rgba(255,255,255,0.28)",
                      opacity: i === activeImg ? 1 : 0.7,
                    }}
                    animate={{ opacity: i === activeImg ? 1 : 0.7 }}
                    transition={springConfig}
                    whileTap={{ scale: 0.96 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-1.5 pb-2">
                {tour.gallery.map((_, i) => (
                  <motion.button
                    key={i}
                    className="rounded-full"
                    style={{
                      width: i === activeImg ? 18 : 6,
                      height: 6,
                      background: i === activeImg ? "white" : "rgba(255,255,255,0.4)",
                    }}
                    animate={{ width: i === activeImg ? 18 : 6 }}
                    transition={springConfig}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-white drop-shadow-sm">{tour.title}</h2>
              <p className="text-sm text-white/70 font-body mt-0.5 italic">{tour.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 mt-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-white text-sm font-semibold">{tour.rating}</span>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Clock, label: tour.duration },
              { icon: Footprints, label: tour.difficulty },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon size={12} />
                {label}
              </div>
            ))}
          </div>

          {/* Long desc */}
          <p className="text-white/85 font-body text-sm leading-relaxed">{tour.longDesc}</p>

          {/* Highlights */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p className="text-white/60 text-xs uppercase tracking-widest font-body font-semibold mb-3">{t("ecotourism.modalIncludes")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {tour.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  className="text-white/85 text-sm font-body"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.2, ...springConfig }}
                >
                  {h}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <BookingModal defaultInterest="Ecoturismo">
            <motion.button
              className="flex items-center justify-center flex-wrap gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold uppercase tracking-wider font-body w-full h-auto min-h-[52px] text-center leading-snug"
              style={{
                background: "linear-gradient(135deg, #d4af37, #aa8529)",
                boxShadow: "0 4px 20px rgba(194,155,71,0.4)",
                color: "white",
              }}
              whileHover={{ scale: 1.02, boxShadow: "0 6px 28px rgba(194,155,71,0.55)" }}
              whileTap={{ scale: 0.97 }}
              transition={springConfig}
            >
              <WhatsappIcon size={17} className="shrink-0" />
              {t("ecotourism.modalButton")}
            </motion.button>
          </BookingModal>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tour Card ────────────────────────────────────────────────────────────────
function thumb(src: string): string {
  if (src.startsWith("/fotos_reais_amazon/")) {
    return src.replace("/fotos_reais_amazon/", "/fotos_reais_amazon/thumbs/");
  }
  return src;
}

function TourCard({ tour, index, onClick }: { tour: Tour; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { t } = useTranslation();
  const touchStartX = useMotionValue(0);
  const images = tour.gallery.length > 0 ? tour.gallery : [tour.preview];

  const goNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(i => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.set(e.touches[0].clientX);
  }, [touchStartX]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.get() - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActiveSlide(i => (i + 1) % images.length);
      else setActiveSlide(i => (i - 1 + images.length) % images.length);
    }
  }, [images.length, touchStartX]);

  return (
    <SectionFadeIn>
      <motion.div
        className="group relative rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
        whileHover={{
          y: -6,
          boxShadow: "0 16px 48px rgba(0,0,0,0.32)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={springConfig}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.07, ...springConfig } }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Carousel */}
        <div
          className="relative overflow-hidden aspect-[4/3]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide}
              src={thumb(images[activeSlide])}
              alt={`${tour.title} - ${activeSlide + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: hovered ? 1.06 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Nav arrows — visible on hover (desktop) or always on mobile */}
          {images.length > 1 && (
            <>
              <motion.button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.85 }}
                onClick={goPrev}
              >
                <ChevronLeft size={16} className="text-white" />
              </motion.button>
              <motion.button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.85 }}
                onClick={goNext}
              >
                <ChevronRight size={16} className="text-white" />
              </motion.button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeSlide ? 18 : 6,
                    height: 6,
                    background: i === activeSlide ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Top-right: counter + tag */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {images.length > 1 && (
              <div className="px-2 py-0.5 rounded-full text-[10px] text-white/90 font-semibold" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                {activeSlide + 1}/{images.length}
              </div>
            )}
            <div
              className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${tour.tagColor} text-white text-[10px] font-bold uppercase tracking-wider shadow-sm`}
            >
              {tour.tag}
            </div>
          </div>

          {/* Icon overlay */}
          <div
            className="absolute bottom-2.5 left-3 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <tour.icon size={16} className="text-white" />
          </div>

          {/* Rating */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-xs font-semibold">{tour.rating}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-0.5 group-hover:text-amber-200 transition-colors duration-300">
            {tour.title}
          </h3>
          <p className="text-xs text-white/55 font-body italic mb-2">{tour.subtitle}</p>
          <p className="text-sm text-white/75 font-body leading-relaxed line-clamp-2 sm:line-clamp-3">{tour.desc}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/55 font-body">
              <Clock size={11} />
              {tour.duration}
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-1.5 text-xs text-white/55 font-body">
              <Footprints size={11} />
              {tour.difficulty}
            </div>
          </div>

          {/* Tap hint */}
          <motion.div
            className="mt-2 flex items-center gap-2 text-xs text-white/40 font-body"
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.2 }}
          >
            <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
            {t("ecotourism.tourCardTip")}
          </motion.div>
        </div>
      </motion.div>
    </SectionFadeIn>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Ecotourism = () => {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const { t } = useTranslation();

  const translatedList = t("ecotourism.toursList", { returnObjects: true }) as Array<{
    title: string;
    subtitle: string;
    desc: string;
    longDesc: string;
    highlights: string[];
  }>;

  const tours: Tour[] = tourMetadata.map((meta, i) => ({
    icon: meta.icon,
    tagColor: meta.tagColor,
    preview: meta.preview,
    rating: meta.rating,
    gallery: meta.gallery,
    duration: t(meta.durationKey),
    difficulty: t(meta.difficultyKey),
    tag: t(meta.tagKey),
    title: translatedList[i]?.title || "",
    subtitle: translatedList[i]?.subtitle || "",
    desc: translatedList[i]?.desc || "",
    longDesc: translatedList[i]?.longDesc || "",
    highlights: translatedList[i]?.highlights || [],
  }));

  const faunaList = t("ecotourism.faunaList", { returnObjects: true }) as string[];

  return (
    <div className="bg-background pt-20">
      <SEOHead
        title={t("ecotourism.title")}
        description={t("ecotourism.description")}
        canonicalPath="/ecoturismo"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t("ecotourism.title"),
          "description": t("ecotourism.description")
        }}
      />
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={ecotourismImg}
          alt="Ecoturismo"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={800}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="relative z-10 text-center px-4">
          <motion.span
            className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
          >
            {t("ecotourism.heroLabel")}
          </motion.span>
          <motion.h1
            className="heading-xl text-primary-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.2 }}
          >
            {t("ecotourism.heroTitle")}
          </motion.h1>
          <motion.p
            className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.3 }}
          >
            {t("ecotourism.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* Intro text */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("ecotourism.introLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6">{t("ecotourism.introTitle")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("ecotourism.introP1")}
            </p>
            <p className="text-body text-muted-foreground mb-8">
              {t("ecotourism.introP2")}
            </p>
            <BookingModal defaultInterest="Ecoturismo">
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
              >
                <WhatsappIcon size={18} className="shrink-0" />
                {t("ecotourism.introButton")}
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={heroImg}
                alt="Passeio de barco"
                className="w-full h-[420px] object-cover"
                loading="lazy"
                width={1200}
                height={800}
              />
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* Tours grid — dark bg for liquid glass effect */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(160deg, hsl(147,27%,10%) 0%, hsl(147,30%,7%) 100%)",
        }}
      >
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-3 text-primary-foreground">{t("ecotourism.toursTitle")}</h2>
            <p className="text-body text-center text-primary-foreground/60 max-w-2xl mx-auto mb-4">
              {t("ecotourism.toursDesc")}
            </p>
            <p className="text-center text-xs text-primary-foreground/35 font-body uppercase tracking-widest mb-14">
              {t("ecotourism.toursFootnote")}
            </p>
          </SectionFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {tours.map((tour, i) => (
              <TourCard
                key={tour.title}
                tour={tour}
                index={i}
                onClick={() => setSelectedTour(tour)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Wildlife section */}
      <section className="section-padding bg-primary">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={fishingImg}
                alt="Fauna amazônica"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={1200}
                height={800}
              />
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("ecotourism.faunaLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">{t("ecotourism.faunaTitle")}</h2>
            <p className="text-body text-primary-foreground/80 mb-4">
              {t("ecotourism.faunaDesc")}
            </p>
            <ul className="space-y-2 text-primary-foreground/80 mb-8">
              {(faunaList ?? []).map(item => (
                <li key={item} className="flex items-center gap-2 font-body text-sm">{item}</li>
              ))}
            </ul>
            <BookingModal defaultInterest="Ecoturismo">
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
              >
                {t("ecotourism.faunaButton")}
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>

      {/* Animal Gallery Section */}
      <section className="section-padding" style={{ background: "hsl(147,27%,8%)" }}>
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-primary-foreground mb-4">{t("ecotourism.galleryTitle")}</h2>
            <p className="text-body text-primary-foreground/70 max-w-2xl mb-12">
              {t("ecotourism.galleryDesc")}
            </p>
          </SectionFadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {animalPhotos.map((photo, i) => (
              <SectionFadeIn key={i}>
                <motion.div
                  className="relative rounded-xl overflow-hidden aspect-square bg-black/20"
                  whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                  transition={springConfig}
                >
                  <img
                    src={thumb(photo.src)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-body font-bold">{photo.alt}</span>
                  </div>
                </motion.div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Modal */}
      <AnimatePresence>
        {selectedTour && (
          <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ecotourism;
