import { Phone, MessageCircle } from "lucide-react";
import BookingModal from "./BookingModal";

const PHONE = "+5592993839110";

/**
 * Barra fixa de conversão exibida apenas no mobile (oculta em lg+).
 * Dois toques de ação sempre visíveis: Ligar e Reservar (WhatsApp).
 */
const MobileCTABar = () => (
  <>
    {/* Espaçador para o conteúdo não ficar atrás da barra fixa */}
    <div className="h-[60px] lg:hidden" aria-hidden />

    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-forest-light bg-primary/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.25)]">
      <a
        href={`tel:${PHONE}`}
        aria-label="Ligar para o Amazon Samaúma"
        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-primary-foreground font-body font-semibold text-sm border-r border-forest-light/60 active:bg-forest-light/30 transition-colors"
      >
        <Phone size={18} className="shrink-0" />
        Ligar
      </a>
      <BookingModal className="flex-1">
        <span className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-accent-foreground font-body font-bold text-sm uppercase tracking-wide active:bg-gold-light transition-colors">
          <MessageCircle size={18} className="shrink-0" />
          Reservar
        </span>
      </BookingModal>
    </div>
  </>
);

export default MobileCTABar;
