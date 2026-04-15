import { useState, useEffect, useCallback } from "react";
import { TreePine, Bird, Moon, Users, Map, Footprints, MessageCircle, Sunrise, X, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import SectionFadeIn from "@/components/SectionFadeIn";
import { Link } from "react-router-dom";
import BookingModal from "@/components/BookingModal";

// ─── Images ──────────────────────────────────────────────────────────────────
import { photos } from "@/lib/photos";
const ecotourismImg = "/fotos_reais_amazon/eco-new-11.jpeg";
const fishingImg    = "/fotos_reais_amazon/eco-new-28.jpeg";
const heroImg       = "/fotos_reais_amazon/eco-new-38.jpeg";
const tourSafari    = "/fotos_reais_amazon/eco-new-16.jpeg";
const tourSafari2   = "/fotos_reais_amazon/eco-new-18.jpeg";
const tourTrilhas   = "/fotos_reais_amazon/eco-new-10.jpeg";
const tourTrilhas2  = "/fotos_reais_amazon/eco-new-41.jpeg";
const tourPorDoSol  = "/fotos_reais_amazon/eco-new-30.jpeg";
const tourNoturna   = "/fotos_reais_amazon/eco-new-17.jpeg";
const tourNoturna2  = "/fotos_reais_amazon/eco-new-6.jpeg";
const tourCultura   = "/fotos_reais_amazon/eco-new-14.jpeg";
const tourRoteiro   = "/fotos_reais_amazon/eco-new-2.jpeg";

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

// ─── Data ─────────────────────────────────────────────────────────────────────
const tours: Tour[] = [
  {
    icon: Bird,
    title: "Safari Amazônico",
    subtitle: "Flora & Fauna",
    desc: "Embarque em uma expedição guiada pelos igarapés e florestas ao redor do lodge. Observe botos, jacarés, macacos, araras e centenas de espécies de pássaros.",
    tag: "Família",
    tagColor: "from-emerald-400/90 to-teal-500/90",
    preview: tourSafari,
    duration: "3–4 horas",
    difficulty: "Fácil",
    rating: 5,
    longDesc:
      "O Safari Amazônico é a experiência mais completa que o Amazon Samaúma Lodge oferece. A bordo de um barco silencioso, navegamos pelos igarapés e lagos que cercam o lodge, mergulhando no ecossistema mais rico do planeta. Nossos guias nativos conhecem cada curva do rio, cada pássaro que canta na copa das árvores, cada rastro deixado pela fauna que vive às margens do Paraná do Mamori. É uma aula viva com paredes de floresta e chão de rio.",
    highlights: [
      "🐬 Avistamento de botos cor-de-rosa",
      "🐊 Observação de jacarés às margens",
      "🦜 Identificação de mais de 50 espécies de aves",
      "🐒 Macacos prego, uakari e bugio",
      "🌿 Apresentação de plantas medicinais",
      "📸 Stops para fotografia em pontos privilegiados",
    ],
    gallery: [tourSafari, tourSafari2, ecotourismImg],
  },
  {
    icon: Footprints,
    title: "Trilhas na Floresta",
    subtitle: "Caminhadas Guiadas",
    desc: "Explore trilhas pela floresta primária com diferentes níveis de dificuldade. Nossos guias apresentam plantas medicinais, árvores centenárias e segredos da mata.",
    tag: "Aventura",
    tagColor: "from-amber-400/90 to-orange-500/90",
    preview: tourTrilhas,
    duration: "2–5 horas",
    difficulty: "Leve a Moderado",
    rating: 5,
    longDesc:
      "Caminhe pela floresta primária amazônica acompanhado por guias que nasceram e cresceram nessa terra. As trilhas percorrem diferentes ambientes: capoeiras, igapós, terra firme e beiras de igarapé. Em cada parada, você aprende sobre as árvores gigantes, os cipós, as plantas medicinais usadas pelos ribeirinhos há séculos e os animais que se camuflam entre as folhas. Uma experiência sensorial única — o cheiro da floresta úmida, o som dos pássaros, a textura do musgo.",
    highlights: [
      "🌳 Árvores centenárias como a samaúma",
      "🌿 Plantas medicinais e seus usos tradicionais",
      "🦋 Borboletas e insetos rares",
      "🐸 Anfíbios e repteis da floresta",
      "🍃 Técnicas de sobrevivência na selva",
      "📍 Múltiplos níveis: fácil, médio e desafiador",
    ],
    gallery: [tourTrilhas, tourTrilhas2, heroImg],
  },
  {
    icon: Sunrise,
    title: "Pôr do Sol no Rio",
    subtitle: "Passeio de Barco",
    desc: "Um dos momentos mais especiais do lodge. Saia de barco no final da tarde e contemple o pôr do sol sobre o Paraná do Mamori em toda a sua glória.",
    tag: "Imperdível",
    tagColor: "from-rose-400/90 to-orange-400/90",
    preview: tourPorDoSol,
    duration: "1,5–2 horas",
    difficulty: "Nenhuma",
    rating: 5,
    longDesc:
      "Às 17h, o Paraná do Mamori se transforma em um espelho dourado. O sol amazônico mergulha devagar atrás das copas das árvores, tingindo o céu de vermelho, laranja e violeta — cores que não existem em nenhum outro lugar do mundo. Saímos de barco em pequenos grupos, navegamos até os pontos mais abertos do rio e simplesmente paramos o motor. Silêncio. Natureza. Um pôr do sol que ficará na memória para sempre.",
    highlights: [
      "🌅 Vista panorâmica do Paraná do Mamori",
      "🚤 Passeio em pequenos grupos (mais íntimo)",
      "🍹 Drinks e petiscos a bordo (sob consulta)",
      "📸 Oportunidade de fotografia única",
      "🌙 Retorno ao entardecer com o céu estrelado",
      "💑 Experiência romântica para casais",
    ],
    gallery: [tourPorDoSol, ecotourismImg, heroImg],
  },
  {
    icon: Moon,
    title: "Expedição Noturna",
    subtitle: "Jacarés & Fauna Noturna",
    desc: "Para os aventureiros: saídas noturnas de barco para observação de jacarés e pesca noturna. Intensa, segura e guiada por especialistas da região.",
    tag: "Emocionante",
    tagColor: "from-purple-500/90 to-indigo-600/90",
    preview: tourNoturna,
    duration: "2–3 horas (noite)",
    difficulty: "Moderado",
    rating: 5,
    longDesc:
      "A floresta amazônica à noite é um mundo completamente diferente. Equipados com lanternas e guiados por profissionais que conhecem cada palmo do rio, saímos após o jantar para descobrir a vida noturna do Mamori. Os olhos dos jacarés brilham avermelhados sob a luz da lanterna, os urutaus cantam seu som característico, as ariranhas dormem nas margens. Para quem tem coragem de sentar na proa do barco e olhar para o escuro — essa é a experiência mais visceral da Amazônia.",
    highlights: [
      "🐊 Observação de jacarés à noite",
      "🦉 Urutau, coruja e aves noturnas",
      "🎣 Pesca noturna artesanal",
      "⭐ Céu com a via láctea visível",
      "🦟 Kit repelente fornecido",
      "🔦 Equipamentos de segurança completos",
    ],
    gallery: [tourNoturna, tourNoturna2, fishingImg],
  },
  {
    icon: Users,
    title: "Cultura Ribeirinha",
    subtitle: "Comunidades Locais",
    desc: "Visite comunidades ribeirinhas do Rio Mamori e conheça de perto a cultura, tradições e o modo de vida das populações amazônicas.",
    tag: "Cultural",
    tagColor: "from-blue-400/90 to-cyan-500/90",
    preview: tourCultura,
    duration: "4–6 horas",
    difficulty: "Fácil",
    rating: 4.8,
    longDesc:
      "As comunidades ribeirinhas do Rio Mamori vivem como vivem há séculos — na pesca artesanal, na extração sustentável da floresta, na cultura oral que passa de geração em geração. Visitamos comunidades parceiras, onde os moradores nos recebem com farinha, tucupi e histórias. Você aprende a fazer farinha de mandioca, ouve lendas da floresta e entende como o amazonense vive em harmonia com o maior rio do mundo. Um encontro humano profundo e transformador.",
    highlights: [
      "🏘️ Visita a comunidades ribeirinhas parceiras",
      "🍚 Culinária regional amazônica",
      "🎭 Histórias e lendas da floresta",
      "🎣 Técnicas de pesca artesanal",
      "🪵 Artesanato local",
      "🤝 Encontro cultural genuíno",
    ],
    gallery: [tourCultura, ecotourismImg, fishingImg],
  },
  {
    icon: Map,
    title: "Roteiro Personalizado",
    subtitle: "Experiência sob Medida",
    desc: "Monte seu roteiro de aventuras de acordo com seus interesses, condicionamento físico e duração da estadia.",
    tag: "Exclusivo",
    tagColor: "from-gold/80 to-amber-600/90",
    preview: tourRoteiro,
    duration: "Personalizado",
    difficulty: "Personalizado",
    rating: 5,
    longDesc:
      "Cada viajante é único. Pensando nisso, o Amazon Samaúma Lodge oferece a possibilidade de montar um roteiro completamente personalizado — combinando passeios de barco, trilhas, pesca, visitas culturais e momentos de contemplação, de acordo com o seu perfil, seu tempo disponível e seus interesses. Seja para uma lua de mel, uma viagem de grupo, uma aventura extrema ou um retiro de descanso — nossos guias criam a experiência perfeita para você.",
    highlights: [
      "🗺️ Planejamento 100% personalizado",
      "👨‍👩‍👧 Ideal para famílias, casais e grupos",
      "🎣 Combinação de pesca + ecoturismo",
      "🌙 Inclui passeios diurnos e noturnos",
      "💼 Pacotes especiais para lua de mel",
      "📞 Atendimento via WhatsApp antes da viagem",
    ],
    gallery: [tourRoteiro, heroImg, ecotourismImg],
  },
];

// ─── Animal Gallery Data ──────────────────────────────────────────────────────
const animalPhotos = [
  { src: "/fotos_reais_amazon/eco-new-12.jpeg", alt: "Aranha" },
  { src: "/fotos_reais_amazon/eco-new-13.jpeg", alt: "Caranguejeira" },
  { src: "/fotos_reais_amazon/eco-new-15.jpeg", alt: "Ave Amazônica" },
  { src: "/fotos_reais_amazon/eco-new-19.jpeg", alt: "Papagaio" },
  { src: "/fotos_reais_amazon/eco-new-20.jpeg", alt: "Garça" },
  { src: "/fotos_reais_amazon/eco-new-21.jpeg", alt: "Gavião em Voo" },
  { src: "/fotos_reais_amazon/eco-new-22.jpeg", alt: "Macaco Prego" },
  { src: "/fotos_reais_amazon/eco-new-23.jpeg", alt: "Águia Pescadora" },
  { src: "/fotos_reais_amazon/eco-new-24.jpeg", alt: "Macaco de Cheiro" },
  { src: "/fotos_reais_amazon/eco-new-25.jpeg", alt: "Ave Colorida" },
  { src: "/fotos_reais_amazon/eco-new-26.jpeg", alt: "Andorinha" },
  { src: "/fotos_reais_amazon/eco-new-29.jpeg", alt: "Ave Silvestre" },
  { src: "/fotos_reais_amazon/eco-new-31.jpeg", alt: "Pássaro no Galho" },
  { src: "/fotos_reais_amazon/eco-new-32.jpeg", alt: "Bicho-Preguiça" },
  { src: "/fotos_reais_amazon/eco-new-33.jpeg", alt: "Garça Branca" },
  { src: "/fotos_reais_amazon/eco-new-34.jpeg", alt: "Garça Moura" },
  { src: "/fotos_reais_amazon/eco-new-35.jpeg", alt: "Macaco" },
  { src: "/fotos_reais_amazon/eco-new-36.jpeg", alt: "Pica-Pau" },
  { src: "/fotos_reais_amazon/eco-new-39.jpeg", alt: "Tarântulas" },
  { src: "/fotos_reais_amazon/eco-new-40.jpeg", alt: "Iguana" },
];

// ─── iOS Spring config ────────────────────────────────────────────────────────
const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };
const modalSpring = { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.9 };

