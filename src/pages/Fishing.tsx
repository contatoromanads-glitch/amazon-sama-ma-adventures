import { useState, useEffect, useCallback, useRef } from "react";
import {
  Fish, Calendar, Anchor, Award, MessageCircle, Binoculars, Moon,
  X, ChevronLeft, ChevronRight, ZoomIn, Heart, MapPin,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import BookingModal from "@/components/BookingModal";

// ─── Images ──────────────────────────────────────────────────────────────────
import { photos } from "@/lib/photos";
const fishCatch       = photos.pescaTucunare;
const fishBoat        = photos.pescaBarco;
const fishGear        = photos.pescaEquipamentos;
const fishSunset      = photos.tourNoturna2;
const fishUnderwaterImg = photos.pescaUnderwater;
const fishGroup       = photos.tourRoteiro;
const fishIgarape     = photos.ecoturismo;
const ecotourismImg   = photos.tourSafari2;

// ─── Constants ────────────────────────────────────────────────────────────────
const springCfg = { type: "spring" as const, stiffness: 380, damping: 28 };
const modalSpring = { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.95 };

const glassStyle = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
  backdropFilter: "blur(28px) saturate(1.7)",
  WebkitBackdropFilter: "blur(28px) saturate(1.7)",
  border: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.25)",
} as React.CSSProperties;

interface GalleryItem {
  src: string;
  label: string;
  caption: string;
  location?: string;
  liked?: boolean;
}

const galleryMetadata = [
  { src: fishCatch, location: "Paraná do Mamori" },
  { src: fishBoat, location: "Rio Mamori, AM" },
  { src: fishSunset, location: "Paraná do Mamori" },
  { src: fishIgarape, location: "Igarapé do Castanho" },
  { src: fishUnderwaterImg, location: "Fundo do Mamori" },
  { src: fishGear, location: "Amazon Samaúma Lodge" },
  { src: fishGroup, location: "Deck do Lodge" },
];

const seasonMetadata = [
  { period: "Jan–Mar", level: 1, color: "bg-blue-400/60" },
  { period: "Mar–Jun", level: 2, color: "bg-blue-600/50" },
  { period: "Jun–Set", level: 3, color: "bg-amber-400/70" },
  { period: "Set–Jan", level: 4, color: "bg-emerald-400/80" },
];

const statMetadata = [
  { value: "12kg+", Icon: Fish },
  { value: "100%", Icon: Award },
  { value: "15+", Icon: Fish },
  { value: "4 meses", Icon: Calendar },
];

