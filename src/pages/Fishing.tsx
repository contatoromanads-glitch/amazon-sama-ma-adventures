import { useState, useEffect, useCallback, useRef } from "react";
import {
  Fish, Calendar, Anchor, Award, MessageCircle, Binoculars, Moon,
  X, ChevronLeft, ChevronRight, ZoomIn, Share2, Heart, MapPin, Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionFadeIn from "@/components/SectionFadeIn";
import { Link } from "react-router-dom";
import BookingModal from "@/components/BookingModal";

// ─── Images ──────────────────────────────────────────────────────────────────
import { photos } from "@/lib/photos";
const fishingImg      = photos.pesca;
const ecotourismImg   = photos.tourSafari2;
const heroImg         = photos.tourTrilhas;
const fishCatch       = photos.pescaTucunare;
const fishBoat        = photos.pescaBarco;
const fishGear        = photos.pescaEquipamentos;
const fishSunset      = photos.tourNoturna2;
const fishUnderwaterImg = photos.pescaUnderwater;
const fishGroup       = photos.tourRoteiro;
const fishIgarape     = photos.ecoturismo;

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

// ─── Data ─────────────────────────────────────────────────────────────────────
interface GalleryItem {
  src: string;
  label: string;
  caption: string;
  location?: string;
  liked?: boolean;
}

const galleryItems: GalleryItem[] = [
  {
    src: fishCatch,
    label: "Tucunaré Açu",
    caption: "O lendário Peacock Bass do Paraná do Mamori — o maior prêmio da pesca esportiva amazônica.",
    location: "Paraná do Mamori",
  },
  {
    src: fishBoat,
    label: "Saída ao Amanhecer",
    caption: "Partimos ao amanhecer, quando os tucunarés estão mais ativos nas margens e enseadas do rio.",
    location: "Rio Mamori, AM",
  },
  {
    src: fishSunset,
    label: "Pôr do Sol no Rio",
    caption: "O momento em que a pesca encontra a contemplação — um silêncio que só a Amazônia oferece.",
    location: "Paraná do Mamori",
  },
  {
    src: fishIgarape,
    label: "Igarapés Secretos",
    caption: "Nossos guias conhecem cada igarapé onde os peixes se concentram durante a seca.",
    location: "Igarapé do Castanho",
  },
  {
    src: fishUnderwaterImg,
    label: "Tucunaré nas Águas",
    caption: "As águas escuras do Mamori escondem cardumes de tucunarés prontos para o combate.",
    location: "Fundo do Mamori",
  },
  {
    src: fishGear,
    label: "Equipamentos & Iscas",
    caption: "Iscas artificiais selecionadas para cada tipo de água e estação. Mosca, pesca superfície e fundo.",
    location: "Amazon Samaúma Lodge",
  },
  {
    src: fishGroup,
    label: "Pescadores & Troféus",
    caption: "Cada peixe capturado é devolvido ao rio com carinho — o espírito do Pesque & Solte.",
    location: "Deck do Lodge",
  },
];

const seasons = [
  { period: "Jan–Mar", name: "Enchente", level: 1, color: "bg-blue-400/60", tip: "Lagos e igapós. Bom para fly fishing." },
  { period: "Mar–Jun", name: "Cheia", level: 2, color: "bg-blue-600/50", tip: "Peixes dispersos. Isca natural recomendada." },
  { period: "Jun–Set", name: "Vazante", level: 3, color: "bg-amber-400/70", tip: "Peixes concentrando em lagos. Isca artificial." },
  { period: "Set–Jan", name: "Seca ★", level: 4, color: "bg-emerald-400/80", tip: "MELHOR ÉPOCA — peixes concentrados, água clara, tucunarés enormes." },
];

const stats = [
  { value: "12kg+", label: "Maior Tucunaré", sub: "capturado no Mamori" },
  { value: "100%", label: "Pesque & Solte", sub: "preservação das espécies" },
  { value: "15+", label: "Espécies", sub: "nos rios do lodge" },
  { value: "4 meses", label: "Alta Temporada", sub: "Set a Jan" },
];

const tips = [
  { icon: "🎣", title: "Iscas Artificiais", desc: "Poppers e jerkbaits na superfície são letais para o tucunaré no período da seca." },
  { icon: "🕕", title: "Horário Ideal", desc: "Entre 6h–9h e 16h–18h os peixes estão mais ativos nas margens e enseadas." },
  { icon: "📍", title: "Pontos Secretos", desc: "Nossos guias conhecem os pontos exatos onde os cardumes se concentram." },
  { icon: "🌊", title: "Leitura do Rio", desc: "Corredeiras, remansos e quedas d'água são as melhores estruturas para pescar." },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ items, startIndex, onClose }: { items: GalleryItem[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const [liked, setLiked] = useState<boolean[]>(items.map(() => false));
  const dragX = useMotionValue(0);

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
            <span className="text-xs text-white/40 uppercase tracking-widest font-body">Galeria de Pesca</span>
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
              style={{ background: liked[current] ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              transition={springCfg}
              onClick={() => setLiked(l => l.map((v, i) => i === current ? !v : v))}
            >
              <Heart size={15} className={liked[current] ? "fill-red-400 text-red-400" : "text-white/70"} />
              <span className={liked[current] ? "text-red-300" : "text-white/70"}>
                {liked[current] ? "Curtido!" : "Curtir"}
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
                <img src={g.src} alt="" className="w-full h-full object-cover" />
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
              Fazer Reserva
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

function SeasonBar() {
  const [active, setActive] = useState(3);

  return (
    <div className="rounded-2xl overflow-hidden" style={seasonGlass}>
      <div className="p-5 border-b border-white/10">
        <h3 className="text-white font-heading text-lg mb-1">Calendário de Temporadas</h3>
        <p className="text-white/50 text-xs font-body">Selecione um período para ver detalhes</p>
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

  const bentoLayout = [
    { item: galleryItems[0], colSpan: true, rowSpan: true },  // big hero
    { item: galleryItems[1], colSpan: false, rowSpan: false },
    { item: galleryItems[2], colSpan: false, rowSpan: false },
    { item: galleryItems[3], colSpan: false, rowSpan: false },
    { item: galleryItems[4], colSpan: true, rowSpan: false },  // wide
    { item: galleryItems[5], colSpan: false, rowSpan: false },
    { item: galleryItems[6], colSpan: false, rowSpan: false },
  ];

  return (
    <div className="bg-background pt-20">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.img
          src={fishCatch}
          alt="Pesca esportiva no Paraná do Mamori, Amazônia"
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
            Paraná do Mamori · Temporada: Set – Jan
          </motion.span>
          <motion.h1
            className="heading-xl text-primary-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springCfg, delay: 0.2 }}
          >
            Pesca Esportiva
          </motion.h1>
          <motion.p
            className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springCfg, delay: 0.3 }}
          >
            A emoção de pescar nos rios mais preservados da Amazônia, guiado por especialistas.
          </motion.p>
        </div>
      </section>

      {/* ── Intro + Highlights ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(147,20%,96%) 100%)" }}>
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-start">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Amazon Sport Fishing</span>
            <h2 className="heading-lg mt-2 mb-6">Pesca de Troféu na Amazônia</h2>
            <p className="text-body text-muted-foreground mb-4">
              O Amazonas é um dos melhores destinos de pesca esportiva do mundo. No lodge, oferecemos saídas guiadas no Paraná do Mamori para a captura do lendário Tucunaré Açu — o Peacock Bass — além de outras espécies típicas da região.
            </p>
            <p className="text-body text-muted-foreground mb-8">
              Nosso proprietário também é guia experiente, garantindo uma experiência segura, divertida e inesquecível. O sistema Pesque & Solte garante a preservação das espécies para as próximas gerações.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Fish, label: "Tucunaré Açu" },
                { icon: Anchor, label: "Barcos Equipados" },
                { icon: Calendar, label: "Melhor: Set – Jan" },
                { icon: Award, label: "Pesque & Solte" },
                { icon: Binoculars, label: "Guias Locais" },
                { icon: Moon, label: "Pesca Noturna" },
              ].map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                  whileHover={{ y: -2, borderColor: "hsl(var(--gold) / 0.4)" }}
                  transition={springCfg}
                >
                  <Icon className="text-gold shrink-0" size={20} />
                  <span className="font-body text-sm font-medium">{label}</span>
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
                <h2 className="heading-lg text-primary-foreground mb-2">Galeria de Pesca</h2>
                <p className="text-primary-foreground/50 font-body text-sm">
                  {galleryItems.length} fotos · Clique para ampliar
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
                  Reserve sua Pescaria
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
            {galleryItems.slice(1).map((item, i) => (
              <motion.div
                key={item.label}
                className={`rounded-2xl overflow-hidden relative cursor-pointer group ${i === 3 ? "col-span-2" : ""}`}
                style={glassStyle}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springCfg}
                onClick={() => setLightboxIdx(i + 1)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
              >
                <motion.img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.55 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-heading text-sm font-semibold line-clamp-1">{item.label}</p>
                  {item.location && (
                    <p className="text-amber-300/70 text-[10px] font-body mt-0.5">📍 {item.location}</p>
                  )}
                </div>
                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    <ZoomIn size={18} className="text-white" />
                  </div>
                </motion.div>
              </motion.div>
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
              <h2 className="heading-lg text-primary-foreground mb-6">Números do Mamori</h2>
              <StatsPanel />
            </SectionFadeIn>

            {/* Tips rotator */}
            <SectionFadeIn>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-lg text-primary-foreground">Dicas de Pesca</h2>
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
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img src={ecotourismImg} alt="Expedição noturna" className="w-full h-[380px] object-cover" loading="lazy" width={1200} height={800} />
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Expedição Especial</span>
            <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">Pesca Noturna & Observação de Jacarés</h2>
            <p className="text-body text-primary-foreground/80 mb-4">
              Para os aventureiros, oferecemos saídas noturnas de barco para observação de jacarés e pesca noturna. Uma experiência intensa e segura, guiada por profissionais com vasto conhecimento da região.
            </p>
            <p className="text-body text-primary-foreground/80 mb-8">
              À luz das lanternas, a vida noturna amazônica revela seus segredos — jacarés deslizando pelas margens, olhos brilhantes na escuridão e os sons inconfundíveis da floresta à noite.
            </p>
            <BookingModal defaultInterest="Pesca Esportiva">
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={springCfg}
              >
                <MessageCircle size={18} className="shrink-0" />
                Saiba Mais / Reservar
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-card text-center">
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg mb-6">Pronto para a Maior Pescaria da sua Vida?</h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Entre em contato via WhatsApp para montar seu pacote de pesca personalizado no Paraná do Mamori.
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
                  Fazer Reserva
                </motion.button>
              </BookingModal>
              <Link
                to="/ecoturismo"
                className="inline-block px-8 py-4 border-2 border-border text-foreground font-body font-semibold text-sm tracking-widest uppercase rounded hover:border-gold hover:text-gold transition-colors duration-300"
              >
                Ver Ecoturismo
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
