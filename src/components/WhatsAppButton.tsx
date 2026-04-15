import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "./BookingModal";
import { Calendar } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BookingModal className="fixed bottom-6 right-6 z-50">
      <motion.button
        className="flex items-center justify-center gap-2 rounded-full shadow-[0_4px_20px_rgba(194,155,71,0.5)] px-4 py-4 font-body font-semibold text-sm transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #d4af37, #aa8529)', color: 'white' }}
        aria-label="Reservar Agora"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Calendar size={22} className="shrink-0" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
              animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Reserve Agora
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </BookingModal>
  );
};

export default WhatsAppButton;
