import { useState, useEffect, useRef } from "react";
import {
  Leaf, Heart, Shield, Users, Fish, Compass,
  X, MapPin, MessageCircle, Star, ChevronDown, TreePine, Anchor,
} from "lucide-react";
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useTransform, useInView, animate,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionFadeIn from "@/components/SectionFadeIn";
import SEOHead from "@/components/SEOHead";
import BookingModal from "@/components/BookingModal";
import { photos } from "@/lib/photos";
const heroImg          = "/fotos_reais_amazon/about-hero-artesanato.webp";
const accommodationImg = "/fotos_reais_amazon/about-card-floresta.webp";
const ownerImg         = photos.proprietario;

// ─── Spring configs ───────────────────────────────────────────────────────────
const sp = { type: "spring" as const, stiffness: 380, damping: 28 };
const spSlow = { type: "spring" as const, stiffness: 200, damping: 22 };

const glassPanel = {
  background: "linear-gradient(135deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.07) 100%)",
  backdropFilter: "blur(36px) saturate(1.8)",
  WebkitBackdropFilter: "blur(36px) saturate(1.8)",
  border: "1px solid rgba(255,255,255,0.28)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
} as React.CSSProperties;

// ─── SVG Floating Leaves ──────────────────────────────────────────────────────
const LEAVES = [
  { x: "7%", y: "20%", size: 28, delay: 0, dur: 7 },
  { x: "87%", y: "14%", size: 20, delay: 1.5, dur: 9 },
  { x: "14%", y: "68%", size: 34, delay: 0.8, dur: 8 },
  { x: "91%", y: "62%", size: 24, delay: 2.2, dur: 10 },
  { x: "50%", y: "6%", size: 18, delay: 0.4, dur: 6 },
  { x: "76%", y: "78%", size: 30, delay: 1.8, dur: 11 },
  { x: "32%", y: "86%", size: 22, delay: 3.0, dur: 9 },
];

function FloatingLeaf({ x, y, size, delay, dur }: typeof LEAVES[0]) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [-12, 12, -12], rotate: [-18, 18, -18], opacity: [0.15, 0.35, 0.15] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path d="M20 2C20 2 36 10 36 24C36 32.84 28.84 38 20 38C11.16 38 4 32.84 4 24C4 10 20 2 20 2Z"
          fill="hsl(147,40%,35%)" opacity={0.8} />
        <path d="M20 2L20 38" stroke="hsl(147,30%,60%)" strokeWidth="1.5" opacity={0.4} />
        <path d="M20 14L28 22M20 14L12 22" stroke="hsl(147,30%,60%)" strokeWidth="1" opacity={0.3} />
      </svg>
    </motion.div>
  );
}