const tipMetadata = [
  { icon: "🎣" },
  { icon: "🕕" },
  { icon: "📍" },
  { icon: "🌊" },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ items, startIndex, onClose }: { items: GalleryItem[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const [liked, setLiked] = useState<boolean[]>(items.map(() => false));
  const { t } = useTranslation();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent(i => (i - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") setCurrent(i => (i + 1) % items.length);
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, items.length]);

  const prev = useCallback(() => setCurrent(i => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % items.length), [items.length]);

  const item = items[current];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
        style={glassStyle}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 20, opacity: 0 }}
        transition={modalSpring}
        onClick={e => e.stopPropagation()}
      >
        {/* Image side */}
        <div className="relative flex-1 bg-black" style={{ minHeight: 320 }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover"
              style={{ maxHeight: 520 }}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </AnimatePresence>

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 pointer-events-none" />

          {/* Arrows */}
          {[{ dir: "left", handler: prev, Icon: ChevronLeft, pos: "left-3" },
            { dir: "right", handler: next, Icon: ChevronRight, pos: "right-3" }
          ].map(({ dir, handler, Icon, pos }) => (
            <motion.button
              key={dir}
              className={`absolute ${pos} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center`}
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              transition={springCfg}
              onClick={handler}
            >
              <Icon size={20} className="text-white" />
            </motion.button>
          ))}

          {/* Counter */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs text-white font-body font-semibold"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
            {current + 1} / {items.length}
          </div>
        </div>

        {/* Info side */}
        <div className="w-full md:w-72 flex flex-col p-6 gap-4">
          {/* Close */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-widest font-body">{t("fishing.lightboxLabel")}</span>
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              transition={springCfg}
              onClick={onClose}
            >
              <X size={14} className="text-white" />
            </motion.button>
          </div>

          <div className="flex-1">
            <motion.h3
              key={current + "title"}
              className="font-heading text-xl text-white mb-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springCfg}
            >
              {item.label}
            </motion.h3>
            {item.location && (
              <motion.div
                key={current + "loc"}
                className="flex items-center gap-1.5 text-xs text-amber-300/80 font-body mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...springCfg, delay: 0.05 }}
              >
                <MapPin size={11} />
                {item.location}
              </motion.div>
            )}
            <motion.p
              key={current + "desc"}
              className="text-sm text-white/75 font-body leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springCfg, delay: 0.08 }}
            >
              {item.caption}
            </motion.p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-body font-semibold"
              style={{ background: liked[current] ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.15)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              transition={springCfg}
              onClick={() => setLiked(l => l.map((v, i) => i === current ? !v : v))}
            >
              <Heart size={15} className={liked[current] ? "fill-red-400 text-red-400" : "text-white/70"} />
              <span className={liked[current] ? "text-red-300" : "text-white/70"}>
                {liked[current] ? t("fishing.liked") : t("fishing.like")}
              </span>
            </motion.button>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-1.5 flex-wrap">
            {items.map((g, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-lg overflow-hidden"
                style={{
                  width: 38, height: 28,
                  border: i === current ? "2px solid rgba(251,191,36,0.9)" : "2px solid rgba(255,255,255,0.15)",
                  opacity: i === current ? 1 : 0.55,
                }}
                animate={{ opacity: i === current ? 1 : 0.55 }}
                whileHover={{ opacity: 1, scale: 1.08 }}
                transition={springCfg}
              >
                <img src={g.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </motion.button>
            ))}
          </div>

          <BookingModal defaultInterest="Pesca Esportiva">
            <motion.button
              className="flex items-center justify-center flex-wrap gap-2 py-3 px-4 rounded-2xl text-sm font-bold uppercase tracking-wide font-body text-white w-full h-auto min-h-[48px] text-center leading-snug"
              style={{ background: "linear-gradient(135deg, #d4af37, #aa8529)", boxShadow: "0 4px 20px rgba(194,155,71,0.4)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={springCfg}
            >
              <MessageCircle size={16} className="shrink-0" />
              {t("fishing.lightboxButton")}
            </motion.button>
          </BookingModal>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({ item, colSpan = false, rowSpan = false, onOpen }: {
  item: GalleryItem;
  colSpan?: boolean;
  rowSpan?: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotX = useSpring(useTransform(mouseY, [-80, 80], [6, -6]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(mouseX, [-80, 80], [-6, 6]), { stiffness: 300, damping: 30 });

  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${colSpan ? "md:col-span-2" : ""} ${rowSpan ? "md:row-span-2" : ""}`}
      style={{ ...glassStyle, perspective: 800, transformStyle: "preserve-3d", rotateX: rotX, rotateY: rotY } as any}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      whileTap={{ scale: 0.98 }}
      transition={springCfg}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
    >
      {/* Image */}
      <motion.img
        src={item.src}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      {/* Zoom icon hint — top right */}
      <motion.div
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
        transition={springCfg}
      >
        <ZoomIn size={14} className="text-white" />
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.p
          className="text-amber-300 text-[10px] uppercase tracking-widest font-body font-bold mb-1"
          animate={{ opacity: hovered ? 1 : 0.7 }}
        >
          {item.location}
        </motion.p>
        <h3 className="text-white font-heading text-base font-semibold leading-tight">{item.label}</h3>
        <motion.p
          className="text-white/70 font-body text-xs leading-relaxed mt-1 overflow-hidden"
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {item.caption}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Season Bar Interactive ───────────────────────────────────────────────────
const seasonGlass = {
  background: "linear-gradient(135deg, rgba(20,40,30,0.95) 0%, rgba(15,30,22,0.98) 100%)",
  backdropFilter: "blur(20px) saturate(1.5)",
  WebkitBackdropFilter: "blur(20px) saturate(1.5)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
} as React.CSSProperties;

type SeasonItem = { period: string; level: number; color: string; name: string; tip: string };

function SeasonBar() {
  const [active, setActive] = useState(3);
  const { t } = useTranslation();

  const translatedSeasons = t("fishing.seasons", { returnObjects: true }) as Array<{ name: string; tip: string }>;
  const seasons: SeasonItem[] = seasonMetadata.map((meta, i) => ({
    ...meta,
    name: translatedSeasons[i]?.name || "",
    tip: translatedSeasons[i]?.tip || "",
  }));

  return (
    <div className="rounded-2xl overflow-hidden" style={seasonGlass}>
      <div className="p-5 border-b border-white/10">
        <h3 className="text-white font-heading text-lg mb-1">{t("fishing.seasonsTitle")}</h3>
        <p className="text-white/50 text-xs font-body">{t("fishing.seasonsDesc")}</p>
      </div>
      <div className="grid grid-cols-4 divide-x divide-white/10">
        {seasons.map((s, i) => (
          <motion.button
            key={s.period}
            className="flex flex-col items-center py-4 px-2 gap-1 relative"
            style={{ background: active === i ? "rgba(255,255,255,0.07)" : "transparent" }}
            onClick={() => setActive(i)}
            whileHover={{ background: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
            transition={springCfg}
          >
            {active === i && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "hsl(38,80%,55%)" }}
                layoutId="season-indicator"
                transition={springCfg}
              />
            )}
            <div className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-[10px] text-white/45 font-body">{s.period}</span>
            <span
              className="text-xs font-body font-semibold"
              style={{ color: active === i ? "hsl(38,80%,60%)" : "rgba(255,255,255,0.75)" }}
            >
              {s.name}
            </span>
            {/* Level bars */}
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4].map(n => (
                <div
                  key={n}
                  className="w-2 h-1 rounded-full"
                  style={{ background: n <= s.level ? "hsl(38,70%,55%)" : "rgba(255,255,255,0.12)" }}
                />
              ))}
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springCfg}
        >
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 ${seasons[active].color} shrink-0`} />
            <p className="text-white/80 text-sm font-body leading-relaxed">{seasons[active].tip}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatsPanel() {
  const { t } = useTranslation();
  const translatedStats = t("fishing.stats", { returnObjects: true }) as Array<{ label: string; sub: string }>;
  const stats = statMetadata.map((meta, i) => ({
    ...meta,
    label: translatedStats[i]?.label || "",
    sub: translatedStats[i]?.sub || "",
  }));

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="rounded-2xl p-4 flex flex-col"
          style={glassStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...springCfg, delay: i * 0.07 }}
          whileHover={{ y: -4 }}
        >
          <span className="font-heading text-3xl font-light text-amber-300">{s.value}</span>
          <span className="text-white text-sm font-body font-semibold mt-1">{s.label}</span>
          <span className="text-white/45 text-xs font-body">{s.sub}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Fishing = () => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [tipIdx, setTipIdx] = useState(0);
  const { t } = useTranslation();

  const translatedGallery = t("fishing.galleryItems", { returnObjects: true }) as Array<{ label: string; caption: string }>;
  const galleryItems: GalleryItem[] = galleryMetadata.map((meta, i) => ({
    ...meta,
    label: translatedGallery[i]?.label || "",
    caption: translatedGallery[i]?.caption || "",
  }));

  const bentoLayout = [
    { item: galleryItems[0], colSpan: true, rowSpan: true },  // big hero
    { item: galleryItems[1], colSpan: false, rowSpan: false },
    { item: galleryItems[2], colSpan: false, rowSpan: false },
    { item: galleryItems[3], colSpan: false, rowSpan: false },
    { item: galleryItems[4], colSpan: true, rowSpan: false },  // wide
    { item: galleryItems[5], colSpan: false, rowSpan: false },
    { item: galleryItems[6], colSpan: false, rowSpan: false },
  ];

  const translatedTips = t("fishing.tips", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const tips = tipMetadata.map((meta, i) => ({
    ...meta,
    title: translatedTips[i]?.title || "",
    desc: translatedTips[i]?.desc || "",
  }));

  const introFeatures = t("fishing.introFeatures", { returnObjects: true }) as string[];

  return (
    <div className="bg-background pt-20">
      <SEOHead
        title={t("fishing.title")}
        description={t("fishing.description")}
        canonicalPath="/pesca"
        ogImage="https://amazon-samauma-lodge.com.br/fotos_reais_amazon/home-pesca.jpg"
      />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.img
          src={fishCatch}
          alt="Pesca esportiva"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          width={1200}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/85" />
        <div className="relative z-10 text-center px-4">
          <motion.span
            className="inline-block text-amber-300 font-body text-sm font-semibold tracking-[4px] uppercase mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springCfg, delay: 0.1 }}
          >
            {t("fishing.heroLabel")}
          </motion.span>
          <motion.h1
            className="heading-xl text-primary-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springCfg, delay: 0.2 }}
          >
            {t("fishing.heroTitle")}
          </motion.h1>
          <motion.p
            className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springCfg, delay: 0.3 }}
          >
            {t("fishing.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* ── Intro + Highlights ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(147,20%,96%) 100%)" }}>
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-start">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("fishing.introLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6">{t("fishing.introTitle")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("fishing.introP1")}
            </p>
            <p className="text-body text-muted-foreground mb-8">
              {t("fishing.introP2")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[Fish, Anchor, Calendar, Award, Binoculars, Moon].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                  whileHover={{ y: -2, borderColor: "hsl(var(--gold) / 0.4)" }}
                  transition={springCfg}
                >
                  <Icon className="text-gold shrink-0" size={20} />
                  <span className="font-body text-sm font-medium">{introFeatures[idx]}</span>
                </motion.div>
              ))}
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <SeasonBar />
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Bento Gallery ──────────────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(170deg, hsl(147,27%,8%) 0%, hsl(25,30%,6%) 100%)" }}
      >
        <div className="container-lodge">
          <SectionFadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="heading-lg text-primary-foreground mb-2">{t("fishing.galleryTitle")}</h2>
                <p className="text-primary-foreground/50 font-body text-sm">
                  {galleryItems.length} {t("fishing.galleryDesc")}
                </p>
              </div>
              <BookingModal defaultInterest="Pesca Esportiva">
                <motion.button
                  className="inline-flex items-center justify-center flex-wrap gap-2 px-5 py-3 rounded-xl text-sm font-body font-bold text-white shrink-0 h-auto min-h-[48px] text-center leading-snug"
                  style={{ background: "linear-gradient(135deg, #d4af37, #aa8529)", boxShadow: "0 4px 16px rgba(194,155,71,0.35)" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springCfg}
                >
                  <MessageCircle size={15} className="shrink-0" />
                  {t("fishing.galleryButton")}
                </motion.button>
              </BookingModal>
            </div>
          </SectionFadeIn>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
            {/* Cell 1 — big tall */}
            <motion.div
              className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative cursor-pointer group"
              style={glassStyle}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.995 }}
              transition={springCfg}
              onClick={() => setLightboxIdx(0)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.img
                src={galleryItems[0].src}
                alt={galleryItems[0].label}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <motion.div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body font-bold uppercase tracking-widest text-amber-300"
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(251,191,36,0.3)" }}
              >
                ★ Destaque
              </motion.div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-heading text-xl font-semibold">{galleryItems[0].label}</h3>
                <p className="text-white/60 font-body text-xs mt-1">{galleryItems[0].caption}</p>
              </div>
              <motion.div
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.15 }}
              >
                <ZoomIn size={16} className="text-white" />
              </motion.div>
            </motion.div>

            {/* Cells 2–7 */}
            {bentoLayout.slice(1).map((cell, i) => (
              <BentoCard
                key={cell.item.label}
                item={cell.item}
                colSpan={cell.colSpan}
                rowSpan={cell.rowSpan}
                onOpen={() => setLightboxIdx(i + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats + Tips ───────────────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: "hsl(147,27%,8%)" }}
      >
        <div className="container-lodge">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Stats */}
            <SectionFadeIn>
              <h2 className="heading-lg text-primary-foreground mb-6">{t("fishing.statsTitle")}</h2>
              <StatsPanel />
            </SectionFadeIn>

            {/* Tips rotator */}
            <SectionFadeIn>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-lg text-primary-foreground">{t("fishing.tipsTitle")}</h2>
                <div className="flex gap-1.5">
                  {tips.map((_, i) => (
                    <motion.button
                      key={i}
                      className="rounded-full"
                      style={{ width: i === tipIdx ? 20 : 8, height: 8, background: i === tipIdx ? "hsl(var(--gold))" : "rgba(255,255,255,0.2)" }}
                      animate={{ width: i === tipIdx ? 20 : 8 }}
                      transition={springCfg}
                      onClick={() => setTipIdx(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="relative min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipIdx}
                    className="rounded-2xl p-6 absolute inset-0"
                    style={glassStyle}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={springCfg}
                  >
                    <div className="text-4xl mb-4">{tips[tipIdx].icon}</div>
                    <h3 className="text-white font-heading text-xl mb-2">{tips[tipIdx].title}</h3>
                    <p className="text-white/70 font-body text-sm leading-relaxed">{tips[tipIdx].desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 mt-[200px]">
                {tips.map((t, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setTipIdx(i)}
                    className="flex-1 py-2 rounded-xl text-xs font-body font-semibold"
                    style={{
                      background: tipIdx === i ? "hsl(var(--gold) / 0.2)" : "rgba(255,255,255,0.06)",
                      border: tipIdx === i ? "1px solid hsl(var(--gold) / 0.5)" : "1px solid rgba(255,255,255,0.1)",
                      color: tipIdx === i ? "hsl(var(--gold))" : "rgba(255,255,255,0.4)",
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springCfg}
                  >
                    {t.icon}
                  </motion.button>
                ))}
              </div>
            </SectionFadeIn>
          </div>
        </div>
      </section>

      {/* ── Night expedition ──────────────────────────────────────────────── */}
      <section className="section-padding bg-primary">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <div className="relative hover-zoom rounded-lg overflow-hidden">
              <img src={ecotourismImg} alt="Expedição noturna" className="w-full h-[380px] object-cover" loading="lazy" width={1200} height={800} />
              <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] sm:text-xs font-body bg-background/70 text-foreground rounded backdrop-blur-sm">
                Imagens meramente ilustrativas
              </span>
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("fishing.expeditionLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">{t("fishing.expeditionTitle")}</h2>
            <p className="text-body text-primary-foreground/80 mb-4">
              {t("fishing.expeditionP1")}
            </p>
            <p className="text-body text-primary-foreground/80 mb-8">
              {t("fishing.expeditionP2")}
            </p>
            <BookingModal defaultInterest="Pesca Esportiva">
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={springCfg}
              >
                <MessageCircle size={18} className="shrink-0" />
                {t("fishing.expeditionButton")}
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-card text-center">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg mb-6">{t("fishing.ctaTitle")}</h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-10">
              {t("fishing.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingModal defaultInterest="Pesca Esportiva">
                <motion.button
                  className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded h-auto min-h-[50px] text-center leading-snug"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springCfg}
                >
                  <MessageCircle size={18} className="shrink-0" />
                  {t("fishing.ctaButton")}
                </motion.button>
              </BookingModal>
              <Link
                to="/ecoturismo"
                className="inline-block px-8 py-4 border-2 border-border text-foreground font-body font-semibold text-sm tracking-widest uppercase rounded hover:border-gold hover:text-gold transition-colors duration-300"
              >
                {t("fishing.ctaButtonEco")}
              </Link>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={galleryItems}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Fishing;