// ─── Modal Component ──────────────────────────────────────────────────────────
function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

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
        <div className="relative overflow-hidden rounded-t-3xl sm:rounded-t-3xl" style={{ height: 240 }}>
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

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {tour.gallery.map((_, i) => (
              <motion.button
                key={i}
                className="rounded-full"
                style={{
                  width: i === activeImg ? 20 : 6,
                  height: 6,
                  background: i === activeImg ? "white" : "rgba(255,255,255,0.5)",
                }}
                animate={{ width: i === activeImg ? 20 : 6 }}
                transition={springConfig}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {tour.gallery.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveImg(i)}
                className="rounded-lg overflow-hidden"
                style={{
                  width: i === activeImg ? 52 : 40,
                  height: 34,
                  border: i === activeImg ? "2px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.3)",
                  opacity: i === activeImg ? 1 : 0.65,
                }}
                animate={{ width: i === activeImg ? 52 : 40, opacity: i === activeImg ? 1 : 0.65 }}
                transition={springConfig}
                whileHover={{ opacity: 1 }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

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
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${tour.tagColor} text-white text-xs font-bold uppercase tracking-wider`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            {tour.tag}
          </div>
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
            <p className="text-white/60 text-xs uppercase tracking-widest font-body font-semibold mb-3">O que inclui</p>
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
              <MessageCircle size={17} className="shrink-0" />
              Reservar este Passeio
            </motion.button>
          </BookingModal>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tour Card ────────────────────────────────────────────────────────────────
function TourCard({ tour, index, onClick }: { tour: Tour; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

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
        {/* Preview Image */}
        <div className="relative overflow-hidden" style={{ height: 180 }}>
          <motion.img
            src={tour.preview}
            alt={tour.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Image gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Tag */}
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${tour.tagColor} text-white text-[10px] font-bold uppercase tracking-wider shadow-sm`}
          >
            {tour.tag}
          </div>

          {/* Icon overlay */}
          <div
            className="absolute bottom-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <tour.icon size={18} className="text-white" />
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-xs font-semibold">{tour.rating}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold text-white mb-0.5 group-hover:text-amber-200 transition-colors duration-300">
            {tour.title}
          </h3>
          <p className="text-xs text-white/55 font-body italic mb-3">{tour.subtitle}</p>
          <p className="text-sm text-white/75 font-body leading-relaxed line-clamp-3">{tour.desc}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
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

          {/* Tap to open hint */}
          <motion.div
            className="mt-3 flex items-center gap-2 text-xs text-white/40 font-body"
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.2 }}
          >
            <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
            Toque para ver detalhes e galeria
          </motion.div>
        </div>
      </motion.div>
    </SectionFadeIn>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Ecotourism = () => {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  return (
    <div className="bg-background pt-20">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={ecotourismImg}
          alt="Ecoturismo na Amazônia — Amazon Samaúma Lodge"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="relative z-10 text-center px-4">
          <motion.span
            className="inline-block text-gold font-body text-sm font-semibold tracking-[4px] uppercase mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
          >
            Amazônia Autêntica · Todo o Ano
          </motion.span>
          <motion.h1
            className="heading-xl text-primary-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.2 }}
          >
            Ecoturismo
          </motion.h1>
          <motion.p
            className="text-body-lg text-primary-foreground/80 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.3 }}
          >
            Aventuras guiadas pelo coração da Amazônia, para toda a família.
          </motion.p>
        </div>
      </section>

      {/* Intro text */}
      <section className="section-padding">
        <div className="container-lodge grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Natureza Selvagem</span>
            <h2 className="heading-lg mt-2 mb-6">A Amazônia no seu Estado Mais Puro</h2>
            <p className="text-body text-muted-foreground mb-4">
              O Amazon Samaúma Lodge está inserido em um dos ecossistemas mais ricos e biodiversos do planeta. A poucos metros do lodge, a floresta amazônica primária oferece experiências de ecoturismo únicas no mundo.
            </p>
            <p className="text-body text-muted-foreground mb-8">
              Botos cor-de-rosa, jacarés, macacos prego, araras azuis, sucuris e centenas de espécies de pássaros habitam a região. A chance de avistamento é alta ao longo de todo o ano.
            </p>
            <BookingModal defaultInterest="Ecoturismo">
              <motion.button
                className="inline-flex items-center justify-center flex-wrap gap-2 px-8 py-4 bg-accent text-accent-foreground font-body font-bold text-sm tracking-widest uppercase rounded hover:bg-gold-light transition-colors duration-300 h-auto min-h-[50px] text-center leading-snug"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
              >
                <MessageCircle size={18} className="shrink-0" />
                Fazer Reserva
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
          <SectionFadeIn>
            <div className="hover-zoom rounded-lg overflow-hidden">
              <img
                src={heroImg}
                alt="Passeio de barco nos igarapés da Amazônia"
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
            <h2 className="heading-lg text-center mb-3 text-primary-foreground">Passeios e Atividades</h2>
            <p className="text-body text-center text-primary-foreground/60 max-w-2xl mx-auto mb-4">
              Toque em qualquer atividade para ver detalhes, galeria de fotos e fazer sua reserva.
            </p>
            <p className="text-center text-xs text-primary-foreground/35 font-body uppercase tracking-widest mb-14">
              ↓ Todos os passeios são guiados por especialistas locais
            </p>
          </SectionFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                alt="Fauna amazônica — observação de animais"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={1200}
                height={800}
              />
            </div>
          </SectionFadeIn>
          <SectionFadeIn>
            <span className="text-sm font-body font-semibold tracking-widest uppercase text-gold">Fauna Amazônica</span>
            <h2 className="heading-lg mt-2 mb-6 text-primary-foreground">Uma Biodiversidade Sem Igual</h2>
            <p className="text-body text-primary-foreground/80 mb-4">
              O Paraná do Mamori e seus arredores abrigam uma das maiores concentrações de espécies da América do Sul. Na região, é possível avistar:
            </p>
            <ul className="space-y-2 text-primary-foreground/80 mb-8">
              {[
                "🐬 Botos cor-de-rosa (golfinhos de água doce)",
                "🐊 Jacarés (várias espécies)",
                "🐒 Macacos: primata, bugio, uakari",
                "🦜 Araras azuis, papagaios e tucanos",
                "🐍 Sucuris, jiboias e ariranhas",
                "🦉 Corujas, urutaus e fauna noturna",
              ].map(item => (
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
                Agende sua Experiência
              </motion.button>
            </BookingModal>
          </SectionFadeIn>
        </div>
      </section>

      {/* Animal Gallery Section */}
      <section className="section-padding" style={{ background: "hsl(147,27%,8%)" }}>
        <div className="container-lodge">
          <SectionFadeIn>
            <h2 className="heading-lg text-primary-foreground mb-4">Galeria de Fauna</h2>
            <p className="text-body text-primary-foreground/70 max-w-2xl mb-12">
              Algumas das espécies incríveis capturadas pelas lentes de nossos visitantes e guias.
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
                    src={photo.src}
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