// ─── SVG River Wave (hero bottom) ────────────────────────────────────────────
function RiverWave() {
  return (
    <div className="absolute inset-x-0 -bottom-1 overflow-hidden pointer-events-none" style={{ height: 110 }}>
      <svg viewBox="0 0 1440 110" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none" className="absolute w-full h-full" style={{ opacity: 0.22 }}>
        <motion.path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,110 L0,110 Z"
          fill="hsl(147,40%,25%)"
          animate={{
            d: [
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,110 L0,110 Z",
              "M0,40 C240,20  480,90 720,50 C960,20  1200,90 1440,40 L1440,110 L0,110 Z",
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,110 L0,110 Z",
            ]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 C360,40 720,110 1080,60 C1260,40 1380,80 1440,80 L1440,110 L0,110 Z"
          fill="hsl(147,35%,18%)"
          animate={{
            d: [
              "M0,80 C360,40 720,110 1080,60 C1260,40 1380,80 1440,80 L1440,110 L0,110 Z",
              "M0,95 C360,70 720,40  1080,90 C1260,70 1380,50 1440,95 L1440,110 L0,110 Z",
              "M0,80 C360,40 720,110 1080,60 C1260,40 1380,80 1440,80 L1440,110 L0,110 Z",
            ]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </svg>
    </div>
  );
}

// ─── SVG Animated Compass ─────────────────────────────────────────────────────
function AnimatedCompass({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <motion.circle cx="50" cy="50" r="46"
        stroke="hsl(38,70%,55%)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50px", originY: "50px" }}
      />
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      {[["N", "50", "13"], ["S", "50", "91"], ["L", "91", "52"], ["O", "9", "52"]].map(([l, x, y]) => (
        <text key={l} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.45)"
          fontSize="9" fontFamily="serif" dominantBaseline="middle">{l}</text>
      ))}
      <motion.polygon points="50,16 46,50 50,44 54,50" fill="hsl(0,75%,57%)"
        animate={{ rotate: [0, 8, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "50px" }}
      />
      <motion.polygon points="50,84 46,50 50,56 54,50" fill="rgba(255,255,255,0.65)"
        animate={{ rotate: [0, 8, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "50px" }}
      />
      <circle cx="50" cy="50" r="4" fill="hsl(38,70%,60%)" />
      <circle cx="50" cy="50" r="2" fill="white" />
    </svg>
  );
}

// ─── SVG Timeline Spine ───────────────────────────────────────────────────────
function TimelineSVG() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block pointer-events-none">
      <svg width="2" height="100%" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(38,80%,55%)" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(38,80%,55%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(147,40%,40%)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <motion.line x1="1" y1="0" x2="1" y2="800"
          stroke="url(#tlGrad)" strokeWidth="2" strokeDasharray="8 6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, to, {
      duration: 1.8, ease: [0.16, 1, 0.3, 1],
      onUpdate: v => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return ctrl.stop;
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── Values data ──────────────────────────────────────────────────────────────
const values = [
  {
    icon: Leaf, emoji: "🌿",
    titleKey: "about.values.sustainability.title",
    shortKey: "about.values.sustainability.short",
    color: "hsl(147,55%,38%)", glow: "rgba(50,160,80,0.3)",
    longKey: "about.values.sustainability.long",
    image: "/sustentabilidade-canoa.jpeg",
  },
  {
    icon: Heart, emoji: "🤝",
    titleKey: "about.values.hospitality.title",
    shortKey: "about.values.hospitality.short",
    color: "hsl(0,70%,62%)", glow: "rgba(220,60,60,0.28)",
    longKey: "about.values.hospitality.long",
    image: "/hospitalidade-grupo-lodge.jpeg",
  },
  {
    icon: Shield, emoji: "🛡️",
    titleKey: "about.values.safety.title",
    shortKey: "about.values.safety.short",
    color: "hsl(210,70%,58%)", glow: "rgba(50,120,220,0.28)",
    longKey: "about.values.safety.long",
    image: "/seguranca-barco-equipe.jpeg",
  },
  {
    icon: Users, emoji: "👨‍👩‍👧",
    titleKey: "about.values.community.title",
    shortKey: "about.values.community.short",
    color: "hsl(280,60%,62%)", glow: "rgba(180,80,220,0.28)",
    longKey: "about.values.community.long",
    image: "/comunidade-artesanato.jpeg",
  },
  {
    icon: Fish, emoji: "🎣",
    titleKey: "about.values.fishing.title",
    shortKey: "about.values.fishing.short",
    color: "hsl(195,70%,52%)", glow: "rgba(30,180,200,0.3)",
    longKey: "about.values.fishing.long",
    image: "/pesca-responsavel-sunset.jpeg",
  },
  {
    icon: Compass, emoji: "🧭",
    titleKey: "about.values.authenticity.title",
    shortKey: "about.values.authenticity.short",
    color: "hsl(38,80%,57%)", glow: "rgba(220,160,30,0.3)",
    longKey: "about.values.authenticity.long",
    image: "/autenticidade-fogueira.jpeg",
  },
];

type TimelineItem = { yearKey: string; titleKey: string; descKey: string; icon: string };

const timeline: TimelineItem[] = [
  { icon: "🌱", yearKey: "about.timeline.0.year", titleKey: "about.timeline.0.title", descKey: "about.timeline.0.desc" },
  { icon: "🏗️", yearKey: "about.timeline.1.year", titleKey: "about.timeline.1.title", descKey: "about.timeline.1.desc" },
  { icon: "👥", yearKey: "about.timeline.2.year", titleKey: "about.timeline.2.title", descKey: "about.timeline.2.desc" },
  { icon: "⭐", yearKey: "about.timeline.3.year", titleKey: "about.timeline.3.title", descKey: "about.timeline.3.desc" },
];

// ─── Value Pop-up Modal ───────────────────────────────────────────────────────
function ValueModal({ value, onClose }: { value: typeof values[0]; onClose: () => void }) {
  const { t } = useTranslation();
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-2xl" style={{ background: "rgba(4,18,10,0.78)" }} />
      <motion.div className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden"
        style={glassPanel}
        initial={{ scale: 0.84, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.91, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}>
        {/* Image header */}
        <div className="relative h-52 overflow-hidden">
          <motion.img src={value.image} alt={t(value.titleKey)}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <motion.span className="absolute bottom-4 left-5 text-5xl"
            initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ ...sp, delay: 0.15 }}>
            {value.emoji}
          </motion.span>
          <motion.button className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={onClose}>
            <X size={15} className="text-white" />
          </motion.button>
        </div>
        {/* Body */}
        <div className="p-6">
          <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-body font-bold uppercase tracking-wider"
            style={{ background: value.glow, border: `1px solid ${value.color}50`, color: value.color }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <value.icon size={12} /> {t(value.shortKey)}
          </motion.div>
          <h3 className="font-heading text-2xl text-white mb-3">{t(value.titleKey)}</h3>
          <p className="text-white/80 font-body text-sm leading-relaxed">{t(value.longKey)}</p>
          <BookingModal>
            <motion.button 
              className="mt-6 flex items-center justify-center flex-wrap gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide font-body text-white w-full h-auto min-h-[50px] text-center leading-snug"
              style={{ background: "linear-gradient(135deg,#d4af37,#aa8529)", boxShadow: "0 4px 20px rgba(194,155,71,0.4)" }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <MessageCircle size={16} className="shrink-0" /> {t("about.ownerModalButton")}
            </motion.button>
          </BookingModal>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Value Card (3-D tilt) ────────────────────────────────────────────────────
function ValueCard({ value, index, onClick }: { value: typeof values[0]; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [8, -8]), { stiffness: 300, damping: 28 });
  const ry = useSpring(useTransform(mx, [-60, 60], [-8, 8]), { stiffness: 300, damping: 28 });
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <motion.div ref={ref}
      className="relative rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: hov ? `linear-gradient(135deg,${value.glow},rgba(255,255,255,0.04))` : "rgba(255,255,255,0.04)",
        border: hov ? `1px solid ${value.color}55` : "1px solid rgba(255,255,255,0.09)",
        boxShadow: hov ? `0 0 40px ${value.glow}` : "none",
        rotateX: rx, rotateY: ry, perspective: 700, transformStyle: "preserve-3d",
      } as any}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...sp, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => { setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      onClick={onClick}
    >
      <div className="p-6">
        <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: value.glow, border: `1px solid ${value.color}40` }}
          animate={{ rotate: hov ? [0, -8, 8, 0] : 0 }} transition={{ duration: 0.55 }}>
          <value.icon style={{ color: value.color }} size={26} />
        </motion.div>

        <AnimatePresence>
          {hov && (
            <motion.span className="absolute top-3 right-4 text-2xl pointer-events-none"
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }} transition={sp}>
              {value.emoji}
            </motion.span>
          )}
        </AnimatePresence>

        <h3 className="font-heading text-lg text-white mb-1 font-semibold">{t(value.titleKey)}</h3>
        <p className="text-xs font-body mb-3" style={{ color: value.color }}>{t(value.shortKey)}</p>
        <p className="text-white/60 font-body text-sm leading-relaxed line-clamp-3">{t(value.longKey)}</p>

        <motion.div className="flex items-center gap-1.5 mt-4 text-xs font-body"
          animate={{ opacity: hov ? 1 : 0.3 }}>
          <motion.span className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: value.color }}
            animate={{ scale: hov ? [1, 1.6, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 0.9 }} />
          <span style={{ color: value.color }}>{t("about.valuesCardTip")}</span>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${value.color},transparent)` }}
        animate={{ opacity: hov ? 1 : 0.18 }} transition={{ duration: 0.3 }} />
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const About = () => {
  const [activeValue, setActiveValue] = useState<typeof values[0] | null>(null);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const { t } = useTranslation();

  const restaurantTags = t("about.restaurantTags", { returnObjects: true }) as string[];
  const ownerModalTags = t("about.ownerModalTags", { returnObjects: true }) as string[];

  return (
    <div className="bg-background pt-20 overflow-x-hidden">
      <SEOHead
        title={t("about.title")}
        description={t("about.description")}
        canonicalPath="/sobre"
        ogImage="https://amazon-samauma-lodge.com.br/fotos_reais_amazon/about-hero-artesanato.webp"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <motion.img src={heroImg} alt="Amazon Samaúma Lodge"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }} animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/50 to-primary/88" />

        {/* Floating SVG leaves */}
        {LEAVES.map((l, i) => <FloatingLeaf key={i} {...l} />)}
        <RiverWave />

        <div className="relative z-10 text-center px-4">
          <motion.div className="inline-flex items-center gap-2 mb-5 text-amber-300 font-body text-xs font-semibold tracking-[4px] uppercase"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MapPin size={12} /> {t("about.heroLabel")}
          </motion.div>

          {/* Animated underline title */}
          <div className="relative inline-block">
            <motion.h1 className="heading-xl text-primary-foreground relative z-10"
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ...spSlow }}>
              {t("about.heroTitle")}
            </motion.h1>
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8">
              <motion.path d="M0,4 Q75,0 150,4 Q225,8 300,4"
                stroke="hsl(38,80%,55%)" strokeWidth="2.5" fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                transition={{ delay: 0.85, duration: 0.9 }} />
            </svg>
          </div>

          <motion.p className="text-body-lg text-primary-foreground/80 mt-6 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {t("about.heroSubtitle")}
          </motion.p>

          {/* Scroll cue */}
          <motion.div className="mt-12 flex flex-col items-center gap-1"
            animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={20} className="text-white/40" />
            <ChevronDown size={20} className="text-white/20 -mt-3.5" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-primary border-b border-white/10">
        <div className="container-lodge grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: 5, suf: "", label: t("about.statBeds"), Icon: Anchor },
            { val: 100, suf: "%", label: t("about.statFishing"), Icon: Fish },
            { val: 15, suf: "+", label: t("about.statSpecies"), Icon: TreePine },
            { val: 5, suf: ".0", label: t("about.statRating"), Icon: Star },
          ].map(({ val, suf, label, Icon }, i) => (
            <motion.div key={label} className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ...sp, delay: i * 0.12 }}>
              <Icon size={18} className="text-amber-300 mb-1 opacity-70" />
              <span className="font-heading text-3xl text-white font-light">
                <Counter to={val} suffix={suf} />
              </span>
              <span className="text-white/50 font-body text-xs">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Story + floating badge ────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,hsl(147,30%,20%) 0%,transparent 50%)", backgroundSize: "4px 4px" }} />
        <div className="container-lodge grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <SectionFadeIn>
            <img
              src="/logo-amazon-samauma.png"
              alt="Amazon Samaúma Lodge"
              className="h-24 w-auto mb-5"
              width={96}
              height={96}
              loading="lazy"
            />
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("about.storyLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6" style={{ whiteSpace: "pre-line" }}>{t("about.storyTitle")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("about.storyP1")}
            </p>
            <p className="text-body text-muted-foreground mb-4">
              {t("about.storyP2")}
            </p>
            <p className="text-body text-muted-foreground mb-8">
              {t("about.storyP3")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <BookingModal>
                <motion.button
                  className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  {t("about.storyButton")}
                </motion.button>
              </BookingModal>
              <motion.button
                className="inline-flex items-center gap-3 px-6 py-4 rounded border font-body text-sm font-semibold border-border hover:border-gold/50 transition-colors"
                whileHover={{ x: 4 }} transition={sp}
                onClick={() => setOwnerOpen(true)}>
                <img src={ownerImg} alt="Guia" className="w-9 h-9 rounded-full object-cover object-top border-2 border-gold/40" />
                <span>{t("about.storyGuideLink")}</span>
              </motion.button>
            </div>
          </SectionFadeIn>

          <SectionFadeIn>
            <div className="relative">
              <motion.div className="rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.01 }} transition={spSlow}>
                <img src={accommodationImg} alt="Amazon Samaúma Lodge"
                  className="w-full h-[420px] object-cover" loading="lazy" />
              </motion.div>
              {/* Floating info badge */}
              <motion.div className="absolute -bottom-5 -left-5 rounded-2xl p-4 min-w-[170px]"
                style={glassPanel}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }} transition={{ ...sp, delay: 0.55 }}
                whileHover={{ y: -4 }}>
                <div className="text-white/50 text-xs font-body mb-1">{t("about.storyLocationLabel")}</div>
                <div className="text-white font-body font-semibold text-sm">Paraná do Mamori</div>
                <div className="text-amber-300 text-xs font-body mt-0.5">Careiro Castanho, AM</div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, n) => <Star key={n} size={10} className="fill-amber-400 text-amber-400" />)}
                </div>
              </motion.div>
              {/* Spinning compass */}
              <div className="absolute -top-7 -right-7 pointer-events-none opacity-65">
                <AnimatedCompass size={84} />
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <section className="section-padding relative"
        style={{ background: "linear-gradient(160deg,hsl(147,22%,96%) 0%,hsl(38,30%,96%) 100%)" }}>
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-3">{t("about.timelineTitle")}</h2>
            <p className="text-body text-center text-muted-foreground max-w-xl mx-auto mb-16">
              {t("about.timelineDesc")}
            </p>
          </SectionFadeIn>
          <div className="relative">
            <TimelineSVG />
            <div className="grid md:grid-cols-2 gap-8 md:gap-x-20">
              {timeline.map((item, i) => (
                <motion.div key={item.yearKey}
                  className={`flex gap-5 items-start p-6 rounded-2xl bg-white border border-border shadow-sm ${i % 2 !== 0 ? "md:mt-14" : ""}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ ...sp, delay: i * 0.12 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.08)", borderColor: "hsl(var(--gold)/0.4)" }}>
                  <div className="text-4xl shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <span className="text-xs font-body font-bold uppercase tracking-widest text-gold">{t(item.yearKey)}</span>
                    <h3 className="font-heading text-lg mt-1 mb-2">{t(item.titleKey)}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Restaurant ───────────────────────────────────────────────────────── */}
      <section className="section-padding bg-card">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <div className="relative rounded-2xl overflow-hidden">
              <motion.img src="/restaurante-buffet.jpeg" alt="Buffet"
                className="w-full h-[380px] object-cover" loading="lazy"
                whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }} />
              <motion.div className="absolute inset-0 flex items-end p-6"
                style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent 60%)" }}
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div>
                  <p className="text-xs text-amber-300 font-body uppercase tracking-widest mb-1">{t("about.restaurantLabel")}</p>
                  <p className="text-white font-heading text-lg">{t("about.restaurantTitle")}</p>
                </div>
              </motion.div>
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">{t("about.restaurantLabel")}</span>
            <h2 className="heading-lg mt-2 mb-6">{t("about.restaurantTitle")}</h2>
            <p className="text-body text-muted-foreground mb-4">
              {t("about.restaurantP1")}
            </p>
            <p className="text-body text-muted-foreground mb-6">
              {t("about.restaurantP2")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(restaurantTags ?? []).map(item => (
                <motion.div key={item}
                  className="flex items-center gap-2 text-sm font-body text-muted-foreground p-3 bg-background rounded-xl border border-border"
                  whileHover={{ x: 4, borderColor: "hsl(var(--gold)/0.4)" }} transition={sp}>
                  {item}
                </motion.div>
              ))}
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,hsl(147,27%,10%) 0%,hsl(147,30%,7%) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.055] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(hsl(38,80%,55%) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container-lodge relative z-10">
          <SectionFadeIn>
            <h2 className="heading-lg text-center mb-3 text-primary-foreground">{t("about.valuesTitle")}</h2>
            <p className="text-center font-body text-primary-foreground/50 max-w-xl mx-auto mb-4">
              {t("about.valuesDesc")}
            </p>
            <p className="text-center text-xs text-primary-foreground/30 font-body uppercase tracking-widest mb-14">
              {t("about.valuesClickTip")}
            </p>
          </SectionFadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <ValueCard key={v.titleKey} value={v} index={i} onClick={() => setActiveValue(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%,hsl(38,70%,55%),transparent)" }} />
        <div className="container-lodge relative z-10">
          <SectionFadeIn>
            <h2 className="heading-lg text-primary-foreground mb-6">{t("about.ctaTitle")}</h2>
            <p className="text-body-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              {t("about.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingModal>
                <motion.button
                  className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  {t("about.ctaButtonContact")}
                </motion.button>
              </BookingModal>
              <BookingModal>
                <motion.button
                  className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 rounded border-2 border-primary-foreground/30 text-primary-foreground font-body font-semibold text-sm tracking-widest uppercase hover:border-amber-300 hover:text-amber-300 transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <MessageCircle size={16} className="shrink-0" /> {t("about.ctaButtonBook")}
                </motion.button>
              </BookingModal>
            </div>
          </SectionFadeIn>
        </div>
      </section>

      {/* ── Owner Pop-up ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {ownerOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOwnerOpen(false)}>
            <div className="absolute inset-0 backdrop-blur-2xl" style={{ background: "rgba(4,18,10,0.82)" }} />
            <motion.div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
              style={glassPanel}
              initial={{ scale: 0.84, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={e => e.stopPropagation()}>
              <div className="relative h-72 overflow-hidden">
                <motion.img src={ownerImg} alt="Guia"
                  className="w-full h-full object-cover object-top"
                  initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <motion.button className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.42)", border: "1px solid rgba(255,255,255,0.2)" }}
                  whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                  onClick={() => setOwnerOpen(false)}>
                  <X size={15} className="text-white" />
                </motion.button>
                <div className="absolute bottom-4 left-5">
                  <p className="text-xs text-amber-300 font-body uppercase tracking-widest mb-1">{t("about.ownerModalLabel")}</p>
                  <h3 className="font-heading text-xl text-white">{t("about.ownerModalTitle")}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-white/80 font-body text-sm leading-relaxed mb-4">
                  {t("about.ownerModalDesc")}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(ownerModalTags ?? []).map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-body text-white/70"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.a
                  href="https://wa.me/5592993839110?text=Ol%C3%A1%2C%20vim%20do%20site.%20Quero%20falar%20com%20o%20guia%20sobre%20uma%20experi%C3%AAncia%20personalizada."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide font-body text-white w-full h-auto min-h-[52px] text-center leading-snug"
                  style={{ background: "linear-gradient(135deg,#d4af37,#aa8529)", boxShadow: "0 4px 20px rgba(194,155,71,0.4)" }}
                  whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(194,155,71,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={sp}
                >
                  <MessageCircle size={16} className="shrink-0" /> {t("about.ownerModalButton")}
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Value modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeValue && <ValueModal value={activeValue} onClose={() => setActiveValue(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default About;
